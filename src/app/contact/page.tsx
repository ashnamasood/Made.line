"use client";

import { useState } from "react";

const reasons = [
  "Order support",
  "Product question",
  "Returns & exchanges",
  "Press",
  "Partnerships",
  "Something else",
];

const field =
  "w-full rounded-xl bg-white px-6 py-5 text-base text-ink placeholder:text-ink/50 outline-none focus:ring-2 focus:ring-ink/30";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  return (
    // Sits in a rounded card inset from the page edge, like the hero.
    <div className="p-2 md:px-[2vw] md:py-[1vw]">
      <div className="rounded-2xl bg-cream px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-[760px]">
        <h1 className="text-5xl font-black md:text-6xl">contact us</h1>

        <div className="mt-8 space-y-5 text-lg leading-relaxed">
          <p>
            Feel free to reach out at any time. We&apos;re here to help with
            orders, product questions, and any feedback you may have.
          </p>
          <p>
            Our team can assist by email Monday through Friday, 9am to 5pm
            (excluding holidays). We&apos;ll aim to get back to you within 2
            business days.
          </p>
          <p className="text-base text-ink/70">* indicates a required field</p>
        </div>

        {sent ? (
          <p className="mt-12 rounded-xl bg-white px-6 py-8 text-lg font-bold">
            Thanks — we&apos;ve got your message and will be in touch within 2
            business days.
          </p>
        ) : (
          <form
            className="mt-12 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError("");
              setSending(true);
              const data = new FormData(e.currentTarget);
              // ponytail: filenames only — storing the bytes needs blob storage.
              const attachments = data
                .getAll("files")
                .filter((f): f is File => f instanceof File && f.size > 0)
                .map((f) => f.name)
                .join(", ");
              data.delete("files");
              const body = {
                ...Object.fromEntries(data.entries()),
                attachments,
              };
              const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              }).catch(() => null);
              setSending(false);
              if (res?.ok) setSent(true);
              else
                setError(
                  (await res?.json().catch(() => null))?.error ??
                    "Something went wrong. Please try again.",
                );
            }}
          >
            <input
              className={field}
              name="name"
              placeholder="First and Last Name*"
              required
            />
            <input
              className={field}
              name="email"
              type="email"
              placeholder="Email*"
              required
            />
            <select className={field} name="reason" required defaultValue="">
              <option value="" disabled>
                Contact Reason*
              </option>
              {reasons.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <input
              className={field}
              name="topic"
              placeholder="Topic*"
              required
            />
            <textarea
              className={`${field} min-h-[260px] resize-y`}
              name="details"
              placeholder="Tell us the details.*"
              required
            />

            <div className="pt-4">
              <p className="mb-3 text-sm text-ink/70">
                Optional: 10 files max, total file size under 50MB
              </p>
              <input
                className={`${field} file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-5 file:py-2 file:text-sm file:font-bold file:text-cream`}
                type="file"
                name="files"
                multiple
                accept="image/*"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-white px-6 py-4 font-bold text-red-700">
                {error}
              </p>
            )}

            <button
              className="mt-6 w-full rounded-full border-2 border-ink py-5 text-base font-black uppercase tracking-[0.15em] hover:bg-ink hover:text-cream disabled:opacity-50"
              type="submit"
              disabled={sending}
            >
              {sending ? "Sending…" : "Submit"}
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}
