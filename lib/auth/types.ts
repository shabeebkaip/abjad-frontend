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
  tokens: { accessToken: string; expiresIn?: number };
  isNewUser: boolean;
  nextStep?: string;
}

export interface OtpSession {
  email: string;
  purpose: 'login' | 'signup';
  rememberDevice?: boolean;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sendOtp: (email: string, purpose: 'login' | 'signup', rememberDevice?: boolean) => Promise<void>;
  verifyOtp: (email: string, otp: string, purpose: string) => Promise<VerifyOtpResult>;
  logout: () => Promise<void>;
}
