/**
 * Single source of truth for the three products.
 *
 * ponytail: prices are PLACEHOLDERS — the design never states them. Swap for
 * real pricing before launch; the cart, checkout and order emails all read
 * from here, so one edit covers everything.
 */
export const PRODUCTS = {
  slick: { title: "Flyaway Balm Stick", price: 3200 },
  fresh: { title: "Dry Shampoo", price: 3400 },
  even: { title: "Grey Coverage Stick", price: 3600 },
} as const;

export type ProductId = keyof typeof PRODUCTS;

export const isProductId = (v: unknown): v is ProductId =>
  typeof v === "string" && v in PRODUCTS;

/** Cents to "$32.00" — money stays integer everywhere else. */
export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
