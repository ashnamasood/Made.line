import Link from "next/link";
import { Monogram } from "@/components/Logo";
import { Slot } from "@/components/Slot";

const products = [
  { name: "slick", tint: "bg-pink/25", href: "/shop/slick" },
  { name: "fresh", tint: "bg-butter/25", href: "/shop/fresh" },
  { name: "even", tint: "bg-peri/25", href: "/shop/even" },
];

const claims = [
  "Everyday essential",
  "Your effortless styling companion",
  "Instant freshness, wherever you are",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="p-2 md:p-3">
        {/* Card fills the screen below the nav (nav + section padding ≈ 6rem) instead of running past the fold. */}
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-blush md:aspect-auto md:h-[calc(100svh-6rem)]">
          {/*
            Source is 2160x4096 (vertical). Full-bleed cover in a landscape frame always crops;
            the 3/2 frame keeps that crop as low as it can go while staying wide, and the Y offset
            frames the head instead of the chin. Tune the 18% if you want it higher/lower.
          */}
          <video
            className="absolute inset-0 h-full w-full object-cover md:[object-position:50%_22%]"
            src="/video/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <Monogram className="absolute right-6 top-5 h-9 md:right-12 md:top-8 md:h-14" />
          <Link
            href="/shop"
            className="absolute bottom-8 left-6 rounded-full border-2 border-white px-8 py-3 text-sm font-extrabold uppercase tracking-wide text-white hover:bg-white hover:text-ink md:bottom-14 md:left-12"
          >
            Shop Products
          </Link>
          <h1 className="absolute bottom-24 right-6 max-w-[14ch] text-right text-3xl font-extrabold leading-tight md:bottom-14 md:right-12 md:max-w-none md:text-5xl">
            Created for effortless touchups anytime.
          </h1>
        </div>
      </section>

      {/* Products */}
      <section className="grid gap-[3px] bg-ink md:grid-cols-3">
        {products.map((p) => (
          <Link key={p.name} href={p.href} className="block bg-cream">
            <div className={`${p.tint} p-10`}>
              <Slot
                label={`MADE.${p.name} product shot`}
                className="mx-auto aspect-[3/4] w-full max-w-xs"
              />
            </div>
            <div className="bg-ink px-8 py-8 text-center text-4xl text-cream md:text-5xl">
              <span className="font-display">MADE.</span>
              <span className="font-script">{p.name}</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Claims */}
      <section className="grid md:grid-cols-2">
        {/* Rules run to the section edge; only the text is inset. */}
        <div className="flex flex-col justify-end">
          {claims.map((c) => (
            <p
              key={c}
              className="border-t border-ink px-6 py-6 text-xl font-extrabold last:border-b md:px-10 md:text-3xl"
            >
              {c}
            </p>
          ))}
        </div>
        <Slot
          label="Lifestyle image — comb / application shot"
          className="aspect-[4/3] md:aspect-auto md:min-h-[620px]"
        />
      </section>
    </>
  );
}
