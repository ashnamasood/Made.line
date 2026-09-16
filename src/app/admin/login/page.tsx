import type { Metadata } from "next";
import { Suspense } from "react";
import { Monogram, Wordmark } from "@/components/Logo";
import { ThemeToggle } from "../_shared/ThemeToggle";
import { isDarkTheme } from "../_shared/theme";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in — MADE.line admin" };

export default async function Login() {
  const dark = await isDarkTheme();
  return (
    <div
      className={`admin-theme grid min-h-screen bg-white font-body text-ink lg:grid-cols-2 ${dark ? "dark" : ""}`}
    >
      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Wordmark className="h-8 dark:brightness-0 dark:invert" priority />
          <h1 className="mt-12 text-4xl font-bold">Sign In</h1>
          <p className="mt-2 text-ink/60">Enter your username and password to sign in.</p>
          {/* useSearchParams needs a Suspense boundary to prerender this route. */}
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </main>

      {/* Brand panel. A fixed brown, not the ink token, which turns light in
          dark mode. The faint grid is two repeating gradients. */}
      <aside
        aria-hidden
        className="relative hidden place-items-center overflow-hidden bg-[#4a2313] lg:grid"
        style={{
          backgroundImage:
            "linear-gradient(rgb(247 240 225 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(247 240 225 / 0.07) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          backgroundPosition: "center",
        }}
      >
        <div className="grid size-80 place-items-center rounded-full bg-[#f0dd9a]">
          <Monogram className="h-28" />
        </div>
      </aside>

      <ThemeToggle
        initialDark={dark}
        className="fixed bottom-6 right-6 size-14 border-0 bg-butter shadow-lg"
      />
    </div>
  );
}
