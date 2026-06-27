// Branded HTML email templates (plain functions, importable from mutations/actions).
const SITE = "https://scrubmac.app";

function layout(title: string, bodyHtml: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:#0a0a0b;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#f5f5f7">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px">
    <div style="text-align:center;margin-bottom:26px">
      <img src="${SITE}/assets/icon-256.png" width="54" height="54" style="border-radius:13px" alt="Scrub"/>
      <div style="font-size:19px;font-weight:700;margin-top:10px;letter-spacing:-0.01em">Scrub</div>
    </div>
    <div style="background:#161618;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 14px;letter-spacing:-0.02em">${title}</h1>
      ${bodyHtml}
    </div>
    <div style="text-align:center;color:#6e6e76;font-size:12px;margin-top:20px">${footer}</div>
  </div></body></html>`;
}

function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#FF9F0A,#FF3B30);color:#fff;text-decoration:none;font-weight:600;padding:13px 26px;border-radius:980px">${label}</a>`;
}

export function confirmEmail(confirmUrl: string) {
  return {
    subject: "Confirm your Scrub updates subscription",
    html: layout(
      "Confirm your subscription",
      `<p style="color:#a1a1a8;line-height:1.6;margin:0 0 22px">Tap below to confirm you'd like an email when Scrub ships a new version — release notes only, no spam. The app still never sees what you delete.</p>
       <p style="margin:0">${button(confirmUrl, "Confirm subscription")}</p>
       <p style="color:#6e6e76;font-size:13px;margin:18px 0 0">If you didn't request this, just ignore this email.</p>`,
      `Scrub for macOS · scrubmac.app`,
    ),
    text: `Confirm your Scrub updates subscription: ${confirmUrl}`,
  };
}

export function updateEmail(opts: {
  title: string;
  bodyHtml: string;
  unsubscribeUrl: string;
}) {
  return layout(
    opts.title,
    opts.bodyHtml,
    `You're getting this because you subscribed to Scrub updates. <a href="${opts.unsubscribeUrl}" style="color:#8a8a93">Unsubscribe</a>`,
  );
}
