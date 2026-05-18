import React from 'react';

export const WhyChooseUs: React.FC = () => {
  return (
    <div className="why-choose-final fade-section" style={{
      background: 'linear-gradient(145deg, #0C0C12, #0A0A0F)',
      borderRadius: '48px',
      padding: '50px',
      margin: '60px 0',
      textAlign: 'center',
      border: '1px solid rgba(229,9,20,0.3)'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#E50914' }}>WHY CHOOSE US</h2>
      <p style={{ color: '#BBB', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto' }}>
        Choosing us means choosing premium protection, proven technology, and trusted performance worldwide. We combine industry expertise with a deep understanding of regional conditions to deliver solutions that truly perform where it matters most.
      </p>
    </div>
  );
};