import React from 'react';

export const FinishOptions: React.FC = () => {
  return (
    <div className="finish-section fade-section" style={{ margin: '60px 0' }}>
      <h2 style={{ fontSize: '2rem', textAlign: 'center', color: '#E50914', marginBottom: '20px' }}>Available Finishes</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px'
      }}>
        <div style={{ background: '#0F0F15', borderRadius: '28px', padding: '30px', textAlign: 'center', border: '1px solid rgba(229,9,20,0.2)' }}>
          <i className="fas fa-sun" style={{ fontSize: '2rem', color: '#E50914', marginBottom: '15px' }}></i>
          <h3>High Gloss</h3>
          <p>Crystal-clear finish that enhances paint depth</p>
        </div>
        <div style={{ background: '#0F0F15', borderRadius: '28px', padding: '30px', textAlign: 'center', border: '1px solid rgba(229,9,20,0.2)' }}>
          <i className="fas fa-moon" style={{ fontSize: '2rem', color: '#E50914', marginBottom: '15px' }}></i>
          <h3>Satin Matte</h3>
          <p>Stealth, luxurious satin finish</p>
        </div>
      </div>
    </div>
  );
};