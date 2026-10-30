"use client";

import { WifiOff } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Shown by protected layouts when the startup session check failed
// transiently (network / 429 / 5xx). The session may well be valid, so we
// offer a retry instead of bouncing the user to /login.
export function AuthUnavailable() {
  const { retryAuth } = useAuth();
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col items-center justify-center text-center gap-3 min-h-[60vh] px-6">
      <WifiOff className="w-8 h-8 text-slate-400" aria-hidden />
      <h2 className="text-lg font-semibold text-gray-900">{t.authUnavailable.title}</h2>
      <p className="text-sm text-gray-500 max-w-sm">{t.authUnavailable.body}</p>
      <button
        type="button"
        onClick={retryAuth}
        className="mt-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
        style={{ backgroundColor: "var(--brand-primary)" }}
      >
        {t.authUnavailable.retry}
      </button>
    </div>
  );
}
