"use client";

import { useState } from "react";
import { Monogram } from "@/components/Logo";

const reasons = [
  "Order support",
  "Product question",
  "Returns & exchanges",
  "Press",
  "Partnerships",
  "Something else",
];

const field =
  "w-full rounded-2xl bg-white px-6 py-4 font-body text-ink placeholder:text-ink/45 outline-none focus:ring-2 focus:ring-ink/20 md:text-[1.24vw] md:leading-none";

/**
 * Sizes are percentages of the design page's width, read from its PDF.
 * Catchye sits small and narrow on the em compared with the cut the design
 * used, so the script words carry tracking and a light stroke to match — the
 * same treatment as the shop taglines.
 */
const SCRIPT = "font-script [-webkit-text-stroke:0.0324em_var(--color-ink)]";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  return (
    <div data-bg="cream">
      <div className="mx-auto max-w-[900px] px-6 py-16 md:py-[6vw]">
        <h1 className="text-center leading-none">
          <span className="font-display text-[clamp(2.5rem,11vw,4.5rem)] uppercase md:text-[6.4vw]">
            Contact
          </span>{" "}
          <span className={`${SCRIPT} text-[clamp(2.6rem,11.5vw,4.7rem)] md:text-[6.68vw] md:tracking-[0.116em]`}>
            US
          </span>
        </h1>

        <p className="mx-auto mt-6 text-center font-body font-medium leading-[1.45] md:mt-[2.5vw] md:text-[1.65vw]">
          Have a question about MADE.line, your order, or a product? Fill out
          the
          <br className="max-md:hidden" />
          form below and we&apos;ll get back to you as soon as possible.
        </p>

        {sent ? (
          <p className="mt-12 rounded-2xl bg-white px-6 py-8 font-body text-lg">
            Thanks — we&apos;ve got your message and will be in touch as soon as
            possible.
          </p>
        ) : (
          <form
            className="mt-10 space-y-4 md:mt-[3.5vw]"
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
            {/* appearance-none so it matches the inputs: a native select ignores
                the padding they use and draws the OS control, which rendered
                it visibly shorter. The chevron is drawn back on. */}
            <select
              className={`${field} appearance-none bg-[length:1.1em] bg-[right_1.5rem_center] bg-no-repeat pr-14 [background-image:url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2016%2016%27%20fill=%27none%27%20stroke=%27%234a2313%27%20stroke-width=%271.5%27%3E%3Cpath%20d=%27M4%206l4%204%204-4%27/%3E%3C/svg%3E")]`}
              name="reason"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Contact Reason*
              </option>
              {reasons.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <textarea
              className={`${field} min-h-[240px] resize-y md:leading-[1.45]`}
              name="details"
              placeholder="Tell us the details.*"
              required
            />

            <div className="pt-4">
              <p className="mb-3 font-body text-sm text-ink/60">
                Optional: 10 files max, total file size under 50MB
              </p>
              <input
                className={`${field} file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-5 file:py-2 file:font-body file:text-sm file:text-cream`}
                type="file"
                name="files"
                multiple
                accept="image/*"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-2xl bg-white px-6 py-4 font-body font-bold text-red-700"
              >
                {error}
              </p>
            )}

            <button
              className="mt-4 w-full rounded-full border-2 border-ink py-4 font-body text-sm font-bold uppercase tracking-[0.25em] disabled:opacity-50 md:py-[1.1vw] md:text-[1.24vw]"
              type="submit"
              disabled={sending}
            >
              {sending ? "Sending…" : "Submit"}
            </button>
          </form>
        )}

        <p
          className={`${SCRIPT} mt-16 text-center text-[8vw] md:mt-[5vw] md:text-[3.28vw] md:tracking-[0.09em]`}
        >
          Let Talk Hair!
        </p>
        <Monogram className="mx-auto mt-8 h-[14vw] md:mt-[3vw] md:h-[6.24vw]" />
      </div>
    </div>
  );
}
