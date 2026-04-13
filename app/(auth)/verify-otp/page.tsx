"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { OTP_SESSION_KEY } from "@/lib/auth/AuthContext";
import type { OtpSession } from "@/lib/auth/types";

const OTP_LENGTH = 6;

function getDashboardPath(role?: string): string {
  // Route groups (teacher), (school) don't affect URL — path is just /dashboard
  if (role === "school") return "/dashboard";
  return "/dashboard";
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const { verifyOtp, sendOtp } = useAuth();

  const [session, setSession] = useState<OtpSession | null>(null);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...otp];
    pasted.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    if (!session) return;

    setIsLoading(true);
    setError("");
    try {
      const result = await verifyOtp(session.email, code, session.purpose);
      const destination = getDashboardPath(result.user.role);
      router.push(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
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
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const filled = otp.filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: "var(--brand-accent-light)" }}
      >
        <MailCheck size={26} style={{ color: "var(--brand-accent)" }} />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Verify your email</h2>
        <p className="text-gray-500 text-sm mt-1">
          We sent a 6-digit code to{" "}
          {session ? (
            <span className="font-medium text-gray-700">{session.email}</span>
          ) : (
            "your email"
          )}
          . Enter it below to continue.
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
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mb-4" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputsRef.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={isLoading}
              className={`w-full aspect-square text-center text-lg sm:text-xl font-semibold rounded-xl border-2 outline-none transition-all focus:scale-105 ${
                error
                  ? "border-red-400 bg-red-50 text-red-600"
                  : digit
                  ? "border-brand-primary bg-brand-primary-light text-brand-primary"
                  : "border-gray-200 bg-gray-50 text-gray-900 focus:border-brand-primary focus:bg-white"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-xs text-red-500 mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || filled < OTP_LENGTH}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Verifying…</>
          ) : (
            "Verify & Continue"
          )}
        </button>
      </form>

      {/* Resend */}
      <div className="text-center mt-6">
        {countdown > 0 ? (
          <p className="text-sm text-gray-500">
            Resend code in{" "}
            <span className="font-semibold" style={{ color: "var(--brand-primary)" }}>
              {countdown}s
            </span>
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
            {isResending ? "Sending…" : "Resend code"}
          </button>
        )}
      </div>

      {/* Back */}
      <div className="text-center mt-4">
        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
