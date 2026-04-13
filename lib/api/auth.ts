// Auth-specific API calls
import { apiFetch } from './client';
import type { AuthUser, VerifyOtpResult } from '@/lib/auth/types';

const authApi = {
  async sendOtp(email: string, purpose: 'login' | 'signup'): Promise<void> {
    await apiFetch('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    });
  },

  async verifyOtp(
    email: string,
    otp: string,
    purpose: string,
  ): Promise<VerifyOtpResult> {
    const res = await apiFetch<VerifyOtpResult>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, code: otp, purpose }),
    });
    if (!res.data) throw new Error('Invalid response from server');
    return res.data;
  },

  async refreshTokens(): Promise<{ accessToken: string }> {
    const res = await apiFetch<{ accessToken: string }>('/api/auth/refresh', {
      method: 'POST',
    });
    if (!res.data) throw new Error('Invalid response from server');
    return res.data;
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
