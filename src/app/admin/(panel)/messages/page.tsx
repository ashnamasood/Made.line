import type { Metadata } from "next";
import { listMessages } from "@/lib/contact";
import { Card, DbProblem, PageHeader, dateTime, loadFromDb, pill } from "../ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Messages — MADE.line admin" };

export default async function Messages({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = ((await searchParams).q ?? "").trim();
  const data = await loadFromDb("messages", () => listMessages(q));

  return (
    <>
      <PageHeader title="Messages" />
      {data.state !== "ok" ? (
        <DbProblem data={data} what="messages" />
      ) : (
        <Card title="Contact Form Enquiries">
          <div className="flex flex-wrap items-center gap-3">
            <form className="flex w-full gap-2 sm:w-auto" action="/admin/messages" method="get">
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
            <span className="text-sm text-ink/50 sm:ml-auto">
              {data.value.length} {data.value.length === 1 ? "message" : "messages"}
            </span>
          </div>

          {data.value.length === 0 ? (
            <p className="mt-8">{q ? "No messages match this search." : "No messages yet."}</p>
          ) : (
            <div className="mt-6 space-y-4">
              {data.value.map((m) => (
                <article key={m.id} className="rounded-xl border border-ink/10 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-3 font-bold">
                      {m.name}
                      <span className={`${pill} bg-peri/50 font-normal`}>{m.reason}</span>
                    </p>
                    <span className="text-sm text-ink/50">{dateTime(m.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm">
                    <a
                      className="underline"
                      href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.reason}`)}`}
                    >
                      {m.email}
                    </a>
                  </p>
                  {/* pre-wrap keeps the customer's own line breaks. */}
                  <p className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-[#faf8f3] p-4">
                    {m.details}
                  </p>
                  {m.attachments && (
                    <p className="mt-3 text-sm text-ink/50">
                      Attached (file names only, files aren&apos;t stored): {m.attachments}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </Card>
      )}
    </>
  );
}
