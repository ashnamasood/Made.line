import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ponytail: HTTP Basic Auth, not a real login — fine for a one-person admin
// view. Move to a proper auth provider if more than the owner needs access.
export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass) {
    return new NextResponse("Admin access is not configured.", {
      status: 503,
    });
  }

  const auth = request.headers.get("authorization");
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  if (auth === expected) return NextResponse.next();

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
