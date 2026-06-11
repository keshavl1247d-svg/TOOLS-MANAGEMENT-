import React from 'react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const typeMap = {
    'Available': 'green',
    'IN': 'green',
    'Good': 'green',
    'Out': 'blue',
    'OUT': 'blue',
    'Damaged': 'red'
  };

  const type = typeMap[status] || 'blue';

  const styleMap = {
    green: 'bg-success-light text-success',
    blue: 'bg-primary-light text-primary',
    red: 'bg-danger-light text-danger'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styleMap[type]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
