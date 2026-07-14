import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Part Management', path: '/parts', icon: '📦' },
    { name: 'Tools Management', path: '/tools', icon: '🔧' },
    { name: 'Tool IN/OUT', path: '/inout', icon: '🔄' },
    { name: 'Search System', path: '/search', icon: '🔍' },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Reports', path: '/reports', icon: '📈' });
  }

  return (
    <div className="w-60 h-screen fixed top-0 left-0 bg-white dark:bg-gray-900 border-r border-gray-border dark:border-gray-700 flex flex-col">
      <div className="p-5 border-b border-gray-divider dark:border-gray-700 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-lg flex-shrink-0">
          🔧
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-dark dark:text-white leading-tight">Maintenance</h1>
          <p className="text-[10px] text-gray-light dark:text-gray-400 uppercase tracking-wider mt-0.5">Tool Management System</p>
        </div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-light text-primary dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-text dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-dark dark:hover:text-white'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

     <div className="p-4 border-t border-gray-divider dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="truncate">
            <p className="text-sm font-medium text-gray-dark dark:text-white truncate">{user?.name}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide
              ${isAdmin ? 'bg-primary-light text-primary dark:bg-blue-900 dark:text-blue-300' : 'bg-success-light text-success'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="w-full py-2 mb-3 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 text-gray-text dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <button
          onClick={logout}
          className="w-full py-2 text-sm font-medium text-gray-text dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
  );
};

export default Sidebar;
