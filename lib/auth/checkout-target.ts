// Auth-aware checkout routing.
//
// One helper that resolves what a "Choose plan" button should do based on:
//   - the plan (audience + code)
//   - the current auth state
//   - the user's current subscription (if any) — caller passes this; we
//     don't fetch here because the pricing page already has it from
//     /api/subscriptions/me when authenticated.
//
// Also exports a safe `parseNext` for /login, /register, /verify-otp so they
// can honour `?next=...` without opening a redirect-injection vector.

import type { AuthUser } from "./types";

export interface CheckoutTargetInput {
  planCode: string;
  audience: "school" | "teacher_premium";
  user: AuthUser | null;
  // Optional — pass if the caller has subscription state. When present we can
  // detect duplicate-sub / wrong-state and disable the CTA cleanly.
  hasActiveSubscription?: boolean;
  // When the action is happening in-app (e.g. /school/billing/plans) we
  // already know the user is logged in and same-role — keep the call sites
  // honest by letting them say so.
  inAppContext?: boolean;
}

export type CheckoutTargetKind =
  | "checkout"                 // ready to go — `href` opens the checkout
  | "login"                    // anonymous — needs to authenticate first
  | "wrong-role"               // logged in but wrong audience for this plan
  | "already-subscribed"       // logged in and has active sub on this or another plan
  | "admin-blocked";           // admin user — not a subscription customer

export interface CheckoutTarget {
  kind: CheckoutTargetKind;
  href: string;
  ctaText?: string;
  // Human-readable note that the card can render in place of (or under) the
  // CTA. Localised by the caller — strings here are English fallbacks.
  warning?: string;
}

// Teacher routes live under the (teacher) route group — bare URLs like
// /dashboard, /jobs, /billing. School routes use an explicit /school/* prefix.
const PLANS_FOR_AUDIENCE: Record<"school" | "teacher_premium", string> = {
  school: "/school/billing/plans",
  teacher_premium: "/billing/plans",
};

const CHECKOUT_FOR_AUDIENCE: Record<"school" | "teacher_premium", (code: string) => string> = {
  school: (code) => `/school/billing/checkout/${encodeURIComponent(code)}`,
  teacher_premium: (code) => `/billing/checkout/${encodeURIComponent(code)}`,
};

export function resolveCheckoutTarget(input: CheckoutTargetInput): CheckoutTarget {
  const { planCode, audience, user, hasActiveSubscription } = input;
  const checkoutHref = CHECKOUT_FOR_AUDIENCE[audience](planCode);

  // 1. Anonymous → bounce through /login carrying both `next` and `selected`.
  //    `selected` is the plan code; `next` is the resolved post-login target.
  if (!user) {
    const nextParam = encodeURIComponent(checkoutHref);
    const selectedParam = encodeURIComponent(planCode);
    return {
      kind: "login",
      href: `/login?next=${nextParam}&selected=${selectedParam}`,
      ctaText: "Login to continue",
    };
  }

  // 2. Admins are not subscription customers.
  if (user.role === "admin") {
    return {
      kind: "admin-blocked",
      href: "#",
      ctaText: "Not available for admins",
      warning: "Admins manage subscriptions for other users — they don't purchase their own.",
    };
  }

  // 3. Role mismatch — show a banner instead of silently redirecting.
  if (audience === "school" && user.role !== "school") {
    return {
      kind: "wrong-role",
      href: "/teacher/billing/plans",
      ctaText: "View Teacher Premium",
      warning: "School plans are for school accounts. View Teacher Premium instead.",
    };
  }
  if (audience === "teacher_premium" && user.role !== "teacher") {
    return {
      kind: "wrong-role",
      href: "/school/billing/plans",
      ctaText: "View School plans",
      warning: "Teacher Premium is for teacher accounts. View school plans instead.",
    };
  }

  // 4. Already has an active subscription — route to management, don't allow
  //    a fresh checkout (the backend would 409 anyway).
  if (hasActiveSubscription) {
    return {
      kind: "already-subscribed",
      href: PLANS_FOR_AUDIENCE[audience],
      ctaText: "Manage subscription",
      warning: "You already have an active subscription. Manage or change it from your billing page.",
    };
  }

  // 5. Ready to go.
  return {
    kind: "checkout",
    href: checkoutHref,
    ctaText: undefined,
  };
}

// ── Same-origin guard ────────────────────────────────────────────────────
// Only relative paths starting with a single "/" are accepted as `?next=`.
// Blocks protocol-relative URLs ("//evil.com"), absolute URLs, and javascript:
// — all classic open-redirect tricks. Falls back to a safe default when the
// input fails validation.

export function parseNext(rawNext: string | null, fallback: string): string {
  if (!rawNext) return fallback;
  let decoded: string;
  try { decoded = decodeURIComponent(rawNext); } catch { return fallback; }
  if (!decoded.startsWith("/"))     return fallback;
  if (decoded.startsWith("//"))     return fallback;        // protocol-relative
  if (decoded.includes(":"))        return fallback;        // path with scheme
  if (decoded.startsWith("/api"))   return fallback;        // never bounce to API
  return decoded;
}
