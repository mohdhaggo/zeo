import React from 'react';

export const AboutContent: React.FC = () => {
  return (
    <div className="about-content fade-section" style={{
      display: 'flex',
      gap: '60px',
      margin: '60px 0',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: '1.5' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#E50914' }}>We Are Zeo Shields</h2>
        <p style={{ lineHeight: '1.8', color: '#BBB', marginBottom: '20px' }}>
          We are a premium automotive protection brand dedicated to delivering high-performance surface protection solutions for modern vehicles across the Middle East, Asia, and global markets. Our expertise lies in advanced technologies such as Paint Protection Film (PPF), Window Tint, and Windshield Protection Film—engineered to enhance durability, safety, and aesthetics worldwide.
        </p>
        <p style={{ lineHeight: '1.8', color: '#BBB', marginBottom: '20px' }}>
          Built with a commitment to quality and innovation, our products are designed to perform in extreme environments, offering superior resistance against heat, UV exposure, scratches, stains, and road hazards. Whether it's preserving a flawless paint finish, improving cabin comfort, or protecting critical glass surfaces, we provide solutions that meet the highest international standards.
        </p>
      </div>
      <div style={{ flex: '1' }}>
        <img 
          src="/zeo_landing.webp" 
          alt="Zeo Shields Installation"
          style={{ width: '100%', borderRadius: '32px', height: '400px', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};