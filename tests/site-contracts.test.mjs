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

  const dmgRule = config.headers.find((rule) => rule.source === "/Scrub.dmg");
  assert.ok(dmgRule, "Scrub.dmg header rule should exist");
  assert.deepEqual(headersFor(dmgRule), {
    "Content-Type": "application/x-apple-diskimage",
    "Content-Disposition": 'attachment; filename="Scrub.dmg"',
    "Cache-Control": "public, max-age=3600",
  });

  const assetRule = config.headers.find((rule) => rule.source === "/assets/(.*)");
  assert.ok(assetRule, "assets header rule should exist");
  assert.equal(
    headersFor(assetRule)["Cache-Control"],
    "public, max-age=86400, stale-while-revalidate=604800",
  );
});

test("download metadata matches the shipped DMG", async () => {
  const page = await readText("src/app/page.tsx");
  const dmg = await readFile(projectFile("public/Scrub.dmg"));
  const sha = createHash("sha256").update(dmg).digest("hex");

  const declaredSha = page.match(/const DMG_SHA256 = "([^"]+)"/)?.[1];
  assert.equal(declaredSha, sha);
  assert.match(page, /softwareVersion:\s*"1\.0"/);
  assert.match(page, /fileSize:\s*"2\.6 MB"/);
  assert.match(page, /href="\/llms\.txt"/);
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
      "public/llms.txt",
      "public/llms-full.txt",
    ].map((path) => access(projectFile(path))),
  );

  const ogImage = await readText("src/app/opengraph-image.tsx");
  assert.doesNotMatch(ogImage, /https:\/\/scrubmac\.app\/assets/);

  const privacy = await readText("src/app/privacy/page.tsx");
  const terms = await readText("src/app/terms/page.tsx");
  assert.match(privacy, /openGraph:/);
  assert.match(privacy, /twitter:/);
  assert.match(terms, /openGraph:/);
  assert.match(terms, /twitter:/);
});

test("sitemap and LLM files expose all agent-facing routes", async () => {
  const { default: sitemap } = await loadRouteModule("src/app/sitemap.ts");
  const urls = Array.from(sitemap(), (entry) => entry.url);

  assert.deepEqual(urls, [
    "https://scrubmac.app",
    "https://scrubmac.app/privacy",
    "https://scrubmac.app/terms",
    "https://scrubmac.app/llms.txt",
    "https://scrubmac.app/llms-full.txt",
  ]);

  const llms = await readText("public/llms.txt");
  assert.match(llms, /https:\/\/scrubmac\.app\/llms-full\.txt/);
});
