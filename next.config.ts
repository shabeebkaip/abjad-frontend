import type { NextConfig } from "next";

// HSTS 1 day for now; raise to 6-12 months after a clean week (QA_FIX_PLAN D8).
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=86400; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
