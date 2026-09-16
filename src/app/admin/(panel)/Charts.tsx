import { money } from "@/lib/products";

// Plain HTML/CSS rather than SVG, so labels stay a readable size at any card
// width. Marks use a deeper step of the brand periwinkle: #b0c7f2 is 1.66:1 on
// white, too faint for a mark; #5a7bd0 is 4.06:1, and hover goes one step
// darker to #4d6fc4. Text always stays in ink, never the mark colour.

/** A clean axis ceiling split into 4 steps of 1, 2, 2.5 or 5 × 10ⁿ. */
function niceScale(max: number, fallback: number) {
  const raw = (max > 0 ? max : fallback) / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)!;
  return { step, top: step * 4 };
}

// Days arrive as YYYY-MM-DD; format in UTC so the label never shifts a day.
const shortDay = (day: string) =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

const dollars = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-AU", { maximumFractionDigits: 0 })}`;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Keep edge labels and tooltips inside the chart instead of centring past it.
const edge = (i: number, n: number, near: number) =>
  i < near ? "left-0" : i >= n - near ? "right-0" : "left-1/2 -translate-x-1/2";

export function RevenueChart({
  data,
}: {
  data: { day: string; revenue: number; orders: number }[];
}) {
  const n = data.length;
  const { step, top } = niceScale(Math.max(...data.map((d) => d.revenue)), 10000);
  const ticks = [0, 1, 2, 3, 4].map((i) => i * step);
  const pct = (v: number) => `${(v / top) * 100}%`;
  // Label roughly every week and always the last day, skipping a regular
  // label that would crowd the last one.
  const labelEvery = Math.ceil(n / 5);
  const labelled = (i: number) =>
    i === n - 1 || (i % labelEvery === 0 && n - 1 - i >= labelEvery);
  const total = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);

  return (
    <figure>
      <p className="text-sm text-ink/60">
        {money(total)} from {plural(totalOrders, "order")}
      </p>

      <div
        role="group"
        aria-label={`Revenue per day over the last ${n} days: ${money(total)} from ${plural(totalOrders, "order")}. A table view follows.`}
        className="mt-3 flex pt-14"
      >
        {/* y-axis labels share the gridlines' positions */}
        <div aria-hidden className="relative h-56 w-12 shrink-0">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-2 translate-y-1/2 text-[11px] leading-none text-ink/55 tabular-nums"
              style={{ bottom: pct(t) }}
            >
              {dollars(t)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-56">
            {ticks.map((t) => (
              <div
                key={t}
                aria-hidden
                className="absolute inset-x-0 border-t border-[#ece8e1]"
                style={{ bottom: pct(t) }}
              />
            ))}

            {total === 0 && (
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-3 py-1 text-sm text-ink/55">
                No sales in this period yet
              </p>
            )}

            <div className="absolute inset-0 flex">
              {data.map((d, i) => (
                // The whole slot is the hover/focus target, bigger than the mark.
                <div
                  key={d.day}
                  tabIndex={0}
                  aria-label={`${shortDay(d.day)}: ${money(d.revenue)}, ${plural(d.orders, "order")}`}
                  className="group relative flex h-full flex-1 items-end justify-center px-px outline-none hover:bg-ink/[0.04] focus-visible:bg-ink/[0.06]"
                >
                  {d.revenue > 0 && (
                    // 1px padding each side leaves a 2px gap between touching bars.
                    <div
                      className="w-full max-w-6 rounded-t-[4px] bg-[#5a7bd0] group-hover:bg-[#4d6fc4] group-focus-visible:bg-[#4d6fc4]"
                      style={{ height: pct(d.revenue) }}
                    />
                  )}
                  <div
                    className={`pointer-events-none absolute bottom-full z-10 mb-2 hidden whitespace-nowrap rounded-lg border border-[#ece8e1] bg-white px-3 py-2 text-xs shadow-sm group-hover:block group-focus-visible:block ${edge(i, n, 4)}`}
                  >
                    <span className="block text-ink/60">{shortDay(d.day)}</span>
                    <span className="block font-bold">
                      {money(d.revenue)} · {plural(d.orders, "order")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div aria-hidden className="flex">
            {data.map((d, i) => (
              <div key={d.day} className="relative h-6 flex-1">
                {labelled(i) && (
                  <span
                    className={`absolute top-1.5 whitespace-nowrap text-[11px] text-ink/55 ${edge(i, n, 1)}`}
                  >
                    {shortDay(d.day)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-ink/60 hover:text-ink">Show as table</summary>
        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-ink/10">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white text-ink/50">
              <tr>
                <th className="px-3 py-2 font-normal">Day</th>
                <th className="px-3 py-2 text-right font-normal">Orders</th>
                <th className="px-3 py-2 text-right font-normal">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 tabular-nums">
              {[...data].reverse().map((d) => (
                <tr key={d.day}>
                  <td className="px-3 py-1.5">{shortDay(d.day)}</td>
                  <td className="px-3 py-1.5 text-right">{d.orders}</td>
                  <td className="px-3 py-1.5 text-right">{money(d.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

export function UnitsChart({ rows }: { rows: { label: string; units: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.units));
  const total = rows.reduce((s, r) => s + r.units, 0);

  return (
    <figure>
      <p className="text-sm text-ink/60">{plural(total, "unit")} sold in total</p>
      <ul className="mt-5 space-y-5">
        {rows.map((r) => (
          <li key={r.label} className="group">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-bold">{r.label}</span>
              <span className="font-bold tabular-nums">{r.units}</span>
            </div>
            {/* Recessive track, so a zero still reads as a row rather than a gap. */}
            <div aria-hidden className="mt-2 h-5 rounded-[4px] bg-[#ece8e1]/60">
              {r.units > 0 && (
                <div
                  className="h-full rounded-r-[4px] bg-[#5a7bd0] group-hover:bg-[#4d6fc4]"
                  style={{ width: `${(r.units / max) * 100}%` }}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </figure>
  );
}
