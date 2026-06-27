"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";

// Client-side Convex Auth (tokens in localStorage). We use the React integration
// rather than the Next.js cookie/SSR one because @convex-dev/auth@0.0.94's Next.js
// middleware predates Next.js 16's middleware→proxy change. All auth UI here is
// client-side, so we don't need server-component auth.
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
