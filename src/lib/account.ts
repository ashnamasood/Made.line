import { randomBytes, scrypt, timingSafeEqual as bytesEqual } from "node:crypto";
import { promisify } from "node:util";
import { timingSafeEqual } from "./auth";
import { db } from "./db";

/**
 * The single admin's profile and password. ADMIN_USER / ADMIN_PASSWORD are the
 * starting login; once the admin changes either in Settings, the database
 * copy wins. ADMIN_PASSWORD stays required as part of the session signing key.
 */

const hashWith = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

type Row = {
  username: string | null;
  name: string | null;
  avatar: string | null;
  password_hash: string | null;
};

export type Account = { username: string; name: string; avatar: string | null };

let ready: Promise<unknown> | null = null;
function ensureAccountSchema() {
  ready ??= db()`
    CREATE TABLE IF NOT EXISTS admin_account (
      id            smallint    PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      username      text,
      name          text,
      avatar        text,
      password_hash text,
      updated_at    timestamptz NOT NULL DEFAULT now()
    )`.catch((error) => {
    ready = null; // retry on the next call instead of failing forever
    throw error;
  });
  return ready;
}

/** The stored row, or null when there's no database or nothing saved yet. Throws on a database error. */
async function readRow(): Promise<Row | null> {
  if (!process.env.DATABASE_URL) return null;
  await ensureAccountSchema();
  const rows = (await db()`
    SELECT username, name, avatar, password_hash FROM admin_account WHERE id = 1`) as Row[];
  return rows[0] ?? null;
}

export async function getAccount(): Promise<Account> {
  const row = await readRow();
  const username = row?.username ?? process.env.ADMIN_USER ?? "admin";
  return { username, name: row?.name ?? username, avatar: row?.avatar ?? null };
}

/**
 * Key that signs admin sessions. It includes the stored password hash, so
 * changing the password signs every other session out, and a session can't
 * be forged from the env var alone. Null when admin access isn't configured.
 */
export async function sessionSecret(): Promise<string | null> {
  const base = process.env.ADMIN_PASSWORD;
  if (!base || !process.env.ADMIN_USER) return null;
  const hash = (await readRow())?.password_hash;
  return hash ? `${base}:${hash}` : base;
}

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await hashWith(password, salt, 32);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

async function passwordMatches(password: string, stored: string) {
  const [scheme, saltHex, keyHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !keyHex) return false;
  const key = await hashWith(password, Buffer.from(saltHex, "hex"), 32);
  return bytesEqual(key, Buffer.from(keyHex, "hex"));
}

/**
 * Checks a login. Throws on a database error rather than falling back to the
 * env password, which may be one the admin has since changed.
 */
export async function verifyLogin(username: string, password: string) {
  const row = await readRow();
  const okUser = timingSafeEqual(username, row?.username ?? process.env.ADMIN_USER ?? "");
  const okPass = row?.password_hash
    ? await passwordMatches(password, row.password_hash)
    : timingSafeEqual(password, process.env.ADMIN_PASSWORD ?? "");
  return okUser && okPass;
}

export async function checkCurrentPassword(password: string) {
  const row = await readRow();
  return row?.password_hash
    ? passwordMatches(password, row.password_hash)
    : timingSafeEqual(password, process.env.ADMIN_PASSWORD ?? "");
}

export async function saveProfile(p: Account) {
  await ensureAccountSchema();
  await db()`
    INSERT INTO admin_account (id, username, name, avatar) VALUES (1, ${p.username}, ${p.name}, ${p.avatar})
    ON CONFLICT (id) DO UPDATE
      SET username = EXCLUDED.username, name = EXCLUDED.name,
          avatar = EXCLUDED.avatar, updated_at = now()`;
}

export async function savePassword(password: string) {
  await ensureAccountSchema();
  const hash = await hashPassword(password);
  await db()`
    INSERT INTO admin_account (id, password_hash) VALUES (1, ${hash})
    ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now()`;
}
