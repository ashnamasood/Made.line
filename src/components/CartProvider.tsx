"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { PRODUCTS, isProductId, type ProductId } from "@/lib/products";

export type CartLine = { id: ProductId; qty: number };

type CartState = {
  lines: CartLine[];
  open: boolean;
  count: number;
  subtotal: number;
  add: (id: ProductId) => void;
  setQty: (id: ProductId, qty: number) => void;
  setOpen: (open: boolean) => void;
  clear: () => void;
};

const Cart = createContext<CartState | null>(null);
const KEY = "madeline.cart";

export function useCart() {
  const ctx = useContext(Cart);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  // Read after mount, not during render: the server has no localStorage, and
  // seeding initial state from it would mismatch the prerendered HTML.
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) {
        setLines(
          saved.filter(
            (l): l is CartLine =>
              !!l && isProductId(l.id) && Number.isFinite(l.qty) && l.qty > 0,
          ),
        );
      }
    } catch {
      // Corrupt or unavailable storage just starts an empty cart.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      // Private mode etc. — the cart still works for this session.
    }
  }, [lines]);

  const add = (id: ProductId) =>
    setLines((prev) => {
      const hit = prev.find((l) => l.id === id);
      return hit
        ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
        : [...prev, { id, qty: 1 }];
    });

  const setQty = (id: ProductId, qty: number) =>
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce(
    (n, l) => n + PRODUCTS[l.id].price * l.qty,
    0,
  );

  return (
    <Cart.Provider
      value={{
        lines,
        open,
        count,
        subtotal,
        add,
        setQty,
        setOpen,
        clear: () => setLines([]),
      }}
    >
      {children}
    </Cart.Provider>
  );
}
