import React, { useEffect, useRef, useState } from 'react';
import { CONSENT_EVENT, getConsent, setConsent } from '../../lib/consent';
import { analyticsRequiresConsent, loadConsentedAnalytics } from '../../lib/analytics';

/**
 * Cookie consent banner.
 *
 * Accept and Decline are given equal visual weight on purpose. A banner where
 * refusing is harder than accepting is treated as invalid consent under both
 * GDPR and China's PIPL, so the styling here is a compliance decision rather
 * than a design preference.
 *
 * There is no close button and no dismiss-on-Escape. Closing a consent prompt
 * without answering it is not consent, so the only ways out are the two
 * buttons - which also means the visitor cannot get stuck with the banner
 * covering content they cannot reach.
 */
export const CookieConsent: React.FC = () => {
  // Computed in the initialiser rather than set from an effect. Setting state
  // synchronously inside an effect renders twice, and here the second render is
  // what the visitor sees - so the banner would flash in a frame late on every
  // first visit. Nothing to ask about when no measurement ID is configured
  // either: the site sets no cookie of its own, so the banner would be asking
  // permission for something that never happens.
  const [visible, setVisible] = useState(
    () => analyticsRequiresConsent && getConsent() === null,
  );
  const acceptRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!analyticsRequiresConsent) return;

    // The footer link clears the stored choice and dispatches this, which is
    // what brings the banner back so a visitor can change their mind.
    const onChange = () => setVisible(getConsent() === null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Moving focus into the banner is what makes it reachable for a keyboard or
  // screen-reader user, who would otherwise have to tab past the whole page.
  useEffect(() => {
    if (visible) acceptRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  const choose = (choice: 'accepted' | 'declined') => {
    setConsent(choice);
    setVisible(false);
    if (choice === 'accepted') loadConsentedAnalytics();
  };

  const button = (primary: boolean): React.CSSProperties => ({
    flex: '1 1 140px',
    padding: '13px 22px',
    borderRadius: '40px',
    border: primary ? '1px solid #E50914' : '1px solid #55555F',
    background: primary ? '#E50914' : 'transparent',
    color: '#FFFFFF',
    fontFamily: "'Orbitron', system-ui, sans-serif",
    fontSize: '0.82rem',
    fontWeight: 700,
    letterSpacing: '0.03em',
    cursor: 'pointer',
    minHeight: '46px',
  });

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-heading"
      style={{
        position: 'fixed',
        left: '16px',
        right: '16px',
        bottom: '16px',
        zIndex: 9999,
        maxWidth: '760px',
        margin: '0 auto',
        background: '#0C0C12',
        border: '1px solid rgba(229,9,20,0.45)',
        borderRadius: '20px',
        padding: 'clamp(18px, 4vw, 26px)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
      }}
    >
      <h2
        id="cookie-consent-heading"
        style={{
          fontFamily: "'Orbitron', system-ui, sans-serif",
          fontSize: '0.95rem',
          color: '#FFFFFF',
          marginBottom: '10px',
        }}
      >
        Cookies on this site
      </h2>

      <p style={{ color: '#D8D8DE', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '18px' }}>
        We count visits without cookies, and that part always runs. We would also like to use Google
        Analytics, which does set cookies, to understand which pages are useful. It stays switched
        off unless you accept. Read our{' '}
        <a href="/privacy-policy" style={{ color: '#FF6B6B' }}>
          privacy policy
        </a>
        .
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <button ref={acceptRef} type="button" onClick={() => choose('accepted')} style={button(true)}>
          ACCEPT
        </button>
        <button type="button" onClick={() => choose('declined')} style={button(false)}>
          DECLINE
        </button>
      </div>
    </div>
  );
};
