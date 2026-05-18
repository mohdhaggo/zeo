import React from 'react';

interface ProductHeroProps {
  title: string;
  badge: string;
  description: string;
}

export const ProductHero: React.FC<ProductHeroProps> = ({ title, badge, description }) => {
  return (
    <div className="product-hero fade-section" style={{ padding: '60px 0 40px' }}>
      <div className="product-badge" style={{
        display: 'inline-block',
        background: 'rgba(229,9,20,0.2)',
        padding: '6px 16px',
        borderRadius: '30px',
        fontSize: '0.8rem',
        marginBottom: '20px',
        borderLeft: '3px solid #E50914',
        fontFamily: "'Orbitron', monospace"
      }}>
        <i className="fas fa-fire"></i> {badge}
      </div>
      <h1 style={{
        fontSize: '3rem',
        background: 'linear-gradient(135deg, #FFFFFF, #E50914)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        marginBottom: '15px'
      }}>{title}</h1>
      <p style={{ color: '#aaa' }}>{description}</p>
    </div>
  );
};