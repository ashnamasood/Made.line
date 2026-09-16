"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Monogram, Wordmark } from "@/components/Logo";
import { logout } from "../login/actions";
import { Icon, type IconName } from "./Icon";

const menu: [href: string, label: string, icon: IconName][] = [
  ["/admin", "Dashboard", "dashboard"],
  ["/admin/orders", "Orders", "orders"],
  ["/admin/messages", "Messages", "messages"],
  ["/admin/products", "Products", "products"],
];

/** Sidebar + top bar around every panel page. Client-side only for the active link and the phone menu. */
export function Chrome({ user, children }: { user: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f3] font-body text-ink">
      {/* Phones get the sidebar as a drawer over a dimmed page. */}
      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
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
            <Wordmark className="h-7" />
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
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3 md:px-8">
          <button
            aria-label="Open menu"
            className="rounded-xl border border-ink/15 p-2.5 lg:invisible"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </button>

          <details className="relative">
            <summary className="flex cursor-pointer list-none items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-butter/60">
                <Monogram className="h-4" />
              </span>
              <span className="hidden font-bold sm:inline">{user}</span>
              <Icon name="chevron" className="size-4" />
            </summary>
            <form
              action={logout}
              className="absolute right-0 mt-2 w-44 rounded-xl border border-ink/10 bg-white p-2 shadow-lg"
            >
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-ink/5"
              >
                Sign out
              </button>
            </form>
          </details>
        </header>

        <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
