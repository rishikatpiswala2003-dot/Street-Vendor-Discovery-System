import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('sb_favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggle = (vendorId) => {
    setFavorites(prev => {
      const next = prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId];
      localStorage.setItem('sb_favorites', JSON.stringify(next));
      return next;
    });
  };

  const isFav = (vendorId) => favorites.includes(vendorId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFav }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
