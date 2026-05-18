import React from 'react';

export const CommitmentSection: React.FC = () => {
  return (
    <div className="commitment-section fade-section" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      margin: '60px 0'
    }}>
      <div style={{
        background: '#0C0C12',
        padding: '35px',
        borderRadius: '32px',
        transition: 'all 0.3s ease'
      }}>
        <h3 style={{ color: '#E50914', marginBottom: '20px', fontSize: '1.5rem' }}>OUR COMMITMENT</h3>
        <p style={{ lineHeight: '1.7', color: '#BBB' }}>We are committed to protecting not just vehicles—but investments, performance, and driving experience across continents. Every solution we provide reflects our dedication to quality, innovation, and customer satisfaction.</p>
      </div>
      <div style={{
        background: '#0C0C12',
        padding: '35px',
        borderRadius: '32px',
        transition: 'all 0.3s ease'
      }}>
        <h3 style={{ color: '#E50914', marginBottom: '20px', fontSize: '1.5rem' }}>OUR APPROACH</h3>
        <p style={{ lineHeight: '1.7', color: '#BBB' }}>From product design to final application, we focus on precision, consistency, and excellence. Our approach ensures that every vehicle receives protection that is not only effective but also visually seamless and long-lasting.</p>
      </div>
    </div>
  );
};