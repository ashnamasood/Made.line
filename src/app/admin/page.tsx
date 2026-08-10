import { db } from "@/lib/db";
import { money } from "@/lib/products";

export const dynamic = "force-dynamic";

type Item = { id: string; qty: number; title: string; unit_price: number };
type Order = {
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
  items: Item[];
  subtotal: number;
  created_at: string;
};

async function getOrders(): Promise<Order[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const rows = await db()`
      SELECT * FROM orders ORDER BY created_at DESC LIMIT 200`;
    return rows as Order[];
  } catch {
    return [];
  }
}

export default async function Admin() {
  const orders = await getOrders();

  return (
    <div className="px-6 py-16 md:px-10">
      <h1 className="font-display text-3xl uppercase">Orders</h1>

      {orders === null ? (
        <p className="mt-6 font-body">DATABASE_URL is not set.</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 font-body">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((o) => (
            <article
              key={o.id}
              className="max-w-3xl rounded-xl border border-ink/20 p-6 font-body"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-bold">Order #{o.id}</span>
                <span className="text-ink/60">
                  {new Date(o.created_at).toLocaleString()}
                </span>
              </div>

              <ul className="mt-4 space-y-1">
                {o.items.map((i) => (
                  <li key={i.id} className="flex justify-between">
                    <span>
                      {i.qty} × MADE.{i.id}{" "}
                      <span className="text-ink/60">({i.title})</span>
                    </span>
                    <span>{money(i.unit_price * i.qty)}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-3 flex justify-between border-t border-ink/15 pt-3 font-bold">
                <span>Subtotal</span>
                <span>{money(o.subtotal)}</span>
              </p>

              <div className="mt-4 border-t border-ink/15 pt-3 text-sm">
                <p className="font-bold">
                  {o.first_name} {o.last_name}
                </p>
                <p>{o.email}</p>
                {o.phone && <p>{o.phone}</p>}
                <p className="text-ink/70">
                  {[
                    o.address,
                    o.apartment,
                    o.city,
                    o.state,
                    o.postcode,
                    o.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
