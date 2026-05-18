import React from 'react';

export const AboutHero: React.FC = () => {
  return (
    <div className="about-hero fade-section" style={{
      textAlign: 'center',
      padding: '80px 0 40px'
    }}>
      <h1 style={{
        fontSize: '3rem',
        marginBottom: '15px',
        background: 'linear-gradient(135deg, #E50914, #FF6B6B)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
      }}>ABOUT ZEO SHIELDS</h1>
      <p style={{ color: '#AAA', fontSize: '1.2rem' }}>Global Protection. Engineered to Dominate the Middle East, Asia & Beyond.</p>
    </div>
  );
};