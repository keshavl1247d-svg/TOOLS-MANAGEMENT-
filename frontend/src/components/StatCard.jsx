import React from 'react';

const StatCard = ({ icon, label, value, color = 'blue' }) => {
  const colorMap = {
    blue: { bg: 'bg-primary-light dark:bg-blue-900', text: 'text-primary dark:text-blue-300' },
    green: { bg: 'bg-success-light dark:bg-green-900', text: 'text-success dark:text-green-300' },
    red: { bg: 'bg-danger-light dark:bg-red-900', text: 'text-danger dark:text-red-300' },
    orange: { bg: 'bg-warning-light dark:bg-orange-900', text: 'text-warning dark:text-orange-300' }
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-border dark:border-gray-700 rounded-xl p-3 transition-all hover:shadow-lg hover:-translate-y-1">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm mb-2 ${style.bg} ${style.text}`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-gray-light dark:text-gray-400 uppercase tracking-wider mb-1" style={{fontSize:'10px'}}>{label}</p>
      <h3 className={`text-xl font-semibold ${style.text}`}>{value}</h3>
    </div>
  );
};

export default StatCard;
