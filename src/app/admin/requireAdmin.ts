import { cookies } from "next/headers";
import { sessionSecret } from "@/lib/account";
import { SESSION_COOKIE, SESSION_DAYS, createSession, isValidSession } from "@/lib/auth";

/**
 * Every admin server action calls this first. Server actions are reachable by
 * direct POST, so Next's docs say to check auth inside each one rather than
 * relying on the proxy in front of the page that renders it.
 */
export async function requireAdmin() {
  const secret = await sessionSecret();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret || !token || !(await isValidSession(token, secret))) {
    throw new Error("Not signed in");
  }
}

/**
 * Sets a fresh session cookie. Deliberately not in a "use server" file:
 * every export there is callable from the browser, and this one signs a
 * session without checking anything.
 */
export async function startSession() {
  const secret = await sessionSecret();
  if (!secret) throw new Error("Admin access is not configured");
  (await cookies()).set(SESSION_COOKIE, await createSession(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}
