import React, { useState, useEffect, useRef } from 'react';
import { ReCaptcha, type ReCaptchaHandle } from '../components/common/ReCaptcha';

// Public key. The paired secret lives only in the Pages Function environment,
// which is what makes the token meaningful.
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '';

interface WarrantyData {
  warrantyNumber: string;
  productName: string;
  manufactureDate: string;
  status: string;
  registrationDate: string;
  eligibleForRegistration: boolean;
}

export const WarrantyPage: React.FC = () => {
  const [warrantyId, setWarrantyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [warrantyDetails, setWarrantyDetails] = useState<WarrantyData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({ warrantyId: '', registeredTo: '' });
  const [regFormData, setRegFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    country: '',
    purchaseDate: ''
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [captchaUnavailable, setCaptchaUnavailable] = useState(false);
  const recaptchaRef = useRef<ReCaptchaHandle>(null);

  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Check warranty using AWS Amplify with public access
  const checkWarranty = async (warrantyNumber: string) => {
    if (!warrantyNumber.trim()) {
      setMessage({ text: '⚠️ Please enter a Warranty ID.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);
    setWarrantyDetails(null);

    try {
      // Server-side lookup: the response carries no customer PII.
      const response = await fetch('/api/warranty/' + encodeURIComponent(warrantyNumber.trim()));
      const data = (await response.json()) as {
        found: boolean;
        warrantyNumber?: string;
        productName?: string;
        manufactureDate?: string;
        status?: string;
        registrationDate?: string;
        eligibleForRegistration?: boolean;
        message?: string;
      };

      if (!data.found) {
        setMessage({ text: '❌ ' + (data.message || 'Warranty ID not found in the system.'), type: 'error' });
        return;
      }

      setWarrantyDetails({
        warrantyNumber: data.warrantyNumber || warrantyNumber,
        productName: data.productName || '-',
        manufactureDate: data.manufactureDate || '-',
        status: data.status || 'UNREGISTERED',
        registrationDate: data.registrationDate || '-',
        eligibleForRegistration: data.eligibleForRegistration ?? false,
      });

      setMessage(
        data.status === 'ACTIVE'
          ? { text: '✅ This warranty is already registered.', type: 'success' }
          : { text: '✅ Valid warranty! This product is eligible for registration.', type: 'success' },
      );
    } catch (error) {
      console.error('Error checking warranty:', error);
      const detail = error instanceof Error ? error.message : 'Connection error. Please try again.';
      setMessage({ text: '❌ ' + detail, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const registerWarranty = async () => {
    if (!warrantyDetails) {
      setMessage({ text: 'Please validate a warranty first.', type: 'error' });
      return;
    }

    const { fullName, mobile, email, country, purchaseDate } = regFormData;

    if (!fullName || !mobile || !email || !country) {
      setMessage({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    if (!recaptchaToken) {
      setMessage({ text: 'Please complete the verification challenge.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      // The API re-checks that the warranty is still unregistered inside the
      // UPDATE, so this cannot be raced or bypassed from the client.
      const response = await fetch('/api/warranty/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          warrantyNumber: warrantyDetails.warrantyNumber,
          customerName: fullName,
          email,
          phone: mobile,
          purchaseCountry: country,
          // Sent only when the customer actually gave one. This used to fall back
          // to today's date, which silently recorded a false purchase date on
          // the record a warranty claim is later judged against.
          purchaseDate: purchaseDate || '',
          recaptchaToken,
        }),
      });

      const data = (await response.json()) as { success: boolean; message?: string };

      if (!data.success) {
        // The token is single-use, so a rejected submission needs a fresh one.
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
        setMessage({ text: data.message || 'Registration failed.', type: 'error' });
        return;
      }

      setShowModal(false);
      setSuccessData({ warrantyId: warrantyDetails.warrantyNumber, registeredTo: fullName });
      setShowSuccessModal(true);
      handleReset();
    } catch (error) {
      console.error('Error registering warranty:', error);
      const detail = error instanceof Error ? error.message : 'Please try again.';
      setMessage({ text: 'Registration failed: ' + detail, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWarrantyId('');
    setMessage(null);
    setWarrantyDetails(null);
    setRegFormData({ fullName: '', mobile: '', email: '', country: '', purchaseDate: '' });
    recaptchaRef.current?.reset();
    setRecaptchaToken(null);
  };

  const formatDateOnly = (dateString: string | undefined) => {
    if (!dateString || dateString === '-') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString.split(' ')[0];
      return date.toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };

  const openRegistrationModal = () => {
    if (!warrantyDetails) {
      setMessage({ text: 'Please validate a warranty first.', type: 'error' });
      return;
    }
    // The same predicate the server uses. Testing status === 'ACTIVE' here
    // meant any other value - a legacy import, a manual edit, wrong casing -
    // opened a form the server would then refuse, telling the customer their
    // warranty was both claimable and already claimed.
    if (!warrantyDetails.eligibleForRegistration) {
      setMessage({ text: 'This warranty is already registered.', type: 'error' });
      return;
    }
    setRegFormData({ fullName: '', mobile: '', email: '', country: '', purchaseDate: '' });
    setRecaptchaToken(null);
    setShowModal(true);
  };

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegFormData({ ...regFormData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px' }}>
      {/* Warranty Hero */}
      <div className="warranty-hero fade-section" style={{ padding: '60px 0 40px', textAlign: 'center' }}>
        <div className="warranty-badge" style={{
          display: 'inline-block',
          background: 'rgba(229,9,20,0.2)',
          padding: '6px 16px',
          borderRadius: '30px',
          fontSize: '0.8rem',
          marginBottom: '20px',
          borderLeft: '3px solid #E50914',
          fontFamily: "'Orbitron', monospace"
        }}>
          <i className="fas fa-shield-alt"></i> OFFICIAL REGISTRATION PORTAL
        </div>
        <h1 style={{
          fontSize: '3rem',
          background: 'linear-gradient(135deg, #FFFFFF, #E50914)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '15px'
        }}>Warranty Registration</h1>
        <p style={{ color: '#aaa', maxWidth: '650px', margin: '0 auto' }}>Register your Zeo Shields product warranty. Enter your unique Warranty ID to get started.</p>
      </div>

      {/* Warranty Card */}
      <div className="warranty-card fade-section" style={{
        maxWidth: '650px',
        margin: '20px auto 60px',
        background: '#0C0C12',
        borderRadius: '32px',
        border: '1px solid rgba(229,9,20,0.3)',
        padding: '40px 36px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ fontSize: '4rem', color: '#E50914', marginBottom: '16px' }}>
          <i className="fas fa-id-card"></i>
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', color: '#fff' }}>Check Your Warranty</h2>
        <p style={{ color: '#aaa', marginBottom: '28px', fontSize: '0.95rem' }}>Please enter the Warranty ID provided with your product purchase.</p>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <label htmlFor="warranty-number" className="visually-hidden">
            Warranty number
          </label>
          <input
            id="warranty-number"
            type="text"
            value={warrantyId}
            onChange={(e) => setWarrantyId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkWarranty(warrantyId)}
            placeholder="Enter Warranty ID (e.g., PPF-00-12345)"
            style={{
              flex: '2',
              minWidth: '200px',
              padding: '14px 20px',
              background: '#1A1A22',
              border: '1px solid #333',
              borderRadius: '60px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none',
              transition: '0.2s'
            }}
            disabled={loading}
          />
          <button
            onClick={() => checkWarranty(warrantyId)}
            disabled={loading}
            style={{
              padding: '14px 32px',
              background: '#E50914',
              border: 'none',
              borderRadius: '60px',
              fontWeight: 'bold',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Orbitron', monospace",
              transition: '0.2s',
              opacity: loading ? 0.6 : 1
            }}
          >
            <i className="fas fa-arrow-right"></i> {loading ? 'Checking...' : 'Enter'}
          </button>
        </div>
        
        {message && (
          <div style={{
            background: message.type === 'error' ? '#1e1215' : message.type === 'success' ? '#121b12' : '#1f1b10',
            borderRadius: '24px',
            padding: '16px 20px',
            margin: '20px 0',
            textAlign: 'center',
            borderLeft: `4px solid ${message.type === 'error' ? '#E50914' : message.type === 'success' ? '#4caf50' : '#ffc107'}`,
            color: message.type === 'error' ? '#ff9b9b' : message.type === 'success' ? '#b9f6ca' : '#ffe0a3'
          }}>
            {message.text}
          </div>
        )}

        {/* Warranty Details */}
        {warrantyDetails && (
          <div style={{
            background: '#1A1A22',
            borderRadius: '24px',
            padding: '20px',
            margin: '20px 0',
            textAlign: 'left',
            border: '1px solid rgba(229,9,20,0.2)'
          }}>
            <h3 style={{
              color: '#E50914',
              fontFamily: "'Orbitron', monospace",
              fontSize: '1.2rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px solid #333',
              paddingBottom: '12px'
            }}>
              <i className="fas fa-info-circle"></i> Warranty Information
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
              <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Warranty ID:</span>
              <span style={{ color: '#fff', fontSize: '0.85rem' }}>{warrantyDetails.warrantyNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
              <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Product Type:</span>
              <span style={{ color: '#fff', fontSize: '0.85rem' }}>{warrantyDetails.productName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
              <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Manufacture Date:</span>
              <span style={{ color: '#fff', fontSize: '0.85rem' }}>{formatDateOnly(warrantyDetails.manufactureDate)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Status:</span>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                background: warrantyDetails.status === 'ACTIVE' ? '#4caf50' : '#ffc107',
                color: warrantyDetails.status === 'ACTIVE' ? 'white' : '#000'
              }}>
                {warrantyDetails.status === 'ACTIVE' ? '✓ Registered' : '⏱ Not Registered'}
              </span>
            </div>
            
            {warrantyDetails.status === 'ACTIVE' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid #2a2a2a', marginTop: '10px', paddingTop: '15px' }}>
                <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Registration Date:</span>
                <span style={{ color: '#fff', fontSize: '0.85rem' }}>{formatDateOnly(warrantyDetails.registrationDate)}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        {warrantyDetails && (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px' }}>
            {warrantyDetails.status !== 'ACTIVE' && (
              <button onClick={openRegistrationModal} style={{
                padding: '12px 28px',
                borderRadius: '40px',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: '#E50914',
                color: 'white',
                border: 'none',
                fontFamily: "'Orbitron', monospace",
                transition: '0.2s'
              }}>
                <i className="fas fa-pen-alt"></i> Register Now
              </button>
            )}
            <button onClick={handleReset} style={{
              padding: '12px 28px',
              borderRadius: '40px',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: '#2C2C36',
              color: '#ddd',
              border: 'none',
              fontFamily: "'Orbitron', monospace",
              transition: '0.2s'
            }}>
              <i className="fas fa-times"></i> Clear
            </button>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#0F0F15',
            borderRadius: '36px',
            maxWidth: '560px',
            width: '90%',
            padding: '32px 30px',
            border: '1px solid rgba(229,9,20,0.5)',
            position: 'relative',
            maxHeight: '85vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div onClick={() => setShowModal(false)} style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#aaa',
              transition: '0.2s'
            }}>
              <i className="fas fa-times"></i>
            </div>
            
            <h3 style={{ fontFamily: "'Orbitron', monospace", color: '#E50914', marginBottom: '24px', fontSize: '1.6rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <i className="fas fa-user-check"></i> Complete Registration
            </h3>
            
            <div style={{ marginBottom: '6px' }}>
              <label htmlFor="reg-full-name" style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginLeft: '12px', marginBottom: '4px', textAlign: 'left' }}>
                <i className="fas fa-user"></i> Full Name (Registered To) *
              </label>
              <input
                type="text"
                id="reg-full-name"
                name="fullName"
                required
                value={regFormData.fullName}
                onChange={handleRegChange}
                placeholder="Enter your full name"
                autoComplete="name"
                style={{ width: '100%', padding: '14px 18px', background: '#1A1A22', border: '1px solid #333', borderRadius: '40px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '6px' }}>
              <label htmlFor="reg-mobile" style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginLeft: '12px', marginBottom: '4px', textAlign: 'left' }}>
                <i className="fas fa-phone-alt"></i> Mobile Number *
              </label>
              <input
                type="tel"
                id="reg-mobile"
                name="mobile"
                required
                value={regFormData.mobile}
                onChange={handleRegChange}
                placeholder="+1234567890"
                autoComplete="tel"
                style={{ width: '100%', padding: '14px 18px', background: '#1A1A22', border: '1px solid #333', borderRadius: '40px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '6px' }}>
              <label htmlFor="reg-email" style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginLeft: '12px', marginBottom: '4px', textAlign: 'left' }}>
                <i className="fas fa-envelope"></i> Email ID *
              </label>
              <input
                type="email"
                id="reg-email"
                name="email"
                required
                value={regFormData.email}
                onChange={handleRegChange}
                placeholder="your@email.com"
                autoComplete="email"
                style={{ width: '100%', padding: '14px 18px', background: '#1A1A22', border: '1px solid #333', borderRadius: '40px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '6px' }}>
              <label htmlFor="reg-country" style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginLeft: '12px', marginBottom: '4px', textAlign: 'left' }}>
                <i className="fas fa-globe-americas"></i> Country of Purchase *
              </label>
              <select
                id="reg-country"
                name="country"
                required
                value={regFormData.country}
                onChange={handleRegChange}
                style={{ width: '100%', padding: '14px 18px', background: '#1A1A22', border: '1px solid #333', borderRadius: '40px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
              >
                <option value="">Select Country</option>
                <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                <option value="UAE">🇦🇪 United Arab Emirates</option>
                <option value="Qatar">🇶🇦 Qatar</option>
                <option value="Kuwait">🇰🇼 Kuwait</option>
                <option value="Bahrain">🇧🇭 Bahrain</option>
                <option value="Oman">🇴🇲 Oman</option>
                <option value="Other">🌍 Other</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '6px' }}>
              <label htmlFor="reg-purchase-date" style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginLeft: '12px', marginBottom: '4px', textAlign: 'left' }}>
                <i className="fas fa-calendar-alt"></i> Purchase Date
              </label>
              <input
                type="date"
                id="reg-purchase-date"
                name="purchaseDate"
                value={regFormData.purchaseDate}
                onChange={handleRegChange}
                style={{ width: '100%', padding: '14px 18px', background: '#1A1A22', border: '1px solid #333', borderRadius: '40px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
              />
            </div>
            
            {/* Registration permanently binds this warranty to a person, so it
                gets the same anti-automation check as the contact form. Without
                it the endpoint could be scripted to claim every unregistered
                warranty in the database. */}
            <div
              style={{
                marginTop: '18px',
                display: 'flex',
                justifyContent: 'center',
                // The widget is a fixed 304px and the modal is narrower than
                // that on a small phone, so it is scaled to fit rather than
                // pushing the dialog into horizontal scroll.
                transform: 'scale(0.88)',
                transformOrigin: 'center',
              }}
            >
              {!RECAPTCHA_SITE_KEY || captchaUnavailable ? (
                <p style={{ color: '#FF8175', fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.6 }}>
                  Verification could not load, so registration cannot be completed here. Please
                  email <a href="mailto:info@zeoshields.com" style={{ color: '#FF8175' }}>info@zeoshields.com</a>{' '}
                  with your warranty number and we will register it for you.
                </p>
              ) : (
                <ReCaptcha
                  ref={recaptchaRef}
                  siteKey={RECAPTCHA_SITE_KEY}
                  onVerify={setRecaptchaToken}
                  onExpire={() => setRecaptchaToken(null)}
                  onUnavailable={() => setCaptchaUnavailable(true)}
                />
              )}
            </div>

            <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
              <button onClick={registerWarranty} disabled={loading} style={{
                flex: 1,
                padding: '12px',
                borderRadius: '40px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: '#E50914',
                color: 'white',
                border: 'none',
                fontFamily: "'Orbitron', monospace",
                transition: '0.2s',
                opacity: loading ? 0.6 : 1
              }}>
                <i className="fas fa-check-circle"></i> {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1,
                padding: '12px',
                borderRadius: '40px',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: '#2C2C36',
                color: '#ddd',
                border: 'none',
                fontFamily: "'Orbitron', monospace",
                transition: '0.2s'
              }}>
                <i className="fas fa-times"></i> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: 4000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowSuccessModal(false)}>
          <div style={{
            background: '#0F0F15',
            borderRadius: '36px',
            maxWidth: '450px',
            width: '90%',
            padding: '40px 35px',
            textAlign: 'center',
            border: '1px solid rgba(76, 175, 80, 0.5)',
            boxShadow: '0 30px 50px rgba(0,0,0,0.6)',
            animation: 'modalPopIn 0.3s ease'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '5rem', color: '#4caf50', marginBottom: '20px' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h3 style={{ fontFamily: "'Orbitron', monospace", color: '#4caf50', fontSize: '1.8rem', marginBottom: '15px' }}>Registration Successful!</h3>
            <p style={{ color: '#ddd', margin: '10px 0', lineHeight: '1.5' }}>Your warranty has been successfully registered.</p>
            <div style={{
              background: '#1A1A22',
              padding: '15px',
              borderRadius: '40px',
              fontFamily: 'monospace',
              color: '#E50914',
              margin: '15px 0',
              fontSize: '1rem'
            }}>
              <strong>Warranty ID:</strong> {successData.warrantyId}<br />
              <strong>Registered To:</strong> {successData.registeredTo}
            </div>
            <button 
              onClick={() => setShowSuccessModal(false)}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '40px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: "'Orbitron', monospace",
                marginTop: '20px',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#45a049'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#4caf50'}
            >
              <i className="fas fa-check"></i> Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};