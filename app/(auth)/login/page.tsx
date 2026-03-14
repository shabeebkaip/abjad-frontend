"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n/useTranslation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  });

  const remember = watch("remember");

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    console.log(data);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
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
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="fade-in-up-4 space-y-1.5">
          <Label htmlFor="login-password">{t.login.password}</Label>
          <div className="relative">
            <Input
              {...register("password")}
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder={t.login.passwordPlaceholder}
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              className="h-11 rounded-xl ps-4 pe-11"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Remember + Forgot */}
        <div className="fade-in-up-5 flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={!!remember}
              onCheckedChange={(val) => setValue("remember", !!val)}
            />
            <Label htmlFor="remember" className="text-muted-foreground font-normal cursor-pointer">
              {t.login.remember}
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-primary hover:opacity-75 transition-opacity"
          >
            {t.login.forgot}
          </Link>
        </div>

        {/* Submit */}
        <div className="fade-in-up-6 pt-1">
          <Button
            type="submit"
            disabled={isLoading}
            className="shimmer-btn w-full h-11 rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 transition-transform"
            style={{ background: "linear-gradient(135deg, #2bbdc5 0%, #1a9aa1 100%)" }}
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

      {/* OR divider */}
      <div className="fade-in-up-6 flex items-center gap-3 my-5">
        <Separator className="flex-1" />
        <span className="text-[11px] font-semibold text-muted-foreground uppercase">{t.login.or}</span>
        <Separator className="flex-1" />
      </div>

      {/* Social sign-in */}
      <div className="fade-in-up-6 grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" className="h-11 rounded-xl gap-2.5 font-medium">
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </Button>
        <Button type="button" variant="outline" className="h-11 rounded-xl gap-2.5 font-medium hover:bg-[#f0f7ff] hover:border-[#0a66c2]/40">
          <svg className="size-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </Button>
      </div>

      {/* Register link */}
      <p className="fade-in-up-7 text-center text-sm text-muted-foreground mt-6">
        {t.login.noAccount}{" "}
        <Link href="/register" className="font-bold text-primary hover:opacity-75 transition-opacity">
          {t.login.createAccount}
        </Link>
      </p>
    </div>
  );
}
