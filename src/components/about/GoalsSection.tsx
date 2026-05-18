import React from 'react';

export const GoalsSection: React.FC = () => {
  const goals = [
    "Provide best-in-class protection solutions for all vehicle types worldwide",
    "Continuously innovate with latest material technologies for extreme climates",
    "Maintain long-term customer trust and satisfaction across all markets",
    "Expand our presence across Middle Eastern, Asian, and international markets",
    "Set new global standards in quality, durability and performance"
  ];

  return (
    <div className="goals fade-section" style={{ margin: '60px 0' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '30px', color: '#E50914' }}>OUR GLOBAL GOALS</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {goals.map((goal, index) => (
          <div key={index} style={{
            background: '#0C0C12',
            padding: '20px',
            borderRadius: '20px',
            transition: 'all 0.3s ease'
          }}>
            <i className="fas fa-check-circle" style={{ color: '#E50914', marginRight: '10px' }}></i>
            {goal}
          </div>
        ))}
      </div>
    </div>
  );
};