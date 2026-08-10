import Image from "next/image";
import { ProductRow } from "@/components/ProductRow";

const items = [
  {
    name: "slick",
    title: "Flyaway Balm Stick",
    accent: "bg-[#fdbdd9]",
    // The design shrinks this one's body copy to fit the longer blurb.
    body: "text-[clamp(0px,1.16vw,17.5px)]",
    aspect: "aspect-[0.738]",
    copyWidth: "max-w-[clamp(0px,39vw,590px)]",
    size: [843, 1143],
    copy: [
      "Effortless hair, wherever you go. MADE.SLICK is a lightweight flyaway balm designed for quick, easy touch-ups on the go. Smooth down frizz, tame flyaways, and refine your look without the stiffness or residue. The compact stick makes styling simple just swipe, smooth, and go. Perfect for sleek buns, polished ponytails, clean-girl looks, or refreshing your style throughout the day.",
    ],
    tagline: "Slick it. Smooth it. Own it.",
    alt: "MADE.slick beside a model resting on a table",
  },
  {
    name: "fresh",
    title: "Dry Shampoo",
    accent: "bg-[#faecb0]",
    body: "text-[clamp(0px,1.29vw,19.5px)]",
    aspect: "aspect-[0.803]",
    copyWidth: "max-w-[clamp(0px,38vw,575px)]",
    size: [976, 1216],
    reverse: true,
    copy: [
      "Fresh hair, no wash day required. MADE.FRESH is a lightweight dry shampoo designed to instantly refresh your roots, absorb excess oil, and bring life back to your hair between washes.",
      "Perfect for busy mornings, post-workout touch-ups, or extending your style for another day. Simply apply, blend, and go for hair that feels fresh, clean, and effortlessly put together.",
    ],
    tagline: "Refresh it. Revive it.",
    alt: "MADE.fresh held beside the face",
  },
  {
    name: "even",
    title: "Grey Coverage Stick",
    accent: "bg-[#a8c7f1]",
    body: "text-[clamp(0px,1.29vw,19.5px)]",
    aspect: "aspect-[0.818]",
    copyWidth: "max-w-[clamp(0px,36vw,545px)]",
    size: [885, 1082],
    copy: [
      "A quick touch-up for those in-between moments.",
      "MADE.EVEN is a convenient grey coverage stick designed to seamlessly blend into your hair, helping disguise visible greys and grown-out roots in seconds.",
      "Easy to apply and effortless to carry, it’s your go-to for last-minute plans, special occasions, or simply keeping your hair looking polished between colour appointments.",
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
          className={`grid scroll-mt-4 bg-cream ${
            item.reverse ? "md:grid-cols-[44fr_56fr]" : "md:grid-cols-[56fr_44fr]"
          }`}
        >
          {/* Copy and photo swap sides down the page, as in the design. order-2
              reorders which track each element paints into, but grid tracks are
              sized by position, not by content — so a reversed item needs its
              column fractions flipped too, or the image (still first in DOM)
              lands in the bigger track meant for the copy. */}
          <div
            className={`flex flex-col justify-between gap-[6vw] px-6 py-16 md:px-[5.5vw] md:py-[6vw] ${
              item.reverse ? "md:order-2" : ""
            }`}
          >
            <div>
              <h2 className="text-[9vw] leading-none md:text-[clamp(0px,5.95vw,90px)]">
                <span className="font-display">MADE.</span>
                <span className="font-script">{item.name}</span>
              </h2>
              <p className="mt-[1.5vw] font-body text-xl font-bold md:text-[clamp(0px,2.25vw,34px)]">
                {item.title}
              </p>
              <div
                // Regular, not Medium: unlike the heading/subhead (each drawn three
            // times in the design), the body copy is single-drawn.
            className={`mt-[clamp(0px,2.8vw,42px)] space-y-[0.9em] font-body leading-[1.45] max-md:max-w-none max-md:text-base ${item.body} ${item.copyWidth}`}
              >
                {item.copy.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </div>

            <div>
              <p className="font-script text-4xl md:text-[clamp(0px,3.8vw,57.5px)]">
                {item.tagline}
              </p>
              <button
                className={`mt-[clamp(0px,2.8vw,42px)] w-full rounded-full border-2 border-ink py-4 font-body font-bold uppercase tracking-[0.25em] md:border-4 md:py-[clamp(0px,0.95vw,14.5px)] md:text-[clamp(0px,1.25vw,19px)] ${item.accent}`}
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
            sizes="(min-width: 768px) 44vw, 100vw"
            className={`w-full border-ink object-cover md:border-l-[clamp(2px,0.6vw,9px)] ${
              item.reverse ? "md:border-l-0 md:border-r-[clamp(2px,0.6vw,9px)]" : ""
            } ${item.aspect}`}
          />
        </section>
      ))}
    </div>
  );
}
