"use client";

import { useCart } from "./CartProvider";
import type { ProductId } from "@/lib/products";

export function AddToCart({
  product,
  className,
}: {
  product: ProductId;
  className: string;
}) {
  const { add, setOpen, catalog } = useCart();
  const soldOut = !catalog[product].active;
  return (
    <button
      className={`${className} disabled:cursor-not-allowed disabled:opacity-50`}
      type="button"
      disabled={soldOut}
      onClick={() => {
        add(product);
        setOpen(true);
      }}
    >
      {soldOut ? "Sold Out" : "Add to Cart"}
    </button>
  );
}
