import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/parts': return 'Part Management';
      case '/tools': return 'Tools Management';
      case '/inout': return 'Tool IN/OUT Entry';
      case '/search': return 'Search System';
      case '/reports': return 'Reports';
      default: return 'Tool Management System';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const dateOptions = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
  const currentDateTime = new Date().toLocaleString('en-IN', dateOptions);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-border dark:border-gray-700 h-14 px-6 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-dark dark:text-white">{getPageTitle()}</h2>
      
     <div className="flex items-center gap-3">
        <span className="text-xs text-gray-text dark:text-gray-300 font-medium px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-border dark:border-gray-700">
          {currentDateTime}
        </span>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-sm font-bold shadow-md shadow-primary/30 ring-2 ring-white dark:ring-gray-900 cursor-pointer hover:scale-105 transition-transform">
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
};

export default Header;
