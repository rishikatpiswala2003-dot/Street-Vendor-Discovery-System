import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';
import { OrdersProvider } from './context/OrdersContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import VendorList from './pages/VendorList';
import VendorDetail from './pages/VendorDetail';
import VendorMap from './pages/VendorMap';
import Login from './pages/Login';
// New imports - pages to be created
import UserDashboard from './pages/UserDashboard';
import Cart from './pages/Cart';
import VendorLogin from './pages/VendorLogin';
import VendorDashboard from './pages/VendorDashboard';

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <OrdersProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/vendors" element={<VendorList />} />
                <Route path="/vendors/:id" element={<VendorDetail />} />
                <Route path="/map" element={<VendorMap />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/vendor-login" element={<VendorLogin />} />
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/dashboard" element={<UserDashboard />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </OrdersProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

