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
  const { add, setOpen } = useCart();
  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        add(product);
        setOpen(true);
      }}
    >
      Add to Cart
    </button>
  );
}
