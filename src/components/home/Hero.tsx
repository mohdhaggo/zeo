import React from 'react';
import { Link } from 'react-router-dom';
import { useWordAnimation } from '../../hooks/useWordAnimation';
import { useFadeIn } from '../../hooks/useFadeIn';

const words = ["Protection", "Performance", "Durability", "Innovation", "Domination"];

export const Hero: React.FC = () => {
  const fadeRef = useFadeIn<HTMLDivElement>();
  const { currentWord, isAnimating } = useWordAnimation(words);

  return (
    <section 
      ref={fadeRef}
      className="hero fade-section" 
      style={{
        minHeight: '85vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '2px solid #E50914',
        background: 'rgba(0, 0, 0, 0.7)'
      }}
    >
      <div className="hero-bg" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: "url('zeo_landing.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 0
      }}></div>
      <style>{`
        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(95deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%);
          z-index: 1;
        }
        .hero .container {
          position: relative;
          z-index: 2;
        }
        @keyframes wordFade {
          0% { opacity: 0; transform: translateY(-20px); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
      
      <div className="container">
        <div className="hero-badge" style={{
          background: 'rgba(229,9,20,0.2)',
          backdropFilter: 'blur(8px)',
          borderRadius: '60px',
          padding: '8px 20px',
          display: 'inline-block',
          marginBottom: '30px',
          fontWeight: 600,
          borderLeft: '3px solid #E50914'
        }}>
          <i className="fas fa-shield-haltered"></i> ENGINEERED FOR THE MIDDLE EAST, ASIA & BEYOND
        </div>
        
        <div className="animated-word-container" style={{
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '18px',
          marginBottom: '20px'
        }}>
          <span className="static-prefix" style={{
            fontSize: '4rem',
            fontWeight: 800,
            fontFamily: "'Orbitron', monospace",
            color: 'white',
            lineHeight: 1.2,
            whiteSpace: 'nowrap'
          }}>Ultimate</span>
          <div className="word-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <span 
              className="animated-word" 
              style={{
                display: 'inline-block',
                fontWeight: 800,
                fontFamily: "'Orbitron', monospace",
                background: 'linear-gradient(135deg, #E50914, #FF6B6B)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontSize: '4rem',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                animation: isAnimating ? 'wordFade 0.4s ease-out' : 'none'
              }}
            >
              {currentWord}
            </span>
          </div>
        </div>
        
        <p className="hero-subtitle" style={{
          fontSize: '1.2rem',
          maxWidth: '580px',
          margin: '20px 0 30px'
        }}>
          PPF, Window Tint & Windshield Film — engineered for extreme climates, high-speed roads, and global performance standards.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn-primary">Explore Products</Link>
          <Link to="/contact" className="btn-outline-silver">Get In Touch</Link>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 900px) {
          .static-prefix, .animated-word {
            font-size: 2.2rem !important;
          }
          .word-wrapper {
            min-width: 180px;
          }
        }
      `}</style>
    </section>
  );
};