import { db } from "./db";

export type OrderItem = {
  id: string;
  qty: number;
  title: string;
  unit_price: number;
};

export type Order = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string | null;
  items: OrderItem[];
  subtotal: number;
  status: "pending" | "done";
  created_at: string;
};

export const STATUSES = ["pending", "done"] as const;
export type Status = (typeof STATUSES)[number];
export const isStatus = (v: unknown): v is Status =>
  STATUSES.includes(v as Status);

// ponytail: DDL on demand rather than a migration tool — two tables, one app.
// ADD COLUMN IF NOT EXISTS covers orders placed before status existed.
let ready: Promise<unknown> | null = null;
export function ensureOrdersSchema() {
  const sql = db();
  ready ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id          bigserial PRIMARY KEY,
        email       text        NOT NULL,
        first_name  text        NOT NULL,
        last_name   text        NOT NULL,
        address     text        NOT NULL,
        apartment   text,
        city        text        NOT NULL,
        state       text        NOT NULL,
        postcode    text        NOT NULL,
        country     text        NOT NULL,
        phone       text,
        items       jsonb       NOT NULL,
        subtotal    integer     NOT NULL,
        created_at  timestamptz NOT NULL DEFAULT now()
      )`;
    await sql`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'`;
  })();
  return ready;
}

/** Filtered by status and a free-text match on name, email or order number. */
export async function listOrders(status: Status | "all", q: string) {
  await ensureOrdersSchema();
  const sql = db();
  const like = `%${q}%`;
  const rows =
    status === "all"
      ? await sql`
          SELECT * FROM orders
          WHERE (${q} = '' OR email ILIKE ${like}
                 OR first_name ILIKE ${like} OR last_name ILIKE ${like}
                 OR id::text = ${q})
          ORDER BY created_at DESC LIMIT 500`
      : await sql`
          SELECT * FROM orders
          WHERE status = ${status}
            AND (${q} = '' OR email ILIKE ${like}
                 OR first_name ILIKE ${like} OR last_name ILIKE ${like}
                 OR id::text = ${q})
          ORDER BY created_at DESC LIMIT 500`;
  return rows as Order[];
}

/** Totals across every order, so the header doesn't shift with the filter. */
export async function orderTotals() {
  await ensureOrdersSchema();
  const rows = (await db()`
    SELECT count(*)::int AS orders,
           coalesce(sum(subtotal), 0)::int AS revenue,
           count(*) FILTER (WHERE status = 'pending')::int AS pending
    FROM orders`) as { orders: number; revenue: number; pending: number }[];
  return rows[0];
}

export async function setOrderStatus(id: number, status: Status) {
  await ensureOrdersSchema();
  await db()`UPDATE orders SET status = ${status} WHERE id = ${id}`;
}
