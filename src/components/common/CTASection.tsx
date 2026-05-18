import React from 'react';

export const CTASection: React.FC = () => {
  return (
    <div className="cta-section fade-section" style={{
      background: '#0B0B10',
      borderRadius: '48px',
      padding: '60px 40px',
      textAlign: 'center',
      margin: '60px 0',
      border: '1px solid rgba(229,9,20,0.2)'
    }}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Need Help Choosing?</h2>
      <p style={{ marginBottom: '30px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
        Our global experts are ready to help you find the perfect protection for your vehicle, no matter where you drive.
      </p>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/contact" className="btn-primary">Contact Distributors</a>
      </div>
    </div>
  );
};