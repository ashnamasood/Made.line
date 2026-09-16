"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyLogin } from "@/lib/account";
import { SESSION_COOKIE } from "@/lib/auth";
import { startSession } from "../requireAdmin";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD) {
    return { error: "Admin access is not configured on the server." };
  }

  const user = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  let ok: boolean;
  try {
    ok = await verifyLogin(user, password);
  } catch (error) {
    console.error("login check failed", error);
    return { error: "Can't sign in right now: the database isn't responding." };
  }
  if (!ok) {
    // Deliberately vague: naming the wrong field tells an attacker which
    // half they already have.
    return { error: "Incorrect username or password." };
  }

  await startSession();

  // Only ever an internal path — an open redirect here would let a crafted
  // login link bounce the admin to another site after signing in.
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
