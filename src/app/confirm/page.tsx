"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

function ConfirmInner() {
  const token = useSearchParams().get("token");
  const confirm = useMutation(api.subscribers.confirm);
  const [state, setState] = useState<"loading" | "ok" | "bad">("loading");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (!token) {
      setState("bad");
      return;
    }
    confirm({ token })
      .then((r) => setState(r.ok ? "ok" : "bad"))
      .catch(() => setState("bad"));
  }, [token, confirm]);

  return (
    <div className="status-page">
      <div className="glow" />
      <img className="status-icon" src="/assets/icon-512.png" alt="Scrub" />
      {state === "loading" && <h1>Confirming…</h1>}
      {state === "ok" && (
        <>
          <h1>You're subscribed 🎉</h1>
          <p>
            You'll get an email whenever Scrub ships a new version — release notes
            only. We still never see what you delete.
          </p>
        </>
      )}
      {state === "bad" && (
        <>
          <h1>Link expired or invalid</h1>
          <p>That confirmation link didn't work. Try subscribing again from the home page.</p>
        </>
      )}
      <a className="status-link" href="/">
        ← Back to scrubmac.app
      </a>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmInner />
    </Suspense>
  );
}
