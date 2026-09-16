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
  ready ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id         text        PRIMARY KEY,
        title      text        NOT NULL,
        price      integer     NOT NULL CHECK (price >= 0),
        active     boolean     NOT NULL DEFAULT true,
        updated_at timestamptz NOT NULL DEFAULT now()
      )`;
    // Added with photos, description and discount; existing rows get defaults.
    await sql`
      ALTER TABLE products
        ADD COLUMN IF NOT EXISTS discount    integer NOT NULL DEFAULT 0
          CHECK (discount BETWEEN 0 AND 90),
        ADD COLUMN IF NOT EXISTS description text,
        ADD COLUMN IF NOT EXISTS image       text,
        ADD COLUMN IF NOT EXISTS shop_image  text`;
  })().catch((error) => {
    ready = null; // retry on the next call instead of failing forever
    throw error;
  });
  return ready;
}

type Row = Omit<ProductInfo, "shopImage"> & { id: string; shop_image: string | null };

/** Fresh from the database. Throws on a database error. */
export async function readCatalog(): Promise<Catalog> {
  const catalog = structuredClone(DEFAULT_CATALOG);
  if (!process.env.DATABASE_URL) return catalog;
  await ensureProductsSchema();
  const rows = (await db()`
    SELECT id, title, price, active, discount, description, image, shop_image
    FROM products`) as Row[];
  for (const { id, shop_image, ...info } of rows) {
    if (isProductId(id)) catalog[id] = { ...info, shopImage: shop_image };
  }
  return catalog;
}

/**
 * The storefront's copy. Cached so the static pages don't query the database
 * on every visit; saveProduct's caller expires the tag, so edits show straight
 * away. A database outage serves the defaults rather than breaking the whole
 * site, and the 5-minute revalidate stops that fallback from sticking.
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
  // Bump the key whenever the catalogue's shape changes: Vercel keeps this
  // cache across deploys, and an old-shaped entry would break the new code.
  ["catalog-v2"],
  { tags: [CATALOG_TAG], revalidate: 300 },
);

export async function saveProduct(id: ProductId, p: ProductInfo) {
  await ensureProductsSchema();
  await db()`
    INSERT INTO products (id, title, price, active, discount, description, image, shop_image)
    VALUES (${id}, ${p.title}, ${p.price}, ${p.active}, ${p.discount},
            ${p.description}, ${p.image}, ${p.shopImage})
    ON CONFLICT (id) DO UPDATE
      SET title = EXCLUDED.title, price = EXCLUDED.price, active = EXCLUDED.active,
          discount = EXCLUDED.discount, description = EXCLUDED.description,
          image = EXCLUDED.image, shop_image = EXCLUDED.shop_image,
          updated_at = now()`;
}
