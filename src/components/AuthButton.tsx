"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function AuthButton() {
  const { signIn } = useAuthActions();
  return (
    <>
      <Unauthenticated>
        <button
          className="nav-link"
          onClick={() => void signIn("google", { redirectTo: "/" })}
        >
          Sign in
        </button>
      </Unauthenticated>
      <Authenticated>
        <Account />
      </Authenticated>
    </>
  );
}

function Account() {
  const { signOut } = useAuthActions();
  const me = useQuery(api.profiles.me);
  return (
    <>
      <span className="nav-link" title={me?.email ?? undefined}>
        {me?.name ?? me?.email ?? "Account"}
      </span>
      <button className="nav-link" onClick={() => void signOut()}>
        Sign out
      </button>
    </>
  );
}
