import React from 'react';

interface ProductInfoProps {
  description: string[];
  thicknessOptions: string[];
  techNote: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ description, thicknessOptions, techNote }) => {
  return (
    <div className="product-info">
      {description.map((para, idx) => (
        <p key={idx} style={{ lineHeight: '1.7', color: '#bbb', marginBottom: '20px' }}>{para}</p>
      ))}
      
      <div className="thickness-options" style={{ display: 'flex', gap: '15px', justifyContent: 'center', margin: '20px 0', flexWrap: 'wrap' }}>
        {thicknessOptions.map((option, idx) => (
          <span key={idx} style={{
            background: '#1a1a1a',
            padding: '8px 20px',
            borderRadius: '30px',
            fontSize: '0.9rem',
            border: '1px solid #E50914',
            fontFamily: "'Orbitron', monospace"
          }}>{option}</span>
        ))}
      </div>
      
      <div className="tech-note" style={{
        background: 'linear-gradient(145deg, #0F0F15, #0A0A0F)',
        borderRadius: '24px',
        padding: '20px',
        margin: '20px 0 0',
        textAlign: 'center',
        border: '1px solid rgba(229,9,20,0.3)'
      }}>
        <i className="fas fa-magic" style={{ fontSize: '1.5rem', color: '#E50914' }}></i>
        <p style={{ marginTop: '8px' }}><strong>{techNote}</strong></p>
      </div>
    </div>
  );
};