"use client";

import { use } from "react";
import { BillingPending } from "@/components/billing/BillingPending";

export default function TeacherPendingPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = use(params);
  return (
    <div className="p-4 lg:p-6">
      <BillingPending invoiceId={invoiceId} audience="teacher_premium" billingHref="/billing" />
    </div>
  );
}
