import { useState } from 'react';
import { signIn, confirmSignIn, resetPassword, confirmResetPassword, signOut } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';

// Separate PasswordInput component to prevent re-rendering issues
const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder, 
  required, 
  showPassword, 
  setShowPassword,
  style = {}
}: any) => {
  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '15px', ...style }}>
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '14px 18px',
          paddingRight: '45px',
          background: '#1A1A22',
          border: '1px solid #333',
          borderRadius: '40px',
          color: 'white',
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color 0.2s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#E50914'}
        onBlur={(e) => e.target.style.borderColor = '#333'}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setShowPassword(!showPassword);
        }}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#aaa',
          fontSize: '1.2rem',
          padding: '5px',
          zIndex: 1
        }}
      >
        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
      </button>
    </div>
  );
};

export const AdminLoginPage: React.FC = () => {
  const [step, setStep] = useState<'login' | 'otp' | 'resetEmail' | 'resetOtp' | 'resetNewPassword'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle normal login with email + password + OTP
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // First, sign out any existing session
      try {
        await signOut();
      } catch (signOutError) {
        console.log('No existing session to sign out');
      }

      // Now sign in with email and password
      const { nextStep } = await signIn({
        username: email,
        password: password,
      });
      
      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE') {
        setMessage({ 
          type: 'success', 
          text: `OTP sent to ${email}. Check your inbox.` 
        });
        setStep('otp');
      } else if (nextStep.signInStep === 'DONE') {
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminEmail', email);
        window.location.href = '/dashboard';
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Unexpected sign-in step. Please try again.' 
        });
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      if (error.name === 'UserNotFoundException') {
        setMessage({ type: 'error', text: 'User not found. Please contact administrator.' });
      } else if (error.name === 'NotAuthorizedException') {
        setMessage({ type: 'error', text: 'Incorrect email or password.' });
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to sign in' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete login
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { nextStep } = await confirmSignIn({
        challengeResponse: otp,
      });
      
      if (nextStep.signInStep === 'DONE') {
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminEmail', email);
        window.location.href = '/dashboard';
      } else {
        setMessage({ type: 'error', text: 'Verification failed. Please try again.' });
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setMessage({ type: 'error', text: error.message || 'Invalid OTP code. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send password reset OTP
  const handleSendResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }
    
    setLoading(true);
    setMessage(null);
    try {
      // Sign out any existing session first
      try {
        await signOut();
      } catch (signOutError) {
        console.log('No existing session to sign out');
      }
      
      await resetPassword({ username: email });
      setMessage({ type: 'success', text: `Password reset OTP sent to ${email}. Check your inbox.` });
      setStep('resetOtp');
    } catch (error: any) {
      console.error('Reset password error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to send reset OTP.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate OTP
  const handleValidateOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ type: 'error', text: 'Please enter the OTP code.' });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      setMessage({ type: 'success', text: 'OTP verified! Please enter your new password.' });
      setStep('resetNewPassword');
    } catch (error: any) {
      console.error('OTP validation error:', error);
      setMessage({ type: 'error', text: error.message || 'Invalid OTP code. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set new password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: otp,
        newPassword: newPassword,
      });
      
      setMessage({ type: 'success', text: 'Password reset successful! Please login with your new password.' });
      
      // Reset all and go back to login
      setTimeout(() => {
        setStep('login');
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
      }, 2000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to reset password. Please try again.' });
    } finally {
      setLoading(false);
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
            {step === 'login' && 'Enter your email and password to login'}
            {step === 'otp' && 'Enter the OTP sent to your email'}
            {step === 'resetEmail' && 'Enter your email to reset password'}
            {step === 'resetOtp' && 'Enter the OTP sent to your email'}
            {step === 'resetNewPassword' && 'Create your new password'}
          </p>
        </div>

        {/* Login Step */}
        {step === 'login' && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                background: '#1A1A22',
                border: '1px solid #333',
                borderRadius: '40px',
                color: 'white',
                fontSize: '1rem',
                marginBottom: '15px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#E50914'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required={true}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => setStep('resetEmail')}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#E50914',
                border: 'none',
                padding: '14px',
                marginTop: '10px',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Forgot Password?
            </button>
          </form>
        )}

        {/* OTP Verification Step (for login MFA) */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
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
                letterSpacing: '4px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#E50914'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '12px'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('login');
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
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Step 1: Forgot Password - Enter Email */}
        {step === 'resetEmail' && (
          <form onSubmit={handleSendResetOTP}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
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
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#E50914'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Sending OTP...' : 'Send Reset OTP'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('login');
                setMessage(null);
              }}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#E50914',
                border: '1px solid #E50914',
                padding: '14px',
                borderRadius: '40px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Step 2: Forgot Password - Enter OTP */}
        {step === 'resetOtp' && (
          <form onSubmit={handleValidateOTP}>
            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>We sent a 6-digit code to:</p>
              <p style={{ fontWeight: 'bold', color: '#E50914' }}>{email}</p>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
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
                letterSpacing: '4px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#E50914'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '12px'
              }}
            >
              {loading ? 'Validating...' : 'Validate OTP'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('resetEmail');
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
                cursor: 'pointer'
              }}
            >
              Back to Email
            </button>
          </form>
        )}

        {/* Step 3: Forgot Password - Enter New Password */}
        {step === 'resetNewPassword' && (
          <form onSubmit={handleSetNewPassword}>
            <div style={{ marginBottom: '15px', textAlign: 'left' }}>
              <p style={{ fontSize: '0.85rem', color: '#4caf50' }}>✓ OTP verified successfully!</p>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Enter your new password for:</p>
              <p style={{ fontWeight: 'bold', color: '#E50914' }}>{email}</p>
            </div>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required={true}
              showPassword={showNewPassword}
              setShowPassword={setShowNewPassword}
            />
            <PasswordInput
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter new password"
              required={true}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              style={{ marginBottom: '20px' }}
            />
            <button
              type="submit"
              disabled={loading || newPassword !== confirmNewPassword}
              style={{
                width: '100%',
                background: '#E50914',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '40px',
                fontWeight: 'bold',
                cursor: (loading || newPassword !== confirmNewPassword) ? 'not-allowed' : 'pointer',
                opacity: (loading || newPassword !== confirmNewPassword) ? 0.7 : 1,
                marginBottom: '12px'
              }}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('resetOtp');
                setNewPassword('');
                setConfirmNewPassword('');
                setMessage(null);
              }}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#E50914',
                border: '1px solid #E50914',
                padding: '14px',
                borderRadius: '40px',
                cursor: 'pointer'
              }}
            >
              Back to OTP
            </button>
          </form>
        )}

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '12px',
            background: message.type === 'error' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(46, 204, 113, 0.2)',
            color: message.type === 'error' ? '#e74c3c' : '#2ecc71'
          }}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};