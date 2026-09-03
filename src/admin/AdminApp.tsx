import React, { useCallback, useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboard } from '../pages/AdminDashboard';

type AuthState = 'checking' | 'signedIn' | 'signedOut';

/**
 * Admin console shell.
 *
 * The gate is a real Cognito session - getCurrentUser() throws unless valid
 * tokens are present - rather than a localStorage flag anyone could set.
 * The API enforces the same rule independently, so a forged client state
 * cannot read data either.
 */
export const AdminApp: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('checking');

  const refreshSession = useCallback(async () => {
    try {
      await getCurrentUser();
      setAuthState('signedIn');
    } catch {
      setAuthState('signedOut');
    }
  }, []);

  useEffect(() => {
    // Verifying the session is inherently asynchronous, so the resulting
    // state update cannot happen during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshSession();

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') setAuthState('signedIn');
      if (payload.event === 'signedOut') setAuthState('signedOut');
      if (payload.event === 'tokenRefresh_failure') setAuthState('signedOut');
    });

    return unsubscribe;
  }, [refreshSession]);

  if (authState === 'checking') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#010101',
          color: '#aaa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Orbitron', monospace",
        }}
      >
        Verifying session...
      </div>
    );
  }

  if (authState === 'signedOut') {
    return <AdminLoginPage onSignedIn={() => setAuthState('signedIn')} />;
  }

  return <AdminDashboard />;
};
