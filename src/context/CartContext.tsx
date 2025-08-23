// CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { MenuItem } from "../pages/Menu";

export type CartItem = MenuItem & { quantity: number };

export type CartContextType = {
  cart: Record<string, CartItem>;
  addItem: (item: MenuItem) => void;
  removeItem: (item: MenuItem) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Record<string, CartItem>>({});

  // Load once from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save every time cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: {
          ...item,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
  };

  const removeItem = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev[item.id];
      if (!existing) return prev;

      if (existing.quantity <= 1) {
        const { [item.id]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [item.id]: { ...existing, quantity: existing.quantity - 1 },
      };
    });
  };

  const clearCart = () => setCart({});

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
