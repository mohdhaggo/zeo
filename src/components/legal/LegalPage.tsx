import React from 'react';
import { LEGAL_LAST_UPDATED } from '../../config/company';

/**
 * Shared shell for the privacy, terms and refund pages.
 *
 * Long-form legal text has different needs from the marketing pages: a
 * readable measure, generous line height, and body copy at a contrast ratio
 * that passes WCAG AA rather than the dim grey used for captions elsewhere.
 * Colours here are #D8D8DE on #010101, which is a ratio of roughly 13:1.
 */

export const Section: React.FC<{ heading: string; children: React.ReactNode }> = ({
  heading,
  children,
}) => (
  <section style={{ marginBottom: '38px' }}>
    <h2
      style={{
        fontFamily: "'Orbitron', system-ui, sans-serif",
        fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
        color: '#FFFFFF',
        marginBottom: '14px',
        lineHeight: 1.35,
      }}
    >
      {heading}
    </h2>
    {children}
  </section>
);

export const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ color: '#D8D8DE', fontSize: '1rem', lineHeight: 1.85, marginBottom: '14px' }}>
    {children}
  </p>
);

export const List: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul
    style={{
      color: '#D8D8DE',
      fontSize: '1rem',
      lineHeight: 1.85,
      margin: '0 0 14px 0',
      paddingLeft: '22px',
    }}
  >
    {children}
  </ul>
);

export const LI: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li style={{ marginBottom: '8px' }}>{children}</li>
);

interface LegalPageProps {
  title: string;
  intro: string;
  children: React.ReactNode;
}

export const LegalPage: React.FC<LegalPageProps> = ({ title, intro, children }) => (
  <main style={{ background: '#010101', padding: '0 0 80px' }}>
    <header
      style={{
        borderBottom: '2px solid #E50914',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,26,0.9) 100%)',
        padding: 'clamp(64px, 12vw, 110px) 20px clamp(40px, 8vw, 60px)',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: "'Orbitron', system-ui, sans-serif",
          fontSize: 'clamp(1.9rem, 6vw, 3rem)',
          color: '#FFFFFF',
          marginBottom: '14px',
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>
      <p style={{ color: '#C4C4CC', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
        {intro}
      </p>
      <p style={{ color: '#9A9AA4', fontSize: '0.85rem', marginTop: '18px' }}>
        Last updated {LEGAL_LAST_UPDATED}
      </p>
    </header>

    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '56px 22px 0' }}>{children}</div>
  </main>
);
