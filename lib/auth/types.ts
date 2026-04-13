export interface AuthUser {
  userId: string;
  email: string;
  role: 'teacher' | 'school' | 'admin';
  firstName?: string;
  lastName?: string;
  schoolName?: string;
  isEmailVerified: boolean;
}

export interface VerifyOtpResult {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string };
  isNewUser: boolean;
  nextStep?: string;
}

export interface OtpSession {
  email: string;
  purpose: 'login' | 'signup';
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sendOtp: (email: string, purpose: 'login' | 'signup') => Promise<void>;
  verifyOtp: (email: string, otp: string, purpose: string) => Promise<VerifyOtpResult>;
  logout: () => Promise<void>;
}
