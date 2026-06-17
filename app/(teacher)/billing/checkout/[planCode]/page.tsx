"use client";

import { use } from "react";
import { CheckoutForm } from "@/components/billing/CheckoutForm";

export default function TeacherCheckoutPage({ params }: { params: Promise<{ planCode: string }> }) {
  const { planCode } = use(params);
  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <CheckoutForm
        planCode={planCode}
        audience="teacher_premium"
        backHref="/billing/plans"
        successPath="/billing/success"
        pendingPath="/billing/pending"
      />
    </div>
  );
}
