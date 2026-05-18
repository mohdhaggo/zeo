import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="fade-section" style={{
      background: '#030303',
      padding: '48px 0 32px',
      borderTop: '1px solid #E5091422',
      marginTop: '60px'
    }}>
      <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px' }}>
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '32px'
        }}>
          <div>
            <h4 style={{ marginBottom: '16px' }}>ZEO SHIELDS</h4>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>Premium automotive protection films engineered for extreme conditions across the Middle East, Asia, and global markets.</p>
          </div>
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ marginBottom: '16px' }}>Quick Links</h4>
            <a href="/warranty" style={{ color: '#AAA', textDecoration: 'none', fontSize: '0.9rem' }}>Warranty Validation</a>
            <a href="/privacy-policy" style={{ color: '#AAA', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</a>
            <a href="/terms-conditions" style={{ color: '#AAA', textDecoration: 'none', fontSize: '0.9rem' }}>Terms & Conditions</a>
            <a href="/contact" style={{ color: '#AAA', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Distributors</a>
          </div>
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ marginBottom: '16px' }}>Products</h4>
            <a href="/ppf-cat" style={{ color: '#AAA', textDecoration: 'none', fontSize: '0.9rem' }}>Paint Protection Film</a>
            <a href="#" style={{ color: '#AAA', textDecoration: 'none', fontSize: '0.9rem' }}>Window Tint</a>
            <a href="#" style={{ color: '#AAA', textDecoration: 'none', fontSize: '0.9rem' }}>Windshield Film</a>
          </div>
          <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ marginBottom: '16px' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#"><i className="fab fa-instagram fa-lg"></i></a>
              <a href="#"><i className="fab fa-x-twitter fa-lg"></i></a>
              <a href="#"><i className="fab fa-tiktok fa-lg"></i></a>
              <a href="#"><i className="fab fa-linkedin fa-lg"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-copyright" style={{
          textAlign: 'center',
          paddingTop: '24px',
          borderTop: '1px solid #222',
          color: '#777',
          fontSize: '0.8rem'
        }}>
          <p>© 2026 Zeo Shields — Global Protection. Engineered to Dominate. | Middle East | Asia | Worldwide</p>
        </div>
      </div>
    </footer>
  );
};