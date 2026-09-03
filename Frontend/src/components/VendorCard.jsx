import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Clock, Zap } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import './VendorCard.css';

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`star ${i < full ? 'filled' : i === full && half ? 'half' : ''}`}>★</span>
      ))}
    </div>
  );
}

export default function VendorCard({ vendor, style }) {
  const { toggle, isFav } = useFavorites();
  const fav = isFav(vendor.id);

  return (
    <div className="vendor-card" style={style}>
      {/* Card header / image area */}
      <div className="vendor-card-header" style={{ '--vendor-color': vendor.color }}>
        <div className="vendor-emoji-bg">
          <span className="vendor-emoji">{vendor.emoji}</span>
        </div>
        <div className="vendor-card-badges">
          <span className={`badge ${vendor.isOpen ? 'badge-open' : 'badge-closed'}`}>
            {vendor.isOpen ? '● Open' : '● Closed'}
          </span>
          {vendor.featured && (
            <span className="badge badge-featured">
              <Zap size={10} /> Featured
            </span>
          )}
        </div>
        <button
          className={`fav-btn ${fav ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); toggle(vendor.id); }}
          aria-label="Toggle favorite"
        >
          <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Card body */}
      <div className="vendor-card-body">
        <div className="vendor-card-top">
          <h3 className="vendor-name">{vendor.name}</h3>
          <div className="vendor-meta">
            <div className="vendor-rating">
              <Stars rating={vendor.rating} />
              <span className="rating-value">{vendor.rating}</span>
              <span className="rating-count">({vendor.reviews})</span>
            </div>
            <span className="price-range">{vendor.priceRange}</span>
          </div>
        </div>

        <div className="vendor-info">
          <div className="vendor-info-item">
            <MapPin size={13} />
            <span>{vendor.location}</span>
          </div>
          <div className="vendor-info-item">
            <Clock size={13} />
            <span>{vendor.openHours}</span>
          </div>
        </div>

        <div className="vendor-specialties">
          {vendor.specialty.slice(0, 3).map(s => (
            <span key={s} className="specialty-tag">{s}</span>
          ))}
        </div>

        <div className="vendor-card-footer">
          <span className="vendor-distance">
            <MapPin size={12} /> {vendor.distance}
          </span>
          <Link to={`/vendors/${vendor.id}`} className="btn-primary view-btn" id={`vendor-card-${vendor.id}`}>
            View Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
