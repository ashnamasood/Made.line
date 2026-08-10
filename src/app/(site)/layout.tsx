import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";

/**
 * Chrome for the public pages. Checkout and admin sit outside this group so
 * they render without the nav and footer.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
