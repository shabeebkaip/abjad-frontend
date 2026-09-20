"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Corrected requirements checklist — the backend only enforces min 8 chars
// + a common-password blocklist (NO forced uppercase/number/symbol). The
// blocklist can't be verified client-side (it's server-only by design, so
// it can't drift or be scraped), so that row is always a static, unchecked
// bullet — never a checkmark — informational only. Rejection surfaces via
// the server's `fieldErrors.password`/`fieldErrors.newPassword` → FieldError.
export function PasswordRequirements({ password }: { password: string }) {
  const { t } = useTranslation();
  const lengthMet = password.length >= 8;

  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex items-center gap-1.5">
        <div
          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
            lengthMet ? "bg-[var(--brand-accent-light)]" : "bg-gray-100"
          }`}
        >
          {lengthMet && <CheckCircle2 size={9} className="text-[var(--brand-accent)]" />}
        </div>
        <span className={`text-xs ${lengthMet ? "text-gray-700" : "text-gray-400"}`}>
          {t.register.passwordReq8Chars}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 bg-gray-100">
          <span className="text-gray-400 text-[10px] leading-none">&bull;</span>
        </div>
        <span className="text-xs text-gray-400">{t.register.passwordReqNotCommon}</span>
      </div>
    </div>
  );
}
