"use client";

// DESIGN_SPEC §6.5 — Settings → Security (school). Mirrors the teacher
// settings page; SecurityCard is the same component for both roles (§3.7 —
// not abstracted further since both consumers render it identically).

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SecurityCard } from "@/components/settings/SecurityCard";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function SchoolSettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
      <div className="mb-6">
        <Link
          href="/school/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors mb-3"
        >
          <ArrowLeft size={12} className="rtl:rotate-180" /> {t.school.settings.backToDashboard}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{t.school.settings.title}</h1>
        <p className="text-sm text-slate-500 mt-1">{t.school.settings.subtitle}</p>
      </div>

      <SecurityCard />
    </div>
  );
}
