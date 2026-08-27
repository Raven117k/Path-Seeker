import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pathseeker_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('pathseeker_theme') || 'dark');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('pathseeker_fontsize') || 'medium');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [sitemapOpen, setSitemapOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Listen for forced logout events (e.g. 401 from server)
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      setAuthModalOpen(true);
      setAuthMode('login');
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  // Apply Theme & Font size attributes to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pathseeker_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('pathseeker_fontsize', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('pathseeker_user', JSON.stringify(userData));
    if (token) localStorage.setItem('pathseeker_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pathseeker_user');
    localStorage.removeItem('pathseeker_token');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        theme,
        toggleTheme,
        fontSize,
        setFontSize,
        login,
        logout,
        authModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        sitemapOpen,
        setSitemapOpen,
        notificationsOpen,
        setNotificationsOpen,
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
