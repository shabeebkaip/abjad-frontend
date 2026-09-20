"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { isCommonPassword } from "@/lib/auth/common-passwords";

// Requirements checklist — the backend enforces min 8 chars + a
// common-password blocklist (NO forced uppercase/number/symbol). SIGNUP-008
// — the blocklist is now mirrored client-side (lib/auth/common-passwords.ts,
// kept in sync with the backend) so this row reflects real state live as the
// user types, instead of a permanently-unchecked static bullet. The backend
// blocklist stays the authoritative backstop (server rejection still
// surfaces via `fieldErrors.password`/`fieldErrors.newPassword` → FieldError
// for anything this mirror missed or a future backend-only addition).
export function PasswordRequirements({ password }: { password: string }) {
  const { t } = useTranslation();
  const lengthMet = password.length >= 8;
  const notCommonMet = lengthMet && !isCommonPassword(password);

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
        <div
          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
            notCommonMet ? "bg-[var(--brand-accent-light)]" : "bg-gray-100"
          }`}
        >
          {notCommonMet ? (
            <CheckCircle2 size={9} className="text-[var(--brand-accent)]" />
          ) : (
            <span className="text-gray-400 text-[10px] leading-none">&bull;</span>
          )}
        </div>
        <span className={`text-xs ${notCommonMet ? "text-gray-700" : "text-gray-400"}`}>
          {t.register.passwordReqNotCommon}
        </span>
      </div>
    </div>
  );
}
