import { db } from "@/lib/db";

const PRODUCTS = new Set(["slick", "fresh", "even"]);

let ready: Promise<unknown> | null = null;
function ensureTable() {
  const sql = db();
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS cart_leads (
      id         bigserial PRIMARY KEY,
      email      text        NOT NULL,
      product    text        NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  return ready;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email;
  const product = body.product;
  if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "email is invalid" }, { status: 400 });
  }
  if (typeof product !== "string" || !PRODUCTS.has(product)) {
    return Response.json({ error: "product is invalid" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return Response.json(
      { error: "The cart is not connected to a database yet." },
      { status: 503 },
    );
  }

  try {
    await ensureTable();
    await db()`INSERT INTO cart_leads (email, product) VALUES (${email}, ${product})`;
  } catch (error) {
    console.error("cart insert failed", error);
    return Response.json({ error: "Could not save" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
