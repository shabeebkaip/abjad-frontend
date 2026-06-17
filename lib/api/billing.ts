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
