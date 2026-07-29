import Link from "next/link";
import { Wordmark } from "./Logo";

const navigate = [
  ["Shop", "/shop"],
  ["Our Story", "/our-story"],
  ["Rhode Futures", "/futures"],
  ["Impact", "/impact"],
  ["VLOG", "/vlog"],
  ["Where to Find Us", "/stockists"],
];

const social = [
  ["Instagram", "https://instagram.com"],
  ["TikTok", "https://tiktok.com"],
  ["Pinterest", "https://pinterest.com"],
];

export function Footer() {
  return (
    <footer className="bg-cream px-6 pb-14 pt-20 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <Wordmark className="h-[14vw] max-h-[220px]" />

        <div className="mt-16 flex flex-wrap gap-16 text-lg font-bold md:gap-32">
          <div>
            <h2 className="mb-6 uppercase">Navigate</h2>
            <ul className="space-y-1">
              {navigate.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:opacity-60">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-6 uppercase">Social</h2>
            <ul className="space-y-1">
              {social.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:opacity-60">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-20 text-xs uppercase tracking-widest text-ink/50">
          © {new Date().getFullYear()} MADE.line
        </p>
      </div>
    </footer>
  );
}
