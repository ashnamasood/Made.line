import Link from "next/link";

const faqs: { q: string; a: string[] }[] = [
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
];

export default function Faqs() {
  return (
    <div data-bg="cream">
      <div className="mx-auto max-w-[900px] px-6 py-16 md:py-[6vw]">
        <h1 className="text-center font-display text-[clamp(2rem,8vw,3.5rem)] uppercase leading-none md:text-[4.4vw]">
          Frequently Asked Questions
        </h1>

        <p className="mx-auto mt-6 max-w-[56ch] text-center font-body font-medium leading-[1.45] md:mt-[2.5vw] md:text-[1.35vw]">
          Everything you need to know about MADE.line, our products, and
          finding what works for you.
        </p>

        <div className="mt-10 divide-y divide-ink/15 rounded-2xl bg-white md:mt-[3.5vw]">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group px-6 py-5 md:px-10 md:py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-base uppercase leading-snug tracking-wide [&::-webkit-details-marker]:hidden md:text-[1.15vw]">
                {q}
                <span className="relative h-4 w-4 shrink-0 md:h-[1.1vw] md:w-[1.1vw]">
                  <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-ink" />
                  <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-ink transition-transform duration-200 group-open:rotate-90" />
                </span>
              </summary>
              <div className="mt-4 max-w-[64ch] space-y-3 font-body leading-[1.5] text-ink/80 md:text-[1.05vw]">
                {a.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </details>
          ))}

          <details className="group px-6 py-5 md:px-10 md:py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-base uppercase leading-snug tracking-wide [&::-webkit-details-marker]:hidden md:text-[1.15vw]">
              How can I contact MADE.line?
              <span className="relative h-4 w-4 shrink-0 md:h-[1.1vw] md:w-[1.1vw]">
                <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-ink" />
                <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-ink transition-transform duration-200 group-open:rotate-90" />
              </span>
            </summary>
            <div className="mt-4 max-w-[64ch] space-y-3 font-body leading-[1.5] text-ink/80 md:text-[1.05vw]">
              <p>
                Need help choosing your MADE.even shade, have a question
                about your order, or just want to say hi?
              </p>
              <p>
                <Link href="/contact" className="underline hover:opacity-60">
                  Reach out through our contact page
                </Link>{" "}
                — we’d love to hear from you.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
