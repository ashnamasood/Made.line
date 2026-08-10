"use client";

import { useCart } from "./CartProvider";

export function CartButton({ className }: { className?: string }) {
  const { count, setOpen } = useCart();
  return (
    <button className={className} onClick={() => setOpen(true)} type="button">
      Cart{count > 0 && ` (${count})`}
    </button>
  );
}
