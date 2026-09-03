import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram, Twitter } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span>🍽️</span>
            <span>Street<span className="logo-accent">Bite</span></span>
          </div>
          <p className="footer-tagline">
            Discover the authentic flavors of Kothrud's vibrant street food culture.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-btn" aria-label="Instagram"><Instagram size={16} /></a>
            <a href="#" className="social-btn" aria-label="Twitter"><Twitter size={16} /></a>
            <a href="#" className="social-btn" aria-label="Email"><Mail size={16} /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/vendors">Discover Vendors</Link></li>
            <li><Link to="/map">Map View</Link></li>
            <li><Link to="/">Home</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/vendors?cat=Street Food">Street Food</Link></li>
            <li><Link to="/vendors?cat=Chaat">Chaat</Link></li>
            <li><Link to="/vendors?cat=Biryani">Biryani</Link></li>
            <li><Link to="/vendors?cat=Beverages">Beverages</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Contact</h4>
          <ul>
            <li><span><MapPin size={13} /> Kothrud, Pune 411038</span></li>
            <li><span><Phone size={13} /> +91 98765 43210</span></li>
            <li><span><Mail size={13} /> hello@streetbite.in</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 StreetBite. Made with ❤️ for Pune's food lovers.</p>
        </div>
      </div>
    </footer>
  );
}
