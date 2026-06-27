import Google from "@auth/core/providers/google";
import Apple from "@auth/core/providers/apple";
import { convexAuth } from "@convex-dev/auth/server";

// Google + Apple sign-in. Each reads its AUTH_<PROVIDER>_ID / _SECRET from the
// Convex deployment env. Apple's secret is a ~6-month JWT (regenerate from the
// .p8 key; key id P7NXSB7QMJ, team CNH4KYRW44, services id app.scrubmac.web).
// Apple only works on the production domain scrubmac.app (its registered return
// URL https://scrubmac.app/api/auth/callback/apple is proxied to Convex — see
// next.config.ts). Email magic-link is added later (sends via SES).
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Apple],
});
