import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Heart, Phone, Share2, Zap, ShoppingCart } from 'lucide-react';
import { vendors } from '../data/vendors';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import './VendorDetail.css';

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < Math.floor(rating) ? 'var(--accent-yellow)' : 'var(--text-muted)', fontSize: '1rem' }}>★</span>
      ))}
    </div>
  );
}

const MOCK_REVIEWS = [
  { id: 1, user: 'Priya M.', avatar: 'P', rating: 5, text: 'Absolutely the best vada pav I\'ve had outside Mumbai. The chutney is insane!', date: '2 days ago' },
  { id: 2, user: 'Rahul K.', avatar: 'R', rating: 4, text: 'Love coming here every morning. The food is fresh and service is quick.', date: '1 week ago' },
  { id: 3, user: 'Sneha T.', avatar: 'S', rating: 5, text: 'A hidden gem in Kothrud. Very consistent quality and super affordable!', date: '2 weeks ago' },
];

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggle, isFav } = useFavorites();
  const { addItem } = useCart();
  const vendor = vendors.find(v => v.id === Number(id));

  if (!vendor) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '120px' }}>
        <div style={{ fontSize: '4rem' }}>😢</div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginTop: 16 }}>Vendor not found</h2>
        <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/vendors')}>
          Back to Vendors
        </button>
      </div>
    );
  }

  const fav = isFav(vendor.id);

  const handleAddToCart = (item) => {
    addItem({
      vendorId: vendor.id,
      item: item.item,
      price: item.price
    });
  };

  return (
    <div className="vendor-detail page-wrapper">
      {/* Hero banner */}
      <div className="vd-hero" style={{ '--vendor-color': vendor.color }}>
        <div className="vd-hero-bg" />
        <div className="container vd-hero-content">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back
          </button>
          <div className="vd-hero-main">
            <div className="vd-hero-emoji-wrap">
              <span className="vd-hero-emoji">{vendor.emoji}</span>
            </div>
            <div className="vd-hero-info">
              <div className="vd-badges">
                <span className={`badge ${vendor.isOpen ? 'badge-open' : 'badge-closed'}`}>
                  {vendor.isOpen ? '● Open Now' : '● Closed'}
                </span>
                {vendor.featured && <span className="badge badge-featured"><Zap size={10} /> Featured</span>}
                <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                  {vendor.category}
                </span>
              </div>
              <h1 className="vd-title">{vendor.name}</h1>
              <div className="vd-rating-row">
                <Stars rating={vendor.rating} />
                <span className="vd-rating-val">{vendor.rating}</span>
                <span className="vd-rating-count">({vendor.reviews} reviews)</span>
                <span className="vd-price">{vendor.priceRange}</span>
              </div>
              <p className="vd-description">{vendor.description}</p>
            </div>
            <div className="vd-actions">
              <button
                className={`vd-action-btn ${fav ? 'fav-active' : ''}`}
                onClick={() => toggle(vendor.id)}
                id="detail-fav-btn"
              >
                <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
                {fav ? 'Saved' : 'Save'}
              </button>
              <button className="vd-action-btn" id="detail-share-btn">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container vd-body">
        <div className="vd-main">
          {/* Menu */}
          <section className="vd-section">
            <h2 className="vd-section-title">Menu <ShoppingCart size={20} style={{opacity: 0.6}} /></h2>
            <div className="menu-grid">
              {vendor.menu.map((item, i) => (
                <div key={i} className="menu-item">
                  <div className="menu-item-info">
                    <span className="menu-item-name">{item.item}</span>
                  </div>
                  <span className="menu-item-price">₹{item.price}</span>
                  <button 
                    className="menu-item-cart btn-primary"
                    onClick={() => handleAddToCart(item)}
                    style={{fontSize: '0.8rem', padding: '8px 16px'}}
                  >
                    Add +
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Specialties */}
          <section className="vd-section">
            <h2 className="vd-section-title">Specialties</h2>
            <div className="specialty-chips">
              {vendor.specialty.map(s => (
                <span key={s} className="specialty-chip">{s}</span>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="vd-section">
            <h2 className="vd-section-title">Customer Reviews</h2>
            <div className="reviews-list">
              {MOCK_REVIEWS.map(r => (
                <div key={r.id} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar">{r.avatar}</div>
                    <div className="review-meta">
                      <div className="review-user">{r.user}</div>
                      <div className="review-rating-row">
                        <Stars rating={r.rating} />
                        <span className="review-date">{r.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="review-text">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="vd-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Location & Hours</h3>
            <div className="sidebar-info-item">
              <MapPin size={16} className="sidebar-icon" />
              <div>
                <div className="sidebar-label">Address</div>
                <div className="sidebar-value">{vendor.location}</div>
              </div>
            </div>
            <div className="sidebar-info-item">
              <Clock size={16} className="sidebar-icon" />
              <div>
                <div className="sidebar-label">Hours</div>
                <div className="sidebar-value">{vendor.openHours}</div>
              </div>
            </div>
            <div className="sidebar-info-item">
              <MapPin size={16} className="sidebar-icon" />
              <div>
                <div className="sidebar-label">Distance</div>
                <div className="sidebar-value">{vendor.distance} away</div>
              </div>
            </div>

            <div className="mini-map-placeholder">
              <div className="mini-map-pin">📍</div>
              <div className="mini-map-label">{vendor.location}</div>
              <Link to="/map" className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px', marginTop: 8, justifyContent: 'center' }}>
                View on Full Map
              </Link>
            </div>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">Tags</h3>
            <div className="tags-wrap">
              {vendor.tags.map(tag => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
              <span className="tag-chip">{vendor.cuisine}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

