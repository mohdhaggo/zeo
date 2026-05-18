import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

export const AdminLoginPage: React.FC = () => {
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
            Enter your credentials to access the admin dashboard
          </p>
        </div>
        
        <Authenticator hideSignUp={true}>
          {({ signOut, user }) => (
            user && (
              <div>
                <p style={{ color: '#4caf50', marginBottom: '15px' }}>
                  Welcome, {user.username}
                </p>
                <button 
                  onClick={signOut}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    color: '#E50914',
                    border: '1px solid #E50914',
                    padding: '12px',
                    borderRadius: '40px',
                    fontWeight: 'bold',
                    fontFamily: "'Orbitron', monospace",
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              </div>
            )
          )}
        </Authenticator>
      </div>
    </div>
  );
};