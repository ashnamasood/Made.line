import { ensureContactSchema } from "@/lib/contact";
import { db } from "@/lib/db";

const LIMITS = {
  name: 200,
  email: 320,
  reason: 100,
  details: 5000,
} as const;

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

  if (!process.env.DATABASE_URL) {
    return Response.json(
      { error: "The contact form is not connected to a database yet." },
      { status: 503 },
    );
  }

  try {
    await ensureContactSchema();
    await db()`
      INSERT INTO contact_messages (name, email, reason, details, attachments)
      VALUES (${result.name}, ${result.email}, ${result.reason},
              ${result.details}, ${result.attachments ?? null})`;
  } catch (error) {
    console.error("contact insert failed", error);
    return Response.json({ error: "Could not save message" }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}
