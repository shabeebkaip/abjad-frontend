export interface AuthUser {
  userId: string;
  email: string;
  role: 'teacher' | 'school' | 'admin';
  firstName?: string;
  lastName?: string;
  schoolName?: string;
  isEmailVerified: boolean;
  hasPassword: boolean;
  // Server-stored UI language preference ("ar" | "en", default "ar") — see
  // PATCH /api/auth/language. Optional because older cached sessions/tests
  // may not carry it; callers should fall back to the client default.
  language?: "ar" | "en";
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
  login: (email: string, password: string, rememberDevice?: boolean) => Promise<VerifyOtpResult>;
  logout: () => Promise<void>;
  // Optimistic local update after a successful set-password — avoids an
  // extra /me round trip just to flip one boolean (§5.7.3 of the spec).
  updateHasPassword: (value: boolean) => void;
}
