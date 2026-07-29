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
  return (
    <header className="sticky top-0 z-50 bg-peri">
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-4 md:px-10">
        <Link href="/" aria-label="MADE.line home">
          <Wordmark className="h-6 md:h-8" priority />
        </Link>
        <ul className="hidden items-center gap-8 text-sm font-bold uppercase tracking-wide md:flex lg:gap-14 lg:text-base">
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
