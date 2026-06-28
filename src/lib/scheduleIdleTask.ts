"use client";

type ScheduleIdleTaskOptions = {
  timeout?: number;
};

type SchedulerWithPostTask = {
  postTask?: (
    callback: () => void,
    options?: {
      priority?: "background";
      delay?: number;
      signal?: AbortSignal;
    },
  ) => Promise<unknown>;
};

export function scheduleIdleTask(callback: () => void, { timeout = 2500 }: ScheduleIdleTaskOptions = {}) {
  if (typeof window === "undefined") {
    return () => {};
  }

  if (typeof window.requestIdleCallback === "function") {
    const idleId = window.requestIdleCallback(() => callback(), { timeout });
    return () => {
      window.cancelIdleCallback?.(idleId);
    };
  }

  const scheduler = (globalThis as typeof globalThis & { scheduler?: SchedulerWithPostTask }).scheduler;

  if (typeof scheduler?.postTask === "function") {
    const controller = new AbortController();
    let didRun = false;
    const runTask = () => {
      if (didRun || controller.signal.aborted) return;

      didRun = true;
      window.clearTimeout(timeoutId);
      callback();
    };

    const timeoutId = window.setTimeout(runTask, timeout);

    try {
      void scheduler.postTask(runTask, {
        priority: "background",
        delay: timeout,
        signal: controller.signal,
      }).catch(() => {});
    } catch {
      // Keep the timeout fallback alive for partial scheduler implementations.
    }

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }

  const timeoutId = window.setTimeout(callback, timeout);

  return () => {
    window.clearTimeout(timeoutId);
  };
}
