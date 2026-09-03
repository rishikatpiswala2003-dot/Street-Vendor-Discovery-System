import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { vendors, categories } from '../data/vendors';
import VendorCard from '../components/VendorCard';
import './VendorList.css';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'distance', label: 'Nearest First' },
  { value: 'name', label: 'Name A–Z' },
];

export default function VendorList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('cat') || 'all');
  const [sortBy, setSortBy] = useState('rating');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get('search') || '';
    const cat = searchParams.get('cat') || 'all';
    setQuery(q);
    setActiveCategory(cat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = vendors.filter(v => {
      const matchQuery = !query.trim() ||
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.specialty.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
        v.category.toLowerCase().includes(query.toLowerCase()) ||
        v.cuisine.toLowerCase().includes(query.toLowerCase());
      const matchCat = activeCategory === 'all' || v.category === activeCategory;
      const matchOpen = !showOpenOnly || v.isOpen;
      return matchQuery && matchCat && matchOpen;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [query, activeCategory, sortBy, showOpenOnly]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    const params = new URLSearchParams(searchParams);
    if (val) params.set('search', val); else params.delete('search');
    setSearchParams(params);
  };

  const handleCategory = (catId) => {
    setActiveCategory(catId);
    const params = new URLSearchParams(searchParams);
    if (catId !== 'all') params.set('cat', catId); else params.delete('cat');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setQuery('');
    setActiveCategory('all');
    setShowOpenOnly(false);
    setSortBy('rating');
    setSearchParams({});
  };

  const hasFilters = query || activeCategory !== 'all' || showOpenOnly || sortBy !== 'rating';

  return (
    <div className="vendor-list-page page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="vl-header">
          <div>
            <h1 className="section-title">Discover <span className="gradient-text">Vendors</span></h1>
            <p className="section-subtitle">
              {filtered.length} vendor{filtered.length !== 1 ? 's' : ''} found in Kothrud, Pune
            </p>
          </div>
        </div>

        {/* Search + Filters bar */}
        <div className="vl-controls">
          <div className="vl-search-wrap">
            <Search size={18} className="vl-search-icon" />
            <input
              id="vendor-search-input"
              type="text"
              placeholder="Search by name, dish, or cuisine..."
              value={query}
              onChange={handleSearch}
              className="vl-search-input"
            />
            {query && (
              <button className="clear-search-btn" onClick={() => handleSearch({ target: { value: '' } })}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="vl-filter-row">
            <div className="sort-select-wrap">
              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="sort-select-icon" />
            </div>

            <button
              id="open-only-toggle"
              className={`filter-toggle ${showOpenOnly ? 'active' : ''}`}
              onClick={() => setShowOpenOnly(p => !p)}
            >
              Open Now
            </button>

            {hasFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                <X size={14} /> Clear All
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="category-chips">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
              style={{ '--cat-color': cat.color }}
              onClick={() => handleCategory(cat.id)}
              id={`chip-${cat.id}`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Results grid */}
        {filtered.length > 0 ? (
          <div className="vendors-grid">
            {filtered.map((vendor, i) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-emoji">🔍</div>
            <h3>No vendors found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
