import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export interface CartItem {
  serviceId: string;
  businessId: string;
  businessName: string;
  serviceName: string;
  price: number;
  quantity: number; // Number of people
  duration: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (serviceId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const STORAGE_KEY = 'ndlela_cart_items';
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore persistence errors
    }
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.serviceId === item.serviceId);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((i) =>
          i.serviceId === item.serviceId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      
      // Add new item
      return [...prevItems, { ...item, quantity }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.serviceId !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.serviceId === serviceId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const isInCart = (serviceId: string) => {
    return items.some((item) => item.serviceId === serviceId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
