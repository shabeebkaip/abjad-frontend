// Regression check for session-refresh classification (SESS-001 / refresh 429).
// Stubs globalThis.fetch and exercises the REAL doRefresh/apiFetch, so it
// fails if doRefresh is reverted to "every non-ok = AuthError".
// Run: npx tsx scripts/check-refresh-retry.ts
import {
  AuthError, ApiError, apiFetch, doRefresh, getAccessToken, setAccessToken,
  isDefinitiveLogout, retryDelayMs, withTransientRetry,
} from "../lib/api/client";

const assert = (c: boolean, m: string) => { if (!c) throw new Error(m); };
const json = (status: number, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify({ message: "x" }), { status, headers });

// Each case: what /auth/refresh answers (a status, or "network").
function stubRefresh(answer: number | "network", resetSec?: number) {
  globalThis.fetch = (async (url: string) => {
    if (String(url).includes("/auth/refresh")) {
      if (answer === "network") throw new TypeError("Failed to fetch");
      return json(answer, resetSec ? { "RateLimit-Reset": String(resetSec) } : {});
    }
    return json(401); // any other endpoint: access token expired
  }) as typeof fetch;
}
const outcome = async (p: Promise<unknown>) => p.then(() => "ok", (e) => e);

(async () => {
  for (const s of [400, 401, 403]) {
    stubRefresh(s);
    assert((await outcome(doRefresh())) instanceof AuthError, `${s} must be AuthError`);
  }
  for (const s of [429, 500, 503, "network" as const]) {
    stubRefresh(s);
    const e = await outcome(doRefresh());
    assert(e instanceof ApiError && !isDefinitiveLogout(e), `${s} must be a transient ApiError`);
  }

  // apiFetch: transient refresh failure keeps the token; 401 clears it.
  setAccessToken("tok");
  stubRefresh(503);
  const e1 = await outcome(apiFetch("/api/x"));
  assert(e1 instanceof ApiError && !(e1 instanceof AuthError), "503 refresh must surface ApiError");
  assert(getAccessToken() === "tok", "token must survive a transient refresh failure");
  stubRefresh(401);
  assert((await outcome(apiFetch("/api/x"))) instanceof AuthError, "401 refresh must be AuthError");
  assert(getAccessToken() === null, "token must be cleared after a definitive logout");

  // Retry policy.
  const t = (s: number, resetSec?: number) => new ApiError("x", s, resetSec ? { resetSec } : undefined);
  assert(retryDelayMs(new AuthError(), 0, [5]) === null, "no retry on logout");
  assert(retryDelayMs(t(503), 0, [5, 6]) === 5 && retryDelayMs(t(503), 2, [5, 6]) === null, "5xx backoff");
  assert(retryDelayMs(t(429), 0, [5]) === null, "429 without reset: give up");
  assert(retryDelayMs(t(429, 300), 0, [5]) === null, "429 with long reset: give up");
  assert(retryDelayMs(t(429, 2), 0, [5]) === 2000, "429 with short reset: wait for it");

  let n = 0;
  const ok = await withTransientRetry(async () => { if (++n < 3) throw t(503); return "ok"; }, [1, 1]);
  assert(ok === "ok" && n === 3, "should retry twice then succeed");
  n = 0;
  await outcome(withTransientRetry(async () => { n++; throw new AuthError(); }, [1, 1]));
  assert(n === 1, "AuthError must not be retried");
  n = 0;
  await outcome(withTransientRetry(async () => { n++; throw t(429); }, [1, 1]));
  assert(n === 1, "429 must not be retried blindly");
  console.log("refresh retry ok");
})().catch((e) => { console.error(e); process.exit(1); });
