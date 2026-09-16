"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { PasswordInput } from "../_shared/PasswordInput";
import { login, type LoginState } from "./actions";

const field =
  "w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-ink outline-none focus:border-ink";

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-10 space-y-6">
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="block font-bold" htmlFor="username">
          Username <span className="text-red-700">*</span>
        </label>
        <input
          className={`${field} mt-2`}
          id="username"
          name="username"
          autoComplete="username"
          placeholder="Enter your username"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block font-bold" htmlFor="password">
          Password <span className="text-red-700">*</span>
        </label>
        <div className="mt-2">
          <PasswordInput
            className={field}
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {state.error}
        </p>
      )}

      <button
        className="w-full rounded-xl bg-butter py-3.5 font-bold disabled:opacity-50"
        type="submit"
        disabled={pending}
      >
        {pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
