import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), "utf8");
}

test("download links stay crawlable while analytics initializes lazily", async () => {
  const downloadLink = await readText("src/components/DownloadLink.tsx");
  const posthogClient = await readText("src/lib/posthogClient.ts");

  assert.match(downloadLink, /href="\/Scrub\.dmg"/);
  assert.match(downloadLink, /download/);
  assert.match(downloadLink, /captureDownloadClicked\(source\)/);

  assert.match(posthogClient, /posthog\.init\(key,\s*posthogConfig\)/);
  assert.match(posthogClient, /capture_pageview:\s*true/);
  assert.match(posthogClient, /capture_pageleave:\s*true/);
  assert.match(posthogClient, /autocapture:\s*false/);
  assert.match(posthogClient, /disable_session_recording:\s*true/);
  assert.match(posthogClient, /posthogPromise\s*=\s*null/);
});

test("GSAP motion degrades safely and cleans up scoped triggers", async () => {
  const animations = await readText("src/components/LandingAnimations.tsx");

  assert.match(animations, /dataset\.motionReady\s*=\s*"true"/);
  assert.match(animations, /import\("gsap"\)/);
  assert.match(animations, /import\("gsap\/ScrollTrigger"\)/);
  assert.match(animations, /\.fromTo\(\s*"h1 \.hero-line"/);
  assert.match(animations, /trigger:\s*"\.product-stage"/);
  assert.doesNotMatch(animations, /quickTo\(/);
  assert.doesNotMatch(animations, /"\.hero-window-shine"/);
  assert.doesNotMatch(animations, /repeat:\s*-\s*1/);
  assert.doesNotMatch(animations, /"\.glow-[ab]"/);
  assert.doesNotMatch(animations, /"\.hero-scan"/);
  assert.doesNotMatch(animations, /repeatDelay:\s*0\.95/);
  assert.doesNotMatch(animations, /prefers-reduced-motion:\s*reduce/);
  assert.match(animations, /catch \(error\)/);
  assert.match(animations, /ctx\.revert\(\)/);
  assert.doesNotMatch(animations, /gsap\.from\("\.reveal-hero"/);
  assert.doesNotMatch(animations, /firstReadHasStarted/);
  assert.doesNotMatch(animations, /ScrollTrigger\.getAll\(\)/);
  assert.doesNotMatch(animations, /\.killAll\(/);
});

test("background analytics stays delayed while first-visit motion starts directly", async () => {
  const scheduler = await readText("src/lib/scheduleIdleTask.ts");
  const provider = await readText("src/app/PostHogProvider.tsx");
  const animations = await readText("src/components/LandingAnimations.tsx");
  const runtime = `${scheduler}\n${provider}\n${animations}`;

  assert.match(provider, /scheduleIdleTask\(warmPostHog,\s*\{\s*timeout:\s*3000\s*\}\)/);
  assert.match(animations, /void run\(\)/);
  assert.match(scheduler, /requestIdleCallback/);
  assert.match(scheduler, /postTask/);
  assert.match(scheduler, /setTimeout\(runTask,\s*timeout\)/);
  assert.doesNotMatch(runtime, /setTimeout\([^,\n]+,\s*1\s*\)/);
  assert.doesNotMatch(runtime, /setTimeout\([^,\n]+,\s*0\s*\)/);
});
