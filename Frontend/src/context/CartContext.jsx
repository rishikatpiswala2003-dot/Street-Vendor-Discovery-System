import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('sb_cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sb_cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (newItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.vendorId === newItem.vendorId && item.item === newItem.item);
      if (existing) {
        return prev.map(item =>
          item.vendorId === newItem.vendorId && item.item === newItem.item
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (vendorId, itemName) => {
    setCart(prev => prev.filter(item => !(item.vendorId === vendorId && item.item === itemName)));
  };

  const updateQuantity = (vendorId, itemName, quantity) => {
    if (quantity <= 0) {
      removeItem(vendorId, itemName);
      return;
    }
    setCart(prev => prev.map(item =>
      item.vendorId === vendorId && item.item === itemName
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  const getTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

