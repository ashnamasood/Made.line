/**
 * The three products and their starting values. The ids are fixed — the shop
 * page is hand-designed around them — but name, price and stock are editable
 * in the admin and stored in the products table (src/lib/catalog.ts), which
 * overrides these. Prices are placeholders until the admin sets real ones.
 */
export const PRODUCTS = {
  slick: { title: "Flyaway Balm Stick", price: 3200 },
  fresh: { title: "Dry Shampoo", price: 3400 },
  even: { title: "Grey Coverage Stick", price: 3600 },
} as const;

export type ProductId = keyof typeof PRODUCTS;
export const PRODUCT_IDS = Object.keys(PRODUCTS) as ProductId[];

export type ProductInfo = {
  title: string;
  /** Cents, before any discount. */
  price: number;
  active: boolean;
  /** Whole percent off, 0–90. */
  discount: number;
  /** Replaces the designed copy on the shop page when set. */
  description: string | null;
  /** Packshot for the product row, cart and checkout; null keeps the original. */
  image: string | null;
  /** Photo beside the product on the shop page; null keeps the original. */
  shopImage: string | null;
};
/** The live catalogue: every product, with any admin edits applied. */
export type Catalog = Record<ProductId, ProductInfo>;

export const DEFAULT_CATALOG = Object.fromEntries(
  PRODUCT_IDS.map((id) => [
    id,
    {
      ...PRODUCTS[id],
      active: true,
      discount: 0,
      description: null,
      image: null,
      shopImage: null,
    },
  ]),
) as Catalog;

export const MAX_DISCOUNT = 90;

/** What the customer pays per unit, in cents. */
export const salePrice = (p: Pick<ProductInfo, "price" | "discount">) =>
  Math.round((p.price * (100 - p.discount)) / 100);

export const packshot = (id: ProductId, p: ProductInfo) => p.image ?? `/products/${id}.jpg`;
export const shopPhoto = (id: ProductId, p: ProductInfo) =>
  p.shopImage ?? `/images/shop-${id}.jpg`;

// hasOwn, not `in`: `in` also matches inherited keys like "toString".
export const isProductId = (v: unknown): v is ProductId =>
  typeof v === "string" && Object.hasOwn(PRODUCTS, v);

/** Cents to "$1,054.00" — money stays integer everywhere else. */
export const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
