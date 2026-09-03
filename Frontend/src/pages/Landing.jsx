import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { vendors, categories, stats } from '../data/vendors';
import VendorCard from '../components/VendorCard';
import './Landing.css';

export default function Landing() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const featuredVendors = vendors.filter(v => v.featured);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/vendors?search=${encodeURIComponent(query)}`);
    else navigate('/vendors');
  };

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <Zap size={14} />
            <span>Kothrud's #1 Vendor Discovery Platform</span>
          </div>
          <h1 className="hero-title">
            Find the Best
            <br />
            <span className="gradient-text">Street Food</span>
            <br />
            Near You
          </h1>
          <p className="hero-subtitle">
            Discover authentic local street vendors, explore menus, check real-time availability, and never miss a great meal again.
          </p>

          {/* Search bar */}
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-icon"><Search size={20} /></div>
            <input
              id="hero-search-input"
              type="text"
              placeholder="Search vendors, dishes, or categories..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="search-input"
            />
            <div className="search-location">
              <MapPin size={14} />
              <span>Kothrud, Pune</span>
            </div>
            <button type="submit" className="btn-primary search-btn" id="hero-search-btn">
              Search <ArrowRight size={16} />
            </button>
          </form>

          {/* Popular searches */}
          <div className="popular-searches">
            <span>Trending:</span>
            {['Vada Pav', 'Chai', 'Biryani', 'Pani Puri', 'Dosa'].map(tag => (
              <button
                key={tag}
                className="trending-tag"
                onClick={() => navigate(`/vendors?search=${tag}`)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Floating stats */}
        <div className="hero-stats container">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Browse by <span className="gradient-text">Category</span></h2>
              <p className="section-subtitle">Explore vendors sorted by what you're craving right now.</p>
            </div>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <button
                key={cat.id}
                className="category-card"
                style={{ '--cat-color': cat.color }}
                onClick={() => navigate(cat.id === 'all' ? '/vendors' : `/vendors?cat=${cat.id}`)}
                id={`category-${cat.id}`}
              >
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured vendors */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">⭐ Featured <span className="gradient-text">Vendors</span></h2>
              <p className="section-subtitle">Hand-picked favorites loved by the Kothrud community.</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate('/vendors')}>
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="featured-grid">
            {featuredVendors.map((vendor, i) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="cta-section container">
        <div className="cta-card">
          <div className="cta-glow" />
          <div className="cta-content">
            <h2 className="section-title">Ready to Explore?</h2>
            <p className="section-subtitle">
              Over 200 street vendors waiting to serve you. Find your next favorite spot today.
            </p>
            <div className="cta-actions">
              <button className="btn-primary" onClick={() => navigate('/vendors')} id="cta-discover-btn">
                Discover Vendors <ArrowRight size={16} />
              </button>
              <button className="btn-secondary" onClick={() => navigate('/map')} id="cta-map-btn">
                <MapPin size={16} /> Open Map
              </button>
            </div>
          </div>
          <div className="cta-decoration">
            <div className="cta-emoji-stack">
              {['🍚', '☕', '🥙', '🍮', '🫙'].map((e, i) => (
                <span key={i} className="float-emoji" style={{ animationDelay: `${i * 0.5}s` }}>{e}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
