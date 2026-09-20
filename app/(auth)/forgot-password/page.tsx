"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail } from "lucide-react";

import { FieldError } from "@/components/ui/field-error";
import { StatusBanner } from "@/components/ui/status-banner";
import { useTranslation } from "@/lib/i18n/useTranslation";
import authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotForm = z.infer<typeof schema>;

// §5.6 — standalone flow, not routed through AuthContext.sendOtp (that
// helper is scoped to login/signup and writes OTP_SESSION_KEY). Reset uses
// its own sessionStorage key (abjad_reset_email) and calls the auth API
// client directly.
export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState<{ variant: "error" | "warning"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    setBanner(null);
    try {
      await authApi.sendOtp(data.email, "reset");
      sessionStorage.setItem("abjad_reset_email", data.email);
      router.push("/reset-password");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          // Intentional pre-existing enumeration tradeoff for this endpoint
          // (DECISIONS LOCKED #6) — not masked here.
          setError("email", { message: err.message });
        } else if (err.status === 429) {
          setBanner({ variant: "warning", message: err.message });
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto"
        style={{ backgroundColor: "var(--brand-accent-light)" }}
      >
        <Mail size={26} style={{ color: "var(--brand-accent)" }} />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">{t.forgotPassword.title}</h2>
        <p className="text-gray-500 text-sm mt-1">{t.forgotPassword.subtitle}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.login.email}</label>
          <input
            {...register("email")}
            type="email"
            dir="ltr"
            placeholder={t.login.emailPlaceholder}
            disabled={isLoading}
            aria-invalid={!!errors.email}
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary ${
              errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
            }`}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {banner && <StatusBanner variant={banner.variant} message={banner.message} />}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> {t.forgotPassword.sending}</>
          ) : (
            t.forgotPassword.cta
          )}
        </button>
      </form>

      {/* Back */}
      <div className="text-center mt-6">
        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
          {t.forgotPassword.backToLogin}
        </Link>
      </div>
    </div>
  );
}
