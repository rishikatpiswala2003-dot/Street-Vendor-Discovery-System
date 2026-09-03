import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Search, Menu, X, Heart, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/vendors', label: 'Discover' },
    { to: '/map', label: 'Map View' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">Street<span className="logo-accent">Bite</span></span>
        </Link>

        {/* Desktop nav links */}
        <ul className="navbar-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-icon-btn" title="Favorites">
                <Heart size={18} />
                {favorites.length > 0 && (
                  <span className="nav-badge">{favorites.length}</span>
                )}
              </Link>
              <div className="user-menu-wrapper">
                <button
                  className="user-menu-trigger"
                  onClick={() => setUserMenuOpen(p => !p)}
                >
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={userMenuOpen ? 'rotate' : ''} />
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <Link to="/dashboard" className="dropdown-item">
                      <User size={14} /> Dashboard
                    </Link>
                    <button
                      className="dropdown-item danger"
                      onClick={() => { logout(); navigate('/'); }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-primary" id="nav-login-btn">
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link to="/login" className="btn-primary mobile-login-btn">
              Sign In
            </Link>
          )}
          {user && (
            <button
              className="mobile-nav-link"
              onClick={() => { logout(); navigate('/'); }}
              style={{ color: 'var(--accent-red)', textAlign: 'left', background: 'none', width: '100%' }}
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
