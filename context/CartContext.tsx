"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedCouleur?: string[];
}

type AddToCartInput = Omit<CartItem, "quantity"> & { quantity?: number };

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  addToCart: (item: AddToCartInput) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const readStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem("cart");
    if (!saved) return [];
    return JSON.parse(saved).map((i: CartItem) => ({
      ...i,
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
    }));
  } catch {
    localStorage.removeItem("cart");
    return [];
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Chargement initial depuis le localStorage
  useEffect(() => {
    setCart(readStorage());
    setHydrated(true);

    // Synchronisation si le panier change dans un autre onglet
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") setCart(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Sauvegarde (seulement après le chargement initial)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart = (item: AddToCartInput) => {
    const qty = Math.max(1, Number(item.quantity) || 1);

    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantity: p.quantity + qty,
                selectedCouleur: item.selectedCouleur ?? p.selectedCouleur,
              }
            : p
        );
      }

      const { quantity: _ignored, ...rest } = item;
      return [...prev, { ...rest, quantity: qty }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};