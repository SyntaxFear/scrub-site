import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

// Phase 1a: Google sign-in (needs AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET in the
// Convex deployment env). Apple and email magic-link are added in Phase 1b
// (Apple needs the custom domain; email magic-link sends via SES).
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
});
