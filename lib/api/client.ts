// Base API client
// - Injects Authorization header from in-memory token store
// - On 401: attempts one silent refresh via httpOnly cookie, retries original request
// - On persistent 401: throws AuthError (caller should redirect to /login)

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

// In-memory store — XSS-safe, restored on page load via refresh endpoint
let _accessToken: string | null = null;
let _isRefreshing = false;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}

export class AuthError extends Error {
  constructor() {
    super('Session expired. Please sign in again.');
    this.name = 'AuthError';
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

async function doRefresh(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new AuthError();
  const json: ApiResponse<{ accessToken: string }> = await res.json();
  if (!json.data?.accessToken) throw new AuthError();
  return json.data.accessToken;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (_accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  // Token expired — attempt silent refresh once then retry
  if (res.status === 401 && !_isRefreshing) {
    _isRefreshing = true;
    try {
      const newToken = await doRefresh();
      setAccessToken(newToken);
      _isRefreshing = false;
      return apiFetch<T>(path, options);
    } catch {
      _isRefreshing = false;
      setAccessToken(null);
      throw new AuthError();
    }
  }

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok) {
    throw new Error(json.message ?? `Request failed (${res.status})`);
  }

  return json;
}
