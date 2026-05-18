import React from 'react';

export const WarrantyHero: React.FC = () => {
  return (
    <div className="warranty-hero fade-section" style={{
      padding: '60px 0 40px',
      textAlign: 'center'
    }}>
      <div className="warranty-badge" style={{
        display: 'inline-block',
        background: 'rgba(229,9,20,0.2)',
        padding: '6px 16px',
        borderRadius: '30px',
        fontSize: '0.8rem',
        marginBottom: '20px',
        borderLeft: '3px solid #E50914',
        fontFamily: "'Orbitron', monospace"
      }}>
        <i className="fas fa-shield-alt"></i> OFFICIAL REGISTRATION PORTAL
      </div>
      <h1 style={{
        fontSize: '3rem',
        background: 'linear-gradient(135deg, #FFFFFF, #E50914)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        marginBottom: '15px'
      }}>Warranty Registration</h1>
      <p style={{ color: '#aaa', maxWidth: '650px', margin: '0 auto' }}>
        Register your Zeo Shields product warranty. Enter your unique Warranty ID to get started.
      </p>
    </div>
  );
};