"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, KeyRound, CheckCircle2, RefreshCw } from "lucide-react";

import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordRequirements } from "@/components/ui/password-requirements";
import { FieldError } from "@/components/ui/field-error";
import { StatusBanner } from "@/components/ui/status-banner";
import { OtpInput, type OtpInputHandle } from "@/components/ui/otp-input";
import { useTranslation } from "@/lib/i18n/useTranslation";
import authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { isCommonPassword, COMMON_PASSWORD_MESSAGE } from "@/lib/auth/common-passwords";

const OTP_LENGTH = 6;

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters")
      .refine((val) => !isCommonPassword(val), { message: COMMON_PASSWORD_MESSAGE }),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

type ResetForm = z.infer<typeof schema>;

// §6.4 — combined code + new password screen, one submit to
// POST /auth/reset-password. Does NOT reuse the /verify-otp page — only
// its extracted OtpInput component (DECISIONS LOCKED #2).
export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [codeError, setCodeError] = useState("");
  const [banner, setBanner] = useState<{ variant: "error" | "warning"; message: string; action?: { label: string; href: string } } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const otpRef = useRef<OtpInputHandle>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("abjad_reset_email");
    if (!stored) {
      router.replace("/forgot-password");
      return;
    }
    setEmail(stored);
  }, [router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<ResetForm>({ resolver: zodResolver(schema) });

  const passwordValue = watch("newPassword") ?? "";

  const onSubmit = async (data: ResetForm) => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setCodeError(t.verifyOtp.incompleteCode);
      return;
    }
    if (!email) return;

    setIsLoading(true);
    setCodeError("");
    setBanner(null);
    try {
      await authApi.resetPassword(email, code, data.newPassword);
      sessionStorage.removeItem("abjad_reset_email");
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          // Wrong code — server message already includes attempts remaining.
          // New/confirm password values are preserved.
          setCodeError(err.message);
          setOtp(Array(OTP_LENGTH).fill(""));
          otpRef.current?.focus(0);
        } else if (err.status === 404) {
          setBanner({
            variant: "warning",
            message: err.message,
            action: { label: t.resetPassword.requestNewCode, href: "/forgot-password" },
          });
        } else if (err.status === 429) {
          setBanner({ variant: "warning", message: err.message });
          setLocked(true);
        } else if (err.status === 400) {
          const fe = err.payload?.fieldErrors as Record<string, string> | undefined;
          if (fe?.newPassword) setError("newPassword", { message: fe.newPassword });
          else setBanner({ variant: "error", message: err.message });
        } else {
          setBanner({ variant: "error", message: err.message });
        }
      } else {
        setBanner({ variant: "error", message: err instanceof Error ? err.message : "Something went wrong. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      await authApi.sendOtp(email, "reset");
      setOtp(Array(OTP_LENGTH).fill(""));
      setCountdown(60);
      setCodeError("");
      otpRef.current?.focus(0);
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : t.verifyOtp.resendFailedFallback);
    } finally {
      setIsResending(false);
    }
  };

  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "var(--brand-accent-light)" }}
        >
          <CheckCircle2 size={30} style={{ color: "var(--brand-accent)" }} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t.resetPassword.successTitle}</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">{t.resetPassword.successBody}</p>
        <Link
          href="/login"
          className="block w-full py-3 rounded-xl text-white text-sm font-semibold text-center transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          {t.resetPassword.signInNow}
        </Link>
      </div>
    );
  }

  const formDisabled = isLoading || locked;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto"
        style={{ backgroundColor: "var(--brand-accent-light)" }}
      >
        <KeyRound size={26} style={{ color: "var(--brand-accent)" }} />
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{t.resetPassword.title}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {t.resetPassword.subtitle.replace("{email}", email ?? "")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <OtpInput ref={otpRef} value={otp} onChange={setOtp} error={!!codeError} disabled={formDisabled} />
          {codeError && <p className="text-center text-xs text-red-500 mt-2">{codeError}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reset-new-password">{t.resetPassword.newPassword}</Label>
          <PasswordInput
            id="reset-new-password"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            disabled={formDisabled}
            {...register("newPassword")}
          />
          <PasswordRequirements password={passwordValue} />
          <FieldError message={errors.newPassword?.message} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reset-confirm-password">{t.resetPassword.confirmPassword}</Label>
          <PasswordInput
            id="reset-confirm-password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            disabled={formDisabled}
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        {banner && <StatusBanner variant={banner.variant} message={banner.message} action={banner.action} />}

        <button
          type="submit"
          disabled={formDisabled}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> {t.resetPassword.resetting}</>
          ) : (
            t.resetPassword.cta
          )}
        </button>
      </form>

      {/* Resend */}
      <div className="text-center mt-6">
        {countdown > 0 ? (
          <p className="text-sm text-gray-500">{t.resetPassword.resendIn.replace("{n}", String(countdown))}</p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || locked}
            className="text-sm font-semibold flex items-center gap-1.5 mx-auto transition-opacity hover:opacity-70 disabled:opacity-50"
            style={{ color: "var(--brand-primary)" }}
          >
            <RefreshCw size={14} className={isResending ? "animate-spin" : ""} />
            {isResending ? t.verifyOtp.sending : t.resetPassword.resend}
          </button>
        )}
      </div>

      {/* Back */}
      <div className="text-center mt-4">
        <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-gray-700">
          {t.resetPassword.backToForgot}
        </Link>
      </div>
    </div>
  );
}
