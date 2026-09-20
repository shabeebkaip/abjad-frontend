"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { useTranslation } from "@/lib/i18n/useTranslation";

const DISMISS_KEY = "abjad_pw_prompt_dismissed";

// Soft, dismissible prompt for OTP-only users (hasPassword === false) shown
// on the dashboard. Dismiss is PERMANENT (localStorage, not per-session) —
// this is an invitation, never a nag. DECISIONS LOCKED #3.
export function PasswordPromptBanner({ settingsHref }: { settingsHref: string }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  // Lazy initializer (not an effect) — safe because this component only
  // ever mounts client-side, after the parent layout's isLoading gate lifts
  // (it never appears in the initial server-rendered/hydrated tree), so
  // there's no SSR/CSR mismatch to worry about here.
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem(DISMISS_KEY) === "1"
  );

  if (!user || user.hasPassword || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="rounded-2xl border border-[var(--brand-accent)]/20 bg-[var(--brand-accent-light)] p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
        <KeyRound className="text-[var(--brand-accent-dark)]" size={18} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{t.dashboardBanner.passwordPromptTitle}</p>
        <p className="text-xs text-gray-600 mt-0.5">{t.dashboardBanner.passwordPromptBody}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={settingsHref}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          {t.dashboardBanner.setPasswordAction}
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex items-center px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 rounded-xl hover:bg-white/50 transition-colors"
        >
          {t.dashboardBanner.notNow}
        </button>
      </div>
    </div>
  );
}
