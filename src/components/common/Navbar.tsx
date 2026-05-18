import React, { useState } from 'react';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'PRODUCTS', path: '/products' },
    { name: 'CONTACT', path: '/contact' }
  ];

  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container nav-flex">
        <a href="/" className="logo-link" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo-area" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <img 
              src="/zeo_logo.webp" 
              alt="Zeo Shields Logo" 
              className="logo-image" 
              style={{ height: '48px', width: 'auto', borderRadius: '12px', objectFit: 'contain' }}
            />
            <span className="logo-title" style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              fontFamily: "'Orbitron', monospace",
              background: 'linear-gradient(130deg, #FFFFFF, #E50914)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              whiteSpace: 'nowrap'
            }}>ZEO SHIELDS</span>
          </div>
        </a>
        
        <div 
          className="menu-icon" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ display: 'none', fontSize: '28px', cursor: 'pointer', color: '#E50914' }}
        >
          <i className="fas fa-bolt"></i>
        </div>
        
        <ul className="nav-links" style={{
          display: 'flex',
          gap: '36px',
          listStyle: 'none',
          margin: 0,
          padding: 0
        }}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <a 
                href={link.path} 
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                style={{
                  textDecoration: 'none',
                  color: '#DDD',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  fontFamily: "'Orbitron', monospace",
                  transition: '0.2s',
                  position: 'relative',
                  padding: '5px 0',
                  display: 'inline-block'
                }}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      <style>{`
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 0%;
          height: 2px;
          background: #E50914;
          transition: 0.3s;
        }
        .nav-link:hover::after, .nav-link.active::after {
          width: 100%;
        }
        .nav-link:hover, .nav-link.active {
          color: #E50914;
        }
        @media (max-width: 900px) {
          .menu-icon {
            display: block !important;
          }
          .nav-links {
            display: ${isMenuOpen ? 'flex' : 'none'} !important;
            flex-direction: column;
            background: #030303;
            padding: 24px;
            border-radius: 28px;
            position: absolute;
            top: 75px;
            right: 20px;
            width: 220px;
            border: 1px solid #E50914;
          }
          .logo-title {
            font-size: 1rem;
            white-space: normal;
          }
          .logo-image {
            height: 40px;
          }
        }
      `}</style>
    </nav>
  );
};