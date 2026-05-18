import React from 'react';

export const PageHeader: React.FC = () => {
  return (
    <section className="page-header fade-section" style={{
      background: 'linear-gradient(135deg, #0a0a0f, #050508)',
      padding: '80px 0 60px',
      textAlign: 'center',
      borderBottom: '1px solid rgba(229, 9, 20, 0.3)',
      marginBottom: '60px'
    }}>
      <div className="container">
        <h1 style={{
          fontSize: '3.5rem',
          background: 'linear-gradient(135deg, #E50914, #FF6B6B)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '20px'
        }}>PROTECTION CATEGORIES</h1>
        <p style={{
          maxWidth: '700px',
          margin: '0 auto',
          color: '#aaa',
          fontSize: '1.1rem'
        }}>Explore our premium range of automotive protection films — engineered for extreme climates across the Middle East, Asia, and global markets, delivering unmatched durability and style.</p>
      </div>
    </section>
  );
};