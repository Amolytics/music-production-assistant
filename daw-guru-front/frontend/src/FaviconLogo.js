import React from 'react';
import '../public/favicon.ico';

const FaviconLogo = () => (
  <img 
    src="/favicon.ico" 
    alt="Logo" 
    style={{
      position: 'fixed',
      right: '2em',
      bottom: '2em',
      width: '48px',
      height: '48px',
      zIndex: 1200,
      borderRadius: '12px',
      boxShadow: '0 2px 8px #0006',
      background: '#fff',
      padding: '4px'
    }}
  />
);

export default FaviconLogo;
