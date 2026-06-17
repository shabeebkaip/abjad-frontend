// Public pricing-page payload — fetched anonymously, no auth required.
// Backed by GET /api/pricing/page?locale=en|ar in abjad-backend.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export type PricingPaymentMethod = "mada" | "apple_pay" | "stcpay" | "moyasar_card" | "bank_transfer";

export interface PricingHero {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  reassurance: string;
}

export interface PricingTrustStrip {
  schoolCount: number;
  teacherCount: number;
  logos: { name: string; logoUrl?: string }[];
}

export interface PricingWhyReason {
  icon: string;
  title: string;
  body: string;
}

export interface PricingPlan {
  code: string;
  audience: "school" | "teacher_premium";
  durationMonths: 1 | 6 | 12;
  durationLabel: string;
  priceHalala: number;
  effectiveMonthlyHalala: number;
  savings: null | { vsMonthlyHalala: number; percent: number };
  name: string;
  description?: string;
  ctaText?: string;
  bullets: string[];
  isHighlighted: boolean;
  displayOrder: number;
  entitlements: Record<string, number | boolean | null>;
}

export interface PricingComparisonRow {
  key: string;
  label: string;
  description?: string;
  values: [string, string];
}

export interface PricingComparisonGroup {
  label: string;
  rows: PricingComparisonRow[];
}

export interface PricingTestimonial {
  kind: "anchor" | "short";
  name: string;
  role: string;
  school: string;
  city?: string;
  outcome?: string;
  photoUrl?: string;
  quote: string;
}

export interface PricingFaqItem {
  q: string;
  a: string;
}

export interface PricingFooterLegal {
  vatNumber: string;
  crNumber: string;
  address: string;
}

export interface PricingPagePayload {
  locale: "en" | "ar";
  generatedAt: string;
  hero: PricingHero;
  trustStrip: PricingTrustStrip;
  whyAbjad: PricingWhyReason[];
  plans: { school: PricingPlan[]; teacher: PricingPlan[] };
  comparison: { columns: [string, string]; groups: PricingComparisonGroup[] };
  testimonials: PricingTestimonial[];
  faq: PricingFaqItem[];
  paymentMethods: PricingPaymentMethod[];
  footerLegal: PricingFooterLegal;
}

export async function getPricingPagePayload(locale: "en" | "ar"): Promise<PricingPagePayload> {
  const res = await fetch(`${API_URL}/api/pricing/page?locale=${locale}`, {
    // Marketing payload changes infrequently; let the browser cache it briefly.
    // The backend itself sends Cache-Control + the admin invalidation flow is
    // a follow-up.
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to load pricing page: ${res.status}`);
  }
  const json = await res.json();
  if (!json?.success) throw new Error(json?.message ?? "Pricing page request failed");
  return json.data as PricingPagePayload;
}
