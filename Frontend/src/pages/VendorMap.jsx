import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { vendors, categories } from '../data/vendors';
import './VendorMap.css';

// Fix leaflet default icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createEmojiIcon(emoji, color) {
  return L.divIcon({
    html: `<div class="custom-pin" style="--pin-color:${color}">
             <span class="pin-emoji">${emoji}</span>
           </div>`,
    className: 'custom-marker-icon',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });
}

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom()); }, [center]);
  return null;
}

export default function VendorMap() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const CENTER = [18.5074, 73.8077];

  const filtered = activeCategory === 'all'
    ? vendors
    : vendors.filter(v => v.category === activeCategory);

  return (
    <div className="map-page page-wrapper">
      <div className="map-header container">
        <div>
          <h1 className="section-title">Vendor <span className="gradient-text">Map</span></h1>
          <p className="section-subtitle">Explore street vendors on an interactive map of Kothrud.</p>
        </div>
      </div>

      {/* Category filter */}
      <div className="map-filter container">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`map-chip ${activeCategory === cat.id ? 'active' : ''}`}
            style={{ '--cat-color': cat.color }}
            onClick={() => setActiveCategory(cat.id)}
            id={`map-chip-${cat.id}`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="map-layout container">
        {/* Sidebar list */}
        <div className="map-vendor-list">
          <div className="map-list-header">
            <span>{filtered.length} vendors</span>
          </div>
          {filtered.map(v => (
            <button
              key={v.id}
              className={`map-vendor-item ${selectedVendor?.id === v.id ? 'active' : ''}`}
              onClick={() => setSelectedVendor(v)}
              id={`map-vendor-item-${v.id}`}
            >
              <div className="mvi-emoji" style={{ '--vendor-color': v.color }}>{v.emoji}</div>
              <div className="mvi-info">
                <div className="mvi-name">{v.name}</div>
                <div className="mvi-meta">
                  <span className={`badge ${v.isOpen ? 'badge-open' : 'badge-closed'}`} style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                    {v.isOpen ? 'Open' : 'Closed'}
                  </span>
                  <span className="mvi-dist">{v.distance}</span>
                  <span className="mvi-rating">★ {v.rating}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Map */}
        <div className="map-container-wrap">
          <MapContainer
            center={CENTER}
            zoom={14}
            className="leaflet-map"
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {selectedVendor && <RecenterMap center={[selectedVendor.lat, selectedVendor.lng]} />}
            {filtered.map(vendor => (
              <Marker
                key={vendor.id}
                position={[vendor.lat, vendor.lng]}
                icon={createEmojiIcon(vendor.emoji, vendor.color)}
                eventHandlers={{ click: () => setSelectedVendor(vendor) }}
              >
                <Popup>
                  <div className="map-popup">
                    <div className="popup-header">
                      <span className="popup-emoji">{vendor.emoji}</span>
                      <div>
                        <div className="popup-name">{vendor.name}</div>
                        <div className="popup-cat">{vendor.category}</div>
                      </div>
                    </div>
                    <div className="popup-meta">
                      <span>★ {vendor.rating}</span>
                      <span>{vendor.priceRange}</span>
                      <span className={vendor.isOpen ? 'popup-open' : 'popup-closed'}>
                        {vendor.isOpen ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <a href={`/vendors/${vendor.id}`} className="popup-link">View Menu →</a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Selected vendor panel */}
          {selectedVendor && (
            <div className="selected-vendor-panel">
              <div className="svp-emoji">{selectedVendor.emoji}</div>
              <div className="svp-info">
                <div className="svp-name">{selectedVendor.name}</div>
                <div className="svp-location">{selectedVendor.location}</div>
                <div className="svp-meta">
                  <span>★ {selectedVendor.rating}</span>
                  <span>{selectedVendor.distance}</span>
                  <span className={selectedVendor.isOpen ? 'popup-open' : 'popup-closed'}>
                    {selectedVendor.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              <Link to={`/vendors/${selectedVendor.id}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                View →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
