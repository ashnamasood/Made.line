import Image from "next/image";
import { Monogram } from "@/components/Logo";

/** The admin's photo, or the M. monogram when none is set. */
export function Avatar({ src, className }: { src: string | null; className: string }) {
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-butter/60 ${className}`}>
      {src ? (
        <Image src={src} alt="" fill sizes="96px" className="object-cover" />
      ) : (
        // The monogram is brown artwork; flip it to light on the dark theme.
        <Monogram className="h-[36%] dark:brightness-0 dark:invert" />
      )}
    </span>
  );
}
