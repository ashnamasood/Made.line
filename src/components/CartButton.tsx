"use client";

import { useCart } from "./CartProvider";

/** Hidden until there's something in the cart, as on the reference site. */
export function CartButton({ className }: { className?: string }) {
  const { count, setOpen } = useCart();
  if (count === 0) return null;
  return (
    <button className={className} onClick={() => setOpen(true)} type="button">
      Cart ({count})
    </button>
  );
}
