import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";

const root = new URL("../", import.meta.url);

function projectFile(path) {
  return new URL(path, root);
}

async function readText(path) {
  return readFile(projectFile(path), "utf8");
}

async function loadRouteModule(path) {
  const source = await readText(path);
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const loadedModule = { exports: {} };
  const context = vm.createContext({
    exports: loadedModule.exports,
    module: loadedModule,
    require: () => ({}),
  });

  vm.runInContext(outputText, context, { filename: path });
  return loadedModule.exports;
}

function headersFor(rule) {
  return Object.fromEntries(rule.headers.map(({ key, value }) => [key, value]));
}

test("download and asset cache headers are encoded for production", async () => {
  const config = JSON.parse(await readText("vercel.json"));
  const proxy = await readText("src/proxy.ts");

  const dmgRule = config.headers.find((rule) => rule.source === "/Scrub.dmg");
  assert.ok(dmgRule, "Scrub.dmg header rule should exist");
  assert.deepEqual(headersFor(dmgRule), {
    "Content-Type": "application/x-apple-diskimage",
    "Content-Disposition": 'attachment; filename="Scrub.dmg"',
    "Cache-Control": "public, max-age=3600",
  });

  const releasesRule = config.headers.find((rule) => rule.source === "/releases/(.*)");
  assert.ok(releasesRule, "versioned release DMG header rule should exist");
  assert.deepEqual(headersFor(releasesRule), {
    "Content-Type": "application/x-apple-diskimage",
    "Content-Disposition": "attachment",
    "Cache-Control": "public, max-age=31536000, immutable",
  });
  assert.match(proxy, /pathname\s*===\s*"\/Scrub\.dmg"/);
  assert.ok(proxy.includes("pathname.match(/^\\/releases\\/([^/]+\\.dmg)$/)"));
  assert.match(proxy, /attachment; filename="\$\{filename\}"/);
  assert.match(proxy, /export function proxy/);
  assert.match(proxy, /matcher:\s*\["\/Scrub\.dmg",\s*"\/releases\/:path\*"\]/);

  const assetRule = config.headers.find((rule) => rule.source === "/assets/(.*)");
  assert.ok(assetRule, "assets header rule should exist");
  assert.equal(
    headersFor(assetRule)["Cache-Control"],
    "public, max-age=86400, stale-while-revalidate=604800",
  );
});

test("download metadata matches the shipped DMG", async () => {
  const page = await readText("src/app/page.tsx");
  const manifest = JSON.parse(await readText("src/data/releases.json"));
  const latest = manifest.releases[0];
  const dmg = await readFile(projectFile("public/Scrub.dmg"));
  const sha = createHash("sha256").update(dmg).digest("hex");

  assert.equal(latest.sha256, sha);
  assert.equal(latest.version, "1.5");
  assert.equal(latest.fileSize, dmg.byteLength);
  assert.match(page, /softwareVersion:\s*latestRelease\.version/);
  assert.match(page, /fileSize:\s*formatBytes\(latestRelease\.fileSize\)/);
  assert.match(page, /href="\/llms\.txt"/);
  assert.match(page, /href="\/releases"/);
  assert.doesNotMatch(page, /View previous versions/);
  assert.match(page, /mainEntity:\s*faqs\.map/);
  assert.equal((page.match(/unoptimized/g) ?? []).length, 3);
});

test("crawler, social, legal, and LLM routes are present", async () => {
  await Promise.all(
    [
      "src/app/robots.ts",
      "src/app/sitemap.ts",
      "src/app/manifest.ts",
      "src/app/opengraph-image.tsx",
      "src/app/twitter-image.tsx",
      "src/app/privacy/page.tsx",
      "src/app/terms/page.tsx",
      "src/app/releases/page.tsx",
      "src/app/api/auth/callback/apple/route.ts",
      "src/proxy.ts",
      "src/data/releases.json",
      "public/llms.txt",
      "public/llms-full.txt",
    ].map((path) => access(projectFile(path))),
  );

  const ogImage = await readText("src/app/opengraph-image.tsx");
  assert.doesNotMatch(ogImage, /https:\/\/scrubmac\.app\/assets/);

  const privacy = await readText("src/app/privacy/page.tsx");
  const terms = await readText("src/app/terms/page.tsx");
  const appleCallback = await readText("src/app/api/auth/callback/apple/route.ts");
  assert.match(privacy, /openGraph:/);
  assert.match(privacy, /twitter:/);
  assert.match(terms, /openGraph:/);
  assert.match(terms, /twitter:/);
  assert.match(appleCallback, /com\.levani\.scrub\.auth:\/apple\/callback/);
  assert.match(appleCallback, /code/);
  assert.match(appleCallback, /state/);
});

test("release page exposes only the current launch release", async () => {
  const manifest = JSON.parse(await readText("src/data/releases.json"));
  const releasesPage = await readText("src/app/releases/page.tsx");
  const latest = manifest.releases[0];

  assert.ok(manifest.releases.length >= 1, "at least one release is listed");
  assert.equal(latest.version, "1.5");
  assert.match(releasesPage, /latestRelease\.latestPath/);
  assert.match(releasesPage, /Current Scrub release/);
  assert.match(releasesPage, /release-page-download/);
  assert.doesNotMatch(releasesPage, /visibleReleases/);
  assert.doesNotMatch(releasesPage, /Archive pending/);
  assert.doesNotMatch(releasesPage, /Previous builds|previous builds|previous downloads/);
});

test("sitemap and LLM files expose all agent-facing routes", async () => {
  const { default: sitemap } = await loadRouteModule("src/app/sitemap.ts");
  const urls = Array.from(sitemap(), (entry) => entry.url);

  assert.deepEqual(urls, [
    "https://scrubmac.app",
    "https://scrubmac.app/privacy",
    "https://scrubmac.app/terms",
    "https://scrubmac.app/releases",
    "https://scrubmac.app/llms.txt",
    "https://scrubmac.app/llms-full.txt",
  ]);

  const llms = await readText("public/llms.txt");
  assert.match(llms, /https:\/\/scrubmac\.app\/llms-full\.txt/);
});
