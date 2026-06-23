// In-app billing surface — used by both school and teacher dashboards.
// Wraps the existing Phase B/D endpoints we already shipped on the backend.

import { apiFetch } from "./client";

export type SubscriptionStatus = "trialing" | "active" | "past_due" | "cancelled" | "expired";

export interface MySubscription {
  _id: string;
  ownerType: "school" | "teacher";
  planCode: string;
  pricePerPeriodHalala: number;
  durationMonths: 1 | 6 | 12;
  status: SubscriptionStatus;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  autoRenew: boolean;
  trialEndsAt?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
}

export interface MySubscriptionResponse {
  subscription: MySubscription | null;
  isTrialing: boolean;
  isPaid: boolean;
  isLegacy: boolean;
}

export interface MyInvoice {
  _id: string;
  number: string;
  status: "draft" | "pending" | "paid" | "failed" | "cancelled";
  paymentMethod?: "moyasar_card" | "mada" | "apple_pay" | "stcpay" | "bank_transfer" | "manual";
  subtotalHalala: number;
  vatHalala: number;
  totalHalala: number;
  currency: "SAR";
  issuedAt: string;
  issuedAtHijri: string;
  paidAt?: string;
  dueAt?: string;
}

export async function getMySubscription(): Promise<MySubscriptionResponse> {
  const r = await apiFetch<MySubscriptionResponse>("/api/subscriptions/me");
  return r.data!;
}

export async function listMyInvoices(page = 1, limit = 20): Promise<{ invoices: MyInvoice[]; total: number; page: number; totalPages: number }> {
  const r = await apiFetch<{ invoices: MyInvoice[]; total: number; page: number; totalPages: number }>(`/api/invoices?page=${page}&limit=${limit}`);
  return r.data!;
}

export async function startTrial(): Promise<MySubscription> {
  const r = await apiFetch<MySubscription>("/api/subscriptions/trial", { method: "POST" });
  return r.data!;
}

export async function cancelMySubscription(reason?: string): Promise<MySubscription> {
  const r = await apiFetch<MySubscription>("/api/subscriptions/cancel", {
    method: "POST",
    body: JSON.stringify({ reason }),
    headers: { "Content-Type": "application/json" },
  });
  return r.data!;
}

// ── Checkout / Payments ────────────────────────────────────────────────────

export type CheckoutMethod = "moyasar_card" | "mada" | "apple_pay" | "stcpay" | "bank_transfer";

export interface InitiatePaymentResponse {
  invoice: {
    _id: string;
    number: string;
    status: string;
    paymentMethod: string;
    subtotalHalala: number;
    vatHalala: number;
    totalHalala: number;
    issuedAt: string;
    dueAt?: string;
    sellerNameEn: string;
    sellerNameAr: string;
    buyerName: string;
    buyerEmail?: string;
  };
  payment: {
    _id: string;
    status: string;
    method: string;
    amountHalala: number;
  };
  providerPaymentId: string;
  publishableKey: string;
  amountHalala: number;
  currency: "SAR";
  // Moyasar hosted-checkout URL. When present, redirect the user here
  // instead of rendering the Moyasar.js embedded form.
  transactionUrl?: string;
  // True when the backend has no Moyasar credentials configured and the
  // demo provider is in use. Frontend renders a "simulate successful
  // payment" button instead of the Moyasar.js form.
  demoMode?: boolean;
}

export async function demoCompletePayment(providerPaymentId: string): Promise<{ activated: boolean; subscriptionId?: string }> {
  const r = await apiFetch<{ activated: boolean; subscriptionId?: string }>(
    `/api/payments/demo/${encodeURIComponent(providerPaymentId)}/complete`,
    { method: "POST" },
  );
  return r.data!;
}

/**
 * Ask the backend to check Moyasar directly for this payment's current
 * status, and (if Moyasar says paid) run the same activation hot-path the
 * webhook would. Used by /billing/success to recover from missed webhooks —
 * always on localhost (webhook can't reach localhost), occasionally in
 * production during a provider blip.
 */
export async function reconcilePayment(
  providerPaymentId: string,
  invoiceId?: string | null,
): Promise<{
  status: "pending" | "succeeded" | "failed" | "unknown";
  activated: boolean;
  subscriptionId?: string;
}> {
  const qs = invoiceId ? `?invoiceId=${encodeURIComponent(invoiceId)}` : "";
  const r = await apiFetch<{
    status: "pending" | "succeeded" | "failed" | "unknown";
    activated: boolean;
    subscriptionId?: string;
  }>(`/api/payments/${encodeURIComponent(providerPaymentId)}/reconcile${qs}`, { method: "POST" });
  return r.data!;
}

export async function initiatePayment(payload: {
  planCode: string;
  method?: CheckoutMethod;
  callbackUrl?: string;
}): Promise<InitiatePaymentResponse> {
  const r = await apiFetch<InitiatePaymentResponse>("/api/payments/initiate", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
  return r.data!;
}

export async function getInvoice(invoiceId: string): Promise<MyInvoice & {
  sellerNameEn: string;
  sellerNameAr: string;
  buyerName: string;
  buyerEmail?: string;
}> {
  // The backend's GET /invoices/:id endpoint isn't exposed directly to teachers/
  // schools as a single-record fetch — we list and find. This is fine for v1 at
  // small volume; a dedicated route is a v1.1 polish item.
  const list = await listMyInvoices(1, 50);
  const found = list.invoices.find((i) => i._id === invoiceId);
  if (!found) throw new Error("Invoice not found");
  return found as MyInvoice & { sellerNameEn: string; sellerNameAr: string; buyerName: string };
}
