'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import authApi from '@/lib/api/auth';
import { setAccessToken } from '@/lib/api/client';
import type { AuthUser, AuthContextValue, OtpSession, VerifyOtpResult } from './types';

const OTP_SESSION_KEY = 'abjad_otp_session';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore session from httpOnly refresh token cookie
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { accessToken } = await authApi.refreshTokens();
        setAccessToken(accessToken);
        const me = await authApi.getMe();
        if (!cancelled) setUser(me);
      } catch {
        // No valid session — stay logged out
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const sendOtp = useCallback(async (email: string, purpose: 'login' | 'signup') => {
    await authApi.sendOtp(email, purpose);
    const session: OtpSession = { email, purpose };
    sessionStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
  }, []);

  const verifyOtp = useCallback(
    async (email: string, otp: string, purpose: string): Promise<VerifyOtpResult> => {
      const result = await authApi.verifyOtp(email, otp, purpose);
      setAccessToken(result.tokens.accessToken);
      setUser(result.user);
      sessionStorage.removeItem(OTP_SESSION_KEY);
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
