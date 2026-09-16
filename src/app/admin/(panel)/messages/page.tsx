import type { Metadata } from "next";
import Link from "next/link";
import { isMessageStatus, listMessages } from "@/lib/contact";
import { Card, DbProblem, PageHeader, dateTime, loadFromDb, pill } from "../ui";
import { updateMessageStatus } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact form — MADE.line admin" };

const tabs = [
  ["all", "All"],
  ["new", "New"],
  ["replied", "Replied"],
] as const;

export default async function Messages({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = isMessageStatus(params.status) ? params.status : "all";
  const q = (params.q ?? "").trim();
  const data = await loadFromDb("messages", () => listMessages(status, q));

  return (
    <>
      <PageHeader title="Contact Form" />
      {data.state !== "ok" ? (
        <DbProblem data={data} what="contact form messages" />
      ) : (
        <Card title="Contact Form Submissions">
          <p className="-mt-2 mb-5 text-sm text-ink/60">
            Everything sent through the Contact page on the site. Reply by email,
            then mark it replied so it drops off the New list.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <form className="flex w-full gap-2 sm:w-auto" action="/admin/messages" method="get">
              <input type="hidden" name="status" value={status} />
              <input
                className="w-full rounded-xl border border-ink/20 px-4 py-2.5 outline-none focus:border-ink sm:w-72"
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search name, email or text…"
              />
              <button className="rounded-xl bg-butter px-5 font-bold" type="submit">
                Search
              </button>
            </form>
            <div className="flex gap-2 sm:ml-auto">
              {tabs.map(([value, label]) => (
                <Link
                  key={value}
                  href={`/admin/messages?status=${value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={`rounded-xl px-4 py-2 text-sm ${
                    status === value ? "bg-butter font-bold" : "bg-ink/5 hover:bg-ink/10"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {data.value.length === 0 ? (
            <p className="mt-8">
              {q || status !== "all" ? "No messages match this filter." : "No messages yet."}
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {data.value.map((m) => {
                const replied = m.status === "replied";
                return (
                  <article key={m.id} className="rounded-xl border border-ink/10 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="flex flex-wrap items-center gap-2 font-bold">
                        {m.name}
                        <span className={`${pill} bg-peri/50 font-normal`}>{m.reason}</span>
                        <span
                          className={`${pill} font-normal ${
                            replied ? "bg-ink/10 text-ink/60" : "bg-butter/70"
                          }`}
                        >
                          {replied ? "Replied" : "New"}
                        </span>
                      </p>
                      <span className="text-sm text-ink/50">{dateTime(m.created_at)}</span>
                    </div>

                    <p className="mt-1 text-sm">
                      <a className="underline" href={`mailto:${m.email}`}>
                        {m.email}
                      </a>
                    </p>
                    {/* pre-wrap keeps the customer's own line breaks. */}
                    <p className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-canvas p-4">
                      {m.details}
                    </p>
                    {m.attachments && (
                      <p className="mt-3 text-sm text-ink/50">
                        Attached (file names only, files aren&apos;t stored): {m.attachments}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap justify-end gap-3">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.reason}`)}`}
                        className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-cream"
                      >
                        Reply by email
                      </a>
                      <form action={updateMessageStatus}>
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="status" value={replied ? "new" : "replied"} />
                        <button
                          type="submit"
                          className="rounded-xl border border-ink/20 px-4 py-2 text-sm hover:border-ink"
                        >
                          {replied ? "Mark as new" : "Mark replied"}
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </>
  );
}
