"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function AuthButton() {
  return (
    <>
      <Unauthenticated>
        <SignInMenu />
      </Unauthenticated>
      <Authenticated>
        <Account />
      </Authenticated>
    </>
  );
}

function SignInMenu() {
  const { signIn } = useAuthActions();
  const [open, setOpen] = useState(false);
  return (
    <div className="signin-wrap">
      <button className="nav-link" onClick={() => setOpen((o) => !o)}>
        Sign in
      </button>
      {open && (
        <>
          <div className="signin-backdrop" onClick={() => setOpen(false)} />
          <div className="signin-menu">
            <button
              className="signin-option"
              onClick={() => void signIn("apple", { redirectTo: "/" })}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M16.37 1.43c.06.86-.27 1.72-.81 2.35-.57.66-1.5 1.17-2.4 1.1-.07-.84.32-1.71.83-2.27.57-.64 1.55-1.13 2.38-1.18ZM19.6 17.2c-.43 1-.64 1.45-1.2 2.33-.78 1.24-1.88 2.78-3.24 2.79-1.21.01-1.52-.79-3.16-.78-1.64.01-1.98.79-3.19.78-1.36-.01-2.4-1.4-3.18-2.63C3.43 16.2 3.2 12.16 4.55 10c.96-1.53 2.47-2.43 3.9-2.43 1.45 0 2.36.8 3.56.8 1.16 0 1.87-.8 3.55-.8 1.27 0 2.62.69 3.58 1.89-3.14 1.72-2.63 6.2.46 7.74Z" />
              </svg>
              Continue with Apple
            </button>
            <button
              className="signin-option"
              onClick={() => void signIn("google", { redirectTo: "/" })}
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <path fill="#EA4335" d="M12 10.2v3.92h5.46c-.24 1.41-1.66 4.14-5.46 4.14-3.29 0-5.97-2.72-5.97-6.08S8.71 6.1 12 6.1c1.87 0 3.13.8 3.85 1.48l2.62-2.53C16.8 3.5 14.6 2.5 12 2.5 6.98 2.5 2.9 6.58 2.9 11.6S6.98 20.7 12 20.7c5.5 0 9.14-3.86 9.14-9.3 0-.62-.07-1.1-.16-1.58H12Z" />
              </svg>
              Continue with Google
            </button>
          </div>
        </>
      )}
    </div>
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
