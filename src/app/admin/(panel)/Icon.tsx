// Outline icons in the reference's style, drawn inline so the admin needs no
// icon package. 24-unit grid, stroked with currentColor.
const paths = {
  dashboard: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  orders:
    "M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6M9 20h.01M17 20h.01",
  messages: "M4 5h16v11H9l-5 4z",
  products:
    "M12 3 20 7.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12 4 7.5M12 12v9",
  money: "M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3S9.5 10.5 12 11s4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3",
  pending: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  menu: "M4 7h16M4 12h10M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  chevron: "M6 9l6 6 6-6",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}
