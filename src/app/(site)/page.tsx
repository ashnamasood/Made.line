import Image from "next/image";
import Link from "next/link";
import { Monogram } from "@/components/Logo";
import { ProductRow } from "@/components/ProductRow";

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
            className="absolute bottom-8 left-6 rounded-full border-2 border-white px-8 py-3 font-display text-sm uppercase tracking-[0.15em] text-white hover:bg-white hover:text-ink md:bottom-14 md:left-12 md:border-4 md:px-9 md:py-3 md:text-[1.35vw]"
          >
            Shop Products
          </Link>
          {/* Roughly twice the Shop Products label, as in the design. */}
          <h1 className="absolute bottom-24 right-6 max-w-[14ch] text-right text-3xl font-bold leading-tight md:bottom-14 md:right-12 md:max-w-none md:text-[2.45vw]">
            Created for effortless touchups anytime.
          </h1>
        </div>
      </section>

      <ProductRow />

      {/* Claims */}
      <section className="grid bg-cream md:grid-cols-2">
        {/* Rules run to the section edge; only the text is inset. The stack sits
            off the bottom, as in the design. */}
        <div className="flex flex-col justify-end pb-[10%]">
          {claims.map((c) => (
            <p
              key={c}
              className="border-t-2 border-ink px-6 py-6 text-xl font-bold last:border-b-2 md:border-t-4 md:px-10 md:py-8 md:text-[2.56vw] md:last:border-b-4"
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
