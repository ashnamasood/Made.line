import Image from "next/image";
import Link from "next/link";

/** "MADE." in the display face, "line" in the script — as the headings set it. */
function Lockup() {
  return (
    <>
      <span className="font-display">MADE.</span>
      <span className="font-script">line</span>
    </>
  );
}

// Measured off the rendered design pages, not the extracted point sizes: those
// sit inside scaled forms. Headings span 53.4% of the page width; body copy is
// 25px on 33px leading.
const heading = "text-center font-display text-[6vw] leading-none md:text-[3.55vw]";
// Medium, not Regular: the design draws every glyph twice, so the paragraphs
// sit visibly heavier than plain Archivo Regular.
const prose = "font-body font-medium text-[2vw] leading-[1.32] max-md:text-base";

export default function OurStory() {
  return (
    <>
      {/* Hero */}
      <section className="p-2 md:px-[2vw] md:pb-[2vw] md:pt-[1vw]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-blush md:aspect-auto md:h-[calc(100svh-3.5rem-4.5vw)]">
          <video
            className="absolute inset-0 h-full w-full object-cover md:[object-position:50%_22%]"
            src="/video/story.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <h1 className="absolute bottom-24 left-6 text-3xl font-bold leading-tight md:bottom-14 md:left-12 md:text-[2.56vw]">
            Made well.
            <br />
            Made for you.
          </h1>
          <Link
            href="/shop"
            className="absolute bottom-8 right-6 rounded-full border-2 border-white px-8 py-3 font-display text-sm uppercase tracking-[0.15em] text-white hover:bg-white hover:text-ink md:bottom-14 md:right-12 md:border-4 md:px-9 md:py-3 md:text-[1.35vw]"
          >
            Shop Products
          </Link>
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream px-6 py-20 md:px-10 md:py-[7vw]">
        <h2 className={heading}>
          STORY ABOUT <Lockup />
        </h2>
        <div className={`mx-auto mt-[4.5vw] max-w-[52ch] text-center ${prose}`}>
          <p>
            For over a decade, founder Beth Bradley has helped thousands of women
            feel like the best version of themselves.
          </p>
          <p>
            One conversation came up almost every day:
            <br />
            &ldquo;My greys are already coming back.&rdquo;
            <br />
            &ldquo;I wish there was something to get me through until my next
            appointment.&rdquo;
          </p>
          <p>
            Beth understood that feeling personally. She started going grey at
            just 19 and knew how quickly it could affect confidence when your
            reflection no longer felt like you.
          </p>
          <p>
            The products available felt like a compromise — heavy, messy,
            obvious, and never designed to fit effortlessly into everyday life.
          </p>
          <p>
            So she created MADE.line: simple, handbag-friendly essentials that
            make in-between moments feel effortless, helping women feel confident
            every day, not just after a salon appointment.
          </p>
        </div>
      </section>

      {/* Made well */}
      <section className="grid bg-cream md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-16 md:px-[5vw] md:py-0">
          <h2 className="font-display text-[8vw] leading-[1.35] md:text-[3.5vw]">
            MADE WELL.
            <br />
            MADE FOR YOU.
          </h2>
          <p className="mt-[1.4em] font-body font-medium text-[1.95vw] italic leading-[1.35] max-md:text-lg">
            Professional quality. Beautifully designed. Made for everyday
            simplicity.
            <br />
            No complicated routines. No unnecessary products.
            <br />
            Just what your hair needs.
          </p>
        </div>
        <Image
          src="/images/story-fresh.jpg"
          alt="MADE.fresh held beside the face"
          width={1200}
          height={1499}
          className="aspect-[4/5] w-full object-cover md:aspect-auto md:h-full"
        />
      </section>

      {/* Product group shot */}
      <Image
        src="/images/story-products.jpg"
        alt="MADE.fresh, MADE.even and MADE.slick"
        width={1800}
        height={1441}
        className="w-full object-cover"
        sizes="100vw"
      />

      {/* What is */}
      <section className="bg-cream px-6 py-20 md:px-10 md:py-[7vw]">
        <h2 className={heading}>
          WHAT IS <Lockup />
        </h2>
        <div className={`mx-auto mt-[4.5vw] max-w-[45ch] text-center ${prose}`}>
          <p>
            MADE.line is a collection of elevated everyday hair essentials
            designed to solve real hair concerns with professional performance
            and thoughtful design.
          </p>
          <p>
            Made in Australia and formulated with hair health at its core, every
            product is created to deliver reliable results without compromising
            your hair or scalp.
          </p>
          <p>
            Compact, handbag-friendly, and beautifully designed, MADE.line fits
            effortlessly into your daily routine.
          </p>
          <p>
            Named after founder Beth Bradley&apos;s middle name, Madeline,
            MADE.line is built on one simple belief: everyone deserves products
            made for their hair, their lifestyle, and their confidence.
          </p>
        </div>
      </section>
    </>
  );
}
