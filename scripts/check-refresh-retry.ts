// Regression check for startup-refresh classification (SESS-001 / refresh 429).
// Run: npx tsx scripts/check-refresh-retry.ts
import { AuthError, ApiError, isDefinitiveLogout, withTransientRetry } from "../lib/api/client";

const assert = (c: boolean, m: string) => { if (!c) throw new Error(m); };
(async () => {
  assert(isDefinitiveLogout(new AuthError()), "AuthError must be logout");
  for (const s of [0, 429, 500, 503]) assert(!isDefinitiveLogout(new ApiError("x", s)), `${s} must be transient`);

  let n = 0;
  const ok = await withTransientRetry(async () => { if (++n < 3) throw new ApiError("x", 429); return "ok"; }, [1, 1]);
  assert(ok === "ok" && n === 3, "should retry twice then succeed");

  n = 0;
  await withTransientRetry(async () => { n++; throw new AuthError(); }, [1, 1]).then(() => assert(false, "should throw"), () => {});
  assert(n === 1, "AuthError must not be retried");

  n = 0;
  await withTransientRetry(async () => { n++; throw new ApiError("x", 0); }, [1, 1]).then(() => assert(false, "should throw"), () => {});
  assert(n === 3, "transient should give up after 2 retries");
  console.log("refresh retry ok");
})();
