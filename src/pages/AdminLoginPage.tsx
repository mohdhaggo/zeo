import React, { useState, useRef } from 'react';

export const AdminLoginPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const generatedOtpRef = useRef<string>('');

  // Allowed admin emails
  const allowedAdmins = ['mohd.haggo@gmail.com', 'admin@zeoshields.com', 'zeoadmin@gmail.com'];

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allowedAdmins.includes(email)) {
      setMessage({ type: 'error', text: 'Unauthorized email address' });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    const otpCode = generateOTP();
    generatedOtpRef.current = otpCode;
    
    // Show OTP in console and alert for demo
    console.log('=========================================');
    console.log('YOUR OTP CODE:', otpCode);
    console.log('=========================================');
    
    // Also show in alert for easier testing
    alert(`Your OTP code is: ${otpCode}\n\n(Check console as well)`);
    
    setMessage({ type: 'success', text: `OTP sent to ${email}. Check console for code.` });
    setStep('otp');
    setLoading(false);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Entered OTP:', otp);
    console.log('Generated OTP:', generatedOtpRef.current);
    
    if (otp === generatedOtpRef.current) {
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminEmail', email);
      window.location.href = '/dashboard';
    } else {
      setMessage({ type: 'error', text: 'Invalid OTP. Please try again.' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#010101',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0C0C12',
        borderRadius: '32px',
        border: '1px solid rgba(229,9,20,0.3)',
        padding: '48px 40px',
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <img src="/zeo_logo.webp" alt="Zeo Shields" style={{ height: '60px', marginBottom: '20px' }} />
          <h1 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: '1.8rem',
            background: 'linear-gradient(135deg, #FFFFFF, #E50914)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>Admin Access</h1>
          <p style={{ color: '#aaa', marginTop: '10px' }}>
            {step === 'email' ? 'Enter your admin email to receive OTP' : 'Enter the verification code sent to your email'}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOTP}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mohd.haggo@gmail.com"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: '#1A1A22',
                border: '1px solid #333',
                borderRadius: '40px',
                color: 'white',
                fontSize: '1rem',
                marginBottom: '20px'
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: '#E50914',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '40px',
                fontWeight: 'bold',
                fontFamily: "'Orbitron', monospace",
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              autoFocus
              style={{
                width: '100%',
                padding: '14px 18px',
                background: '#1A1A22',
                border: '1px solid #333',
                borderRadius: '40px',
                color: 'white',
                fontSize: '1rem',
                marginBottom: '20px',
                textAlign: 'center',
                letterSpacing: '4px'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#E50914',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '40px',
                fontWeight: 'bold',
                fontFamily: "'Orbitron', monospace",
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              Verify & Login
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtp('');
                setMessage(null);
              }}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#E50914',
                border: '1px solid #E50914',
                padding: '14px',
                borderRadius: '40px',
                fontWeight: 'bold',
                fontFamily: "'Orbitron', monospace",
                cursor: 'pointer'
              }}
            >
              Back to Email
            </button>
          </form>
        )}

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '12px',
            background: message.type === 'error' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(46, 204, 113, 0.2)',
            border: `1px solid ${message.type === 'error' ? '#e74c3c' : '#2ecc71'}`,
            color: message.type === 'error' ? '#e74c3c' : '#2ecc71'
          }}>
            {message.text}
          </div>
        )}
        
        <div style={{ marginTop: '20px', fontSize: '0.75rem', color: '#555' }}>
          <p>Demo: OTP will appear in alert box</p>
          <p>Allowed emails: mohd.haggo@gmail.com</p>
        </div>
      </div>
    </div>
  );
};