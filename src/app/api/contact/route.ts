import { neon } from "@neondatabase/serverless";

const LIMITS = {
  name: 200,
  email: 320,
  reason: 100,
  topic: 200,
  details: 5000,
} as const;

// Created on first request, not at module load, so a build without
// DATABASE_URL set doesn't fail.
let client: ReturnType<typeof neon> | null = null;
function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return (client ??= neon(url));
}

// ponytail: DDL on cold start instead of a migration tool — one table, one app.
// Move to migrations if a second table shows up.
let ready: Promise<unknown> | null = null;
function ensureTable() {
  const sql = db();
  ready ??= sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id         bigserial PRIMARY KEY,
      name       text        NOT NULL,
      email      text        NOT NULL,
      reason     text        NOT NULL,
      topic      text        NOT NULL,
      details    text        NOT NULL,
      attachments text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
  return ready;
}

/** Trims, rejects empties, and caps length so a huge body can't reach the DB. */
function clean(body: Record<string, unknown>) {
  const out: Record<string, string> = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    const value = body[key];
    if (typeof value !== "string" || !value.trim()) return `${key} is required`;
    if (value.length > max) return `${key} is too long`;
    out[key] = value.trim();
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(out.email)) return "email is invalid";

  const { attachments } = body;
  if (typeof attachments === "string") {
    if (attachments.length > 2000) return "too many attachments";
    out.attachments = attachments;
  }
  return out;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = clean(body);
  if (typeof result === "string") {
    return Response.json({ error: result }, { status: 400 });
  }

  try {
    await ensureTable();
    await db()`
      INSERT INTO contact_messages (name, email, reason, topic, details, attachments)
      VALUES (${result.name}, ${result.email}, ${result.reason},
              ${result.topic}, ${result.details}, ${result.attachments ?? null})`;
  } catch (error) {
    console.error("contact insert failed", error);
    return Response.json({ error: "Could not save message" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
