'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import authApi from '@/lib/api/auth';
import { setAccessToken, AuthError, ApiError } from '@/lib/api/client';
import type { AuthUser, AuthContextValue, OtpSession, VerifyOtpResult } from './types';

const OTP_SESSION_KEY = 'abjad_otp_session';

// Module-level guard: persists for the lifetime of the page session.
// Unlike useRef, this is NOT reset when React Strict Mode unmounts and
// remounts the component — so the init refresh only ever fires once per
// page load, even in dev Strict Mode.
let _authInitDone = false;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // initDone is intentionally module-level (_authInitDone above), not a ref.
  // See the declaration for why.

  // Centralised "tear down the session locally" — called when /me reports the
  // user no longer exists OR when an explicit logout fires. Calling /logout
  // is best-effort: even if the network request fails, we still wipe local
  // state so the UI redirects.
  const teardown = useCallback(async (callLogoutEndpoint: boolean) => {
    if (callLogoutEndpoint) {
      try { await authApi.logout(); } catch { /* swallow — cookie may already be invalid */ }
    }
    setAccessToken(null);
    setUser(null);
    sessionStorage.removeItem(OTP_SESSION_KEY);
  }, []);

  useEffect(() => {
    if (_authInitDone) return;
    _authInitDone = true;

    (async () => {
      try {
        // Step 1 — restore the access token from the httpOnly refresh cookie.
        const { accessToken } = await authApi.refreshTokens();
        setAccessToken(accessToken);

        // Step 2 — verify the User row still exists. Only a genuine auth
        // failure (dead session, or 401/403 = deleted/suspended user) should
        // tear the session down. A transient 500 / network blip must NOT log
        // the user out — calling logout would revoke a still-valid session.
        try {
          const me = await authApi.getMe();
          setUser(me);
        } catch (e) {
          const isAuthFailure =
            e instanceof AuthError ||
            (e instanceof ApiError && (e.status === 401 || e.status === 403));
          if (isAuthFailure) {
            if (process.env.NODE_ENV !== 'production') {
              console.error('[auth] /me auth failure during init → tearing down session', e);
            }
            await teardown(true);
          } else {
            // Transient error — keep the session; a reload or the next request
            // will recover. Leave user null for now.
            if (process.env.NODE_ENV !== 'production') {
              console.warn('[auth] /me failed transiently during init (session kept):', e);
            }
          }
        }
      } catch (e) {
        // No valid refresh cookie — user is simply logged out. In dev we still
        // log it so genuine refresh failures (network, server down) don't
        // disappear silently.
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[auth] init refresh failed (no/expired cookie?):', e);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [teardown]);

  const sendOtp = useCallback(
    async (email: string, purpose: 'login' | 'signup', rememberDevice: boolean = true) => {
      await authApi.sendOtp(email, purpose);
      const session: OtpSession = { email, purpose, rememberDevice };
      sessionStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
    },
    [],
  );

  const verifyOtp = useCallback(
    async (email: string, otp: string, purpose: string): Promise<VerifyOtpResult> => {
      let registrationData: Record<string, unknown> | undefined;
      if (purpose === 'signup') {
        try {
          const raw = sessionStorage.getItem('abjad_reg_data');
          if (raw) registrationData = JSON.parse(raw) as Record<string, unknown>;
        } catch { /* ignore parse errors */ }
      }
      // Read rememberDevice choice from the OTP session (set during sendOtp)
      let rememberDevice = true;
      try {
        const raw = sessionStorage.getItem(OTP_SESSION_KEY);
        if (raw) {
          const s = JSON.parse(raw) as OtpSession;
          if (typeof s.rememberDevice === 'boolean') rememberDevice = s.rememberDevice;
        }
      } catch { /* default to true */ }

      const result = await authApi.verifyOtp(email, otp, purpose, registrationData, rememberDevice);
      // FlushSync forces React to commit the setUser before this callback
      // returns. Without it, React 18's automatic batching may defer the
      // commit past the caller's `router.push(destination)`, which makes
      // the destination layout's first render see user=null. The layout's
      // useEffect then bounces the user back to /login?next=... — exactly
      // the regression that keeps surfacing here. flushSync is the supported
      // escape hatch for "this state update must be visible to the next
      // synchronous action."
      setAccessToken(result.tokens.accessToken);
      flushSync(() => {
        setUser(result.user);
      });
      sessionStorage.removeItem(OTP_SESSION_KEY);
      sessionStorage.removeItem('abjad_reg_data');
      return result;
    },
    [],
  );

  const login = useCallback(
    async (email: string, password: string, rememberDevice: boolean = true): Promise<VerifyOtpResult> => {
      const result = await authApi.login(email, password, rememberDevice);
      // Same flushSync pattern as verifyOtp — see the comment there for why
      // this is required (avoids the destination layout's first render
      // seeing user=null and bouncing back to /login?next=...).
      setAccessToken(result.tokens.accessToken);
      flushSync(() => {
        setUser(result.user);
      });
      sessionStorage.removeItem(OTP_SESSION_KEY);
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    await teardown(true);
  }, [teardown]);

  const updateHasPassword = useCallback((value: boolean) => {
    setUser((u) => (u ? { ...u, hasPassword: value } : u));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        sendOtp,
        verifyOtp,
        login,
        logout,
        updateHasPassword,
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
