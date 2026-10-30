'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import authApi from '@/lib/api/auth';
import { setAccessToken, AuthError, ApiError, withTransientRetry, isDefinitiveLogout } from '@/lib/api/client';
import { TERMS_VERSION } from '@/lib/legal';
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
  const [authUnavailable, setAuthUnavailable] = useState(false);

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

  const initAuth = useCallback(async () => {
    try {
      // Step 1 — restore the access token from the httpOnly refresh cookie.
      const { accessToken } = await withTransientRetry(() => authApi.refreshTokens());
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
          // Transient error — session kept, but we can't confirm the user.
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[auth] /me failed transiently during init (session kept):', e);
          }
          setAuthUnavailable(true);
        }
      }
    } catch (e) {
      // 400/401/403: no valid refresh cookie — user is simply logged out.
      // Anything else (network/429/5xx) already got its retries: flag the
      // session check as unavailable so layouts show Retry, not /login.
      if (!isDefinitiveLogout(e)) setAuthUnavailable(true);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(isDefinitiveLogout(e) ? '[auth] no valid session' : '[auth] init refresh failed transiently after retries:', e);
      }
    } finally {
      setIsLoading(false);
    }
  }, [teardown]);

  useEffect(() => {
    if (_authInitDone) return;
    _authInitDone = true;
    initAuth();
  }, [initAuth]);

  const retryAuth = useCallback(() => {
    setAuthUnavailable(false);
    setIsLoading(true);
    initAuth();
  }, [initAuth]);

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
        // Consent record (D6): the register form's terms checkbox must be ticked
        // to reach here; tell the server which version was accepted.
        registrationData = { ...registrationData, termsVersion: TERMS_VERSION };
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
      // Q-39: new accounts default to language 'ar' server-side. If the visitor
      // chose English before signing up, persist that choice so
      // LanguageProvider doesn't flip them to Arabic when the account loads.
      let user = result.user;
      if (purpose === 'signup') {
        const chosen = localStorage.getItem('abjad_lang');
        if ((chosen === 'ar' || chosen === 'en') && chosen !== user.language) {
          user = { ...user, language: chosen };
          authApi.updateLanguage(chosen).catch(() => {});
        }
      }
      flushSync(() => {
        setUser(user);
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
        authUnavailable,
        retryAuth,
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
