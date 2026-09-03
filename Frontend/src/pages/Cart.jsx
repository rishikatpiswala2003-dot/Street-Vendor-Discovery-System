import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { vendors } from '../data/vendors';
import './Cart.css';  // To be created

export default function Cart() {
  const { cart, removeItem, updateQuantity, clearCart, getTotal } = useCart();
  const { placeOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: 120 }}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2 style={{ fontFamily: 'var(--font-display)' }}>Your Cart</h2>
        <p style={{ color: 'var(--text-muted)' }}>Sign in to view your cart</p>
        <Link to="/login" className="btn-primary" style={{ marginTop: 20 }}>Sign In</Link>
      </div>
    );
  }

  // Group cart by vendor
  const cartByVendor = cart.reduce((acc, item) => {
    const vendor = vendors.find(v => v.id === item.vendorId);
    if (!acc[item.vendorId]) {
      acc[item.vendorId] = { vendor, items: [] };
    }
    acc[item.vendorId].items.push(item);
    return acc;
  }, {});

  const checkout = () => {
    Object.keys(cartByVendor).forEach(vendorId => {
      const vendorCart = cartByVendor[vendorId];
      placeOrder(vendorCart.items, parseInt(vendorId));
    });
    clearCart();
    navigate('/dashboard');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty page-wrapper">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Browse vendors and add items to get started!</p>
        <Link to="/vendors" className="btn-primary">Find Food</Link>
      </div>
    );
  }

  return (
    <div className="cart page-wrapper">
      <div className="container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="cart-title">Your Cart</h1>
        </div>

        <div className="cart-vendors">
          {Object.values(cartByVendor).map(({ vendor, items }) => (
            <div key={vendor.id} className="cart-vendor-section">
              <div className="cart-vendor-header">
                <span className="cart-vendor-name">{vendor.name}</span>
                <span className="cart-vendor-total">₹{items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(0)}</span>
              </div>

              {items.map((item, i) => (
                <div key={i} className="cart-item">
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.item}</div>
                    <div className="cart-item-price">₹{item.price} each</div>
                  </div>
                  <div className="cart-item-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.vendorId, item.item, item.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <span className="qty">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.vendorId, item.item, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                    <button className="remove-btn" onClick={() => removeItem(item.vendorId, item.item)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="cart-item-total">₹{(item.price * item.quantity).toFixed(0)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            Total: ₹{getTotal().toFixed(0)}
          </div>
          <button className="checkout-btn" onClick={checkout} id="checkout-btn">
            <CreditCard size={20} />
            Checkout & Place Order
          </button>
          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

