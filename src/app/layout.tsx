import type { Metadata } from "next";
import localFont from "next/font/local";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
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

// The design's UI face. Only 400 and 700 exist, so nothing heavier than bold
// should be asked for — the browser would fake it.
// Body copy on the story page.
const archivo = localFont({
  src: [
    { path: "../fonts/Archivo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Archivo-Italic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/Archivo-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Archivo-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../fonts/Archivo-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-archivo",
  display: "swap",
});

const alteHaas = localFont({
  src: [
    { path: "../fonts/AlteHaasGroteskRegular.ttf", weight: "400" },
    { path: "../fonts/AlteHaasGroteskBold.ttf", weight: "700" },
  ],
  variable: "--font-alte-haas",
  display: "swap",
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
      className={`${ttCommons.variable} ${catchye.variable} ${alteHaas.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
