"use client";

import { useActionState } from "react";
import type { Account } from "@/lib/account";
import { Avatar } from "../../_shared/Avatar";
import { PasswordInput } from "../../_shared/PasswordInput";
import { PhotoPicker } from "../PhotoPicker";
import { updatePassword, updateProfile, type FormState } from "./actions";

const field =
  "w-full rounded-xl border border-ink/20 bg-white px-4 py-3 font-normal outline-none focus:border-ink";
const label = "block font-bold";

function Result({ state, pending, saved }: { state: FormState; pending: boolean; saved: string }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 font-bold text-red-700">
        {state.error}
      </p>
    );
  }
  if (state.saved && !pending) {
    return (
      <p role="status" className="rounded-xl bg-green-50 px-4 py-3 font-bold text-green-800">
        {saved}
      </p>
    );
  }
  return null;
}

function Submit({ pending, children }: { pending: boolean; children: string }) {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-butter px-6 py-3 font-bold disabled:opacity-50"
      >
        {pending ? "Saving…" : children}
      </button>
    </div>
  );
}

export function ProfileForm({ account, blobReady }: { account: Account; blobReady: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfile, {});
  return (
    <form action={action} className="space-y-6">
      <PhotoPicker
        key={account.avatar ?? "none"}
        name="avatar"
        label="Profile picture"
        hint={
          blobReady
            ? "Shown in the top bar. Square photos work best."
            : "Photo uploads need a Vercel Blob store connected to the project."
        }
        current={account.avatar}
        canReset={!!account.avatar}
        resetLabel="Remove photo"
        disabled={!blobReady}
        round
        fallback={<Avatar src={null} className="size-full" />}
      />
      <label className={label}>
        Name *
        <input className={`${field} mt-2`} name="name" defaultValue={account.name} maxLength={60} required />
        <span className="mt-1 block text-sm font-normal text-ink/50">Shown in the top bar.</span>
      </label>
      <label className={label}>
        Username *
        <input
          className={`${field} mt-2`}
          name="username"
          defaultValue={account.username}
          pattern="[A-Za-z0-9._\-]{3,32}"
          title="3–32 letters, numbers, dots, dashes or underscores"
          autoComplete="username"
          required
        />
        <span className="mt-1 block text-sm font-normal text-ink/50">What you type to sign in.</span>
      </label>
      <Result state={state} pending={pending} saved="Profile saved." />
      <Submit pending={pending}>Save changes</Submit>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(updatePassword, {});
  return (
    <form action={action} className="space-y-6">
      <div>
        <label className={label} htmlFor="current">Current password *</label>
        <div className="mt-2">
          <PasswordInput className={field} id="current" name="current" autoComplete="current-password" placeholder="Enter current password" required />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="next">New password *</label>
        <div className="mt-2">
          <PasswordInput className={field} id="next" name="next" autoComplete="new-password" minLength={8} maxLength={128} placeholder="Enter new password" required />
        </div>
        <p className="mt-1 text-sm text-ink/50">At least 8 characters.</p>
      </div>
      <div>
        <label className={label} htmlFor="confirm">Confirm new password *</label>
        <div className="mt-2">
          <PasswordInput className={field} id="confirm" name="confirm" autoComplete="new-password" minLength={8} maxLength={128} placeholder="Confirm new password" required />
        </div>
      </div>
      <Result
        state={state}
        pending={pending}
        saved="Password updated. Any other signed-in browsers have been signed out."
      />
      <Submit pending={pending}>Update password</Submit>
    </form>
  );
}
