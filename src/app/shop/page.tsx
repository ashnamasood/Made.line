import Image from "next/image";
import { ProductRow } from "@/components/ProductRow";

const items = [
  {
    name: "slick",
    title: "Flyaway Balm Stick",
    accent: "bg-[#fdbdd9]",
    // The design shrinks this one's body copy to fit the longer blurb.
    body: "text-[clamp(0px,1.26vw,19px)]",
    made: "md:text-[clamp(0px,5.59vw,84.5px)]",
    script: "md:text-[clamp(0px,5.84vw,88.3px)]",
    sub: "md:text-[clamp(0px,2.14vw,32.4px)]",
    tag: "md:text-[clamp(0px,2.99vw,45.2px)]",
    cart: "md:text-[clamp(0px,1.46vw,22.1px)]",
    aspect: "aspect-[0.738]",
    copyWidth: "max-w-[clamp(0px,40vw,605px)]",
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
    body: "text-[clamp(0px,1.37vw,20.7px)]",
    made: "md:text-[clamp(0px,5.69vw,86px)]",
    script: "md:text-[clamp(0px,5.94vw,89.8px)]",
    sub: "md:text-[clamp(0px,2.18vw,33px)]",
    tag: "md:text-[clamp(0px,2.76vw,41.7px)]",
    cart: "md:text-[clamp(0px,1.46vw,22.1px)]",
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
    body: "text-[clamp(0px,1.34vw,20.2px)]",
    made: "md:text-[clamp(0px,5.55vw,83.9px)]",
    script: "md:text-[clamp(0px,5.79vw,87.5px)]",
    sub: "md:text-[clamp(0px,2.12vw,32.1px)]",
    tag: "md:text-[clamp(0px,2.87vw,43.4px)]",
    cart: "md:text-[clamp(0px,1.52vw,23px)]",
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
              {/* The two halves are set at different sizes in the design —
                  Catchye sits smaller on the em, so it runs slightly larger. */}
              <h2 className="text-[9vw] leading-none">
                <span className={`font-display ${item.made}`}>MADE.</span>
                <span className={`font-script ${item.script}`}>
                  {item.name}
                </span>
              </h2>
              <p className={`mt-[clamp(0px,0.92vw,14px)] font-body text-xl font-bold ${item.sub}`}>
                {item.title}
              </p>
              <div
                // Regular, not Medium: unlike the heading/subhead (each drawn
                // three times in the design), the body copy is single-drawn.
                className={`mt-[clamp(0px,2.32vw,35px)] space-y-[0.75em] font-body leading-[1.35] max-md:max-w-none max-md:text-base ${item.body} ${item.copyWidth}`}
              >
                {item.copy.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </div>

            <div>
              <p className={`font-script text-4xl ${item.tag}`}>
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
