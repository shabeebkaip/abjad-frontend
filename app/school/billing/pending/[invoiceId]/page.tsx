"use client";

import { use } from "react";
import { BillingPending } from "@/components/billing/BillingPending";

export default function SchoolPendingPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = use(params);
  return (
    <div className="p-4 lg:p-6">
      <BillingPending invoiceId={invoiceId} audience="school" billingHref="/school/billing" />
    </div>
  );
}
