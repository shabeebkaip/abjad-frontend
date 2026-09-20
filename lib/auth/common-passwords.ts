// keep in sync with backend passwordSchema COMMON_PASSWORDS (auth.validation.ts)
export const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890',
  'qwerty123', 'qwertyuiop', 'letmein123', 'welcome123', 'admin12345', 'iloveyou1',
  'abc123456', '11111111', '00000000', 'passw0rd1', 'sunshine1', 'football1',
  'monkey1234', 'dragon1234', 'baseball1', 'princess1', 'trustno1x', 'starwars1',
  'changeme1', '87654321',
]);

export function isCommonPassword(value: string): boolean {
  return COMMON_PASSWORDS.has(value.toLowerCase());
}

// Matches the backend's exact copy (auth.validation.ts passwordSchema refine
// message) so a client-blocked and server-blocked password read identically.
export const COMMON_PASSWORD_MESSAGE = "This password is too common. Please choose a stronger one.";
