"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  MAX_DISCOUNT,
  packshot,
  shopPhoto,
  type ProductId,
  type ProductInfo,
} from "@/lib/products";
import { PhotoPicker } from "../PhotoPicker";
import { updateProduct, type SaveState } from "./actions";

const field =
  "mt-2 w-full rounded-xl border border-ink/20 bg-white px-4 py-3 font-normal outline-none focus:border-ink";
const help = "mt-1 block text-sm font-normal text-ink/50";

export function ProductForm({
  id,
  info,
  blobReady,
}: {
  id: ProductId;
  info: ProductInfo;
  blobReady: boolean;
}) {
  const [state, action, pending] = useActionState<SaveState, FormData>(updateProduct, {});

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="id" value={id} />

      <section className="space-y-4">
        <h3 className="text-lg font-bold">Photos</h3>
        {!blobReady && (
          <p className="rounded-xl bg-butter/40 px-4 py-3 text-sm">
            Photo uploads need a Vercel Blob store. In Vercel, open the project → Storage →
            Create → Blob, connect it to this project and redeploy. Everything else on
            this page works without it.
          </p>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          <PhotoPicker
            key={packshot(id, info)}
            name="image"
            label="Product photo"
            hint="Shown in the product row on the home and shop pages, the cart and checkout."
            current={packshot(id, info)}
            canReset={!!info.image}
            disabled={!blobReady}
          />
          <PhotoPicker
            key={shopPhoto(id, info)}
            name="shopImage"
            label="Shop page photo"
            hint="The large photo beside this product on the shop page."
            current={shopPhoto(id, info)}
            canReset={!!info.shopImage}
            disabled={!blobReady}
          />
        </div>
      </section>

      <section className="space-y-6 border-t border-ink/10 pt-8">
        <h3 className="text-lg font-bold">Details</h3>
        <label className="block font-bold">
          Product name *
          <input className={field} name="title" defaultValue={info.title} maxLength={80} required />
          <span className={help}>Shown on the shop page, cart, checkout and order emails.</span>
        </label>

        <label className="block font-bold">
          Description
          <textarea
            className={`${field} min-h-36`}
            name="description"
            defaultValue={info.description ?? ""}
            maxLength={1500}
            placeholder="Leave empty to keep the shop page's designed text."
          />
          <span className={help}>
            Replaces the paragraph under the product name on the shop page.
          </span>
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block font-bold">
            Price * ($)
            <input
              className={field}
              name="price"
              inputMode="decimal"
              defaultValue={(info.price / 100).toFixed(2)}
              pattern="\d{1,5}(\.\d{1,2})?"
              title="A number like 32 or 32.50"
              required
            />
            <span className={help}>Orders are always charged the price saved here.</span>
          </label>

          <label className="block font-bold">
            Discount (%)
            <input
              className={field}
              name="discount"
              type="number"
              min={0}
              max={MAX_DISCOUNT}
              step={1}
              defaultValue={info.discount}
            />
            <span className={help}>0 for no sale. Shown on the shop page and in the cart.</span>
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
      </section>

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
