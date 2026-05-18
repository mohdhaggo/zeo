import React from 'react';

export const InfoSection: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', margin: '20px 0 60px' }} className="fade-section">
      <p style={{ color: '#888', fontSize: '0.85rem' }}>
        <i className="fas fa-lock"></i> Secure validation • Warranty coverage • Worldwide support
      </p>
    </div>
  );
};