import type { Metadata } from "next";
import Link from "next/link";
import { isStatus, listOrders } from "@/lib/orders";
import { money } from "@/lib/products";
import { Card, DbProblem, PageHeader, dateTime, loadFromDb, pill } from "../ui";
import { updateStatus } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders — MADE.line admin" };

const tabs = [
  ["all", "All"],
  ["pending", "To fulfil"],
  ["done", "Done"],
] as const;

export default async function Orders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = isStatus(params.status) ? params.status : "all";
  const q = (params.q ?? "").trim();
  const data = await loadFromDb("orders", () => listOrders(status, q));

  return (
    <>
      <PageHeader title="Orders" />
      {data.state !== "ok" ? (
        <DbProblem data={data} what="orders" />
      ) : (
        <Card title="Orders Management">
          {/* Filter and search are plain links and a GET form, so the list is
              shareable by URL and needs no client-side state. */}
          <div className="flex flex-wrap items-center gap-3">
            <form className="flex w-full gap-2 sm:w-auto" action="/admin/orders" method="get">
              <input type="hidden" name="status" value={status} />
              <input
                className="w-full rounded-xl border border-ink/20 px-4 py-2.5 outline-none focus:border-ink sm:w-72"
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search name, email or #id…"
              />
              <button className="rounded-xl bg-butter px-5 font-bold" type="submit">
                Search
              </button>
            </form>
            <div className="flex gap-2 sm:ml-auto">
              {tabs.map(([value, label]) => (
                <Link
                  key={value}
                  href={`/admin/orders?status=${value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={`rounded-xl px-4 py-2 text-sm ${
                    status === value ? "bg-butter font-bold" : "bg-ink/5 hover:bg-ink/10"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {data.value.length === 0 ? (
            <p className="mt-8">
              {q || status !== "all" ? "No orders match this filter." : "No orders yet."}
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {data.value.map((o) => (
                <article key={o.id} className="rounded-xl border border-ink/10 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-3 font-bold">
                      Order #{o.id}
                      <span
                        className={`${pill} font-normal ${
                          o.status === "done" ? "bg-ink/10 text-ink/60" : "bg-butter/70"
                        }`}
                      >
                        {o.status === "done" ? "Done" : "To fulfil"}
                      </span>
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-ink/50">{dateTime(o.created_at)}</span>
                      <form action={updateStatus}>
                        <input type="hidden" name="id" value={o.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={o.status === "done" ? "pending" : "done"}
                        />
                        <button
                          className={`rounded-xl px-4 py-1.5 text-sm ${
                            o.status === "done"
                              ? "border border-ink/20 hover:border-ink"
                              : "bg-ink font-bold text-cream"
                          }`}
                          type="submit"
                        >
                          {o.status === "done" ? "Reopen" : "Mark done"}
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    <div>
                      <ul className="space-y-1">
                        {o.items.map((i) => (
                          <li key={i.id} className="flex justify-between gap-3">
                            <span>
                              {i.qty} × MADE.{i.id}{" "}
                              <span className="text-ink/50">({i.title})</span>
                            </span>
                            <span>{money(i.unit_price * i.qty)}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-bold">
                        <span>Subtotal</span>
                        <span>{money(o.subtotal)}</span>
                      </p>
                    </div>

                    <div className="rounded-lg bg-canvas p-4 text-sm">
                      <p className="font-bold">
                        {o.first_name} {o.last_name}
                      </p>
                      <p>
                        <a className="underline" href={`mailto:${o.email}`}>
                          {o.email}
                        </a>
                      </p>
                      {o.phone && <p>{o.phone}</p>}
                      <p className="mt-1 text-ink/60">
                        {[o.address, o.apartment, o.city, o.state, o.postcode, o.country]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      )}
    </>
  );
}
