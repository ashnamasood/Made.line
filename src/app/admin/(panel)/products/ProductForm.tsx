"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { ProductId, ProductInfo } from "@/lib/products";
import { updateProduct, type SaveState } from "./actions";

const field =
  "mt-2 w-full rounded-xl border border-ink/20 bg-white px-4 py-3 outline-none focus:border-ink";

export function ProductForm({ id, info }: { id: ProductId; info: ProductInfo }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(updateProduct, {});

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={id} />

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block font-bold">
          Product name *
          <input
            className={`${field} font-normal`}
            name="title"
            defaultValue={info.title}
            maxLength={80}
            required
          />
          <span className="mt-1 block text-sm font-normal text-ink/50">
            Shown in the cart, checkout and order emails.
          </span>
        </label>

        <label className="block font-bold">
          Price * ($)
          <input
            className={`${field} font-normal`}
            name="price"
            inputMode="decimal"
            defaultValue={(info.price / 100).toFixed(2)}
            pattern="\d{1,5}(\.\d{1,2})?"
            title="A number like 32 or 32.50"
            required
          />
          <span className="mt-1 block text-sm font-normal text-ink/50">
            Orders are always charged the price saved here.
          </span>
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-ink/15 p-4">
        <input
          type="checkbox"
          name="active"
          defaultChecked={info.active}
          className="mt-1 size-5 accent-ink"
        />
        <span>
          <span className="block font-bold">In stock</span>
          <span className="text-sm text-ink/60">
            Untick to show &ldquo;Sold Out&rdquo; on the shop and block checkout for this
            product.
          </span>
        </span>
      </label>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 font-bold text-red-700">
          {state.error}
        </p>
      )}
      {state.saved && !pending && (
        <p role="status" className="rounded-xl bg-green-50 px-4 py-3 font-bold text-green-800">
          Saved. The shop is updated.
        </p>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link href="/admin/products" className="rounded-xl px-5 py-3 hover:bg-ink/5">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-butter px-6 py-3 font-bold disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
