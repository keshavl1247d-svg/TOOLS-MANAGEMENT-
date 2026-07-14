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
      
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-light dark:text-gray-400 font-medium">{currentDateTime}</span>
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold shadow-sm">
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
};

export default Header;
