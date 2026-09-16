import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSession } from "@/lib/auth";

/**
 * Every admin server action calls this first. Server actions are reachable by
 * direct POST, so Next's docs say to check auth inside each one rather than
 * relying on the proxy in front of the page that renders it.
 */
export async function requireAdmin() {
  const secret = process.env.ADMIN_PASSWORD;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret || !token || !(await isValidSession(token, secret))) {
    throw new Error("Not signed in");
  }
}
