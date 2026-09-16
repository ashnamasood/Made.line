import { unstable_cache } from "next/cache";
import { db } from "./db";
import {
  DEFAULT_CATALOG,
  isProductId,
  type Catalog,
  type ProductId,
  type ProductInfo,
} from "./products";

export const CATALOG_TAG = "catalog";

// ponytail: DDL on demand, same as orders. Rows only exist for products the
// admin has edited; the rest fall back to DEFAULT_CATALOG.
let ready: Promise<unknown> | null = null;
function ensureProductsSchema() {
  const sql = db();
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS products (
      id         text        PRIMARY KEY,
      title      text        NOT NULL,
      price      integer     NOT NULL CHECK (price >= 0),
      active     boolean     NOT NULL DEFAULT true,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  return ready;
}

/** Fresh from the database. Throws on a database error. */
export async function readCatalog(): Promise<Catalog> {
  const catalog = structuredClone(DEFAULT_CATALOG);
  if (!process.env.DATABASE_URL) return catalog;
  await ensureProductsSchema();
  const rows = (await db()`SELECT id, title, price, active FROM products`) as
    ({ id: string } & ProductInfo)[];
  for (const { id, title, price, active } of rows) {
    if (isProductId(id)) catalog[id] = { title, price, active };
  }
  return catalog;
}

/**
 * The storefront's copy. Cached so the static pages don't query the database
 * on every visit; saveProduct expires the tag, so edits show straight away.
 * A database outage serves the defaults rather than breaking the whole site,
 * and the 5-minute revalidate stops that fallback from sticking.
 */
export const getCatalog = unstable_cache(
  async () => {
    try {
      return await readCatalog();
    } catch (error) {
      console.error("catalog read failed, serving defaults", error);
      return structuredClone(DEFAULT_CATALOG);
    }
  },
  ["catalog"],
  { tags: [CATALOG_TAG], revalidate: 300 },
);

export async function saveProduct(id: ProductId, info: ProductInfo) {
  await ensureProductsSchema();
  await db()`
    INSERT INTO products (id, title, price, active)
    VALUES (${id}, ${info.title}, ${info.price}, ${info.active})
    ON CONFLICT (id) DO UPDATE
      SET title = EXCLUDED.title, price = EXCLUDED.price,
          active = EXCLUDED.active, updated_at = now()`;
}
