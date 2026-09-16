"use client";

import { useState } from "react";
import { Icon } from "./Icon";

/**
 * Flips the admin between light and dark. Toggles the class straight away for
 * an instant switch and stores the choice in a cookie, which the server reads
 * on the next render. The cookie name matches THEME_COOKIE in theme.ts.
 */
export function ThemeToggle({ initialDark, className = "" }: { initialDark: boolean; className?: string }) {
  const [dark, setDark] = useState(initialDark);
  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      className={`grid size-11 place-items-center rounded-full border border-ink/15 hover:border-ink/40 ${className}`}
      onClick={() => {
        const next = !dark;
        document.querySelector(".admin-theme")?.classList.toggle("dark", next);
        document.cookie = `admin_theme=${next ? "dark" : "light"}; path=/admin; max-age=31536000; samesite=lax`;
        setDark(next);
      }}
    >
      <Icon name={dark ? "sun" : "moon"} />
    </button>
  );
}
