import type { Metadata } from "next";
import { Wordmark } from "@/components/Logo";
import { money } from "@/lib/products";
import { isStatus, listOrders, orderTotals, type Order } from "@/lib/orders";
import { updateStatus } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders — MADE.line admin" };

// Separating these keeps a database outage from rendering as "No orders yet".
type Data =
  | { state: "unconfigured" }
  | { state: "error"; message: string }
  | {
      state: "ok";
      orders: Order[];
      totals: { orders: number; revenue: number; pending: number };
    };

async function load(status: "all" | "pending" | "done", q: string): Promise<Data> {
  if (!process.env.DATABASE_URL) return { state: "unconfigured" };
  try {
    const [orders, totals] = await Promise.all([
      listOrders(status, q),
      orderTotals(),
    ]);
    return { state: "ok", orders, totals };
  } catch (error) {
    console.error("admin orders query failed", error);
    return {
      state: "error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="px-6 py-12 md:px-10">
      <Wordmark className="h-7" />
      <h1 className="mt-8 font-display text-3xl uppercase">Orders</h1>
      {children}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink/20 px-5 py-4">
      <div className="font-body text-sm text-ink/60">{label}</div>
      <div className="mt-1 font-body text-2xl font-bold">{value}</div>
    </div>
  );
}

export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = isStatus(params.status) ? params.status : "all";
  const q = (params.q ?? "").trim();
  const data = await load(status, q);

  if (data.state === "unconfigured") {
    return (
      <Shell>
        <p className="mt-6 font-body">
          <code>DATABASE_URL</code> is not set, so there is nothing to read.
        </p>
      </Shell>
    );
  }

  if (data.state === "error") {
    return (
      <Shell>
        <p className="mt-6 font-body font-bold text-red-700">
          Couldn&apos;t load orders — this is a database error, not an empty
          shop.
        </p>
        <pre className="mt-3 max-w-3xl overflow-x-auto rounded-lg bg-ink/5 p-4 font-body text-sm">
          {data.message}
        </pre>
      </Shell>
    );
  }

  const { orders, totals } = data;
  const tabs = [
    ["all", "All"],
    ["pending", "To fulfil"],
    ["done", "Done"],
  ] as const;

  return (
    <Shell>
      <div className="mt-8 grid max-w-3xl grid-cols-3 gap-4">
        <Stat label="Orders" value={String(totals.orders)} />
        <Stat label="To fulfil" value={String(totals.pending)} />
        <Stat label="Revenue" value={money(totals.revenue)} />
      </div>

      {/* Filter and search are plain links and a GET form, so the list is
          shareable by URL and needs no client-side state. */}
      <div className="mt-8 flex max-w-3xl flex-wrap items-center gap-3">
        {tabs.map(([value, label]) => {
          const href = `/admin?status=${value}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
          const active = status === value;
          return (
            <a
              key={value}
              href={href}
              className={`rounded-full border px-4 py-2 font-body text-sm ${
                active
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/30 hover:border-ink"
              }`}
            >
              {label}
            </a>
          );
        })}

        <form className="ml-auto flex gap-2" action="/admin" method="get">
          <input type="hidden" name="status" value={status} />
          <input
            className="rounded-full border border-ink/30 px-4 py-2 font-body text-sm outline-none focus:border-ink"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Name, email or #id"
          />
          <button
            className="rounded-full border border-ink px-4 py-2 font-body text-sm"
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <p className="mt-10 font-body">
          {q || status !== "all"
            ? "No orders match this filter."
            : "No orders yet."}
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((o) => (
            <article
              key={o.id}
              className="max-w-3xl rounded-xl border border-ink/20 p-6 font-body"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-bold">
                  Order #{o.id}
                  <span
                    className={`ml-3 rounded-full px-3 py-1 text-xs font-normal ${
                      o.status === "done"
                        ? "bg-ink/10 text-ink/60"
                        : "bg-[#faecb0]"
                    }`}
                  >
                    {o.status === "done" ? "Done" : "To fulfil"}
                  </span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-ink/60">
                    {new Date(o.created_at).toLocaleString()}
                  </span>
                  <form action={updateStatus}>
                    <input type="hidden" name="id" value={o.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={o.status === "done" ? "pending" : "done"}
                    />
                    <button
                      className="rounded-full border border-ink px-4 py-1.5 text-sm"
                      type="submit"
                    >
                      {o.status === "done" ? "Reopen" : "Mark done"}
                    </button>
                  </form>
                </div>
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
      )}
    </Shell>
  );
}
