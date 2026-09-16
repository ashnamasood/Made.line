import Link from "next/link";
import { Icon, type IconName } from "../_shared/Icon";

export function PageHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h1 className="font-body text-2xl font-bold md:text-3xl">{title}</h1>
      <nav aria-label="Breadcrumb" className="font-body text-sm text-ink/50">
        <Link href="/admin" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-ink">{title}</span>
      </nav>
    </div>
  );
}

/** White panel with an optional titled header row, like the reference's cards. */
export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-ink/10 bg-white ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-5 py-4 md:px-7 md:py-5">
          <h2 className="font-body text-lg font-bold">{title}</h2>
          {action}
        </div>
      )}
      <div className="p-5 md:p-7">{children}</div>
    </section>
  );
}

// Brand tints for the stat tiles' icon squares.
const tints = {
  peri: "bg-peri/40",
  butter: "bg-butter/60",
  pink: "bg-pink/30",
  blush: "bg-blush",
} as const;

export function StatCard({
  icon,
  tint,
  label,
  value,
  note,
  href,
}: {
  icon: IconName;
  tint: keyof typeof tints;
  label: string;
  value: string;
  note: string;
  href?: string;
}) {
  const body = (
    <>
      <span className={`grid size-12 place-items-center rounded-xl ${tints[tint]}`}>
        <Icon name={icon} className="size-6" />
      </span>
      <p className="mt-5 font-body text-ink/60">{label}</p>
      <p className="mt-1 font-body text-3xl font-bold">{value}</p>
      <p className="mt-1 font-body text-sm text-ink/50">{note}</p>
    </>
  );
  const box = "block rounded-2xl border border-ink/10 bg-white p-6";
  return href ? (
    <Link href={href} className={`${box} transition-colors hover:border-ink/30`}>
      {body}
    </Link>
  ) : (
    <div className={box}>{body}</div>
  );
}

export type Loaded<T> =
  | { state: "unconfigured" }
  | { state: "error"; message: string }
  | { state: "ok"; value: T };

/**
 * Runs a page's queries, keeping "no database" and "database failed" apart
 * from real data, so an outage never renders as an empty shop.
 */
export async function loadFromDb<T>(what: string, run: () => Promise<T>): Promise<Loaded<T>> {
  if (!process.env.DATABASE_URL) return { state: "unconfigured" };
  try {
    return { state: "ok", value: await run() };
  } catch (error) {
    console.error(`admin ${what} query failed`, error);
    return {
      state: "error",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export function DbProblem({ data, what }: { data: Loaded<unknown>; what: string }) {
  if (data.state === "unconfigured") {
    return (
      <Card>
        <p className="font-body">
          <code>DATABASE_URL</code> is not set, so there is nothing to read.
        </p>
      </Card>
    );
  }
  if (data.state === "error") {
    return (
      <Card>
        <p className="font-body font-bold text-red-700">
          Couldn&apos;t load {what}. This is a database error, not an empty list.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-ink/5 p-4 font-body text-sm">
          {data.message}
        </pre>
      </Card>
    );
  }
  return null;
}

// Pages render on Vercel in UTC; pin to the business's own clock.
export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Adelaide",
  });

export const pill = "rounded-full px-3 py-1 font-body text-xs";
