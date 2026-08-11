"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_DAYS,
  createSession,
  credentialsMatch,
} from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!process.env.ADMIN_USER || !secret) {
    return { error: "Admin access is not configured on the server." };
  }

  const user = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!credentialsMatch(user, password)) {
    // Deliberately vague: naming the wrong field tells an attacker which
    // half they already have.
    return { error: "Incorrect username or password." };
  }

  (await cookies()).set(SESSION_COOKIE, await createSession(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });

  // Only ever an internal path — an open redirect here would let a crafted
  // login link bounce the admin to another site after signing in.
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
