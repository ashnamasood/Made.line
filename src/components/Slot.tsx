/** Placeholder for artwork not supplied yet. Delete once the real <Image> goes in. */
export function Slot({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-ink/30 bg-ink/[0.04] text-center text-xs uppercase tracking-[0.2em] text-ink/50 ${className}`}
    >
      {label}
    </div>
  );
}
