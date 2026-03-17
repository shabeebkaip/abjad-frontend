"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotForm = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    console.log("Reset link sent to:", data.email);
    // TODO: wire up API
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "var(--brand-primary-light)" }}
        >
          <CheckCircle2 size={30} style={{ color: "var(--brand-primary)" }} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check your inbox</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          We&apos;ve sent a password reset link to{" "}
          <span className="font-semibold text-gray-700">{getValues("email")}</span>.
          It may take a minute or two to arrive.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/login"
            className="block w-full py-3 rounded-xl text-white text-sm font-semibold text-center transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            Back to sign in
          </Link>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="block w-full py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 border border-gray-200 text-center"
          >
            Try a different email
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Didn&apos;t get the email? Check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: "var(--brand-accent-light)" }}
      >
        <Mail size={26} style={{ color: "var(--brand-accent)" }} />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Forgot password?</h2>
        <p className="text-gray-500 text-sm mt-1">
          No worries! Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary ${
              errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Sending…</>
          ) : (
            "Send reset link"
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
