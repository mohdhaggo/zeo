import React, { useState, useEffect } from 'react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwtZxdLQOKSJiMYtzeWfsef9WYugiyW9Wuy7aq5Ux9nkJEBGQ944MBQM73T70mKQfH3/exec';

interface WarrantyData {
  warranty_id: string;
  product_type: string;
  manufacture_date: string;
  status?: string;
  registered_to?: string;
  registration_date?: string;
  mobile_number?: string;
  email_id?: string;
  purchase_date?: string;
  purchase_country?: string;
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

  const checkWarrantyAPI = async (id: string) => {
    const url = `${APPS_SCRIPT_URL}?action=check&warrantyId=${encodeURIComponent(id)}`;
    const response = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  };

  const registerWarrantyAPI = async (registrationData: any) => {
    const params = new URLSearchParams({
      action: 'register',
      warranty_id: registrationData.warranty_id,
      registered_to: registrationData.registered_to,
      mobile_number: registrationData.mobile_number,
      email_id: registrationData.email_id,
      purchase_country: registrationData.purchase_country,
      purchase_date: registrationData.purchase_date || new Date().toISOString().split('T')[0]
    });
    const url = `${APPS_SCRIPT_URL}?${params.toString()}`;
    const response = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
    return await response.json();
  };

  const validateWarranty = async () => {
    if (!warrantyId.trim()) {
      setMessage({ text: '⚠️ Please enter a Warranty ID.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);
    setWarrantyDetails(null);

    try {
      const result = await checkWarrantyAPI(warrantyId);
      
      if (!result.success) {
        setMessage({ text: `❌ ${result.message}`, type: 'error' });
        setWarrantyDetails(null);
      } else {
        const warranty = result.data;
        setWarrantyDetails(warranty);
        
        const isRegistered = warranty.status === 'registered' || 
                           (warranty.registered_to && warranty.registered_to.trim() !== '');
        
        if (isRegistered) {
          setMessage({ text: '✅ This warranty is already registered.', type: 'success' });
        } else {
          setMessage({ text: '✅ Valid warranty! This product is eligible for registration.', type: 'success' });
        }
      }
    } catch (error) {
      setMessage({ text: '❌ Connection error. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDateOnly = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
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
    const isRegistered = warrantyDetails.status === 'registered' || 
                        (warrantyDetails.registered_to && warrantyDetails.registered_to.trim() !== '');
    if (isRegistered) {
      setMessage({ text: 'This warranty is already registered.', type: 'error' });
      return;
    }
    setRegFormData({ fullName: '', mobile: '', email: '', country: '', purchaseDate: '' });
    setShowModal(true);
  };

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegFormData({ ...regFormData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const submitRegistration = async () => {
    const { fullName, mobile, email, country, purchaseDate } = regFormData;
    
    if (!fullName || !mobile || !email || !country) {
      setMessage({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }
    
    if (!validateEmail(email)) {
      setMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    setLoading(true);
    
    try {
      const result = await registerWarrantyAPI({
        warranty_id: warrantyDetails!.warranty_id,
        registered_to: fullName,
        mobile_number: mobile,
        email_id: email,
        purchase_country: country,
        purchase_date: purchaseDate
      });
      
      if (result.success) {
        setShowModal(false);
        setSuccessData({ warrantyId: warrantyDetails!.warranty_id, registeredTo: fullName });
        setShowSuccessModal(true);
        handleReset();
      } else {
        setMessage({ text: `Registration failed: ${result.message}`, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Registration failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWarrantyId('');
    setMessage(null);
    setWarrantyDetails(null);
    setRegFormData({ fullName: '', mobile: '', email: '', country: '', purchaseDate: '' });
  };

  return (
    <>
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
            <input
              type="text"
              value={warrantyId}
              onChange={(e) => setWarrantyId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && validateWarranty()}
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
              onClick={validateWarranty}
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
                <span style={{ color: '#fff', fontSize: '0.85rem' }}>{warrantyDetails.warranty_id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
                <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Product Type:</span>
                <span style={{ color: '#fff', fontSize: '0.85rem' }}>{warrantyDetails.product_type || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
                <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Manufacture Date:</span>
                <span style={{ color: '#fff', fontSize: '0.85rem' }}>{formatDateOnly(warrantyDetails.manufacture_date)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
                <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Status:</span>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  background: (warrantyDetails.status === 'registered' || (warrantyDetails.registered_to && warrantyDetails.registered_to.trim() !== '')) ? '#4caf50' : '#ffc107',
                  color: (warrantyDetails.status === 'registered' || (warrantyDetails.registered_to && warrantyDetails.registered_to.trim() !== '')) ? 'white' : '#000'
                }}>
                  {(warrantyDetails.status === 'registered' || (warrantyDetails.registered_to && warrantyDetails.registered_to.trim() !== '')) ? '✓ Registered' : '⏱ Not Registered'}
                </span>
              </div>
              
              {(warrantyDetails.status === 'registered' || (warrantyDetails.registered_to && warrantyDetails.registered_to.trim() !== '')) && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
                    <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Registration Date:</span>
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{formatDateOnly(warrantyDetails.registration_date)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
                    <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Registered To:</span>
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{warrantyDetails.registered_to}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
                    <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Mobile Number:</span>
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{warrantyDetails.mobile_number}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
                    <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Email ID:</span>
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{warrantyDetails.email_id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2a2a' }}>
                    <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Purchase Date:</span>
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{formatDateOnly(warrantyDetails.purchase_date)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                    <span style={{ fontWeight: 600, color: '#aaa', fontSize: '0.85rem' }}>Purchase Country:</span>
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{warrantyDetails.purchase_country}</span>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          {warrantyDetails && (
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '20px' }}>
              {!(warrantyDetails.status === 'registered' || (warrantyDetails.registered_to && warrantyDetails.registered_to.trim() !== '')) && (
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

        {/* Info Section */}
        <div className="fade-section" style={{ textAlign: 'center', margin: '20px 0 60px' }}>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>
            <i className="fas fa-lock"></i> Secure validation • warranty coverage • Worldwide support
          </p>
        </div>
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
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginLeft: '12px', marginBottom: '4px', textAlign: 'left' }}>
                <i className="fas fa-user"></i> Full Name (Registered To) *
              </label>
              <input
                type="text"
                name="fullName"
                value={regFormData.fullName}
                onChange={handleRegChange}
                placeholder="Enter your full name"
                autoComplete="name"
                style={{ width: '100%', padding: '14px 18px', background: '#1A1A22', border: '1px solid #333', borderRadius: '40px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '6px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginLeft: '12px', marginBottom: '4px', textAlign: 'left' }}>
                <i className="fas fa-phone-alt"></i> Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={regFormData.mobile}
                onChange={handleRegChange}
                placeholder="+1234567890"
                autoComplete="tel"
                style={{ width: '100%', padding: '14px 18px', background: '#1A1A22', border: '1px solid #333', borderRadius: '40px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '6px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginLeft: '12px', marginBottom: '4px', textAlign: 'left' }}>
                <i className="fas fa-envelope"></i> Email ID *
              </label>
              <input
                type="email"
                name="email"
                value={regFormData.email}
                onChange={handleRegChange}
                placeholder="your@email.com"
                autoComplete="email"
                style={{ width: '100%', padding: '14px 18px', background: '#1A1A22', border: '1px solid #333', borderRadius: '40px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '6px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginLeft: '12px', marginBottom: '4px', textAlign: 'left' }}>
                <i className="fas fa-globe-americas"></i> Country of Purchase *
              </label>
              <select
                name="country"
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
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#aaa', marginLeft: '12px', marginBottom: '4px', textAlign: 'left' }}>
                <i className="fas fa-calendar-alt"></i> Purchase Date
              </label>
              <input
                type="date"
                name="purchaseDate"
                value={regFormData.purchaseDate}
                onChange={handleRegChange}
                style={{ width: '100%', padding: '14px 18px', background: '#1A1A22', border: '1px solid #333', borderRadius: '40px', color: 'white', fontSize: '1rem', outline: 'none', transition: '0.2s', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '14px', marginTop: '24px' }}>
              <button onClick={submitRegistration} disabled={loading} style={{
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
              padding: '10px',
              borderRadius: '40px',
              fontFamily: 'monospace',
              color: '#E50914',
              margin: '15px 0',
              fontSize: '1.1rem'
            }}>
              Warranty ID: {successData.warrantyId}<br />
              Registered To: {successData.registeredTo}
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
              }}>
              <i className="fas fa-check"></i> Continue
            </button>
          </div>
        </div>
      )}

      <style>{`
        .fade-section { opacity: 0; transform: translateY(20px); transition: opacity 0.6s, transform 0.6s; }
        .fade-section.visible { opacity: 1; transform: translateY(0); }
        .warranty-card:hover { transform: translateY(-5px); border-color: rgba(229,9,20,0.6); }
        input:focus, select:focus { outline: none; border-color: #E50914 !important; }
        @keyframes modalPopIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .warranty-card { padding: 28px 20px; margin: 20px 20px 50px; }
        }
      `}</style>
    </>
  );
};