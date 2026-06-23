// Base API client
// - Injects Authorization header from in-memory token store
// - On 401: attempts one silent refresh via httpOnly cookie, retries original request
// - On persistent 401: throws AuthError (caller should redirect to /login)
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// In-memory store — XSS-safe, restored on page load via refresh endpoint
let _accessToken: string | null = null;
// Shared promise mutex: all concurrent refresh callers coalesce onto the
// same in-flight fetch so the rotation token is only consumed once.
let _refreshPromise: Promise<string> | null = null;

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

export function doRefresh(): Promise<string> {
  if (_refreshPromise) return _refreshPromise;
  _refreshPromise = (async () => {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new AuthError();
    const json: ApiResponse<{ accessToken: string }> = await res.json();
    if (!json.data?.accessToken) throw new AuthError();
    return json.data.accessToken;
  })().finally(() => {
    _refreshPromise = null;
  });
  return _refreshPromise;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  // Don't set Content-Type for FormData — the browser sets multipart/form-data with the boundary automatically
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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

  // Token expired — attempt one silent refresh then retry.
  // All concurrent 401-triggered callers share the same _refreshPromise so
  // the rotation cookie is only consumed once.
  const isRefreshEndpoint = path.includes('/auth/refresh');
  if (res.status === 401 && !isRefreshEndpoint) {
    try {
      const newToken = await doRefresh();
      setAccessToken(newToken);
      return apiFetch<T>(path, options);
    } catch {
      setAccessToken(null);
      throw new AuthError();
    }
  }

  // Defensively parse the body. Upstream intermediaries (rate limiter,
  // proxy, gateway timeout) might return non-JSON; res.json() throws a
  // cryptic "Unexpected token" error in that case. Read text first.
  const rawText = await res.text();
  let json: (ApiResponse<T> & Record<string, unknown>) | undefined;
  try {
    json = rawText ? (JSON.parse(rawText) as ApiResponse<T> & Record<string, unknown>) : undefined;
  } catch {
    json = undefined;
  }

  if (!res.ok) {
    if (res.status === 429) {
      throw new ApiError(json?.message ?? 'Too many requests. Please wait a moment and try again.', res.status, json);
    }
    throw new ApiError(
      json?.message ?? (rawText.trim() || `Request failed (${res.status})`),
      res.status,
      json,
    );
  }

  if (!json) {
    throw new Error('Server returned an empty or non-JSON response.');
  }
  return json;
}

// ApiError preserves the structured details from the backend response so
// callers can branch on machine-readable codes (e.g. ENTITLEMENT_BLOCKED)
// rather than parse the free-text message. Plain `throw new Error()` for
// non-HTTP failures still works — instanceof ApiError narrows the type.
export class ApiError extends Error {
  status: number;
  payload?: Record<string, unknown>;
  constructor(message: string, status: number, payload?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}
