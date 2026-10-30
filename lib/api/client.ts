// Base API client
// - Injects Authorization header from in-memory token store
// - On 401: attempts one silent refresh via httpOnly cookie, retries original request
// - On persistent 401: throws AuthError (caller should redirect to /login)
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// In-memory store — XSS-safe, restored on page load via refresh endpoint
let _accessToken: string | null = null;
// Shared promise mutex: all concurrent refresh callers coalesce onto the
// same in-flight fetch, so a burst of 401s triggers only one /refresh call.
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
    let res: Response;
    try {
      res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      throw new ApiError('Network error — please check your connection and try again.', 0);
    }
    // Only 400/401/403 mean "no/invalid session". 429 / 5xx / network are
    // transient and must not be read as logged out (see isDefinitiveLogout).
    if (!res.ok) {
      if (res.status === 400 || res.status === 401 || res.status === 403) throw new AuthError();
      const resetSec = Number(res.headers.get('RateLimit-Reset'));
      throw new ApiError(
        `Request failed (${res.status}). Please try again.`,
        res.status,
        resetSec > 0 ? { resetSec } : undefined,
      );
    }
    const json: ApiResponse<{ accessToken: string }> = await res.json();
    if (!json.data?.accessToken) throw new AuthError();
    return json.data.accessToken;
  })().finally(() => {
    _refreshPromise = null;
  });
  return _refreshPromise;
}

/** True only when the refresh failure proves the session is gone (400/401). */
export function isDefinitiveLogout(e: unknown): boolean {
  return e instanceof AuthError;
}

const MAX_RATE_LIMIT_WAIT_S = 10;

/** ms to wait before retry `i` of error `e`, or null to give up. */
export function retryDelayMs(e: unknown, i: number, delaysMs: number[]): number | null {
  if (isDefinitiveLogout(e)) return null;
  if (e instanceof ApiError && e.status === 429) {
    // Never hammer a rate limiter: wait only if the server told us when it resets (and soon).
    const s = e.payload?.resetSec;
    return typeof s === 'number' && s <= MAX_RATE_LIMIT_WAIT_S && i === 0 ? s * 1000 : null;
  }
  return i < delaysMs.length ? delaysMs[i] : null;
}

/** Runs `fn`, retrying transient failures (not definitive logouts) with backoff. */
export async function withTransientRetry<T>(fn: () => Promise<T>, delaysMs: number[] = [500, 1500]): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (e) {
      const wait = retryDelayMs(e, i, delaysMs);
      if (wait === null) throw e;
      await new Promise((r) => setTimeout(r, wait));
    }
  }
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

  // A network-layer failure (dropped connection, DNS failure, CORS block)
  // makes fetch reject with a raw TypeError('Failed to fetch'). Convert it to
  // a friendly ApiError (status 0 = no HTTP response) so every caller surfaces
  // an actionable message instead of the cryptic browser string. Covers login,
  // register, verify-otp — all callers, not just the one that reported it.
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers,
    });
  } catch {
    throw new ApiError('Network error — please check your connection and try again.', 0);
  }

  // Token expired — attempt one silent refresh then retry.
  // All concurrent 401-triggered callers share the same _refreshPromise so
  // only one /refresh request is made.
  // Pre-auth endpoints issue their own 401s for business reasons (wrong/
  // expired OTP code, wrong password, wrong current-password, etc.) — those
  // are not "your access token expired" and must not trigger a refresh
  // attempt or get rewritten into a generic AuthError. Without this, e.g. a
  // stale OTP code 401 from /auth/verify-otp triggers a doomed refresh (no
  // session exists yet, so it always fails too) which masks the real
  // "Invalid OTP code" message behind a misleading "Session expired."
  // `login`/`reset-password` are unauthenticated (same reasoning as
  // send-otp/verify-otp). `set-password`/`change-password` ARE authenticated
  // but their business 401s ("Current password is incorrect") are
  // indistinguishable here from a real expired-token 401 — and retrying an
  // authenticated request that keeps failing with a *business* 401 would
  // refresh-and-retry forever (the retry gets the same wrong-password 401
  // every time). Excluding all four keeps this endpoint's real error message
  // intact; a genuinely expired session on these two forms surfaces as a
  // raw "Unauthorized" message instead of a graceful bounce — acceptable,
  // narrow edge case (other concurrent calls on the same page already
  // recover/redirect a truly dead session).
  const isPreAuthEndpoint = /\/auth\/(refresh|send-otp|verify-otp|login|set-password|change-password|reset-password)(\?|$)/.test(path);
  if (res.status === 401 && !isPreAuthEndpoint) {
    try {
      const newToken = await doRefresh();
      setAccessToken(newToken);
      return apiFetch<T>(path, options);
    } catch (e) {
      // Transient refresh failure (network/429/5xx): keep the token, surface the error.
      if (!isDefinitiveLogout(e)) throw e;
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
    // json?.message only exists when the body parsed as JSON from our own
    // API. A non-JSON body (a gateway/proxy HTML error page on a 502/504,
    // a plain-text infra dump, etc.) must never be shown to the user
    // verbatim -- rawText is untrusted and can be large, ugly, or leak
    // infrastructure details. Always fall back to a generic, readable
    // status-based message instead of echoing rawText (LOGIN-013).
    throw new ApiError(
      json?.message ?? `Request failed (${res.status}). Please try again.`,
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
