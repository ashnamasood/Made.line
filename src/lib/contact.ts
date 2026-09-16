import { db } from "./db";

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  reason: string;
  topic: string | null;
  details: string;
  attachments: string | null;
  created_at: string;
};

// ponytail: DDL on cold start instead of a migration tool, same as orders.
let ready: Promise<unknown> | null = null;
export function ensureContactSchema() {
  const sql = db();
  ready ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id         bigserial PRIMARY KEY,
        name       text        NOT NULL,
        email      text        NOT NULL,
        reason     text        NOT NULL,
        topic      text,
        details    text        NOT NULL,
        attachments text,
        created_at timestamptz NOT NULL DEFAULT now()
      )`;
    // The design dropped the Topic field. CREATE TABLE IF NOT EXISTS won't
    // touch a table that already exists, so a database created before this
    // still has topic NOT NULL and every insert would fail on it.
    await sql`ALTER TABLE contact_messages ALTER COLUMN topic DROP NOT NULL`;
  })();
  return ready;
}

/** Newest first, with a free-text match on name, email, reason or message. */
export async function listMessages(q: string) {
  await ensureContactSchema();
  const like = `%${q}%`;
  const rows = await db()`
    SELECT * FROM contact_messages
    WHERE (${q} = '' OR name ILIKE ${like} OR email ILIKE ${like}
           OR reason ILIKE ${like} OR details ILIKE ${like})
    ORDER BY created_at DESC LIMIT 500`;
  return rows as ContactMessage[];
}

export async function recentMessages(limit: number) {
  await ensureContactSchema();
  const rows = await db()`
    SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ${limit}`;
  return rows as ContactMessage[];
}

export async function messageCount() {
  await ensureContactSchema();
  const rows = (await db()`
    SELECT count(*)::int AS n FROM contact_messages`) as { n: number }[];
  return rows[0].n;
}
