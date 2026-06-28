import { NextRequest, NextResponse } from "next/server";

const SCRUB_APP_CALLBACK = "com.levani.Scrub.auth:/apple/callback";

function scrubRedirect(params: URLSearchParams) {
  const target = new URL(SCRUB_APP_CALLBACK);
  for (const key of ["code", "state", "error", "error_description"]) {
    const value = params.get(key);
    if (value) target.searchParams.set(key, value);
  }
  if (!target.searchParams.has("code") && !target.searchParams.has("error")) {
    target.searchParams.set("error", "missing_code");
  }
  return NextResponse.redirect(target);
}

export function GET(request: NextRequest) {
  return scrubRedirect(request.nextUrl.searchParams);
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const params = new URLSearchParams();
  for (const key of ["code", "state", "error", "error_description"]) {
    const value = form.get(key);
    if (typeof value === "string") params.set(key, value);
  }
  return scrubRedirect(params);
}
