"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, KeyRound, CheckCircle2 } from "lucide-react";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof schema>;

function StrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#2bbdc5"];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= score ? colors[score] : "#e5e7eb" }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[score] }}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(schema),
  });

  const passwordValue = watch("password") ?? "";

  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true);
    console.log("New password set:", data);
    // TODO: wire up API
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#e0f7f8" }}
        >
          <CheckCircle2 size={30} style={{ color: "#2bbdc5" }} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Password updated!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className="block w-full py-3 rounded-xl text-white text-sm font-semibold text-center transition-all hover:opacity-90"
          style={{ backgroundColor: "#2bbdc5" }}
        >
          Sign in now
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: "#e0f7f8" }}
      >
        <KeyRound size={26} style={{ color: "#2bbdc5" }} />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Reset password</h2>
        <p className="text-gray-500 text-sm mt-1">
          Choose a strong new password for your account.
        </p>
      </div>

      {/* Requirements */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
        <p className="text-xs font-medium text-gray-600 mb-2">Password requirements:</p>
        {[
          { label: "At least 8 characters", met: passwordValue.length >= 8 },
          { label: "One uppercase letter (A–Z)", met: /[A-Z]/.test(passwordValue) },
          { label: "One number (0–9)", met: /[0-9]/.test(passwordValue) },
          { label: "One special character (optional)", met: /[^A-Za-z0-9]/.test(passwordValue) },
        ].map(({ label, met }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: met ? "#e0f7f8" : "#f3f4f6" }}
            >
              <CheckCircle2 size={10} style={{ color: met ? "#2bbdc5" : "#9ca3af" }} />
            </div>
            <span className={`text-xs ${met ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className={`w-full px-4 py-3 rounded-xl border text-sm pr-11 transition-colors outline-none focus:ring-2 focus:ring-[#2bbdc5]/20 focus:border-[#2bbdc5] ${
                errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <StrengthBar password={passwordValue} />
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm new password
          </label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat new password"
              className={`w-full px-4 py-3 rounded-xl border text-sm pr-11 transition-colors outline-none focus:ring-2 focus:ring-[#2bbdc5]/20 focus:border-[#2bbdc5] ${
                errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          style={{ backgroundColor: "#2bbdc5" }}
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Updating…</>
          ) : (
            "Update password"
          )}
        </button>
      </form>

      {/* Back */}
      <div className="text-center mt-6">
        <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
