import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Daily: delete expired sessions and email codes.
crons.daily(
  "purge expired auth rows",
  { hourUTC: 3, minuteUTC: 0 },
  internal.nativeAuth.purgeExpired,
);

export default crons;
