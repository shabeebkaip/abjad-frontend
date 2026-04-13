"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAuth } from "@/lib/auth/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { sendOtp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setApiError("");
    try {
      await sendOtp(data.email, "login");
      setSent(true);
      setTimeout(() => router.push("/verify-otp"), 800);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="mb-7 fade-in-up-1">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t.login.welcome}</h2>
        <p className="text-muted-foreground text-sm mt-1">{t.login.subtitle}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="fade-in-up-3 space-y-1.5">
          <Label htmlFor="login-email">{t.login.email}</Label>
          <Input
            {...register("email")}
            id="login-email"
            type="email"
            placeholder={t.login.emailPlaceholder}
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="h-11 rounded-xl ps-4"
            dir="ltr"
            disabled={isLoading || sent}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* API error */}
        {apiError && (
          <p className="text-xs text-destructive fade-in-up-3">{apiError}</p>
        )}

        {/* Success state */}
        {sent && (
          <div className="flex items-center gap-2 text-sm text-green-600 fade-in-up-3">
            <CheckCircle2 size={16} />
            {t.login.otpSent}
          </div>
        )}

        {/* Submit */}
        <div className="fade-in-up-6 pt-1">
          <Button
            type="submit"
            disabled={isLoading || sent}
            className="shimmer-btn w-full h-11 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 transition-transform"
            style={{ background: "var(--brand-gradient)" }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {t.login.signingIn}
              </>
            ) : (
              t.login.cta
            )}
          </Button>
        </div>
      </form>

      {/* Register link */}
      <p className="fade-in-up-7 text-center text-sm text-muted-foreground mt-6">
        {t.login.noAccount}{" "}
        <Link href="/choose-role" className="font-bold text-primary hover:opacity-75 transition-opacity">
          {t.login.createAccount}
        </Link>
      </p>
    </div>
  );
}
