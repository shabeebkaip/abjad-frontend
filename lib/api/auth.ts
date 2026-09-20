// Auth-specific API calls
import { apiFetch, doRefresh } from './client';
import type { AuthUser, VerifyOtpResult } from '@/lib/auth/types';

const authApi = {
  // purpose 'reset' is used by the standalone forgot-password flow, which
  // does NOT go through AuthContext.sendOtp (no OTP_SESSION_KEY involved —
  // see forgot-password/page.tsx).
  async sendOtp(email: string, purpose: 'login' | 'signup' | 'reset'): Promise<void> {
    await apiFetch('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    });
  },

  async login(email: string, password: string, rememberDevice: boolean = true): Promise<VerifyOtpResult> {
    const res = await apiFetch<VerifyOtpResult>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberDevice }),
    });
    if (!res.data) throw new Error('Invalid response from server');
    return res.data;
  },

  async setPassword(newPassword: string): Promise<void> {
    await apiFetch('/api/auth/set-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiFetch('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await apiFetch('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    });
  },

  async verifyOtp(
    email: string,
    otp: string,
    purpose: string,
    registrationData?: Record<string, unknown>,
    rememberDevice: boolean = true,
  ): Promise<VerifyOtpResult> {
    const res = await apiFetch<VerifyOtpResult>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code: otp, purpose, rememberDevice, ...registrationData }),
    });
    if (!res.data) throw new Error('Invalid response from server');
    return res.data;
  },

  async refreshTokens(): Promise<{ accessToken: string }> {
    // Use the shared mutex so this and any concurrent 401-triggered refresh
    // coalesce onto a single in-flight /refresh request.
    const accessToken = await doRefresh();
    return { accessToken };
  },

  async logout(): Promise<void> {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  },

  async getMe(): Promise<AuthUser> {
    const res = await apiFetch<AuthUser>('/api/auth/me');
    if (!res.data) throw new Error('Invalid response from server');
    return res.data;
  },
};

export default authApi;
