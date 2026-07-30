import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

// The design's own faces: TT Commons Pro Black sets "MADE." and Catchye the
// script half. Both are demo cuts — licence them before a commercial launch.
const ttCommons = localFont({
  src: "../fonts/TTCommonsPro-Black.otf",
  variable: "--font-tt-commons",
  display: "swap",
});

const catchye = localFont({
  src: "../fonts/Catchye.otf",
  variable: "--font-catchye",
  display: "swap",
});

// Stand-in for the design's Alte Haas Grotesk Bold — same neo-grotesk family
// of shapes. Replace with next/font/local once the real file is in src/fonts.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MADE.line",
  description: "Created for effortless touchups anytime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ttCommons.variable} ${catchye.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
