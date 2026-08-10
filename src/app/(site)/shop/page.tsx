import Image from "next/image";
import { AddToCart } from "@/components/AddToCart";
import { ProductRow } from "@/components/ProductRow";
import type { ProductId } from "@/lib/products";

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
 * Taglines are sized per product, not shared: the design gives slick a larger
 * setting than the other two, and one shared size left each about a
 * percentage point of page width off. Solved so each matches the PDF's own
 * rendered width; all stay on one line (the longest wraps above ~4.3vw).
 */

const items = [
  {
    name: "slick",
    title: "Flyaway Balm Stick",
    accent: "bg-[#fdbdd9]",
    body: "md:text-[clamp(0px,1.26vw,19px)]",
    made: "md:text-[clamp(0px,5.37vw,81.1px)]",
    script: "md:text-[clamp(0px,6.46vw,97.7px)]",
    sub: "md:text-[clamp(0px,2.14vw,32.4px)]",
    cart: "md:text-[clamp(0px,1.4vw,21.2px)]",
    tag: "md:text-[clamp(0px,3.62vw,54.7px)]",
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
    made: "md:text-[clamp(0px,5.46vw,82.6px)]",
    script: "md:text-[clamp(0px,6.22vw,94.1px)]",
    sub: "md:text-[clamp(0px,2.13vw,32.3px)]",
    cart: "md:text-[clamp(0px,1.4vw,21.2px)]",
    tag: "md:text-[clamp(0px,3.39vw,51.3px)]",
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
    made: "md:text-[clamp(0px,5.33vw,80.5px)]",
    script: "md:text-[clamp(0px,5.82vw,87.9px)]",
    sub: "md:text-[clamp(0px,2.09vw,31.7px)]",
    cart: "md:text-[clamp(0px,1.46vw,22.1px)]",
    tag: "md:text-[clamp(0px,3.4vw,51.4px)]",
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
              <h2 className="text-[9vw] leading-none md:leading-[0.78]">
                <span className={`font-display [-webkit-text-stroke:0.4px_var(--color-ink)] ${item.made}`}>MADE.</span>
                <span className={`font-script [-webkit-text-stroke:0.4px_var(--color-ink)] ${item.script}`}>
                  {item.name}
                </span>
              </h2>
              <p
                className={`mt-2 font-body text-xl font-bold [-webkit-text-stroke:0.35px_var(--color-ink)] md:mt-[clamp(0px,0.75vw,11.3px)] ${item.sub}`}
              >
                {item.title}
              </p>
              <p
                className={`mt-6 font-body font-medium leading-[1.35] max-md:text-base md:mt-[clamp(0px,1.83vw,27.7px)] ${item.body}`}
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
              <p className={`font-script [-webkit-text-stroke:0.0324em_var(--color-ink)] text-4xl tracking-[0.035em] ${item.tag}`}>
                {item.tagline}
              </p>
              {/* The design sets this in the display face, not Archivo, and
                  spaces the letters in the text itself rather than by tracking. */}
              <AddToCart
                product={item.name as ProductId}
                className={`mt-[clamp(0px,2.42vw,36.6px)] w-full rounded-full border-2 border-ink py-4 font-display [-webkit-text-stroke:0.4px_var(--color-ink)] uppercase tracking-[0.12em] md:border-4 md:py-[clamp(0px,0.95vw,14.5px)] ${item.cart} ${item.accent}`}
              />
            </div>
          </div>

          <Image
            src={`/images/shop-${item.name}.jpg`}
            alt={item.alt}
            width={item.size[0]}
            height={item.size[1]}
            sizes="(min-width: 768px) 42vw, 100vw"
            // Only ever emit one edge: cancelling a border with border-l-0
            // relies on source order at equal specificity, and Tailwind emits
            // it first, so the cancel silently lost and left a stray rule.
            className={`w-full border-ink object-cover md:aspect-auto md:h-full ${
              item.reverse
                ? "md:border-r-[clamp(2px,0.6vw,9px)]"
                : "md:border-l-[clamp(2px,0.6vw,9px)]"
            } ${item.aspect}`}
          />
        </section>
      ))}
    </div>
  );
}
