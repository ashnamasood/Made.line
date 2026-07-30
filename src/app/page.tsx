import Image from "next/image";
import Link from "next/link";
import { Monogram } from "@/components/Logo";

// Backdrops are near-identical creams in the design, not product-colour tints.
const products = [
  { name: "slick", tint: "bg-[#f8f3e7]", href: "/shop/slick" },
  { name: "fresh", tint: "bg-[#f7f1e3]", href: "/shop/fresh" },
  { name: "even", tint: "bg-[#f3ede2]", href: "/shop/even" },
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
      <section className="p-2 md:px-[2vw] md:pb-[2vw] md:pt-[1vw]">
        {/* Fills the screen below the nav: 3.5rem bar + the 1.5/1/2vw gutters around it. */}
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-blush md:aspect-auto md:h-[calc(100svh-3.5rem-4.5vw)]">
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
            className="absolute bottom-8 left-6 rounded-full border-2 border-white px-8 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white hover:bg-white hover:text-ink md:bottom-14 md:left-12 md:border-4 md:px-9 md:py-3 md:text-[0.95vw]"
          >
            Shop Products
          </Link>
          {/* Sized off the viewport so it holds the design's proportion to the card. */}
          <h1 className="absolute bottom-24 right-6 max-w-[14ch] text-right text-3xl font-bold leading-tight md:bottom-14 md:right-12 md:max-w-none md:text-[2.2vw]">
            Created for effortless touchups anytime.
          </h1>
        </div>
      </section>

      {/* Products — dividers are dark over the shot, cream over the name band. */}
      <section className="grid md:grid-cols-3">
        {products.map((p, i) => {
          const divider = i < products.length - 1;
          return (
            <Link key={p.name} href={p.href} className="block bg-cream">
              <div
                className={`${p.tint} ${
                  divider ? "md:border-r-[3px] md:border-ink" : ""
                }`}
              >
                <Image
                  src={`/products/${p.name}.jpg`}
                  alt={`MADE.${p.name}`}
                  width={706}
                  height={941}
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                className={`bg-ink px-8 py-14 text-center text-4xl text-cream md:py-16 md:text-[3.6vw] ${
                  divider ? "md:border-r-[3px] md:border-cream" : ""
                }`}
              >
                {/* The band's dot is square, unlike the round one in the logo. */}
                <span className="font-display">MADE</span>
                <span className="mx-[0.05em] inline-block size-[0.17em] bg-current" />
                <span className="font-script">{p.name}</span>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Claims */}
      <section className="grid bg-cream md:grid-cols-2">
        {/* Rules run to the section edge; only the text is inset. The stack sits
            off the bottom, as in the design. */}
        <div className="flex flex-col justify-end pb-[10%]">
          {claims.map((c) => (
            <p
              key={c}
              className="border-t-2 border-ink px-6 py-6 text-xl font-bold last:border-b-2 md:px-10 md:py-8 md:text-3xl"
            >
              {c}
            </p>
          ))}
        </div>
        <Image
          src="/images/comb.jpg"
          alt="Product being combed through damp hair"
          width={735}
          height={800}
          className="aspect-[4/3] w-full object-cover md:aspect-auto md:h-full md:min-h-[620px]"
        />
      </section>
    </>
  );
}
