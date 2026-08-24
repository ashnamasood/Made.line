import Image from "next/image";
import Link from "next/link";

/**
 * Grouped the way the reference lays them out: a category list on the left,
 * and the questions for every category stacked down the right.
 */
const groups: { id: string; title: string; items: { q: string; a: string[] }[] }[] = [
  {
    id: "about",
    title: "About MADE.line",
    items: [
      {
        q: "Who is MADE.line for?",
        a: [
          "Anyone and everyone who wants their hair to feel a little more MADE up without needing a salon appointment to get there.",
          "Whether you’re covering your first few greys, stretching out your colour appointment, taming those never-ending flyaways or refreshing day-three hair, MADE.line is designed to make those little in-between hair moments easier.",
          "Whatever your hair is doing, there’s something in the line-up for you.",
        ],
      },
      {
        q: "Is there a recommended age for MADE.line products?",
        a: [
          "Not at all. Good hair doesn’t have an age limit.",
          "MADE.line was created for every stage of life — from discovering your first grey at 21 to covering greys you’ve been colouring for decades.",
          "If it solves a hair problem for you, it’s MADE for you.",
        ],
      },
      {
        q: "What makes MADE.line different?",
        a: [
          "MADE.line was born from over a decade of real conversations behind the salon chair.",
          "These aren’t products created just to look pretty on your bathroom shelf. They’re designed around the little hair problems we actually experience — visible greys, overdue colour appointments, oily roots, stubborn flyaways and everything in between.",
          "Professional knowledge is behind every product, with formulas designed to perform and packaging beautiful enough to earn a permanent place in your handbag.",
        ],
      },
      {
        q: "Do I need to be good at doing my own hair?",
        a: [
          "Definitely not — quite the opposite.",
          "Every MADE.line product is designed to be uncomplicated, quick and easy to use, with no professional hair skills required.",
          "The whole purpose of the range is to make your hair routine and your life that little bit easier.",
        ],
      },
      {
        q: "Are MADE.line products only for women?",
        a: ["Nope. Hair is hair. If you’ve got it, you’re invited."],
      },
      {
        q: "Are MADE.line products salon products?",
        a: [
          "Think professional knowledge, made for real life.",
          "MADE.line combines years of professional hair experience with products designed to be genuinely easy to use in your everyday routine.",
          "You don’t need to be standing behind a salon chair to get the best out of them — that’s exactly the point.",
        ],
      },
    ],
  },
  {
    id: "made-even",
    title: "MADE.even",
    items: [
      {
        q: "How do I choose my MADE.even shade?",
        a: [
          "Match MADE.even to your natural or coloured root area, rather than the lighter pieces through your ends.",
          "If you’re sitting between two shades, we recommend going approximately half a shade darker rather than lighter. This generally provides better grey coverage while helping the product blend naturally through your root area.",
          "Still unsure? Reach out to us — we’re always happy to help with a shade match.",
        ],
      },
      {
        q: "What if I choose the wrong MADE.even shade?",
        a: [
          "Don’t panic! MADE.even isn’t permanent hair colour and is designed to simply wash out when you shampoo.",
          "Take a look at our shade guide before purchasing, or contact our team if you need a little help finding your perfect match.",
        ],
      },
      {
        q: "Do I need to have grey hair to use MADE.even?",
        a: [
          "Not at all.",
          "While grey coverage was a big part of the inspiration behind MADE.even, it can do so much more.",
          "Use it to soften visible regrowth, disguise sparse or finer-looking areas, create the appearance of a fuller hairline, or simply make your root area look more even between colour appointments.",
        ],
      },
      {
        q: "Will MADE.even cover stubborn greys?",
        a: [
          "That’s exactly what it was designed to do — whilst you won’t get 100% coverage like an in-salon colour, you’ll get a blend that’ll last you until that time comes.",
          "For more resistant areas, particularly around the hairline and temples, build MADE.even gradually until you reach your desired coverage.",
          "For the best result, allow the product to dry between applications before adding another layer.",
        ],
      },
      {
        q: "Will MADE.even replace my salon colour?",
        a: [
          "We’d never do that to your hairdresser.",
          "MADE.even is the in-between, not the replacement.",
          "It’s designed to give you confidence through those final days or weeks before your next colour appointment, then simply wash away when it’s time for the real thing.",
        ],
      },
      {
        q: "Can I use MADE.even every day?",
        a: [
          "Absolutely. MADE.even is designed for temporary, as-needed coverage.",
          "Apply it whenever you need a little help, then shampoo it out as normal when you’re ready.",
        ],
      },
      {
        q: "Will MADE.even affect my next colour appointment?",
        a: [
          "MADE.even is temporary and designed to wash from the hair.",
          "Before your salon colour appointment, we recommend thoroughly shampooing your hair twice to ensure any remaining product has been removed before your colour service.",
        ],
      },
    ],
  },
  {
    id: "orders",
    title: "Orders and Stockists",
    items: [
      {
        q: "Where are MADE.line products made?",
        a: ["MADE.line products are proudly manufactured in Adelaide, South Australia."],
      },
      {
        q: "Is MADE.line Australian owned?",
        a: [
          "Absolutely.",
          "MADE.line is proudly Australian owned, founded in Adelaide, South Australia, and created from more than a decade of experience behind the salon chair.",
        ],
      },
      {
        q: "Where can I buy MADE.line?",
        a: [
          "For now, MADE.line is exclusively available online, with shipping Australia-wide.",
          "But we’ve got bigger plans… so stay tuned.",
        ],
      },
    ],
  },
];

// The rail lists every section, including the plain Contact Us block that has
// no accordion of its own.
const rail = [...groups.map(({ id, title }) => ({ id, title })), { id: "contact-us", title: "Contact Us" }];

export default function Faqs() {
  return (
    <div data-bg="cream">
      {/* Same gutter and radius as the other page-top cards. The source is a
          portrait shot, so the container does the cropping: near-square on
          phones, a wide banner from md up. The 22% offset keeps the crown off
          the top edge while holding the hair waves in frame. */}
      <section className="p-2 md:px-[2vw] md:pb-[1vw] md:pt-[1vw]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[4/3] md:aspect-[16/9]">
          <Image
            src="/images/faq-hero.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-[50%_22%]"
          />
          {/* The photo runs light-grey to dark-brown, so white type needs a
              floor under it. Scrim only, no colour cast. */}
          <div className="absolute inset-0 bg-black/15" />
          <h1 className="absolute inset-0 grid place-items-center px-6 text-center font-sans text-[clamp(1.75rem,7vw,3rem)] font-bold leading-tight text-white md:text-[3.6vw]">
            You Got Any Questions?
          </h1>
        </div>
      </section>

      <p className="mx-auto max-w-[56ch] px-6 pb-6 pt-6 text-center font-body font-medium leading-[1.45] md:pb-[1.8vw] md:pt-[1.6vw] md:text-[1.35vw]">
        Everything you need to know about MADE.line, our products, and finding
        what works for you.
      </p>

      <div className="grid gap-6 px-2 pb-16 md:grid-cols-[1fr_1.94fr] md:gap-[2vw] md:px-[2vw] md:pb-[6vw]">
        {/* Category rail. Anchors only — the dot follows the jump, not free
            scrolling. ponytail: scroll-spy needs an observer, add it if the
            client asks for the dot to track while scrolling. */}
        <nav className="faq-nav h-max rounded-2xl bg-white px-6 py-8 md:sticky md:top-[2vw] md:px-[2.2vw] md:py-[2.6vw]">
          <h2 className="font-display text-2xl uppercase md:text-[2.4vw]">FAQ</h2>
          <ul className="mt-6 space-y-4 md:mt-[2vw] md:space-y-[1.3vw]">
            {rail.map(({ id, title }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="font-display text-sm uppercase tracking-wide hover:opacity-60 md:text-[1.3vw]"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rounded-2xl bg-white px-6 py-8 md:px-[2.6vw] md:py-[2.6vw]">
          {groups.map(({ id, title, items }) => (
            <section key={id} id={id} className="scroll-mt-6 pt-8 first:pt-0 md:pt-[3vw]">
              <h2 className="font-display text-xl uppercase md:text-[2.1vw]">
                {title}
              </h2>
              <div className="mt-5 border-t border-ink/15 md:mt-[1.6vw]">
                {items.map(({ q, a }) => (
                  <details key={q} className="group border-b border-ink/15 py-4 md:py-[1.15vw]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-sm uppercase leading-snug tracking-wide [&::-webkit-details-marker]:hidden md:text-[1.15vw]">
                      {q}
                      {/* Circled plus that turns into a minus, as the reference draws it. */}
                      <span className="relative grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink/50 md:h-[1.7vw] md:w-[1.7vw]">
                        <span className="h-[1.5px] w-1/2 bg-ink" />
                        <span className="absolute h-1/2 w-[1.5px] bg-ink transition-transform duration-200 group-open:rotate-90" />
                      </span>
                    </summary>
                    <div className="mt-3 max-w-[64ch] space-y-3 font-body leading-[1.5] text-ink/80 md:mt-[0.9vw] md:text-[1.05vw]">
                      {a.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <section id="contact-us" className="scroll-mt-6 pt-8 md:pt-[3vw]">
            <h2 className="font-display text-xl uppercase md:text-[2.1vw]">
              Contact Us
            </h2>
            <p className="mt-5 max-w-[64ch] font-body leading-[1.5] text-ink/80 md:mt-[1.6vw] md:text-[1.05vw]">
              Need help choosing your MADE.even shade, have a question about
              your order, or just want to say hi?{" "}
              <Link href="/contact" className="underline hover:opacity-60">
                Reach out through our contact page
              </Link>{" "}
              — we’d love to hear from you.
            </p>
          </section>
        </div>
      </div>

      {/* Rules are generated from `groups` so the ids can never drift apart. */}
      <style>
        {`.faq-nav a::before{content:"•";margin-right:.5em;opacity:0}
          .faq-nav a:hover::before{opacity:.4}
          body:not(:has([id]:target)) .faq-nav li:first-child a::before,
          ${rail
            .map(({ id }) => `body:has(#${id}:target) .faq-nav a[href="#${id}"]::before`)
            .join(",")}{opacity:1}`}
      </style>
    </div>
  );
}
