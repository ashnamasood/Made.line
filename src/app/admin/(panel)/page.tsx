import type { Metadata } from "next";
import Link from "next/link";
import { messageCount, recentMessages } from "@/lib/contact";
import { orderTotals, recentOrders } from "@/lib/orders";
import { PRODUCTS, money } from "@/lib/products";
import {
  Card,
  DbProblem,
  StatCard,
  dateTime,
  loadFromDb,
  pill,
} from "./ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard — MADE.line admin" };

export default async function Dashboard() {
  const data = await loadFromDb("dashboard", async () => {
    const [totals, messages, orders, latest] = await Promise.all([
      orderTotals(),
      messageCount(),
      recentOrders(5),
      recentMessages(5),
    ]);
    return { totals, messages, orders, latest };
  });

  return (
    <>
      <div>
        <h1 className="font-body text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-ink/60">
          Welcome back! Here&apos;s what&apos;s happening at MADE.line.
        </p>
      </div>

      {data.state !== "ok" ? (
        <DbProblem data={data} what="the dashboard" />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              href="/admin/orders"
              icon="orders"
              tint="peri"
              label="Orders"
              value={String(data.value.totals.orders)}
              note="Total orders"
            />
            <StatCard
              href="/admin/orders?status=pending"
              icon="pending"
              tint="butter"
              label="To fulfil"
              value={String(data.value.totals.pending)}
              note="Waiting to be sent"
            />
            <StatCard
              icon="money"
              tint="pink"
              label="Revenue"
              value={money(data.value.totals.revenue)}
              note="Subtotal of every order"
            />
            <StatCard
              href="/admin/messages"
              icon="messages"
              tint="blush"
              label="Messages"
              value={String(data.value.messages)}
              note="Contact form enquiries"
            />
            <StatCard
              href="/admin/products"
              icon="products"
              tint="peri"
              label="Products"
              value={String(Object.keys(PRODUCTS).length)}
              note="In the shop"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card
              title="Recent orders"
              action={<ViewAll href="/admin/orders" />}
            >
              {data.value.orders.length === 0 ? (
                <p className="text-ink/60">No orders yet.</p>
              ) : (
                <ul className="-my-3 divide-y divide-ink/10">
                  {data.value.orders.map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="font-bold">
                          #{o.id} · {o.first_name} {o.last_name}
                        </p>
                        <p className="text-sm text-ink/50">{dateTime(o.created_at)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-bold">{money(o.subtotal)}</span>
                        <span
                          className={`${pill} ${
                            o.status === "done" ? "bg-ink/10 text-ink/60" : "bg-butter/70"
                          }`}
                        >
                          {o.status === "done" ? "Done" : "To fulfil"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card
              title="Recent messages"
              action={<ViewAll href="/admin/messages" />}
            >
              {data.value.latest.length === 0 ? (
                <p className="text-ink/60">No messages yet.</p>
              ) : (
                <ul className="-my-3 divide-y divide-ink/10">
                  {data.value.latest.map((m) => (
                    <li key={m.id} className="py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate font-bold">{m.name}</p>
                        <span className={`${pill} shrink-0 bg-peri/50`}>{m.reason}</span>
                      </div>
                      <p className="mt-1 truncate text-sm text-ink/60">{m.details}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}

function ViewAll({ href }: { href: string }) {
  return (
    <Link href={href} className="text-sm text-ink/60 underline hover:text-ink">
      View all
    </Link>
  );
}
