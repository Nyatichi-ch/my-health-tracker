import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = async () => {
    try {
      const res = await api.me();
      setUser(res.data.user || null);
    } catch (err) {
      console.error('Auth me error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    setUser(res.data);
    return res;
  };

  const register = async (payload) => {
    const res = await api.register(payload);
    setUser(res.data);
    return res;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout failed', err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
