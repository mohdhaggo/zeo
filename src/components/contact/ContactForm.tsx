import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { contactService } from '../../services/contactService';

const RECAPTCHA_SITE_KEY = '6LeE1uYsAAAAAOQ-e0UgE3IXPG3D5pI4uJLdSizb';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    interest: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.region || !formData.interest || !formData.message) {
      setMessage({ type: 'error', text: '❌ Please fill in all required fields.' });
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: '❌ Please enter a valid email address.' });
      return;
    }
    
    // Validate reCAPTCHA
    if (!recaptchaToken) {
      setMessage({ type: 'error', text: '❌ Please complete the reCAPTCHA verification.' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: 'info', text: '📧 Sending your message...' });
    
    try {
      const response = await contactService.submitContact({
        ...formData,
        recaptchaToken
      });
      
      if (response.success) {
        setMessage({ type: 'success', text: '✅ Thank you! Your message has been sent successfully. A Zeo Shields representative will contact you within 24 hours.' });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          region: '',
          interest: '',
          message: ''
        });
        // Reset reCAPTCHA
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      } else {
        throw new Error(response.message || 'Failed to send');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: '❌ Failed to send message. Please try again later or call us directly.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form">
      <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#E50914' }}>
        <i className="fas fa-paper-plane"></i> Send us a message
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            style={{
              width: '100%',
              padding: '14px 18px',
              background: '#13131A',
              border: '1px solid #2A2A35',
              borderRadius: '20px',
              color: 'white',
              fontSize: '1rem'
            }}
            required
          />
        </div>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            style={{
              width: '100%',
              padding: '14px 18px',
              background: '#13131A',
              border: '1px solid #2A2A35',
              borderRadius: '20px',
              color: 'white',
              fontSize: '1rem'
            }}
            required
          />
        </div>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+XXX XX XXX XXXX"
            style={{
              width: '100%',
              padding: '14px 18px',
              background: '#13131A',
              border: '1px solid #2A2A35',
              borderRadius: '20px',
              color: 'white',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="region" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Region *</label>
          <select
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: '#13131A',
              border: '1px solid #2A2A35',
              borderRadius: '20px',
              color: 'white',
              fontSize: '1rem'
            }}
            required
          >
            <option value="">Select your region</option>
            <option value="middle-east">Middle East</option>
            <option value="asia">Asia Pacific</option>
            <option value="europe">Europe</option>
            <option value="north-america">North America</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="interest" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Product Interest *</label>
          <select
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '14px 18px',
              background: '#13131A',
              border: '1px solid #2A2A35',
              borderRadius: '20px',
              color: 'white',
              fontSize: '1rem'
            }}
            required
          >
            <option value="">Select product</option>
            <option value="ppf">Paint Protection Film (PPF)</option>
            <option value="multiple">Multiple / Not sure</option>
          </select>
        </div>
        
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your vehicle and protection needs..."
            style={{
              width: '100%',
              padding: '14px 18px',
              background: '#13131A',
              border: '1px solid #2A2A35',
              borderRadius: '20px',
              color: 'white',
              fontSize: '1rem',
              resize: 'vertical',
              minHeight: '120px'
            }}
            required
          />
        </div>
        
        <div className="recaptcha-container" style={{
          margin: '20px 0',
          background: '#0F0F15',
          padding: '12px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />
        </div>
        
        {message && (
          <div className={`form-message ${message.type}`} style={{
            padding: '12px',
            borderRadius: '12px',
            marginTop: '15px',
            textAlign: 'center',
            background: message.type === 'success' ? 'rgba(46, 204, 113, 0.2)' : message.type === 'error' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)',
            border: `1px solid ${message.type === 'success' ? '#2ecc71' : message.type === 'error' ? '#e74c3c' : '#3498db'}`,
            color: message.type === 'success' ? '#2ecc71' : message.type === 'error' ? '#e74c3c' : '#3498db'
          }}>
            {message.text}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="submit-btn"
          style={{
            width: '100%',
            background: '#E50914',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '40px',
            fontWeight: 'bold',
            fontSize: '1rem',
            fontFamily: "'Orbitron', monospace",
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            marginTop: '10px'
          }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                borderTopColor: 'white',
                animation: 'spin 0.8s linear infinite',
                marginRight: '8px',
                verticalAlign: 'middle'
              }}></span>
              Sending...
            </>
          ) : (
            <>
              <i className="fas fa-envelope"></i> Send Message
            </>
          )}
        </button>
      </form>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none;
          border-color: #E50914;
          box-shadow: 0 0 0 2px rgba(229,9,20,0.2);
        }
      `}</style>
    </div>
  );
};