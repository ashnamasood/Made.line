export const SESSION_COOKIE = "madeline_admin";
export const SESSION_DAYS = 7;

/**
 * Signed-cookie sessions — no session store to keep, since there is exactly
 * one admin. The signing key is ADMIN_PASSWORD, so changing the password
 * invalidates every existing session, which is the behaviour you want.
 */
const enc = new TextEncoder();

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time, so a wrong value can't be narrowed by response timing. */
function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSession(secret: string) {
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  return `${expires}.${await sign(String(expires), secret)}`;
}

export async function isValidSession(token: string, secret: string) {
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const expires = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  return timingSafeEqual(signature, await sign(expires, secret));
}

/** Compares credentials without leaking which field was wrong via timing. */
export function credentialsMatch(user: string, password: string) {
  const okUser = timingSafeEqual(user, process.env.ADMIN_USER ?? "");
  const okPass = timingSafeEqual(password, process.env.ADMIN_PASSWORD ?? "");
  return okUser && okPass;
}
