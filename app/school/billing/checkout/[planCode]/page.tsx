"use client";

import { use } from "react";
import { CheckoutForm } from "@/components/billing/CheckoutForm";

export default function SchoolCheckoutPage({ params }: { params: Promise<{ planCode: string }> }) {
  const { planCode } = use(params);
  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <CheckoutForm
        planCode={planCode}
        audience="school"
        backHref="/school/billing/plans"
        successPath="/school/billing/success"
        pendingPath="/school/billing/pending"
      />
    </div>
  );
}
