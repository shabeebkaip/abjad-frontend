"use client";

// DESIGN_SPEC §6.5 — Settings → Security. Single page, one section, for
// now — do not add empty placeholder tabs for future settings categories.
// Page chrome follows the same pattern as notifications/preferences/page.tsx
// (hardcoded English, matching that page's existing convention — the
// SecurityCard content itself is fully localized via the `security` i18n
// namespace per DESIGN_SPEC §10).

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SecurityCard } from "@/components/settings/SecurityCard";

export default function TeacherSettingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors mb-3"
        >
          <ArrowLeft size={12} className="rtl:rotate-180" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account security.</p>
      </div>

      <SecurityCard />
    </div>
  );
}
