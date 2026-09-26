"use client";

// DESIGN_SPEC §6.5 — Settings → Security. Single page, one section, for
// now — do not add empty placeholder tabs for future settings categories.
// PROJECT_PLAN_PANEL_I18N.md M2 supersedes the earlier "hardcoded English
// chrome" stopgap noted here by the password-auth milestone — this page's
// chrome is now translated via the `teacher.settings` namespace too. The
// SecurityCard content itself remains localized via the `security` i18n
// namespace per DESIGN_SPEC §10.

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SecurityCard } from "@/components/settings/SecurityCard";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function TeacherSettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors mb-3"
        >
          <ArrowLeft size={12} className="rtl:rotate-180" /> {t.teacher.settings.backToDashboard}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{t.teacher.settings.title}</h1>
        <p className="text-sm text-slate-500 mt-1">{t.teacher.settings.subtitle}</p>
      </div>

      <SecurityCard />
    </div>
  );
}
