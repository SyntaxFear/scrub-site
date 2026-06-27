"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type State = "idle" | "loading" | "pending" | "already" | "error";

export function NewsletterSignup({ source = "site" }: { source?: string }) {
  const subscribe = useMutation(api.subscribers.subscribe);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  if (state === "pending" || state === "already") {
    return (
      <div className="news-done">
        {state === "already"
          ? "You're already on the list — thanks!"
          : "Almost there — check your inbox and click the confirmation link."}
      </div>
    );
  }

  return (
    <form
      className="news-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("loading");
        setError("");
        try {
          const r = await subscribe({ email, source });
          setState(r.status === "already" ? "already" : "pending");
        } catch (err) {
          setState("error");
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      }}
    >
      <div className="news-row">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="news-input"
          aria-label="Email address"
        />
        <button type="submit" className="news-btn" disabled={state === "loading"}>
          {state === "loading" ? "…" : "Notify me"}
        </button>
      </div>
      {state === "error" && <div className="news-error">{error}</div>}
    </form>
  );
}
