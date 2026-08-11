"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Wordmark } from "@/components/Logo";
import { login, type LoginState } from "./actions";

const field =
  "w-full rounded-lg border border-ink/30 bg-white px-4 py-3 font-body text-ink outline-none focus:border-ink";

function LoginForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-10 space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block font-body text-sm text-ink/70" htmlFor="username">
        Username
      </label>
      <input
        className={field}
        id="username"
        name="username"
        autoComplete="username"
        required
        autoFocus
      />

      <label
        className="block pt-2 font-body text-sm text-ink/70"
        htmlFor="password"
      >
        Password
      </label>
      <input
        className={field}
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      {state.error && (
        <p
          role="alert"
          className="rounded-lg bg-white px-4 py-3 font-body text-sm font-bold text-red-700"
        >
          {state.error}
        </p>
      )}

      <button
        className="mt-2 w-full rounded-full border-2 border-ink bg-ink py-3.5 font-display uppercase tracking-[0.12em] text-cream disabled:opacity-50"
        type="submit"
        disabled={pending}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function Login() {
  return (
    <main className="mx-auto w-full max-w-[400px] px-6 py-20">
      <Wordmark className="mx-auto h-8" />
      <h1 className="mt-8 text-center font-display text-2xl uppercase">
        Admin
      </h1>
      {/* useSearchParams needs a Suspense boundary to prerender this route. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
