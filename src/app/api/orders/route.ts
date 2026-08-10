import { db } from "@/lib/db";
import { sendAdminEmail } from "@/lib/email";
import { ensureOrdersSchema } from "@/lib/orders";
import { PRODUCTS, isProductId, money, type ProductId } from "@/lib/products";

const FIELDS = {
  email: { max: 320, required: true },
  first_name: { max: 100, required: true },
  last_name: { max: 100, required: true },
  address: { max: 300, required: true },
  apartment: { max: 100, required: false },
  city: { max: 100, required: true },
  state: { max: 100, required: true },
  postcode: { max: 30, required: true },
  country: { max: 100, required: true },
  phone: { max: 40, required: false },
} as const;

type Line = { id: ProductId; qty: number };

function clean(body: Record<string, unknown>) {
  const out: Record<string, string> = {};
  for (const [key, rule] of Object.entries(FIELDS)) {
    const value = body[key];
    if (typeof value !== "string" || !value.trim()) {
      if (rule.required) return { error: `${key} is required` };
      continue;
    }
    if (value.length > rule.max) return { error: `${key} is too long` };
    out[key] = value.trim();
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(out.email)) {
    return { error: "email is invalid" };
  }

  const raw = body.lines;
  if (!Array.isArray(raw) || raw.length === 0) {
    return { error: "cart is empty" };
  }
  const lines: Line[] = [];
  for (const l of raw) {
    const id = (l as Line)?.id;
    const qty = Number((l as Line)?.qty);
    if (!isProductId(id) || !Number.isInteger(qty) || qty < 1 || qty > 99) {
      return { error: "cart is invalid" };
    }
    lines.push({ id, qty });
  }
  return { out, lines };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = clean(body);
  if (parsed.error) return Response.json({ error: parsed.error }, { status: 400 });
  const { out, lines } = parsed as { out: Record<string, string>; lines: Line[] };

  // Priced server-side from our own catalogue — never from the request body,
  // so a tampered payload can't set its own total.
  const items = lines.map((l) => ({
    id: l.id,
    qty: l.qty,
    title: PRODUCTS[l.id].title,
    unit_price: PRODUCTS[l.id].price,
  }));
  const subtotal = items.reduce((n, i) => n + i.unit_price * i.qty, 0);

  if (!process.env.DATABASE_URL) {
    return Response.json(
      { error: "Ordering is not connected to a database yet." },
      { status: 503 },
    );
  }

  let orderId: number;
  try {
    await ensureOrdersSchema();
    const rows = (await db()`
      INSERT INTO orders (email, first_name, last_name, address, apartment,
                          city, state, postcode, country, phone, items, subtotal)
      VALUES (${out.email}, ${out.first_name}, ${out.last_name}, ${out.address},
              ${out.apartment ?? null}, ${out.city}, ${out.state},
              ${out.postcode}, ${out.country}, ${out.phone ?? null},
              ${JSON.stringify(items)}, ${subtotal})
      RETURNING id`) as { id: number }[];
    orderId = rows[0].id;
  } catch (error) {
    console.error("order insert failed", error);
    return Response.json({ error: "Could not place order" }, { status: 500 });
  }

  // The order is already saved; a failed email must not fail the request.
  const lineText = items
    .map((i) => `  ${i.qty} x MADE.${i.id} (${i.title}) — ${money(i.unit_price * i.qty)}`)
    .join("\n");
  const result = await sendAdminEmail(
    `New order #${orderId} — ${money(subtotal)}`,
    [
      `Order #${orderId}`,
      "",
      lineText,
      "",
      `Subtotal: ${money(subtotal)}`,
      "",
      `${out.first_name} ${out.last_name}`,
      out.email,
      out.phone ?? "",
      [out.address, out.apartment, out.city, out.state, out.postcode, out.country]
        .filter(Boolean)
        .join(", "),
    ].join("\n"),
  ).catch((e) => ({ sent: false, reason: String(e) }));

  if (!result.sent) {
    console.error(`order ${orderId} email not sent:`, result.reason);
  }

  return Response.json({ ok: true, id: orderId }, { status: 201 });
}
