'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import authApi from '@/lib/api/auth';
import { setAccessToken } from '@/lib/api/client';
import type { AuthUser, AuthContextValue, OtpSession, VerifyOtpResult } from './types';

const OTP_SESSION_KEY = 'abjad_otp_session';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ref prevents React Strict Mode's double-invocation from sending the refresh
  // token twice. The second call would find the first token already rotated
  // (revoked) and log the user out — or in the worst case revoke all sessions.
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    (async () => {
      try {
        const { accessToken } = await authApi.refreshTokens();
        setAccessToken(accessToken);
        const me = await authApi.getMe();
        setUser(me);
      } catch {
        // No valid session — stay logged out
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const sendOtp = useCallback(async (email: string, purpose: 'login' | 'signup') => {
    await authApi.sendOtp(email, purpose);
    const session: OtpSession = { email, purpose };
    sessionStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
  }, []);

  const verifyOtp = useCallback(
    async (email: string, otp: string, purpose: string): Promise<VerifyOtpResult> => {
      let registrationData: Record<string, unknown> | undefined;
      if (purpose === 'signup') {
        try {
          const raw = sessionStorage.getItem('abjad_reg_data');
          if (raw) registrationData = JSON.parse(raw) as Record<string, unknown>;
        } catch { /* ignore parse errors */ }
      }
      const result = await authApi.verifyOtp(email, otp, purpose, registrationData);
      setAccessToken(result.tokens.accessToken);
      setUser(result.user);
      sessionStorage.removeItem(OTP_SESSION_KEY);
      sessionStorage.removeItem('abjad_reg_data');
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors — clear state regardless
    }
    setAccessToken(null);
    setUser(null);
    sessionStorage.removeItem(OTP_SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export { OTP_SESSION_KEY };
