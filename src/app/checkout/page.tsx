"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { Wordmark } from "@/components/Logo";
import { PRODUCTS, money } from "@/lib/products";

const field =
  "w-full rounded-lg border border-ink/30 bg-white px-4 py-3 font-body text-ink outline-none focus:border-ink";

export default function Checkout() {
  const { lines, count, subtotal, clear } = useCart();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [placed, setPlaced] = useState<string | null>(null);

  if (placed) {
    return (
      <div className="mx-auto max-w-[560px] px-6 py-24 text-center">
        <h1 className="font-display text-3xl uppercase">Order placed</h1>
        <p className="mt-4 font-body">
          Thanks — a confirmation is on its way to {placed}.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full border-2 border-ink px-8 py-3 font-display uppercase tracking-[0.12em]"
        >
          Keep shopping
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[560px] px-6 py-24 text-center">
        <h1 className="font-display text-3xl uppercase">Your cart is empty</h1>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full border-2 border-ink px-8 py-3 font-display uppercase tracking-[0.12em]"
        >
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid md:min-h-dvh md:grid-cols-2">
      {/* Contact + shipping */}
      <div className="px-6 py-12 md:px-[6vw]">
        <Link href="/" aria-label="MADE.line home" className="inline-block">
          <Wordmark className="h-7" />
        </Link>
        <h1 className="mt-10 font-display text-2xl uppercase">Checkout</h1>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setSending(true);
            const data = Object.fromEntries(
              new FormData(e.currentTarget).entries(),
            );
            const res = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...data, lines }),
            }).catch(() => null);
            setSending(false);
            if (res?.ok) {
              setPlaced(String(data.email));
              clear();
            } else {
              setError(
                (await res?.json().catch(() => null))?.error ??
                  "Something went wrong. Please try again.",
              );
            }
          }}
        >
          <h2 className="font-body font-bold">Contact</h2>
          <input
            className={field}
            name="email"
            type="email"
            required
            placeholder="Email"
          />

          <h2 className="pt-4 font-body font-bold">Shipping address</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              className={field}
              name="first_name"
              required
              placeholder="First name"
            />
            <input
              className={field}
              name="last_name"
              required
              placeholder="Last name"
            />
          </div>
          <input
            className={field}
            name="address"
            required
            placeholder="Address"
          />
          <input
            className={field}
            name="apartment"
            placeholder="Apartment, suite, etc. (optional)"
          />
          <div className="grid grid-cols-3 gap-4">
            <input className={field} name="city" required placeholder="City" />
            <input className={field} name="state" required placeholder="State" />
            <input
              className={field}
              name="postcode"
              required
              placeholder="ZIP code"
            />
          </div>
          <input className={field} name="country" required placeholder="Country" />
          <input className={field} name="phone" placeholder="Phone (optional)" />

          {error && (
            <p className="rounded-lg bg-white px-4 py-3 font-body font-bold text-red-700">
              {error}
            </p>
          )}

          <button
            className="mt-4 w-full rounded-full border-4 border-ink bg-ink py-4 font-display uppercase tracking-[0.12em] text-cream disabled:opacity-50"
            type="submit"
            disabled={sending}
          >
            {sending ? "Placing order…" : "Place order"}
          </button>
          {/* ponytail: no payment step — orders are recorded and emailed to the
              admin. Wire a payment provider here when there's one to wire. */}
          <p className="text-center font-body text-xs text-ink/60">
            No payment is taken — we&apos;ll be in touch to confirm your order.
          </p>
        </form>
      </div>

      {/* Order summary */}
      <aside className="bg-cream px-6 py-12 md:px-[5vw]">
        {lines.map((line) => (
          <div key={line.id} className="flex items-center gap-4 py-4">
            <div className="relative flex-none">
              <Image
                src={`/products/${line.id}.jpg`}
                alt=""
                width={706}
                height={941}
                className="h-16 w-14 rounded border border-ink/15 object-cover"
              />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink font-body text-xs text-cream">
                {line.qty}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-display uppercase">MADE.{line.id}</p>
              <p className="font-body text-sm text-ink/70">
                {PRODUCTS[line.id].title}
              </p>
            </div>
            <span className="font-body font-bold">
              {money(PRODUCTS[line.id].price * line.qty)}
            </span>
          </div>
        ))}

        <dl className="mt-6 border-t border-ink/15 pt-6 font-body">
          <div className="flex justify-between">
            <dt>Subtotal · {count} items</dt>
            <dd>{money(subtotal)}</dd>
          </div>
          <div className="mt-2 flex justify-between text-ink/70">
            <dt>Shipping</dt>
            <dd>Calculated separately</dd>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink/15 pt-4 text-xl font-bold">
            <dt>Total</dt>
            <dd>{money(subtotal)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
