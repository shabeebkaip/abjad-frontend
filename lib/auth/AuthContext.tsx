'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import authApi from '@/lib/api/auth';
import { setAccessToken } from '@/lib/api/client';
import type { AuthUser, AuthContextValue, OtpSession, VerifyOtpResult } from './types';

const OTP_SESSION_KEY = 'abjad_otp_session';

// Access tokens are signed for 15 minutes. Refresh one minute earlier so a
// 401 → silent-retry round-trip is never the user's first signal that
// something needs to happen. Backed off to 60s to avoid hammering when the
// tab is in the background — browsers throttle setTimeout for background
// tabs which means the actual refresh may run a few seconds later, but
// still well before the token expires.
const ACCESS_TOKEN_LIFETIME_MS = 15 * 60 * 1000;
const REFRESH_LEAD_MS          = 60 * 1000;
const REFRESH_INTERVAL_MS      = ACCESS_TOKEN_LIFETIME_MS - REFRESH_LEAD_MS;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ref prevents React Strict Mode's double-invocation from sending the refresh
  // token twice. The second call would find the first token already rotated
  // (revoked) and log the user out.
  const initDone = useRef(false);

  // Track the proactive refresh interval so we can cancel it on logout /
  // unmount.
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  // Centralised "tear down the session locally" — called when /me reports the
  // user no longer exists OR when an explicit logout fires. Calling /logout
  // is best-effort: even if the network request fails, we still wipe local
  // state so the UI redirects.
  const teardown = useCallback(async (callLogoutEndpoint: boolean) => {
    clearRefreshTimer();
    if (callLogoutEndpoint) {
      try { await authApi.logout(); } catch { /* swallow — cookie may already be invalid */ }
    }
    setAccessToken(null);
    setUser(null);
    sessionStorage.removeItem(OTP_SESSION_KEY);
  }, []);

  const startProactiveRefresh = useCallback(() => {
    clearRefreshTimer();
    refreshTimerRef.current = setInterval(async () => {
      try {
        const { accessToken } = await authApi.refreshTokens();
        setAccessToken(accessToken);
      } catch {
        // Refresh failed — session is dead. Tear it down so the layout
        // redirects to /login instead of silently degrading.
        await teardown(false);
      }
    }, REFRESH_INTERVAL_MS);
  }, [teardown]);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    (async () => {
      try {
        // Step 1 — restore the access token from the httpOnly refresh cookie.
        const { accessToken } = await authApi.refreshTokens();
        setAccessToken(accessToken);

        // Step 2 — verify the User row still exists. A non-2xx here (commonly
        // 401 when the row was deleted) MUST tear down the session so we
        // don't sit on a navbar with no body.
        try {
          const me = await authApi.getMe();
          setUser(me);
          startProactiveRefresh();
        } catch {
          await teardown(true);
        }
      } catch {
        // No valid refresh cookie — user is simply logged out.
      } finally {
        setIsLoading(false);
      }
    })();

    return () => { clearRefreshTimer(); };
  }, [startProactiveRefresh, teardown]);

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
      startProactiveRefresh();
      return result;
    },
    [startProactiveRefresh],
  );

  const logout = useCallback(async () => {
    await teardown(true);
  }, [teardown]);

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
