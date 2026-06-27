"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

function client() {
  return new SESv2Client({
    region: process.env.SES_REGION!,
    credentials: {
      accessKeyId: process.env.SES_ACCESS_KEY_ID!,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
    },
  });
}

// Low-level SES send. Internal — callers schedule this with built HTML/text.
// (Until SES production access lands, sends only reach SES-verified recipients.)
export const send = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.optional(v.string()),
  },
  handler: async (_ctx, { to, subject, html, text }) => {
    await client().send(
      new SendEmailCommand({
        FromEmailAddress: process.env.SES_FROM!,
        Destination: { ToAddresses: [to] },
        Content: {
          Simple: {
            Subject: { Data: subject, Charset: "UTF-8" },
            Body: {
              Html: { Data: html, Charset: "UTF-8" },
              ...(text ? { Text: { Data: text, Charset: "UTF-8" } } : {}),
            },
          },
        },
      }),
    );
  },
});
