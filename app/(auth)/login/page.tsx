"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

function LoginInner() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Carry ?next= and ?selected= through to /verify-otp so the post-login
  // redirect lands the user where they intended (typically a checkout page).
  const forwardQuery = (() => {
    const qs = new URLSearchParams();
    const next = searchParams.get("next");
    const selected = searchParams.get("selected");
    if (next) qs.set("next", next);
    if (selected) qs.set("selected", selected);
    const s = qs.toString();
    return s ? `?${s}` : "";
  })();
  const { sendOtp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);

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
      await sendOtp(data.email, "login", rememberDevice);
      setSent(true);
      setTimeout(() => router.push(`/verify-otp${forwardQuery}`), 800);
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

        {/* Remember this device */}
        <div className="fade-in-up-3 flex items-center gap-2">
          <input
            id="remember-device"
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            disabled={isLoading || sent}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <Label
            htmlFor="remember-device"
            className="text-sm text-gray-600 cursor-pointer select-none font-normal"
          >
            {t.login.remember}
          </Label>
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

// Suspense wrapper required for Next.js static rendering when useSearchParams
// is called inside the page (the carry of ?next= / ?selected= from the public
// pricing page through to /verify-otp).
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
