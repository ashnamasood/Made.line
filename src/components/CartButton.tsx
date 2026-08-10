"use client";

import { useCart } from "./CartProvider";

/**
 * Opens the cart drawer from the nav. The label carries no count: the display
 * face is a demo cut whose punctuation renders as watermark glyphs, so "Cart
 * (2)" shows ornaments instead of brackets. The drawer states the count.
 */
export function CartButton({ className }: { className?: string }) {
  const { setOpen } = useCart();
  return (
    <button className={className} onClick={() => setOpen(true)} type="button">
      Cart
    </button>
  );
}
