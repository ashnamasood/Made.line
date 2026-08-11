import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSession } from "@/lib/auth";

// ponytail: one signed cookie, no session store and no auth provider — there
// is a single admin. Swap for a real provider if more people need access.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page has to stay reachable, or signing in is impossible.
  if (pathname === "/admin/login") return NextResponse.next();

  const secret = process.env.ADMIN_PASSWORD;
  if (!process.env.ADMIN_USER || !secret) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token && (await isValidSession(token, secret))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/admin/:path*",
};
