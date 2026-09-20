"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { PasswordRequirements } from "@/components/ui/password-requirements";
import { FieldError } from "@/components/ui/field-error";
import { StatusBanner, type StatusBannerVariant } from "@/components/ui/status-banner";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAuth } from "@/lib/auth/useAuth";
import authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

type Banner = { variant: StatusBannerVariant; message: string } | null;

function getFieldErrors(err: unknown): Record<string, string> | undefined {
  if (err instanceof ApiError) return err.payload?.fieldErrors as Record<string, string> | undefined;
  return undefined;
}

// ── Set password (hasPassword === false) ───────────────────────────────────
function SetPasswordForm({
  onSuccess,
  onAlreadySet,
}: {
  onSuccess: () => void;
  onAlreadySet: () => void;
}) {
  const { t } = useTranslation();
  const schema = z
    .object({
      newPassword: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must be at most 128 characters"),
      confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t.register.passwordsNoMatch,
      path: ["confirmPassword"],
    });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);
  const password = watch("newPassword") ?? "";

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setBanner(null);
    try {
      await authApi.setPassword(data.newPassword);
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          const fe = getFieldErrors(err);
          if (fe?.newPassword) setError("newPassword", { message: fe.newPassword });
          else setBanner({ variant: "error", message: err.message });
        } else if (err.status === 409) {
          onAlreadySet();
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
    <>
      <h3 className="text-base font-semibold text-slate-900">{t.security.addPasswordTitle}</h3>
      <p className="text-sm text-slate-500 mt-1 mb-5">{t.security.addPasswordBody}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="set-new-password">{t.resetPassword.newPassword}</Label>
          <PasswordInput
            id="set-new-password"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            disabled={isLoading}
            {...register("newPassword")}
          />
          <PasswordRequirements password={password} />
          <FieldError message={errors.newPassword?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="set-confirm-password">{t.resetPassword.confirmPassword}</Label>
          <PasswordInput
            id="set-confirm-password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        {banner && <StatusBanner variant={banner.variant} message={banner.message} />}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 rounded-xl text-sm font-bold w-full sm:w-auto sm:px-6"
          style={{ background: "var(--brand-gradient)" }}
        >
          {isLoading ? <><Loader2 size={16} className="animate-spin" /> {t.resetPassword.resetting}</> : t.security.setPasswordCta}
        </Button>
      </form>
    </>
  );
}

// ── Change password (hasPassword === true) ─────────────────────────────────
function ChangePasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation();
  const schema = z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must be at most 128 characters"),
      confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t.register.passwordsNoMatch,
      path: ["confirmPassword"],
    });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);
  const password = watch("newPassword") ?? "";

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setBanner(null);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      reset();
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          // Current/new/confirm values are preserved — don't make the user
          // retype a correct new password because they mistyped the current
          // one (§5.8.4).
          setError("currentPassword", { message: t.security.currentPasswordIncorrect });
        } else if (err.status === 400) {
          const fe = getFieldErrors(err);
          if (fe?.newPassword) setError("newPassword", { message: fe.newPassword });
          else setBanner({ variant: "error", message: err.message });
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
    <>
      <h3 className="text-base font-semibold text-slate-900">{t.security.changePasswordTitle}</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="current-password">{t.security.currentPassword}</Label>
          <PasswordInput
            id="current-password"
            autoComplete="current-password"
            aria-invalid={!!errors.currentPassword}
            disabled={isLoading}
            {...register("currentPassword")}
          />
          <FieldError message={errors.currentPassword?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="change-new-password">{t.resetPassword.newPassword}</Label>
          <PasswordInput
            id="change-new-password"
            autoComplete="new-password"
            aria-invalid={!!errors.newPassword}
            disabled={isLoading}
            {...register("newPassword")}
          />
          <PasswordRequirements password={password} />
          <FieldError message={errors.newPassword?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="change-confirm-password">{t.resetPassword.confirmPassword}</Label>
          <PasswordInput
            id="change-confirm-password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        {banner && <StatusBanner variant={banner.variant} message={banner.message} />}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 rounded-xl text-sm font-bold w-full sm:w-auto sm:px-6"
          style={{ background: "var(--brand-gradient)" }}
        >
          {isLoading ? <><Loader2 size={16} className="animate-spin" /> {t.resetPassword.resetting}</> : t.security.changePasswordCta}
        </Button>
      </form>
    </>
  );
}

// ── Composite — picks the right state off user.hasPassword ─────────────────
export function SecurityCard() {
  const { user, updateHasPassword } = useAuth();
  const { t } = useTranslation();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!user) return null;

  const handleAlreadySet = async () => {
    // Race condition (e.g. two open tabs): our cached hasPassword was stale.
    // Re-fetch /me to confirm, then flip to the Change-password state.
    try {
      const me = await authApi.getMe();
      updateHasPassword(me.hasPassword);
    } catch {
      // Best-effort — if /me also fails, flip locally anyway so the user
      // isn't stuck resubmitting the "set" form against a 409 forever.
      updateHasPassword(true);
    }
    setSuccessMsg(t.security.alreadySetNotice);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">{t.security.title}</h2>

      {successMsg && (
        <div className="mb-4 flex items-start gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
          <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
          <p>{successMsg}</p>
        </div>
      )}

      {user.hasPassword ? (
        <ChangePasswordForm onSuccess={() => setSuccessMsg(t.security.changePasswordSuccess)} />
      ) : (
        <SetPasswordForm
          onSuccess={() => {
            updateHasPassword(true);
            setSuccessMsg(t.security.setPasswordSuccess);
          }}
          onAlreadySet={handleAlreadySet}
        />
      )}
    </div>
  );
}
