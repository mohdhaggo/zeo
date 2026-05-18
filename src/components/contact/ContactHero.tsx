import React from 'react';

export const ContactHero: React.FC = () => {
  return (
    <section className="contact-hero" style={{
      position: 'relative',
      minHeight: '50vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%), url("/zeo_landing.webp")',
      backgroundSize: 'cover',
      backgroundPosition: 'center 30%',
      backgroundAttachment: 'fixed',
      borderBottom: '2px solid #E50914'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 2, padding: '100px 30px' }}>
        <h1 style={{
          fontSize: '3.5rem',
          marginBottom: '15px',
          background: 'linear-gradient(135deg, #E50914, #FF6B6B)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent'
        }}>Get In Touch</h1>
        <p style={{ fontSize: '1.2rem', color: '#ddd', maxWidth: '600px', margin: '0 auto' }}>
          Our global team is ready to assist you with premium automotive protection solutions across the Middle East, Asia, and beyond.
        </p>
      </div>
    </section>
  );
};