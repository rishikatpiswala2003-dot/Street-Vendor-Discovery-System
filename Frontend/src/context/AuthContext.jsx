import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('sb_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

const login = (userData) => {
    const u = { ...userData, loginTime: Date.now(), role: userData.role || 'user' };
    setUser(u);
    localStorage.setItem('sb_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sb_user');
  };

  const isRegistered = (mobile) => {
    const users = JSON.parse(localStorage.getItem('sb_users') || '[]');
    return users.find(u => u.mobile === mobile) || null;
  };

const registerUser = (userData) => {
    const users = JSON.parse(localStorage.getItem('sb_users') || '[]');
    const newUser = { ...userData, id: Date.now(), role: userData.role || 'user' };
    users.push(newUser);
    localStorage.setItem('sb_users', JSON.stringify(users));
    return newUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isRegistered, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
