import React from 'react';
import { Link, useNavigate, useEffect } from 'react-router-dom';
import { Heart, MapPin, Clock, LogOut, User, ArrowRight, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { vendors } from '../data/vendors';
import VendorCard from '../components/VendorCard';
import './Dashboard.css';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { cart, getTotal } = useCart();
  const { getUserOrders } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'user') {
      navigate('/vendor-dashboard');
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: '3rem' }}>🔐</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>Sign in to view your dashboard</h2>
        <Link to="/login" className="btn-primary" id="dashboard-login-btn">Sign In</Link>
      </div>
    );
  }

  const favoriteVendors = vendors.filter(v => favorites.includes(v.id));
  const userOrders = getUserOrders(user.mobile);
  const joinDate = new Date(user.loginTime || Date.now());
  const joinStr = joinDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="dashboard page-wrapper">
      <div className="container">
        {/* Profile Hero */}
        <div className="dash-profile-card">
          <div className="profile-bg-glow" />
          <div className="profile-content">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="profile-info">
              <div className="profile-greeting">Welcome back! 👋</div>
              <h1 className="profile-name">{user.name}</h1>
              <div className="profile-meta">
                <span><MapPin size={13} /> {user.address || 'Kothrud, Pune'}</span>
                <span>·</span>
                <span><Clock size={13} /> Joined {joinStr}</span>
                <span>·</span>
                <span>📱 +91 {user.mobile}</span>
              </div>
            </div>
            <button
              className="profile-logout-btn"
              onClick={() => { logout(); navigate('/'); }}
              id="dashboard-logout-btn"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          {/* Stats row */}
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="pstat-value">{favorites.length}</div>
              <div className="pstat-label">Saved</div>
            </div>
            <div className="profile-stat">
              <div className="pstat-value">{vendors.filter(v => v.isOpen).length}</div>
              <div className="pstat-label">Open Now</div>
            </div>
            <div className="profile-stat">
              <div className="pstat-value">{cart.length}</div>
              <div className="pstat-label">Cart Items</div>
            </div>
            <div className="profile-stat">
              <div className="pstat-value">{userOrders.length}</div>
              <div className="pstat-label">Orders</div>
            </div>
          </div>
        </div>

        {/* Orders section */}
        <section className="dash-section">
          <div className="dash-section-header">
            <div>
              <h2 className="section-title" style={{ fontSize: '1.5rem' }}>
                <ShoppingCart size={20} style={{ color: 'var(--accent-orange)', verticalAlign: 'middle', marginRight: 8 }} />
                Your Orders
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
                {userOrders.length} recent order{userOrders.length !== 1 ? 's' : ''}
              </p>
            </div>
            {userOrders.length > 0 && (
              <Link to="/cart" className="btn-secondary" style={{ fontSize: '0.875rem', padding: '9px 18px' }}>
                View All <ArrowRight size={14} />
              </Link>
            )}
          </div>
          {userOrders.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-emoji">📦</div>
              <h3>No orders yet</h3>
              <p>Start exploring vendors and place your first order!</p>
              <Link to="/vendors" className="btn-primary" id="first-order-btn">
                Explore Vendors
              </Link>
            </div>
          ) : (
            <div className="orders-preview">
              {userOrders.slice(0, 3).map(order => (
                <div key={order.id} className="order-preview-card">
                  <div className="order-header">
                    <div className="order-vendor">{order.vendorName}</div>
                    <span className={`order-status ${order.status}`}>{order.status.toUpperCase()}</span>
                  </div>
                  <div className="order-items">
                    {order.items.map((it, i) => (
                      <div key={i} className="order-item-mini">
                        {it.item} x{it.quantity}
                      </div>
                    ))}
                  </div>
                  <div className="order-total">₹{order.total}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Saved vendors */}
        <section className="dash-section">
          <div className="dash-section-header">
            <div>
              <h2 className="section-title" style={{ fontSize: '1.5rem' }}>
                <Heart size={20} style={{ color: 'var(--accent-red)', verticalAlign: 'middle', marginRight: 8 }} />
                Saved Vendors
              </h2>
            </div>
            <Link to="/vendors" className="btn-secondary" style={{ fontSize: '0.875rem', padding: '9px 18px' }}>
              Discover More <ArrowRight size={14} />
            </Link>
          </div>
          {favoriteVendors.length > 0 ? (
            <div className="dash-vendors-grid">
              {favoriteVendors.map(v => <VendorCard key={v.id} vendor={v} />)}
            </div>
          ) : (
            <div className="dash-empty">
              <div className="dash-empty-emoji">💔</div>
              <h3>No favorites yet</h3>
              <p>Browse vendors and tap the heart icon to save them here!</p>
              <Link to="/vendors" className="btn-primary" id="browse-vendors-btn">
                Browse Vendors
              </Link>
            </div>
          )}
        </section>

        {/* Quick links */}
        <section className="dash-section">
          <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 20 }}>
            Quick Actions
          </h2>
          <div className="quick-links-grid">
            <Link to="/vendors" className="quick-link-card" id="ql-discover">
              <span className="ql-emoji">🔍</span>
              <div>
                <div className="ql-title">Discover Vendors</div>
                <div className="ql-sub">Browse all vendors</div>
              </div>
              <ArrowRight size={18} className="ql-arrow" />
            </Link>
            <Link to="/cart" className="quick-link-card" id="ql-cart">
              <span className="ql-emoji">🛒</span>
              <div>
                <div className="ql-title">Your Cart</div>
                <div className="ql-sub">₹{getTotal().toFixed(0)} in cart</div>
              </div>
              <ArrowRight size={18} className="ql-arrow" />
            </Link>
            <Link to="/map" className="quick-link-card" id="ql-map">
              <span className="ql-emoji">🗺️</span>
              <div>
                <div className="ql-title">Map View</div>
                <div className="ql-sub">See vendors near you</div>
              </div>
              <ArrowRight size={18} className="ql-arrow" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

