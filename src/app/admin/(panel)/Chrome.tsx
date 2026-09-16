"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/Logo";
import type { Account } from "@/lib/account";
import { Avatar } from "../_shared/Avatar";
import { Icon, type IconName } from "../_shared/Icon";
import { ThemeToggle } from "../_shared/ThemeToggle";
import { logout } from "../login/actions";

const menu: [href: string, label: string, icon: IconName][] = [
  ["/admin", "Dashboard", "dashboard"],
  ["/admin/orders", "Orders", "orders"],
  ["/admin/messages", "Contact Form", "messages"],
  ["/admin/products", "Products", "products"],
  ["/admin/settings", "Settings", "settings"],
];

/**
 * Sidebar + top bar around every panel page. Client-side only for the active
 * link and the phone menu. `admin-theme` scopes the dark palette in globals.css.
 */
export function Chrome({
  account,
  dark,
  children,
}: {
  account: Account;
  dark: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className={`admin-theme min-h-screen bg-canvas font-body text-ink ${dark ? "dark" : ""}`}>
      {/* Phones get the sidebar as a drawer over a dimmed page. */}
      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-ink/10 bg-white px-5 py-8 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/admin" onClick={() => setOpen(false)}>
            <Wordmark className="h-7 dark:brightness-0 dark:invert" />
          </Link>
          <button
            aria-label="Close menu"
            className="rounded-lg p-1 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>

        <p className="mt-10 px-3 text-xs uppercase tracking-wider text-ink/50">Menu</p>
        <nav className="mt-3 space-y-1">
          {menu.map(([href, label, icon]) => {
            // Dashboard only on its exact path, or it would light up everywhere.
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
                  active ? "bg-butter/50 font-bold" : "text-ink/80 hover:bg-ink/5"
                }`}
              >
                <Icon name={icon} className="size-6" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-3 md:px-8">
          <button
            aria-label="Open menu"
            className="rounded-xl border border-ink/15 p-2.5 lg:invisible"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>

          <div className="flex items-center gap-3">
            <ThemeToggle initialDark={dark} />
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full py-1 pl-1 pr-2 hover:bg-ink/5">
                <Avatar src={account.avatar} className="size-11" />
                <span className="hidden max-w-48 truncate font-bold sm:inline">{account.name}</span>
                <Icon name="chevron" className="size-4" />
              </summary>
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-ink/10 bg-white p-2 shadow-lg">
                <p className="truncate px-3 pb-2 pt-1 text-sm text-ink/50">@{account.username}</p>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-ink/5"
                >
                  <Icon name="settings" className="size-4" />
                  Profile settings
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-ink/5"
                  >
                    <Icon name="logout" className="size-4" />
                    Sign out
                  </button>
                </form>
              </div>
            </details>
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
