import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, CheckCircle, XCircle, Clock, MapPin, Phone, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { vendors } from '../data/vendors';
import './VendorDashboard.css'; // New

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const { getVendorOrders, updateOrderStatus } = useOrders();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login');
      return;
    }
    const v = vendors.find(v => v.ownerMobile === user.mobile);
    if (v) {
      setVendor(v);
      const vendorOrders = getVendorOrders(v.id);
      setOrders(vendorOrders);
    }
  }, [user, navigate]);

  if (!vendor) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: 120 }}>
        <div style={{ fontSize: '4rem' }}>🏪</div>
        <h2>Vendor not found</h2>
        <p>Login with your registered vendor mobile</p>
        <Link to="/vendor-login" className="btn-primary">Vendor Login</Link>
      </div>
    );
  }

  const handleStatusUpdate = (orderId, status) => {
    updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const pendingOrders = orders.filter(o => o.status === 'pending');

  return (
    <div className="vendor-dash page-wrapper">
      <div className="container">
        <div className="vd-profile">
          <div className="vd-avatar">{vendor.emoji}</div>
          <div>
            <h1>{vendor.name}</h1>
            <p>{vendor.location} • ₹{vendor.priceRange}</p>
          </div>
          <button onClick={() => logout()} className="logout-btn">
            <LogOut />
            Logout
          </button>
        </div>

        <div className="stats-row">
          <div className="stat">
            <div className="stat-num">{pendingOrders.length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat">
            <div className="stat-num">{orders.filter(o => o.status === 'accepted').length}</div>
            <div className="stat-label">Accepted</div>
          </div>
          <div className="stat">
            <div className="stat-num">{orders.filter(o => o.status === 'rejected').length}</div>
            <div className="stat-label">Rejected</div>
          </div>
          <div className="stat">
            <div className="stat-num">{orders.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>

        <div className="orders-section">
          <h2>Pending Orders</h2>
          {pendingOrders.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={48} />
              <p>No pending orders. All caught up! 🚀</p>
            </div>
          ) : (
            pendingOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-info">
                  <div className="customer">{order.userMobile} • {order.address}</div>
                  <div className="order-time">{new Date(order.timestamp).toLocaleString()}</div>
                  <div className="order-items">
                    {order.items.map((it, i) => (
                      <div key={i}>{it.item} x{it.quantity}</div>
                    ))}
                  </div>
                  <div className="order-total">Total: ₹{order.total}</div>
                </div>
                <div className="order-actions">
                  <button className="btn-accept" onClick={() => handleStatusUpdate(order.id, 'accepted')}>
                    <CheckCircle size={20} />
                    Accept
                  </button>
                  <button className="btn-reject" onClick={() => handleStatusUpdate(order.id, 'rejected')}>
                    <XCircle size={20} />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

