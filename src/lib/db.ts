import { neon } from "@neondatabase/serverless";

// Created on first request, not at module load, so a build without
// DATABASE_URL set doesn't fail.
let client: ReturnType<typeof neon> | null = null;
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return (client ??= neon(url));
}
