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
    <div className="w-60 h-screen fixed top-0 left-0 bg-white dark:bg-gray-900 border-r border-gray-border dark:border-gray-700 flex flex-col shadow-sm">
     <div className="relative p-5 border-b border-gray-divider dark:border-gray-700 flex items-center gap-3 overflow-hidden">
        <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full blur-2xl"></div>
        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-primary via-primary to-primary-dark flex items-center justify-center text-white text-xl flex-shrink-0 shadow-lg shadow-primary/40 ring-2 ring-white dark:ring-gray-900">
          🔧
        </div>
        <div className="relative">
          <h1 className="text-base font-extrabold bg-gradient-to-r from-primary to-primary-dark dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent leading-tight tracking-tight">
            Maintenance
          </h1>
          <p className="text-[10px] text-gray-light dark:text-gray-400 uppercase tracking-widest mt-0.5 font-semibold">
            Tool Management System
          </p>
        </div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md shadow-primary/25'
                  : 'text-gray-text dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-dark dark:hover:text-white hover:translate-x-0.5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-base w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  isActive ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700'
                }`}>
                  {item.icon}
                </span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-divider dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-gray-dark dark:text-white truncate">{user?.name}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide inline-block mt-0.5
              ${isAdmin ? 'bg-primary-light text-primary dark:bg-blue-900 dark:text-blue-300' : 'bg-success-light text-success'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full py-2.5 mb-2 text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 text-gray-text dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-border dark:border-gray-700"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        <button
          onClick={logout}
          className="w-full py-2.5 text-sm font-medium text-danger bg-danger-light dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
            <line x1="12" y1="2" x2="12" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
