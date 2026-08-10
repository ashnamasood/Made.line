import Image from "next/image";
import Link from "next/link";

// Backdrops are near-identical creams in the design, not product-colour tints.
export const products = [
  { name: "slick", tint: "bg-[#f8f3e7]" },
  { name: "fresh", tint: "bg-[#f7f1e3]" },
  { name: "even", tint: "bg-[#f3ede2]" },
];

/** The three-up product row, shared by the home and shop pages. */
export function ProductRow() {
  return (
    <section className="grid md:grid-cols-3">
      {products.map((p, i) => {
        // Drawn as a shadow on the panel's left, not a border on the previous
        // panel's right: a border would narrow that column and drop its band,
        // and a right-hand shadow gets painted over by the next column.
        const divider = i > 0;
        return (
          <Link
            key={p.name}
            href={`/shop#${p.name}`}
            className="block bg-cream"
          >
            <div
              className={`${p.tint} ${
                divider ? "md:shadow-[-4px_0_0_0_#000]" : ""
              }`}
            >
              <Image
                src={`/products/${p.name}.jpg`}
                alt={`MADE.${p.name}`}
                width={706}
                height={941}
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className={`bg-ink px-8 py-14 text-center text-4xl text-cream md:py-16 md:text-[3.6vw] ${
                divider ? "md:shadow-[-4px_0_0_0_var(--color-cream)]" : ""
              }`}
            >
              <span className="font-display">MADE.</span>
              <span className="font-script">{p.name}</span>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
