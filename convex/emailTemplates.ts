// Branded HTML email templates (plain functions, importable from actions).
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

/// The email sign-in code for the macOS app.
export function authCodeEmail(code: string) {
  return {
    subject: `${code} is your Scrub sign-in code`,
    html: layout(
      "Your sign-in code",
      `<p style="color:#a1a1a8;line-height:1.6;margin:0 0 18px">Enter this code in Scrub to finish signing in. It expires in 10 minutes.</p>
       <div style="font-size:34px;font-weight:700;letter-spacing:10px;text-align:center;margin:6px 0 18px;color:#fff">${code}</div>
       <p style="color:#6e6e76;font-size:13px;margin:0">If you didn't request this, you can safely ignore this email.</p>`,
      `Scrub for macOS · scrubmac.app`,
    ),
    text: `Your Scrub sign-in code is ${code}. It expires in 10 minutes.`,
  };
}
