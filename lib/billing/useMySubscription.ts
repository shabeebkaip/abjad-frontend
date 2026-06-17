"use client";

import { useCallback, useEffect, useState } from "react";
import { getMySubscription, type MySubscription } from "@/lib/api/billing";

// Shared subscription state hook — used by:
//   - the trial banner on dashboards
//   - the plan badge in headers
//   - the paywall modal entitlement reader
//
// Fetches once on mount; exposes a refetch() callers can fire after
// completing a checkout or trial action. Errors are surfaced as null
// (callers can render an optimistic UI rather than blocking).

export interface MySubscriptionState {
  subscription: MySubscription | null;
  isTrialing: boolean;
  isPaid: boolean;
  isLegacy: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMySubscription(): MySubscriptionState {
  const [subscription, setSubscription] = useState<MySubscription | null>(null);
  const [isTrialing, setIsTrialing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isLegacy, setIsLegacy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await getMySubscription();
      setSubscription(r.subscription);
      setIsTrialing(r.isTrialing);
      setIsPaid(r.isPaid);
      setIsLegacy(r.isLegacy);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load subscription");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { subscription, isTrialing, isPaid, isLegacy, loading, error, refetch: load };
}
