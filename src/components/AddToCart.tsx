"use client";

import { useState } from "react";

/**
 * Replaces the Add to Cart button with an inline email capture on click, then
 * posts {email, product} to the DB. No cart state, no checkout — just a lead
 * per item, which is what the admin list shows.
 */
export function AddToCart({
  product,
  className,
}: {
  product: string;
  className: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "asking" | "sent" | "error">(
    "idle",
  );

  if (status === "sent") {
    return (
      <p className={`${className} flex items-center justify-center`}>
        Added — we&apos;ll be in touch
      </p>
    );
  }

  if (status === "idle") {
    return (
      <button
        className={className}
        type="button"
        onClick={() => setStatus("asking")}
      >
        Add to Cart
      </button>
    );
  }

  return (
    <form
      className="mt-[clamp(0px,2.42vw,36.6px)] flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, product }),
        }).catch(() => null);
        setStatus(res?.ok ? "sent" : "error");
      }}
    >
      <input
        className="min-w-0 flex-1 rounded-full border-2 border-ink bg-white px-5 py-3 font-body text-sm text-ink outline-none"
        type="email"
        required
        autoFocus
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className={`${className} !mt-0 flex-none px-6`}
        type="submit"
      >
        {status === "error" ? "Try again" : "Confirm"}
      </button>
    </form>
  );
}
