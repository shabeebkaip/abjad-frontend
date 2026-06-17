"use client";

import { BillingSuccess } from "@/components/billing/BillingSuccess";

export default function TeacherBillingSuccessPage() {
  return (
    <BillingSuccess
      audience="teacher_premium"
      dashboardHref="/dashboard"
      billingHref="/billing"
    />
  );
}
