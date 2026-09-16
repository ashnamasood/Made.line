import { db } from "./db";

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  reason: string;
  topic: string | null;
  details: string;
  attachments: string | null;
  status: MessageStatus;
  created_at: string;
};

export const MESSAGE_STATUSES = ["new", "replied"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];
export const isMessageStatus = (v: unknown): v is MessageStatus =>
  MESSAGE_STATUSES.includes(v as MessageStatus);

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
    // Added with the admin's replied tracking; older rows start as new.
    await sql`
      ALTER TABLE contact_messages
      ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'`;
  })();
  return ready;
}

/** Newest first, filtered by status, with a free-text match on name, email, reason or message. */
export async function listMessages(status: MessageStatus | "all", q: string) {
  await ensureContactSchema();
  const like = `%${q}%`;
  const rows = await db()`
    SELECT * FROM contact_messages
    WHERE (${status} = 'all' OR status = ${status})
      AND (${q} = '' OR name ILIKE ${like} OR email ILIKE ${like}
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

export async function messageTotals() {
  await ensureContactSchema();
  const rows = (await db()`
    SELECT count(*)::int AS total,
           count(*) FILTER (WHERE status = 'new')::int AS unread
    FROM contact_messages`) as { total: number; unread: number }[];
  return rows[0];
}

export async function setMessageStatus(id: number, status: MessageStatus) {
  await ensureContactSchema();
  await db()`UPDATE contact_messages SET status = ${status} WHERE id = ${id}`;
}
