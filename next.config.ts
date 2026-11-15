import type { NextConfig } from "next";
import { BILLING_UI_ENABLED } from "./lib/billing-flags";

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
  // Billing is hidden until launch (client feedback R1 §8.2–8.3). Server-side
  // so it works regardless of the client auth guards in the panel layouts.
  async redirects() {
    if (BILLING_UI_ENABLED) return [];
    return [
      { source: "/pricing", destination: "/", permanent: false },
      { source: "/billing/:path*", destination: "/dashboard", permanent: false },
      { source: "/billing", destination: "/dashboard", permanent: false },
      { source: "/school/billing/:path*", destination: "/school/dashboard", permanent: false },
      { source: "/school/billing", destination: "/school/dashboard", permanent: false },
    ];
  },
};

export default nextConfig;
