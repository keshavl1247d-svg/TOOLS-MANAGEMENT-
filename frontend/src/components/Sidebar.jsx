import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();

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
    <div className="w-60 h-screen fixed top-0 left-0 bg-white border-r border-gray-border flex flex-col">
      <div className="p-5 border-b border-gray-divider flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-lg flex-shrink-0">
          🔧
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-dark leading-tight">Maintenance</h1>
          <p className="text-[10px] text-gray-light uppercase tracking-wider mt-0.5">Tool Management System</p>
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
                  ? 'bg-primary-light text-primary' 
                  : 'text-gray-text hover:bg-gray-50 hover:text-gray-dark'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-divider">
        <div className="flex items-center justify-between mb-3">
          <div className="truncate">
            <p className="text-sm font-medium text-gray-dark truncate">{user?.name}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide
              ${isAdmin ? 'bg-primary-light text-primary' : 'bg-success-light text-success'}`}>
              {user?.role}
            </span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full py-2 text-sm font-medium text-gray-text bg-gray-50 hover:bg-gray-200 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
