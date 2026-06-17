"use client";

import { BillingSuccess } from "@/components/billing/BillingSuccess";

export default function SchoolBillingSuccessPage() {
  return (
    <BillingSuccess
      audience="school"
      dashboardHref="/school/dashboard"
      billingHref="/school/billing"
    />
  );
}
