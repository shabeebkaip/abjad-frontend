"use client";

import * as React from "react";

export interface OtpInputHandle {
  focus: (index?: number) => void;
}

interface OtpInputProps {
  length?: number;
  value: string[];
  onChange: (next: string[]) => void;
  error?: boolean;
  disabled?: boolean;
}

// Extracted verbatim from the original /verify-otp inline implementation
// (digit-only filter, auto-advance, backspace-to-previous, paste distributes
// across boxes) — no behavior change, just relocated so /verify-otp and
// /reset-password can both use it.
export const OtpInput = React.forwardRef<OtpInputHandle, OtpInputProps>(function OtpInput(
  { length = 6, value, onChange, error, disabled },
  ref
) {
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useImperativeHandle(ref, () => ({
    focus: (index = 0) => inputsRef.current[index]?.focus(),
  }));

  const handleChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const next = [...value];
    pasted.split("").forEach((d, i) => {
      next[i] = d;
    });
    onChange(next);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="grid grid-cols-6 gap-1.5 sm:gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className={`w-full aspect-square text-center text-lg sm:text-xl font-semibold rounded-xl border-2 outline-none transition-all focus:scale-105 ${
            error
              ? "border-red-400 bg-red-50 text-red-600"
              : value[i]
              ? "border-brand-primary bg-brand-primary-light text-brand-primary"
              : "border-gray-200 bg-gray-50 text-gray-900 focus:border-brand-primary focus:bg-white"
          }`}
        />
      ))}
    </div>
  );
});
