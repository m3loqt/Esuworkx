"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  image: string | null;
  price: string;
  quantity: number;
  maxQuantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "esuworks_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage, which doesn't exist during SSR —
    // has to run post-mount, not as lazy useState initial value.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // corrupted storage, start empty
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, item.maxQuantity);
        return prev.map((i) => (i.productId === item.productId ? { ...i, quantity: nextQuantity } : i));
      }
      return [...prev, { ...item, quantity: Math.min(quantity, item.maxQuantity) }];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(Math.max(quantity, 1), i.maxQuantity) }
          : i,
      ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    isCartOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
