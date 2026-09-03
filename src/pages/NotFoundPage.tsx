import React from 'react';

export const NotFoundPage: React.FC = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '80px 20px',
      background: '#010101',
      color: '#EAEAEA',
    }}
  >
    <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: '3rem', color: '#E50914', marginBottom: '12px' }}>404</h1>
    <p style={{ fontSize: '1.1rem', marginBottom: '28px', color: '#aaa' }}>
      That page does not exist. It may have moved, or the link may be out of date.
    </p>
    <a
      href="/"
      style={{
        background: '#E50914',
        color: 'white',
        padding: '14px 32px',
        borderRadius: '40px',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontFamily: "'Orbitron', monospace",
      }}
    >
      Back to Home
    </a>
  </div>
);
