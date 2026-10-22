// Regression check for the ?next= open-redirect guard (SESS-008/009).
// Run: npx tsx scripts/check-parse-next.ts
import { parseNext } from "../lib/auth/checkout-target";

const FB = "/FALLBACK";
const blocked = [
  "%2F%09%2Fexample.com", "%2F%0A%2Fexample.com", "%2F%0D%2Fexample.com", "/%09/example.com",
  "//evil.com", "/\\evil.com", "%5C%5Cevil.com", "https://evil.com", "%20//evil.com",
  "%2F.%2F%2Fexample.com", "/..//example.com", "/a/..//example.com", "/./\\example.com",
  "/api/auth/me", "%E0%A4%A",
];
const allowed = ["/dashboard", "%2Fschool%2Fjobs%3Ftab%3Dactive", "/billing/checkout?plan=pro"];

for (const v of blocked) if (parseNext(v, FB) !== FB) throw new Error(`not blocked: ${JSON.stringify(v)}`);
for (const v of allowed) if (parseNext(v, FB) === FB) throw new Error(`wrongly blocked: ${v}`);
console.log(`parseNext ok (${blocked.length} blocked, ${allowed.length} allowed)`);
