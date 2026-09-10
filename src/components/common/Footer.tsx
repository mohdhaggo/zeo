import React from 'react';
import { COMPANY, SOCIAL } from '../../config/company';
import { resetConsent } from '../../lib/consent';
import { analyticsRequiresConsent } from '../../lib/analytics';

const linkStyle: React.CSSProperties = {
  color: '#AAA',
  textDecoration: 'none',
  fontSize: '0.9rem',
};

export const Footer: React.FC = () => {
  const social = SOCIAL.filter((profile) => profile.url);

  // Withdrawing consent has to be as easy as giving it. Clearing the stored
  // choice brings the banner back; the reload is what stops an already-running
  // Google Analytics from continuing in this tab.
  const openCookieSettings = () => {
    resetConsent();
    window.location.reload();
  };

  return (
    <footer
      className="fade-section"
      style={{
        background: '#030303',
        padding: '48px 0 32px',
        borderTop: '1px solid #E5091422',
        marginTop: '60px',
      }}
    >
      <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px' }}>
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '32px',
          }}
        >
          <div>
            <h4 style={{ marginBottom: '16px' }}>ZEO SHIELDS</h4>
            <p style={{ color: '#999', fontSize: '0.85rem', lineHeight: 1.7 }}>
              Premium automotive protection films engineered for extreme conditions across the
              Middle East, Asia, and global markets.
            </p>
          </div>

          <nav
            className="footer-links"
            aria-label="Quick links"
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <h4 style={{ marginBottom: '16px' }}>Quick Links</h4>
            <a href="/about" style={linkStyle}>
              About Us
            </a>
            <a href="/warranty" style={linkStyle}>
              Warranty Policy &amp; Validation
            </a>
            <a href="/contact" style={linkStyle}>
              Contact Distributors
            </a>
          </nav>

          <nav
            className="footer-links"
            aria-label="Products"
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <h4 style={{ marginBottom: '16px' }}>Products</h4>
            <a href="/ppf-cat" style={linkStyle}>
              Paint Protection Film
            </a>
            {/* Both of these are still marked coming soon on the products page,
                which is where these links now land rather than at "#". */}
            <a href="/products" style={linkStyle}>
              Window Tint
            </a>
            <a href="/products" style={linkStyle}>
              Windshield Film
            </a>
          </nav>

          <nav
            className="footer-links"
            aria-label="Legal"
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <h4 style={{ marginBottom: '16px' }}>Legal</h4>
            <a href="/privacy-policy" style={linkStyle}>
              Privacy Policy
            </a>
            <a href="/terms-conditions" style={linkStyle}>
              Terms &amp; Conditions
            </a>
            <a href="/refund-policy" style={linkStyle}>
              Refund &amp; Returns
            </a>
            {analyticsRequiresConsent && (
            <button
              type="button"
              onClick={openCookieSettings}
              style={{
                ...linkStyle,
                background: 'none',
                border: 0,
                padding: 0,
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Cookie Settings
            </button>
            )}
          </nav>

          {social.length > 0 && (
            <div className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ marginBottom: '16px' }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '16px' }}>
                {social.map((profile) => (
                  <a
                    key={profile.name}
                    href={profile.url}
                    aria-label={profile.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#AAA' }}
                  >
                    <i className={'fab ' + profile.icon + ' fa-lg'} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="footer-copyright"
          style={{
            textAlign: 'center',
            paddingTop: '24px',
            borderTop: '1px solid #222',
            color: '#8A8A8A',
            fontSize: '0.8rem',
          }}
        >
          <p>
            &copy; {new Date().getFullYear()} {COMPANY.brand} &mdash; Global Protection. Engineered
            to Dominate. | Middle East | Asia | Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};
