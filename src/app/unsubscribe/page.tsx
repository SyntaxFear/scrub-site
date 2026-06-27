"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

function UnsubInner() {
  const token = useSearchParams().get("token");
  const unsubscribe = useMutation(api.subscribers.unsubscribe);
  const [state, setState] = useState<"loading" | "ok" | "bad">("loading");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (!token) {
      setState("bad");
      return;
    }
    unsubscribe({ token })
      .then((r) => setState(r.ok ? "ok" : "bad"))
      .catch(() => setState("bad"));
  }, [token, unsubscribe]);

  return (
    <div className="status-page">
      <div className="glow" />
      <img className="status-icon" src="/assets/icon-512.png" alt="Scrub" />
      {state === "loading" && <h1>Unsubscribing…</h1>}
      {state === "ok" && (
        <>
          <h1>You're unsubscribed</h1>
          <p>You won't get any more update emails. Sorry to see you go — Scrub stays free and yours.</p>
        </>
      )}
      {state === "bad" && (
        <>
          <h1>Link invalid</h1>
          <p>That unsubscribe link didn't work. If you keep getting emails, reply and we'll remove you.</p>
        </>
      )}
      <a className="status-link" href="/">
        ← Back to scrubmac.app
      </a>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubInner />
    </Suspense>
  );
}
