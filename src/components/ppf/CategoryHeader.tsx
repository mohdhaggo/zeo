import React from 'react';

export const CategoryHeader: React.FC = () => {
  return (
    <section className="category-header fade-section" style={{
      background: 'linear-gradient(135deg, #0f0a0a, #080505)',
      padding: '80px 0 60px',
      textAlign: 'center',
      borderBottom: '2px solid #E50914',
      marginBottom: '60px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container">
        <h1 style={{
          fontSize: '3.5rem',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #E50914, #FF6B6B)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>
          <i className="fas fa-shield-alt"></i> Paint Protection Film
        </h1>
        <p style={{
          maxWidth: '850px',
          margin: '0 auto',
          color: '#aaa',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Our Paint Protection Film (PPF) collection is engineered to deliver unmatched protection, clarity, and durability for modern vehicles. Built using advanced polymer technology, each film layer is designed to absorb impacts, resist stains, and recover from minor scratches through its innovative self-healing top coat.
        </p>
      </div>
    </section>
  );
};