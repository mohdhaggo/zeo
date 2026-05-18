import React from 'react';

export const WhyDifferent: React.FC = () => {
  const features = [
    { icon: "fa-shield-alt", text: "Maximum protection against environmental and physical damage" },
    { icon: "fa-magic", text: "Advanced self-healing technologies for long-lasting finish" },
    { icon: "fa-sun", text: "UV and heat resistance engineered for extreme climates like the Middle East & Asia" },
    { icon: "fa-gem", text: "Exceptional clarity and aesthetics without compromise" },
    { icon: "fa-certificate", text: "Warranty-backed confidence for peace of mind globally" }
  ];

  return (
    <div className="why-different fade-section" style={{
      background: '#0C0C12',
      borderRadius: '40px',
      padding: '50px',
      margin: '60px 0'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#E50914' }}>WHAT MAKES US DIFFERENT</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '25px'
      }}>
        {features.map((feature, index) => (
          <div key={index} style={{
            padding: '15px',
            borderBottom: '2px solid #E50914',
            transition: 'all 0.3s ease'
          }}>
            <i className={`fas ${feature.icon}`} style={{ color: '#E50914', marginRight: '10px' }}></i>
            {feature.text}
          </div>
        ))}
      </div>
    </div>
  );
};