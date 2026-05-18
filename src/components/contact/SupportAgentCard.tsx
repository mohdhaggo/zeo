import React from 'react';

export const SupportAgentCard: React.FC = () => {
  return (
    <div className="agent-card" style={{
      background: 'linear-gradient(145deg, #0F0F15, #0A0A0F)',
      borderRadius: '32px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: '1px solid rgba(229,9,20,0.3)',
      boxShadow: '0 20px 35px -15px rgba(0,0,0,0.5)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <img 
        src="/contact.webp" 
        alt="Zeo Shields Call Center Agent with Headset" 
        style={{
          width: '100%',
          height: '380px',
          objectFit: 'cover',
          objectPosition: 'center 20%',
          display: 'block',
          filter: 'grayscale(15%)',
          transition: 'filter 0.3s ease'
        }}
      />
      <div className="agent-caption" style={{
        padding: '28px 25px',
        textAlign: 'center',
        background: 'rgba(10, 10, 15, 0.95)',
        borderTop: '1px solid rgba(229,9,20,0.4)'
      }}>
        <h3 style={{
          color: '#E50914',
          fontSize: '1.5rem',
          marginBottom: '8px',
          fontFamily: "'Orbitron', monospace"
        }}>
          <i className="fas fa-headset"></i> Get Professional Support
        </h3>
        <p style={{ fontSize: '0.95rem', color: '#bbb', lineHeight: '1.5', marginTop: '8px' }}>
          Global Support Specialist
        </p>
        <div className="agent-contact-info" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '15px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.85rem', color: '#E50914' }}>
            <i className="fas fa-envelope"></i> info@zeoshields.com
          </span>
          <span style={{ fontSize: '0.85rem', color: '#E50914' }}>
            <i className="fas fa-comment-dots"></i> 24/7 Support
          </span>
        </div>
        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          "Our dedicated team is here to provide expert guidance on PPF, Window Tint, and Windshield Protection. Reach out anytime!"
        </p>
      </div>
      
      <style>{`
        .agent-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 45px -15px rgba(229,9,20,0.3);
          border-color: #E50914;
        }
        .agent-card:hover img {
          filter: grayscale(0%);
        }
      `}</style>
    </div>
  );
};