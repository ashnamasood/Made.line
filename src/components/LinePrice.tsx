import { money, salePrice, type ProductInfo } from "@/lib/products";

/** A cart line's total, with the pre-discount total struck through beside it. */
export function LinePrice({ info, qty }: { info: ProductInfo; qty: number }) {
  return (
    <span>
      {info.discount > 0 && (
        <s className="mr-2 font-normal text-ink/50">{money(info.price * qty)}</s>
      )}
      {money(salePrice(info) * qty)}
    </span>
  );
}
