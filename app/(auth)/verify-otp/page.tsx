"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MailCheck, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { OTP_SESSION_KEY } from "@/lib/auth/AuthContext";
import type { OtpSession } from "@/lib/auth/types";
import { parseNext, getDashboardPath } from "@/lib/auth/checkout-target";
import { OtpInput, type OtpInputHandle } from "@/components/ui/otp-input";
import { ApiError } from "@/lib/api/client";
import { useTranslation } from "@/lib/i18n/useTranslation";

const OTP_LENGTH = 6;

function VerifyOtpInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, sendOtp } = useAuth();
  const { t } = useTranslation();

  const [session, setSession] = useState<OtpSession | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  // §5.5.5 — signup password rejected by the server blocklist. Shown as an
  // extra "← Edit your password" link alongside the normal error line.
  const [passwordRejected, setPasswordRejected] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const otpRef = useRef<OtpInputHandle>(null);

  // Load OTP session (set by login/register pages via AuthContext.sendOtp)
  useEffect(() => {
    const raw = sessionStorage.getItem(OTP_SESSION_KEY);
    if (!raw) {
      router.replace("/login");
      return;
    }
    try {
      setSession(JSON.parse(raw) as OtpSession);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // W2 — abjad_reg_data (written by /register, see the comment there) holds
  // a plaintext password until this screen verifies the signup. If the user
  // abandons the flow (navigates away — "Back to sign in", browser back,
  // closes the tab route) without completing it, clear it here so an
  // abandoned signup doesn't leave the password sitting in sessionStorage
  // for the rest of the tab's lifetime. No-op on the success path — verifyOtp
  // already clears it before this cleanup runs.
  useEffect(() => {
    return () => {
      if (session?.purpose === "signup") sessionStorage.removeItem("abjad_reg_data");
    };
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError(t.verifyOtp.incompleteCode);
      return;
    }
    if (!session) return;

    setIsLoading(true);
    setError("");
    setPasswordRejected(false);
    try {
      const result = await verifyOtp(session.email, code, session.purpose);
      // Honour ?next= if present (carried through from /pricing → /login →
      // here). Defaults to the role-appropriate dashboard. parseNext blocks
      // open-redirect injection — only same-origin paths under /api are
      // allowed through.
      const destination = parseNext(searchParams.get("next"), getDashboardPath(result.user.role));
      router.push(destination);
    } catch (err) {
      if (err instanceof ApiError && session.purpose === "signup") {
        const fe = err.payload?.fieldErrors as Record<string, string> | undefined;
        if (fe?.password) {
          setError(fe.password);
          setPasswordRejected(true);
          setIsLoading(false);
          return;
        }
      }
      setError(err instanceof Error ? err.message : t.verifyOtp.invalidCodeFallback);
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRef.current?.focus(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!session) return;
    setIsResending(true);
    try {
      await sendOtp(session.email, session.purpose);
      setOtp(Array(OTP_LENGTH).fill(""));
      setCountdown(60);
      setError("");
      setPasswordRejected(false);
      otpRef.current?.focus(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.verifyOtp.resendFailedFallback);
    } finally {
      setIsResending(false);
    }
  };

  const filled = otp.filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto"
        style={{ backgroundColor: "var(--brand-accent-light)" }}
      >
        <MailCheck size={26} style={{ color: "var(--brand-accent)" }} />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">{t.verifyOtp.title}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {t.verifyOtp.subtitlePrefix}{" "}
          {session ? (
            <span className="font-medium text-gray-700">{session.email}</span>
          ) : (
            t.verifyOtp.defaultEmail
          )}
          {t.verifyOtp.subtitleSuffix}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < filled ? "var(--brand-primary)" : "#e5e7eb" }}
          />
        ))}
      </div>

      {/* OTP form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <OtpInput ref={otpRef} value={otp} onChange={setOtp} error={!!error} disabled={isLoading} />
        </div>

        {error && (
          <div className="text-center mb-4">
            <p className="text-xs text-red-500">{error}</p>
            {passwordRejected && (
              <Link href="/register" className="inline-block mt-1 text-xs font-semibold text-primary hover:opacity-75 transition-opacity">
                {t.register.editPasswordLink}
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || filled < OTP_LENGTH}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> {t.verifyOtp.verifying}</>
          ) : (
            t.verifyOtp.verifyAndContinue
          )}
        </button>
      </form>

      {/* Resend */}
      <div className="text-center mt-6">
        {countdown > 0 ? (
          <p className="text-sm text-gray-500">
            {t.verifyOtp.resendIn.replace("{n}", String(countdown))}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-sm font-semibold flex items-center gap-1.5 mx-auto transition-opacity hover:opacity-70 disabled:opacity-50"
            style={{ color: "var(--brand-primary)" }}
          >
            <RefreshCw size={14} className={isResending ? "animate-spin" : ""} />
            {isResending ? t.verifyOtp.sending : t.verifyOtp.resend}
          </button>
        )}
      </div>

      {/* Back */}
      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
          {t.verifyOtp.backToSignIn}
        </Link>
      </div>
    </div>
  );
}

// Suspense wrapper — useSearchParams requires it for static rendering.
export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpInner />
    </Suspense>
  );
}
