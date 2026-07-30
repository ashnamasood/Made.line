import Link from "next/link";
import { Wordmark } from "./Logo";

const links = [
  ["Shop", "/shop"],
  ["Our Story", "/our-story"],
  ["FAQs", "/faqs"],
  ["Cart", "/cart"],
  ["Contact", "/contact"],
];

export function Nav() {
  // Inset to the same gutter as the hero card, and it scrolls away rather than sticking.
  return (
    <header className="px-2 pt-2 md:px-[2vw] md:pt-[1.5vw]">
      <nav className="flex items-center justify-between gap-6 bg-peri px-5 py-3 md:pl-4 md:pr-10">
        <Link href="/" aria-label="MADE.line home">
          <Wordmark className="h-6 md:h-8" priority />
        </Link>
        {/* 24.5pt on the design's 1366-wide canvas = 1.79% of the page. */}
        <ul className="hidden items-center gap-8 text-sm font-bold uppercase tracking-wide md:flex md:text-[1.79vw] lg:gap-14">
          {links.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="hover:opacity-60">
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none text-sm font-bold uppercase">
            Menu
          </summary>
          <ul className="absolute right-0 mt-3 w-44 space-y-3 bg-peri p-4 text-sm font-bold uppercase shadow-lg">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </details>
      </nav>
    </header>
  );
}
