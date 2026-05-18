import React, { useState, useEffect } from 'react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz0ujxYOjbNvBfG48IWdu7qFx3jHS88_Vin8NCVnXFj1CYozlg33EgMQ_cYnh__V61cBw/exec';

export const ContactPage: React.FC = () => {
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
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaExpected, setCaptchaExpected] = useState<number | null>(null);
  const [captchaStatus, setCaptchaStatus] = useState('Solve the math problem to continue');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
    
    generateCaptcha();
    
    return () => observer.disconnect();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operators = ['+', '-'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let question: string;
    let answer: number;
    
    if (operator === '+') {
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
    } else {
      if (num1 >= num2) {
        question = `${num1} - ${num2}`;
        answer = num1 - num2;
      } else {
        question = `${num2} - ${num1}`;
        answer = num2 - num1;
      }
    }
    
    setCaptchaQuestion(question);
    setCaptchaExpected(answer);
    setCaptchaAnswer('');
    setCaptchaStatus('Solve the math problem to continue');
    setCaptchaValid(false);
  };

  const validateCaptcha = (value: string) => {
    setCaptchaAnswer(value);
    if (value === '') {
      setCaptchaStatus('Solve the math problem to continue');
      setCaptchaValid(false);
      return;
    }
    
    const userAnswer = parseInt(value);
    if (!isNaN(userAnswer) && userAnswer === captchaExpected) {
      setCaptchaStatus('✓ Correct! You can now send the message.');
      setCaptchaValid(true);
    } else if (value !== '') {
      setCaptchaStatus('✗ Incorrect answer. Please try again.');
      setCaptchaValid(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.region || !formData.interest || !formData.message) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    
    if (!captchaValid) {
      setMessage({ type: 'error', text: 'Please solve the math problem correctly.' });
      return;
    }
    
    setLoading(true);
    
    try {
      // Use image request to bypass CORS
      const img = new Image();
      const url = `${APPS_SCRIPT_URL}?action=submit&full_name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.phone)}&region=${encodeURIComponent(formData.region)}&product_interest=${encodeURIComponent(formData.interest)}&message=${encodeURIComponent(formData.message)}&t=${Date.now()}`;
      
      img.onload = () => {
        setLoading(false);
        setFormData({ name: '', email: '', phone: '', region: '', interest: '', message: '' });
        generateCaptcha();
        setShowSuccessModal(true);
      };
      
      img.onerror = () => {
        setLoading(false);
        setFormData({ name: '', email: '', phone: '', region: '', interest: '', message: '' });
        generateCaptcha();
        setShowSuccessModal(true);
      };
      
      img.src = url;
    } catch (error) {
      setLoading(false);
      setMessage({ type: 'error', text: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <>
      {/* Contact Hero */}
      <section className="contact-hero" style={{
        position: 'relative',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%)' ,
        borderBottom: '2px solid #E50914'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '100px 30px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '15px', background: 'linear-gradient(135deg, #E50914, #FF6B6B)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get In Touch</h1>
          <p style={{ fontSize: '1.2rem', color: '#ddd', maxWidth: '600px', margin: '0 auto' }}>Our global team is ready to assist you with premium automotive protection solutions across the Middle East, Asia, and beyond.</p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 30px' }}>
        <div className="contact-main fade-section" style={{ margin: '80px 0' }}>
          <div className="contact-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '50px',
            background: '#0A0A0F',
            borderRadius: '48px',
            padding: '48px',
            border: '1px solid rgba(229,9,20,0.2)'
          }}>
            {/* Contact Form */}
            <div className="contact-form">
              <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#E50914' }}><i className="fas fa-paper-plane"></i> Send us a message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Full Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="John Doe" 
                    style={{ width: '100%', padding: '14px 18px', background: '#13131A', border: '1px solid #2A2A35', borderRadius: '20px', color: 'white', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }} 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="john@example.com" 
                    style={{ width: '100%', padding: '14px 18px', background: '#13131A', border: '1px solid #2A2A35', borderRadius: '20px', color: 'white', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }} 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label htmlFor="phone" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="+XXX XX XXX XXXX" 
                    style={{ width: '100%', padding: '14px 18px', background: '#13131A', border: '1px solid #2A2A35', borderRadius: '20px', color: 'white', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }} 
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label htmlFor="region" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Region *</label>
                  <select 
                    id="region" 
                    name="region" 
                    required 
                    value={formData.region} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '14px 18px', background: '#13131A', border: '1px solid #2A2A35', borderRadius: '20px', color: 'white', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }}>
                    <option value="">Select your region</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Oman">Oman</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label htmlFor="interest" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Product Interest *</label>
                  <select 
                    id="interest" 
                    name="interest" 
                    required 
                    value={formData.interest} 
                    onChange={handleChange} 
                    style={{ width: '100%', padding: '14px 18px', background: '#13131A', border: '1px solid #2A2A35', borderRadius: '20px', color: 'white', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box' }}>
                    <option value="">Select product</option>
                    <option value="ULTRA PPF">ULTRA PPF</option>
                    <option value="TITAN PPF">TITAN PPF</option>
                    <option value="TITAN SATIN PPF">TITAN SATIN PPF</option>
                    <option value="Window Tint">Window Tint</option>
                    <option value="Windshield Film">Windshield Film</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#ccc' }}>Message *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    required 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Tell us about your vehicle and protection needs..." 
                    rows={5} 
                    style={{ width: '100%', padding: '14px 18px', background: '#13131A', border: '1px solid #2A2A35', borderRadius: '20px', color: 'white', fontFamily: 'inherit', fontSize: '1rem', outline: 'none', transition: 'all 0.3s ease', resize: 'vertical', minHeight: '120px', boxSizing: 'border-box' }} 
                  />
                </div>

                {/* Math CAPTCHA */}
                <div style={{
                  background: '#0F0F15',
                  padding: '20px',
                  borderRadius: '20px',
                  margin: '20px 0',
                  border: '1px solid #2A2A35',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.3rem',
                    color: '#E50914',
                    marginBottom: '15px',
                    fontFamily: "'Orbitron', monospace"
                  }}>
                    <span style={{ color: 'white', fontSize: '1.5rem', margin: '0 5px' }}>🔐</span>
                    {captchaQuestion} = ?
                    <span style={{ color: 'white', fontSize: '1.5rem', margin: '0 5px' }}>❓</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input 
                      type="number" 
                      value={captchaAnswer} 
                      onChange={(e) => validateCaptcha(e.target.value)}
                      placeholder="Enter your answer" 
                      autoComplete="off"
                      style={{ width: '120px', textAlign: 'center', fontSize: '1.1rem', padding: '10px', background: '#13131A', border: '1px solid #2A2A35', borderRadius: '20px', color: 'white', outline: 'none', boxSizing: 'border-box' }}
                    />
                    <button 
                      type="button" 
                      onClick={generateCaptcha}
                      style={{
                        background: '#2C2C36',
                        color: 'white',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '40px',
                        cursor: 'pointer',
                        transition: '0.2s',
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '0.8rem'
                      }}>
                      <i className="fas fa-sync-alt"></i> New
                    </button>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    marginTop: '10px',
                    color: captchaValid ? '#4caf50' : '#888'
                  }}>
                    {captchaStatus}
                  </div>
                </div>

                {message && (
                  <div style={{ 
                    padding: '12px', 
                    borderRadius: '12px', 
                    marginTop: '15px', 
                    textAlign: 'center',
                    background: message.type === 'success' ? 'rgba(46, 204, 113, 0.2)' : message.type === 'error' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)',
                    border: `1px solid ${message.type === 'success' ? '#2ecc71' : message.type === 'error' ? '#e74c3c' : '#3498db'}`,
                    color: message.type === 'success' ? '#2ecc71' : message.type === 'error' ? '#e74c3c' : '#3498db',
                    display: message ? 'block' : 'none'
                  }}>
                    {message.text}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={loading}
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
                    marginTop: '10px',
                    transition: 'all 0.3s ease',
                    opacity: loading ? 0.6 : 1
                  }}>
                  {loading ? <><span className="spinner"></span> Sending...</> : <><i className="fas fa-paper-plane"></i> Send Message</>}
                </button>
              </form>
            </div>

            {/* Support Agent Card */}
            <div style={{
              background: 'linear-gradient(145deg, #0F0F15, #0A0A0F)',
              borderRadius: '32px',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid rgba(229,9,20,0.3)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <img 
                src="/contact.webp" 
                alt="Zeo Shields Call Center Agent" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x380/1A1A22/E50914?text=Zeo+Shields+Agent';
                }}
                style={{ width: '100%', height: '380px', objectFit: 'cover', objectPosition: 'center 20%', display: 'block', filter: 'grayscale(15%)', transition: 'filter 0.3s ease' }}
              />
              <div style={{
                padding: '28px 25px',
                textAlign: 'center',
                background: 'rgba(10, 10, 15, 0.95)',
                borderTop: '1px solid rgba(229,9,20,0.4)'
              }}>
                <h3 style={{ color: '#E50914', fontSize: '1.5rem', marginBottom: '8px', fontFamily: "'Orbitron', monospace" }}>
                  <i className="fas fa-headset"></i> Get Professional Support
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#bbb', lineHeight: 1.5 }}>Global Support Specialist</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: '#E50914' }}><i className="fas fa-envelope"></i> info@zeoshields.com</span>
                  <span style={{ fontSize: '0.85rem', color: '#E50914' }}><i className="fas fa-comment-dots"></i> 24/7 Support</span>
                </div>
                <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#bbb', lineHeight: 1.5 }}>"Our dedicated team is here to provide expert guidance on PPF, Window Tint, and Windshield Protection. Reach out anytime!"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            transform: 'scale(0.96)',
            transition: 'transform 0.2s ease',
            animation: 'modalPopIn 0.3s ease'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '5rem', color: '#4caf50', marginBottom: '20px' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h3 style={{ fontFamily: "'Orbitron', monospace", color: '#4caf50', fontSize: '1.8rem', marginBottom: '15px' }}>Message Sent Successfully!</h3>
            <p style={{ color: '#ddd', margin: '10px 0', lineHeight: 1.5 }}>Thank you for contacting Zeo Shields.</p>
            <p style={{ color: '#ddd', margin: '10px 0', lineHeight: 1.5 }}>Our team will respond to your inquiry shortly.</p>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                window.location.reload();
              }}
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
        .fade-section { opacity: 0; transform: translateY(30px); transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .fade-section.visible { opacity: 1; transform: translateY(0); }
        .spinner { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 0.8s linear infinite; margin-right: 8px; vertical-align: middle; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes modalPopIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        input:focus, select:focus, textarea:focus { border-color: #E50914 !important; box-shadow: 0 0 0 2px rgba(229,9,20,0.2) !important; }
        @media (max-width: 900px) { 
          .contact-grid { grid-template-columns: 1fr; padding: 30px; }
        }
      `}</style>
    </>
  );
};