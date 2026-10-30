"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { getDashboardPath } from "@/lib/auth/checkout-target";

// Drop-in for next/link on marketing pages: a signed-in user clicking a
// registration CTA goes to their dashboard instead (HOME-040). Reuses
// AuthContext state — no extra refresh calls.
export default function MarketingLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const { user, isAuthenticated } = useAuth();
  const target =
    isAuthenticated && typeof href === "string" && href.startsWith("/register")
      ? getDashboardPath(user?.role)
      : href;
  return <Link href={target} {...rest} />;
}
