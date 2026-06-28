import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import vm from "node:vm";

const requireFromTest = createRequire(import.meta.url);
const root = new URL("../", import.meta.url);

async function readText(path) {
  return readFile(new URL(path, root), "utf8");
}

async function loadClientModule(path, overrides = {}) {
  const source = await readText(path);
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const loadedModule = { exports: {} };
  const context = vm.createContext({
    AbortController,
    Promise,
    clearTimeout,
    console: overrides.console ?? console,
    exports: loadedModule.exports,
    module: loadedModule,
    process: overrides.process ?? process,
    require: overrides.require ?? requireFromTest,
    setTimeout,
    window: overrides.window,
  });

  if (overrides.scheduler) {
    context.scheduler = overrides.scheduler;
  }

  vm.runInContext(outputText, context, { filename: path });
  return loadedModule.exports;
}

test("scheduleIdleTask executes and cancels each runtime branch", async () => {
  const idleCalls = [];
  const idleWindow = {
    requestIdleCallback(callback, options) {
      idleCalls.push(options);
      this.idleCallback = callback;
      return 7;
    },
    cancelIdleCallback(id) {
      this.cancelled = id;
    },
  };
  const idleModule = await loadClientModule("src/lib/scheduleIdleTask.ts", { window: idleWindow });
  let idleRan = false;
  const cancelIdle = idleModule.scheduleIdleTask(() => {
    idleRan = true;
  }, { timeout: 1234 });

  assert.equal(idleCalls.length, 1);
  assert.equal(idleCalls[0].timeout, 1234);
  idleWindow.idleCallback();
  assert.equal(idleRan, true);
  cancelIdle();
  assert.equal(idleWindow.cancelled, 7);

  let postTaskOptions;
  const postTaskWindow = {
    setTimeout(callback, delay) {
      this.timeoutDelay = delay;
      this.timeoutCallback = callback;
      return 24;
    },
    clearTimeout(id) {
      this.cleared = id;
    },
  };
  const postTaskModule = await loadClientModule("src/lib/scheduleIdleTask.ts", {
    window: postTaskWindow,
    scheduler: {
      postTask(callback, options) {
        postTaskOptions = options;
        callback();
        return Promise.resolve();
      },
    },
  });
  let postTaskRan = false;
  const cancelPostTask = postTaskModule.scheduleIdleTask(() => {
    postTaskRan = true;
  }, { timeout: 2222 });

  assert.equal(postTaskRan, true);
  assert.equal(postTaskOptions.priority, "background");
  assert.equal(postTaskOptions.delay, 2222);
  assert.equal(postTaskOptions.signal.aborted, false);
  assert.equal(postTaskWindow.timeoutDelay, 2222);
  assert.equal(postTaskWindow.cleared, 24);
  cancelPostTask();
  assert.equal(postTaskOptions.signal.aborted, true);

  const rejectedPostTaskWindow = {
    setTimeout(callback, delay) {
      this.timeoutDelay = delay;
      this.timeoutCallback = callback;
      return 73;
    },
    clearTimeout(id) {
      this.cleared = id;
    },
  };
  const rejectedPostTaskModule = await loadClientModule("src/lib/scheduleIdleTask.ts", {
    window: rejectedPostTaskWindow,
    scheduler: {
      postTask() {
        return Promise.reject(new Error("postTask unavailable"));
      },
    },
  });
  let rejectedPostTaskRan = false;
  const cancelRejectedPostTask = rejectedPostTaskModule.scheduleIdleTask(() => {
    rejectedPostTaskRan = true;
  }, { timeout: 2333 });

  assert.equal(rejectedPostTaskRan, false);
  assert.equal(rejectedPostTaskWindow.timeoutDelay, 2333);
  rejectedPostTaskWindow.timeoutCallback();
  assert.equal(rejectedPostTaskRan, true);
  cancelRejectedPostTask();
  assert.equal(rejectedPostTaskWindow.cleared, 73);

  const timeoutCalls = [];
  const timeoutWindow = {
    setTimeout(callback, delay) {
      timeoutCalls.push(delay);
      this.timeoutCallback = callback;
      return 42;
    },
    clearTimeout(id) {
      this.cleared = id;
    },
  };
  const timeoutModule = await loadClientModule("src/lib/scheduleIdleTask.ts", { window: timeoutWindow });
  let timeoutRan = false;
  const cancelTimeout = timeoutModule.scheduleIdleTask(() => {
    timeoutRan = true;
  }, { timeout: 3456 });

  assert.equal(timeoutCalls.length, 1);
  assert.equal(timeoutCalls[0], 3456);
  timeoutWindow.timeoutCallback();
  assert.equal(timeoutRan, true);
  cancelTimeout();
  assert.equal(timeoutWindow.cleared, 42);

  const serverModule = await loadClientModule("src/lib/scheduleIdleTask.ts");
  assert.doesNotThrow(() => serverModule.scheduleIdleTask(() => assert.fail("should not run"))());
});

test("posthogClient lazy init, retry, and download capture execute", async () => {
  const fakePostHog = {
    __loaded: false,
    captures: [],
    init(key, config) {
      this.__loaded = true;
      this.key = key;
      this.config = config;
    },
    capture(name, payload) {
      this.captures.push([name, payload]);
    },
  };
  const processStub = {
    env: {
      NEXT_PUBLIC_POSTHOG_KEY: "ph_test",
      NODE_ENV: "test",
    },
  };
  let requireCalls = 0;
  const posthogModule = await loadClientModule("src/lib/posthogClient.ts", {
    process: processStub,
    window: {},
    require: (name) => {
      assert.equal(name, "posthog-js");
      requireCalls += 1;
      return { __esModule: true, default: fakePostHog };
    },
  });

  const [clientA, clientB] = await Promise.all([
    posthogModule.ensurePostHog(),
    posthogModule.ensurePostHog(),
  ]);
  assert.equal(clientA, fakePostHog);
  assert.equal(clientB, fakePostHog);
  assert.equal(requireCalls, 1);
  assert.equal(fakePostHog.key, "ph_test");
  assert.equal(fakePostHog.config.autocapture, false);
  assert.equal(fakePostHog.config.disable_session_recording, true);

  await posthogModule.captureDownloadClicked("unit");
  assert.equal(fakePostHog.captures.length, 1);
  assert.equal(fakePostHog.captures[0][0], "download_clicked");
  assert.equal(fakePostHog.captures[0][1].source, "unit");

  const missingKeyModule = await loadClientModule("src/lib/posthogClient.ts", {
    process: { env: { NODE_ENV: "test" } },
    window: {},
  });
  assert.equal(await missingKeyModule.ensurePostHog(), null);

  let attempts = 0;
  const retryModule = await loadClientModule("src/lib/posthogClient.ts", {
    process: processStub,
    window: {},
    console: { warn() {} },
    require: () => {
      attempts += 1;
      if (attempts === 1) throw new Error("temporary import failure");
      return { __esModule: true, default: fakePostHog };
    },
  });
  assert.equal(await retryModule.ensurePostHog(), null);
  assert.equal(await retryModule.ensurePostHog(), fakePostHog);
});
