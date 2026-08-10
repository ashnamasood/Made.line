import type { Metadata } from "next";
import { db } from "@/lib/db";
import { money } from "@/lib/products";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders — MADE.line admin" };

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

// Distinguishes "no database", "nothing ordered yet" and "the query broke" —
// collapsing the last two into an empty list makes an outage look like calm.
type Result =
  | { state: "unconfigured" }
  | { state: "error"; message: string }
  | { state: "ok"; orders: Order[] };

async function getOrders(): Promise<Result> {
  if (!process.env.DATABASE_URL) return { state: "unconfigured" };
  try {
    const rows = await db()`
      SELECT * FROM orders ORDER BY created_at DESC LIMIT 500`;
    return { state: "ok", orders: rows as Order[] };
  } catch (error) {
    // The table only exists after the first order, so "missing table" is the
    // expected empty state rather than a failure.
    const message = error instanceof Error ? error.message : String(error);
    if (/relation .*orders.* does not exist/i.test(message)) {
      return { state: "ok", orders: [] };
    }
    console.error("admin orders query failed", error);
    return { state: "error", message };
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/20 px-5 py-4">
      <div className="font-body text-sm text-ink/60">{label}</div>
      <div className="mt-1 font-body text-2xl font-bold">{value}</div>
    </div>
  );
}

export default async function Admin() {
  const result = await getOrders();

  if (result.state === "unconfigured") {
    return (
      <main className="px-6 py-16 font-body md:px-10">
        <h1 className="font-display text-3xl uppercase">Orders</h1>
        <p className="mt-6">
          <code>DATABASE_URL</code> is not set, so there is nothing to read.
        </p>
      </main>
    );
  }

  if (result.state === "error") {
    return (
      <main className="px-6 py-16 font-body md:px-10">
        <h1 className="font-display text-3xl uppercase">Orders</h1>
        <p className="mt-6 font-bold text-red-700">
          Couldn&apos;t load orders — this is a database error, not an empty
          shop.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-ink/5 p-4 text-sm">
          {result.message}
        </pre>
      </main>
    );
  }

  const { orders } = result;
  const revenue = orders.reduce((n, o) => n + o.subtotal, 0);
  const units = orders.reduce(
    (n, o) => n + o.items.reduce((m, i) => m + i.qty, 0),
    0,
  );

  return (
    <main className="px-6 py-16 md:px-10">
      <h1 className="font-display text-3xl uppercase">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 font-body">No orders yet.</p>
      ) : (
        <>
          <div className="mt-8 grid max-w-3xl grid-cols-3 gap-4">
            <Stat label="Orders" value={String(orders.length)} />
            <Stat label="Items sold" value={String(units)} />
            <Stat label="Revenue" value={money(revenue)} />
          </div>

          <div className="mt-10 space-y-6">
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
                  <p>
                    <a className="underline" href={`mailto:${o.email}`}>
                      {o.email}
                    </a>
                  </p>
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
        </>
      )}
    </main>
  );
}
