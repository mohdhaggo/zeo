import React from 'react';

export const WarrantySection: React.FC = () => {
  return (
    <div className="warranty-section fade-section" style={{
      background: 'rgba(229,9,20,0.05)',
      borderRadius: '40px',
      padding: '40px',
      textAlign: 'center',
      margin: '40px 0'
    }}>
      <i className="fas fa-shield-alt" style={{ fontSize: '3rem', color: '#E50914', marginBottom: '15px' }}></i>
      <h3>Manufacturer Warranty</h3>
      <p>All Zeo Shields PPF products are backed by a comprehensive manufacturer warranty, guaranteeing performance, reliability, and peace of mind for years to come.</p>
    </div>
  );
};