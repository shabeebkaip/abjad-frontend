"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";

export interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, "type"> {
  // Required, no default — forces every call site to think about which
  // value is correct for the field it's building (login vs. a brand-new
  // password field behave differently for password managers).
  autoComplete: "current-password" | "new-password";
}

// Wraps the shared `Input` with a trailing show/hide toggle. Uses logical
// (`pe-`/`end-`) positioning throughout so the icon sits on the visual
// trailing edge in both LTR and RTL — the old reset-password stub hardcoded
// `pr-11`/`right-3`, which stayed glued to the visual right even in Arabic.
export function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
  const [visible, setVisible] = React.useState(false);
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn("pe-10", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        aria-pressed={visible}
        aria-label={visible ? t.login.hidePassword : t.login.showPassword}
        className="absolute end-1 top-1/2 -translate-y-1/2 flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
