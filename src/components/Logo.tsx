import Image from "next/image";

/** MADE.line wordmark. Size it with a height class; width follows. */
export function Wordmark({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logos/wordmark.png"
      alt="MADE.line"
      width={917}
      height={150}
      priority={priority}
      className={`w-auto ${className}`}
    />
  );
}

/** The "M." monogram. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/logos/monogram.png"
      alt=""
      width={266}
      height={179}
      className={`w-auto ${className}`}
    />
  );
}
