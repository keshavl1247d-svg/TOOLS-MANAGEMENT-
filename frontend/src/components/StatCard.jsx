import React from 'react';

const StatCard = ({ icon, label, value, color = 'blue' }) => {
  const colorMap = {
    blue: { bg: 'bg-primary-light', text: 'text-primary' },
    green: { bg: 'bg-success-light', text: 'text-success' },
    red: { bg: 'bg-danger-light', text: 'text-danger' },
    orange: { bg: 'bg-warning-light', text: 'text-warning' }
  };

  const style = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white border border-gray-border rounded-xl p-5 transition-all hover:shadow-lg hover:-translate-y-1">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 ${style.bg} ${style.text}`}>
        {icon}
      </div>
      <p className="text-xs font-semibold text-gray-light uppercase tracking-wider mb-1">{label}</p>
      <h3 className={`text-3xl font-semibold ${style.text}`}>{value}</h3>
    </div>
  );
};

export default StatCard;
