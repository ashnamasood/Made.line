"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { PRODUCTS, money } from "@/lib/products";

function Stepper({
  qty,
  onChange,
}: {
  qty: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="mt-3 inline-flex items-center gap-4 rounded-full border border-ink/30 px-3 py-1">
      <button
        aria-label="Decrease quantity"
        className="text-xl leading-none"
        onClick={() => onChange(qty - 1)}
        type="button"
      >
        −
      </button>
      <span className="min-w-4 text-center font-body text-sm">{qty}</span>
      <button
        aria-label="Increase quantity"
        className="text-xl leading-none"
        onClick={() => onChange(qty + 1)}
        type="button"
      >
        +
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { lines, open, count, subtotal, setQty, setOpen } = useCart();

  return (
    <>
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        aria-label="Cart"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-[480px] flex-col bg-cream transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-6 py-5">
          <span className="font-body text-lg">
            {count} {count === 1 ? "item" : "items"}
          </span>
          <button
            aria-label="Close cart"
            className="text-2xl leading-none"
            onClick={() => setOpen(false)}
            type="button"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <p className="py-10 font-body">Your cart is empty.</p>
          ) : (
            lines.map((line) => (
              <div
                key={line.id}
                className="flex gap-4 border-t border-ink/15 py-6"
              >
                <Image
                  src={`/products/${line.id}.jpg`}
                  alt=""
                  width={706}
                  height={941}
                  className="h-20 w-16 flex-none rounded object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between gap-3">
                    <span className="font-display uppercase">
                      MADE.{line.id}
                    </span>
                    <span className="font-body font-bold">
                      {money(PRODUCTS[line.id].price * line.qty)}
                    </span>
                  </div>
                  <p className="font-body text-sm text-ink/70">
                    {PRODUCTS[line.id].title}
                  </p>
                  <Stepper
                    qty={line.qty}
                    onChange={(n) => setQty(line.id, n)}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="border-t border-ink/15 px-6 py-6">
          <div className="flex justify-between font-body text-lg">
            <span>Subtotal</span>
            <span className="font-bold">{money(subtotal)}</span>
          </div>
          <p className="mt-1 font-body text-xs text-ink/60">
            Shipping and taxes calculated at checkout.
          </p>
          <Link
            href="/checkout"
            onClick={() => setOpen(false)}
            aria-disabled={lines.length === 0}
            className={`mt-5 block rounded-full border-4 border-ink py-4 text-center font-display uppercase tracking-[0.12em] ${
              lines.length === 0
                ? "pointer-events-none opacity-40"
                : "bg-ink text-cream"
            }`}
          >
            Checkout
          </Link>
        </footer>
      </aside>
    </>
  );
}
