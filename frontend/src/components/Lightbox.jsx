import React, { useEffect } from 'react';

const Lightbox = ({ src, alt, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !src) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 transition-opacity"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white hover:text-gray-300 w-10 h-10 flex items-center justify-center text-3xl font-light"
        onClick={onClose}
      >
        &times;
      </button>
      <img 
        src={src} 
        alt={alt || 'Full size image'} 
        className="max-w-full max-h-full object-contain rounded shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default Lightbox;
