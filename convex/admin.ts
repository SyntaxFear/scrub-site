import { internalQuery } from "./_generated/server";

const MAX_ROWS = 500;

const tableNames = ["appUsers", "appSessions", "emailCodes"] as const;

function redactRecord(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => {
      const lowered = key.toLowerCase();
      if (
        lowered.includes("token") ||
        lowered.includes("secret") ||
        lowered.includes("password") ||
        lowered.includes("hash") ||
        lowered.includes("key") ||
        lowered.includes("code") ||
        lowered.includes("authorization")
      ) {
        return [key, "[redacted]"];
      }
      return [key, value];
    }),
  );
}

export const snapshot = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const tables: Record<string, { count: number; rows: Record<string, unknown>[] }> = {};

    for (const table of tableNames) {
      const rows = await ctx.db.query(table).order("desc").take(MAX_ROWS);
      tables[table] = {
        count: rows.length,
        rows: rows.map((row) => redactRecord(row)),
      };
    }

    const activeSessions = tables.appSessions.rows.filter((row) => {
      const expiresAt = row.expiresAt;
      return typeof expiresAt === "number" && expiresAt > now;
    }).length;
    const expiredSessions = tables.appSessions.rows.length - activeSessions;
    const pendingEmailCodes = tables.emailCodes.rows.filter((row) => {
      const expiresAt = row.expiresAt;
      return typeof expiresAt === "number" && expiresAt > now;
    }).length;
    const expiredEmailCodes = tables.emailCodes.rows.length - pendingEmailCodes;
    const googleUsers = tables.appUsers.rows.filter((row) => row.googleSub).length;
    const appleUsers = tables.appUsers.rows.filter((row) => row.appleSub).length;

    return {
      tables,
      summary: [
        {
          label: "Users",
          value: String(tables.appUsers.count),
          detail: `${googleUsers} Google, ${appleUsers} Apple`,
        },
        {
          label: "Active sessions",
          value: String(activeSessions),
          detail: `${expiredSessions} expired`,
        },
        {
          label: "Pending email codes",
          value: String(pendingEmailCodes),
          detail: `${expiredEmailCodes} expired`,
        },
      ],
      warnings:
        Object.values(tables).some((table) => table.count === MAX_ROWS)
          ? [`One or more tables is capped at the latest ${MAX_ROWS} rows.`]
          : [],
    };
  },
});
