import { NextRequest, NextResponse } from "next/server";

function attachmentName(pathname: string) {
  if (pathname === "/Scrub.dmg") return "Scrub.dmg";
  const match = pathname.match(/^\/releases\/([^/]+\.dmg)$/);
  return match?.[1];
}

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const filename = attachmentName(request.nextUrl.pathname);

  if (filename) {
    response.headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  }

  return response;
}

export const config = {
  matcher: ["/Scrub.dmg", "/releases/:path*"],
};
