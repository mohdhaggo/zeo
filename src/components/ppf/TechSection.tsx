import React from 'react';

export const TechSection: React.FC = () => {
  return (
    <div className="tech-section fade-section" style={{
      background: 'linear-gradient(145deg, #0C0C12, #08080c)',
      borderRadius: '48px',
      padding: '60px',
      margin: '60px 0',
      border: '1px solid rgba(229,9,20,0.2)'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#E50914', textAlign: 'center' }}>
        <i className="fas fa-microscope"></i> Advanced Polymer Technology
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '30px'
      }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <i className="fas fa-magic" style={{ fontSize: '2.5rem', color: '#E50914', marginBottom: '15px' }}></i>
          <h3>Self-Healing Top Coat</h3>
          <p>Minor scratches disappear with heat exposure</p>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <i className="fas fa-sun" style={{ fontSize: '2.5rem', color: '#E50914', marginBottom: '15px' }}></i>
          <h3>UV & Oxidation Resistance</h3>
          <p>Blocks harmful UV rays preventing fading</p>
        </div>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <i className="fas fa-water" style={{ fontSize: '2.5rem', color: '#E50914', marginBottom: '15px' }}></i>
          <h3>Hydrophobic Properties</h3>
          <p>Repels water and contaminants</p>
        </div>
      </div>
    </div>
  );
};