/**
 * Wordmark. Type-based stand-in for the supplied brand files.
 * Swap for the real asset by replacing the body with:
 *   <Image src="/logos/wordmark.svg" alt="MADE.line" width={180} height={40} priority />
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline leading-none ${className}`}>
      <span className="font-display tracking-tight">MADE.</span>
      <span className="font-script font-normal">line</span>
    </span>
  );
}

/** The "M." monogram mark. */
export function Monogram({ className = "" }: { className?: string }) {
  return <span className={`font-display leading-none ${className}`}>M.</span>;
}
