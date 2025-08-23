// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
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
  // ✅ Hydrate immediately from localStorage (avoids flash/empty on refresh)
  const [cart, setCart] = useState<Record<string, CartItem>>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // ✅ Persist to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: existing
          ? { ...existing, quantity: existing.quantity + 1 }
          : { ...item, quantity: 1 },
      };
    });
  };

  const removeItem = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev[item.id];
      if (!existing) return prev;

      if (existing.quantity <= 1) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }

      return {
        ...prev,
        [item.id]: { ...existing, quantity: existing.quantity - 1 },
      };
    });
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
