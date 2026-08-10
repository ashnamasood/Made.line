import Image from "next/image";
import { ProductRow } from "@/components/ProductRow";

/**
 * Sizes are percentages of the design page's width, read from the PDF's own
 * font metrics. Two things those metrics don't tell you directly:
 *
 * - Our Catchye.otf is a different cut from the PDF's CatchyeDemo: it sits
 *   ~30% smaller on the em, so matching the design means scaling it well past
 *   the PDF's nominal size. Archivo and TT Commons match within 0.7%.
 * - Line pitch is perfectly uniform in all three blocks, so the copy has no
 *   paragraph gaps — it's one block with hard line breaks.
 *
 * Taglines are ONE shared size (TAG_SIZE below), not per-item: Catchye has
 * only one weight, so at a smaller size a short tagline reads visibly
 * chunkier than a longer one at a larger size — a hinting artifact, not a
 * real weight difference. A single size keeps all three reading the same.
 * 3.9vw is the largest that still keeps every tagline on one line — the
 * longest, "Cover it. Blend it. Feel even", wraps above ~4.3vw.
 */
const TAG_SIZE = "md:text-[clamp(0px,3.9vw,59px)]";

const items = [
  {
    name: "slick",
    title: "Flyaway Balm Stick",
    accent: "bg-[#fdbdd9]",
    body: "md:text-[clamp(0px,1.26vw,19px)]",
    made: "md:text-[clamp(0px,5.59vw,84.5px)]",
    script: "md:text-[clamp(0px,6.73vw,101.8px)]",
    sub: "md:text-[clamp(0px,2.23vw,33.7px)]",
    cart: "md:text-[clamp(0px,1.46vw,22.1px)]",
    aspect: "aspect-[0.738]",
    size: [843, 1143],
    lines: [
      "Effortless hair, wherever you go. MADE.SLICK is a lightweight flyaway",
      "balm designed for quick, easy touch-ups on the go. Smooth down frizz,",
      "tame flyaways, and refine your look without the stiffness or residue.",
      "The compact stick makes styling simple just swipe, smooth, and go.",
      "Perfect for sleek buns, polished ponytails, clean-girl looks, or refreshing",
      "your style throughout the day.",
    ],
    tagline: "Slick it. Smooth it. Own it.",
    alt: "MADE.slick beside a model resting on a table",
  },
  {
    name: "fresh",
    title: "Dry Shampoo",
    accent: "bg-[#faecb0]",
    body: "md:text-[clamp(0px,1.37vw,20.7px)]",
    made: "md:text-[clamp(0px,5.69vw,86px)]",
    script: "md:text-[clamp(0px,6.48vw,98px)]",
    sub: "md:text-[clamp(0px,2.22vw,33.6px)]",
    cart: "md:text-[clamp(0px,1.46vw,22.1px)]",
    aspect: "aspect-[0.803]",
    size: [976, 1216],
    reverse: true,
    lines: [
      "Fresh hair, no wash day required. MADE.FRESH is a",
      "lightweight dry shampoo designed to instantly refresh your",
      "roots, absorb excess oil, and bring life back to your hair",
      "between washes.",
      "Perfect for busy mornings, post-workout touch-ups, or",
      "extending your style for another day. Simply apply, blend, and",
      "go for hair that feels fresh, clean, and effortlessly put together.",
    ],
    tagline: "Refresh it. Revive it.",
    alt: "MADE.fresh held beside the face",
  },
  {
    name: "even",
    title: "Grey Coverage Stick",
    accent: "bg-[#a8c7f1]",
    body: "md:text-[clamp(0px,1.34vw,20.2px)]",
    made: "md:text-[clamp(0px,5.55vw,83.9px)]",
    script: "md:text-[clamp(0px,6.06vw,91.6px)]",
    sub: "md:text-[clamp(0px,2.18vw,33px)]",
    cart: "md:text-[clamp(0px,1.52vw,23px)]",
    aspect: "aspect-[0.818]",
    size: [885, 1082],
    lines: [
      "A quick touch-up for those in-between moments.",
      "MADE.EVEN is a convenient grey coverage stick designed",
      "to seamlessly blend into your hair, helping disguise visible",
      "greys and grown-out roots in seconds.",
      "Easy to apply and effortless to carry, it’s your go-to for last-",
      "minute plans, special occasions, or simply keeping your hair",
      "looking polished between colour appointments.",
    ],
    tagline: "Cover it. Blend it. Feel even",
    alt: "MADE.even held against curly hair",
  },
];

export default function Shop() {
  return (
    <div data-bg="cream">
      {/* Hero */}
      <section className="p-2 md:px-[2vw] md:pb-[2vw] md:pt-[1vw]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl md:aspect-[2/1]">
          <Image
            src="/images/shop-hero.jpg"
            alt="Everyday hair essentials"
            width={1123}
            height={562}
            priority
            sizes="100vw"
            className="h-full w-full object-cover"
          />
          <h1 className="absolute inset-0 flex items-center justify-center text-center text-3xl font-bold text-white md:text-[3.58vw]">
            Everyday Hair Essentials
          </h1>
        </div>
      </section>

      <ProductRow />

      {items.map((item) => (
        <section
          key={item.name}
          id={item.name}
          // The design page is 16:9; letting the photo's own ratio drive the
          // height made the block taller than the design.
          className={`grid scroll-mt-4 bg-cream md:aspect-[16/9] ${
            item.reverse
              ? "md:grid-cols-[42.2fr_57.8fr]"
              : "md:grid-cols-[57.8fr_42.2fr]"
          }`}
        >
          {/* Copy and photo swap sides down the page, as in the design. order-2
              reorders which track each element paints into, but grid tracks are
              sized by position, not by content — so a reversed item needs its
              column fractions flipped too, or the image (still first in DOM)
              lands in the bigger track meant for the copy. */}
          <div
            className={`flex flex-col justify-between px-6 py-16 md:px-[5.5vw] md:pb-[5.55vw] md:pt-[3.95vw] ${
              item.reverse ? "md:order-2" : ""
            }`}
          >
            <div>
              <h2 className="text-[9vw] leading-none">
                <span className={`font-display ${item.made}`}>MADE.</span>
                <span className={`font-script ${item.script}`}>
                  {item.name}
                </span>
              </h2>
              <p
                className={`mt-[clamp(0px,0.92vw,14px)] font-body text-xl font-bold ${item.sub}`}
              >
                {item.title}
              </p>
              <p
                className={`mt-[clamp(0px,2.32vw,35px)] font-body leading-[1.35] max-md:text-base ${item.body}`}
              >
                {item.lines.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < item.lines.length - 1 && (
                      <>
                        {/* No space after a hyphen, so "last-" joins straight
                            onto "minute" once the break is hidden. */}
                        {line.endsWith("-") ? "" : " "}
                        <br className="max-md:hidden" />
                      </>
                    )}
                  </span>
                ))}
              </p>
            </div>

            <div>
              <p className={`font-script text-4xl ${TAG_SIZE}`}>
                {item.tagline}
              </p>
              {/* The design sets this in the display face, not Archivo, and
                  spaces the letters in the text itself rather than by tracking. */}
              <button
                className={`mt-[clamp(0px,2.42vw,36.6px)] w-full rounded-full border-2 border-ink py-4 font-display uppercase tracking-[0.12em] md:border-4 md:py-[clamp(0px,0.95vw,14.5px)] ${item.cart} ${item.accent}`}
                type="button"
              >
                Add to Cart
              </button>
            </div>
          </div>

          <Image
            src={`/images/shop-${item.name}.jpg`}
            alt={item.alt}
            width={item.size[0]}
            height={item.size[1]}
            sizes="(min-width: 768px) 42vw, 100vw"
            className={`w-full border-ink object-cover md:aspect-auto md:h-full md:border-l-[clamp(2px,0.6vw,9px)] ${
              item.reverse
                ? "md:border-l-0 md:border-r-[clamp(2px,0.6vw,9px)]"
                : ""
            } ${item.aspect}`}
          />
        </section>
      ))}
    </div>
  );
}
