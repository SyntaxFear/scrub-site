import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import net from "node:net";
import test from "node:test";
import { chromium } from "playwright-core";

const root = new URL("../", import.meta.url);
const chromePath =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function hasChrome() {
  try {
    await access(chromePath);
    return true;
  } catch {
    return false;
  }
}

async function getOpenPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, () => {
      const address = server.address();
      server.close(() => {
        if (typeof address === "object" && address) {
          resolve(address.port);
        } else {
          reject(new Error("Could not allocate a local port"));
        }
      });
    });
  });
}

async function waitForServer(baseUrl, child) {
  const deadline = Date.now() + 30_000;
  let lastError;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`next start exited early with code ${child.exitCode}`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw lastError ?? new Error("Timed out waiting for next start");
}

async function startNext() {
  const port = await getOpenPort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn("npm", ["run", "start", "--", "-p", String(port)], {
    cwd: root,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk;
  });
  child.stderr.on("data", (chunk) => {
    output += chunk;
  });

  try {
    await waitForServer(baseUrl, child);
  } catch (error) {
    child.kill();
    throw new Error(`${error.message}\n${output}`);
  }

  return {
    baseUrl,
    stop: async () => {
      if (child.exitCode !== null) return;

      child.kill();
      await new Promise((resolve) => child.once("exit", resolve));
    },
  };
}

const chromeAvailable = await hasChrome();

if (!chromeAvailable && process.env.SKIP_BROWSER_TESTS === "1") {
  test("browser landing contracts", { skip: `Chrome not found at ${chromePath}` }, () => {});
} else {
  test("browser landing contracts", { timeout: 90_000 }, async () => {
    assert.equal(
      chromeAvailable,
      true,
      `Chrome not found at ${chromePath}. Set CHROME_PATH to a browser executable or set SKIP_BROWSER_TESTS=1 for an explicit local-only skip.`,
    );

    let server;
    let browser;
    try {
      server = await startNext();
      browser = await chromium.launch({ executablePath: chromePath });

      for (const [name, options] of Object.entries({
        desktop: { viewport: { width: 1280, height: 800 } },
        mobile: {
          viewport: { width: 390, height: 844 },
          deviceScaleFactor: 2,
          isMobile: true,
        },
      })) {
        const page = await browser.newPage(options);
        const consoleErrors = [];
        const pageErrors = [];
        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => {
          pageErrors.push(error.message);
        });

        await page.goto(server.baseUrl, { waitUntil: "domcontentloaded" });
        await page.waitForFunction(() => document.documentElement.dataset.motionReady === "true");
        const introTransform = await page.evaluate(
          () => getComputedStyle(document.querySelector(".hero-window")).transform,
        );
        await page.waitForTimeout(2600);
        const heroOpacitySamples = await page.evaluate(() =>
          [...document.querySelectorAll(".reveal-hero")].map((element) =>
            Number.parseFloat(getComputedStyle(element).opacity),
          ),
        );
        const settledTransform = await page.evaluate(
          () => getComputedStyle(document.querySelector(".hero-window")).transform,
        );
        assert.ok(
          heroOpacitySamples.every((opacity) => opacity >= 0.98),
          `${name} hero should settle visible after intro: ${heroOpacitySamples.join(", ")}`,
        );
        assert.notEqual(introTransform, settledTransform, `${name} hero window should animate`);

        await page.waitForLoadState("networkidle");

        const metrics = await page.evaluate(() => ({
          downloadLinks: document.querySelectorAll('a[href="/Scrub.dmg"]').length,
          hasMain: Boolean(document.querySelector("main#main")),
          h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
          heroVisualVisible:
            (document.querySelector(".hero-window")?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY) <
            window.innerHeight,
          overflow: document.documentElement.scrollWidth > window.innerWidth,
        }));

        assert.equal(metrics.hasMain, true, `${name} main landmark`);
        assert.match(metrics.h1, /^Uninstall apps\.\s*Leave no leftovers\.$/, `${name} h1`);
        assert.equal(metrics.downloadLinks, 3, `${name} download anchors`);
        assert.equal(metrics.overflow, false, `${name} horizontal overflow`);
        assert.equal(metrics.heroVisualVisible, true, `${name} hero product visual`);
        assert.deepEqual(consoleErrors, [], `${name} console errors`);
        assert.deepEqual(pageErrors, [], `${name} page errors`);

        await page.keyboard.press("Tab");
        const focused = await page.evaluate(() => {
          const active = document.activeElement;
          const rect = active?.getBoundingClientRect();
          return {
            isVisible:
              Boolean(rect) &&
              rect.width > 0 &&
              rect.height > 0 &&
              rect.bottom > 0 &&
              rect.top < window.innerHeight,
            text: active?.textContent?.trim(),
          };
        });
        assert.equal(focused.text, "Skip to content", `${name} skip link focus`);
        assert.equal(focused.isVisible, true, `${name} skip link visible`);

        const showcaseImages = await page.locator(".showcase img").all();
        for (const image of showcaseImages) {
          await image.scrollIntoViewIfNeeded();
        }
        await page.waitForFunction(() =>
          [...document.querySelectorAll(".showcase img")].every(
            (image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0,
          ),
        );
        const screenshotSources = await page.evaluate(() =>
          [...document.querySelectorAll(".showcase img")].map((image) => image.currentSrc || image.src),
        );
        assert.ok(
          screenshotSources.every((source) => source.includes("/assets/screenshots/")),
          `${name} screenshots should use static asset URLs: ${screenshotSources.join(", ")}`,
        );
        assert.ok(
          screenshotSources.every((source) => !source.includes("/_next/image")),
          `${name} screenshots should not use Next image optimizer: ${screenshotSources.join(", ")}`,
        );

        await page.close();
      }

      const reduced = await browser.newPage({
        viewport: { width: 390, height: 844 },
        reducedMotion: "reduce",
      });
      await reduced.goto(server.baseUrl, { waitUntil: "networkidle" });
      await reduced.waitForFunction(() => document.documentElement.dataset.motionReady === "true");
      const reducedOverflow = await reduced.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      assert.equal(reducedOverflow, false, "reduced-motion horizontal overflow");
      await reduced.close();

      const imageResponse = await fetch(`${server.baseUrl}/opengraph-image`);
      assert.equal(imageResponse.status, 200);
      assert.match(imageResponse.headers.get("content-type") ?? "", /^image\/png/);
    } finally {
      await browser?.close();
      await server?.stop();
    }
  });
}
