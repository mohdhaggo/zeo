import React from 'react';

export const MissionVision: React.FC = () => {
  return (
    <div className="mission-vision fade-section" style={{
      display: 'flex',
      gap: '40px',
      margin: '60px 0',
      flexWrap: 'wrap'
    }}>
      <div style={{
        background: '#0C0C12',
        padding: '40px',
        borderRadius: '32px',
        flex: '1',
        textAlign: 'center',
        borderLeft: '4px solid #E50914',
        transition: 'all 0.3s ease'
      }}>
        <i className="fas fa-eye" style={{ fontSize: '3rem', color: '#E50914', marginBottom: '20px' }}></i>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>OUR VISION</h3>
        <p style={{ color: '#BBB', lineHeight: '1.6' }}>To become a leading name in automotive protection solutions across the Middle East, Asia, and global automotive community—recognized for innovation, reliability, and premium quality.</p>
      </div>
      <div style={{
        background: '#0C0C12',
        padding: '40px',
        borderRadius: '32px',
        flex: '1',
        textAlign: 'center',
        borderLeft: '4px solid #E50914',
        transition: 'all 0.3s ease'
      }}>
        <i className="fas fa-rocket" style={{ fontSize: '3rem', color: '#E50914', marginBottom: '20px' }}></i>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>OUR MISSION</h3>
        <p style={{ color: '#BBB', lineHeight: '1.6' }}>To deliver advanced protection technologies that enhance vehicle longevity, comfort, and appearance—while ensuring every customer across MENA, Asia, and worldwide receives exceptional quality, performance, and value.</p>
      </div>
    </div>
  );
};