import React, { createContext, useContext, useState, useEffect } from 'react';
import { vendors } from '../data/vendors';
import { useAuth } from './AuthContext';

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('sb_orders');
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sb_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (cartItems, vendorId) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;
    
    const { user } = useAuth();
    const newOrder = {
      id: Date.now(),
      userMobile: user.mobile,
      vendorId,
      vendorName: vendor.name,
      items: [...cartItems],
      total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      timestamp: new Date().toISOString(),
      address: user.address
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
    ));
  };

  const getUserOrders = (mobile) => orders.filter(o => o.userMobile === mobile);
  const getVendorOrders = (vendorId) => orders.filter(o => o.vendorId === vendorId);

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, updateOrderStatus, getUserOrders, getVendorOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export const useOrders = () => useContext(OrdersContext);

