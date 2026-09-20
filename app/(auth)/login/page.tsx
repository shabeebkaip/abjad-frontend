"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { StatusBanner } from "@/components/ui/status-banner";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAuth } from "@/lib/auth/useAuth";
import { ApiError } from "@/lib/api/client";
import { parseNext, getDashboardPath } from "@/lib/auth/checkout-target";

type Method = "password" | "code";

type LoginFormValues = {
  email: string;
  password: string | undefined;
};

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
  const { sendOtp, login, user, isLoading: authLoading } = useAuth();
  const [method, setMethod] = useState<Method>("password");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");
  const [banner, setBanner] = useState<{ variant: "error" | "warning"; message: string } | null>(null);
  const [showTroubleLine, setShowTroubleLine] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // If the user lands on /login while already authenticated (back button,
  // bookmark, direct nav, etc.) — bounce them to ?next= or the role-based
  // dashboard.
  useEffect(() => {
    if (authLoading) return;
    if (!user) return;
    router.replace(parseNext(searchParams.get("next"), getDashboardPath(user.role)));
  }, [authLoading, user, router, searchParams]);

  // One shared email field regardless of mode — toggling method must never
  // lose the typed email (DESIGN_SPEC §6.1 state-ownership note). The zod
  // schema is rebuilt each render from the current `method`; react-hook-form
  // picks up a changed `resolver` on the next validation pass.
  const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: method === "password" ? z.string().min(1, "Password is required") : z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const switchMethod = (next: Method) => {
    setMethod(next);
    setApiError("");
    setBanner(null);
    setShowTroubleLine(false);
    setSent(false);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setApiError("");
    setBanner(null);
    setShowTroubleLine(false);
    try {
      if (method === "password") {
        const result = await login(data.email, data.password!, rememberDevice);
        router.push(parseNext(searchParams.get("next"), getDashboardPath(result.user.role)));
        return; // keep the button disabled through the redirect
      }
      await sendOtp(data.email, "login", rememberDevice);
      setSent(true);
      setTimeout(() => router.push(`/verify-otp${forwardQuery}`), 800);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          // Same generic body for all four failure modes (unknown email,
          // wrong password, OTP-only account, wrong role) — no enumeration.
          setBanner({ variant: "error", message: err.message || t.login.invalidCredentials });
          setShowTroubleLine(true);
          setValue("password", "");
          setFocus("password");
        } else if (err.status === 403 || err.status === 429) {
          setBanner({ variant: "warning", message: err.message });
        } else if (err.status === 400) {
          const fe = err.payload?.fieldErrors as Record<string, string> | undefined;
          if (fe?.email) setError("email", { message: fe.email });
          if (fe?.password) setError("password", { message: fe.password });
          if (!fe?.email && !fe?.password) setApiError(err.message);
        } else {
          setApiError(err.message);
        }
      } else {
        setApiError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = isLoading || sent;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="mb-7 fade-in-up-1">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t.login.welcome}</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {method === "password" ? t.login.subtitlePassword : t.login.subtitle}
        </p>
      </div>

      {/* Visually-hidden live region announcing the mode swap for screen readers */}
      <p aria-live="polite" className="sr-only">
        {method === "password" ? t.login.modeAnnouncePassword : t.login.modeAnnounceCode}
      </p>

      {/* noValidate — let zod own all validation (LOGIN-003). */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            disabled={disabled}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        {/* Password (password mode only) */}
        {method === "password" && (
          <div className="fade-in-up-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">{t.login.password}</Label>
              <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:opacity-75 transition-opacity">
                {t.login.forgot}
              </Link>
            </div>
            <PasswordInput
              {...register("password")}
              id="login-password"
              autoComplete="current-password"
              placeholder={t.login.passwordPlaceholder}
              aria-invalid={!!errors.password}
              className="h-11 rounded-xl ps-4"
              disabled={disabled}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
        )}

        {/* Remember this device */}
        <div className="fade-in-up-3 flex items-center gap-2">
          <input
            id="remember-device"
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <Label htmlFor="remember-device" className="text-sm text-gray-600 cursor-pointer select-none font-normal">
            {t.login.remember}
          </Label>
        </div>

        {/* Status banner (403/429/401) */}
        {banner && <div className="fade-in-up-3"><StatusBanner variant={banner.variant} message={banner.message} /></div>}
        {showTroubleLine && (
          <p className="text-xs text-muted-foreground fade-in-up-3">
            {t.login.troubleSigningIn}{" "}
            <button
              type="button"
              onClick={() => switchMethod("code")}
              className="font-semibold text-primary hover:opacity-75 transition-opacity"
            >
              {t.login.tryCodeInstead}
            </button>
          </p>
        )}

        {/* Generic API error (network, etc.) */}
        {apiError && <p className="text-xs text-destructive fade-in-up-3">{apiError}</p>}

        {/* OTP-sent success state */}
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
            disabled={disabled}
            className="shimmer-btn w-full h-11 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 transition-transform"
            style={{ background: "var(--brand-gradient)" }}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {method === "password" ? t.login.signingInPassword : t.login.signingIn}
              </>
            ) : method === "password" ? (
              t.login.signInCta
            ) : (
              t.login.cta
            )}
          </Button>
        </div>
      </form>

      {/* Method toggle — after the submit button in DOM/tab order (§9) */}
      <p className="fade-in-up-7 text-center text-sm mt-5">
        <button
          type="button"
          onClick={() => switchMethod(method === "password" ? "code" : "password")}
          className="font-semibold text-primary hover:opacity-75 transition-opacity"
        >
          {method === "password" ? t.login.useCodeInstead : t.login.usePasswordInstead}
        </button>
      </p>

      {/* Register link */}
      <p className="fade-in-up-7 text-center text-sm text-muted-foreground mt-3">
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
