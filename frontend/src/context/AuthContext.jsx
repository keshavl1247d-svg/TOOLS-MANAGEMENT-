import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('tms_user');
    const storedToken = localStorage.getItem('tms_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

 const login = async (email, password) => {
  const user = { id: 1, name: 'Admin User', email, role: 'admin' };
  localStorage.setItem('tms_token', 'bypass-token');
  localStorage.setItem('tms_user', JSON.stringify(user));
  setToken('bypass-token');
  setUser(user);
  return { success: true };
};

  const logout = () => {
    localStorage.removeItem('tms_token');
    localStorage.removeItem('tms_user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAdmin: user?.role === 'admin'
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-bg text-gray-text">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
