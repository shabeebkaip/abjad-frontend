"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, GraduationCap, School, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

type Role = "teacher" | "school";

export default function LoginPage() {
  const [role, setRole] = useState<Role>("teacher");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    console.log({ role, ...data });
    // TODO: wire up API
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="mb-7 fade-in-up-1">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to continue to Abjad</p>
        </div>

        {/* Animated Role Toggle */}
        <div className="fade-in-up-2 mb-6">
          <div
            className="relative flex bg-gray-100 rounded-2xl p-1 gap-1"
            style={{ isolation: "isolate" }}
          >
            {/* Sliding pill */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm"
              style={{
                background: "linear-gradient(135deg, #2bbdc5, #1a9aa1)",
                transform: role === "teacher" ? "translateX(2px)" : "translateX(calc(100% + 6px))",
                zIndex: 0,
              }}
            />
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 z-10"
              style={{ color: role === "teacher" ? "#fff" : "#9ca3af" }}
            >
              <GraduationCap size={15} />
              Teacher
            </button>
            <button
              type="button"
              onClick={() => setRole("school")}
              className="relative flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors duration-200 z-10"
              style={{ color: role === "school" ? "#fff" : "#9ca3af" }}
            >
              <School size={15} />
              School
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email — floating label */}
          <div className="fade-in-up-3 relative">
            <input
              {...register("email")}
              type="email"
              id="login-email"
              placeholder=" "
              autoComplete="email"
              className={`peer w-full px-4 pt-5 pb-2 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-[#2bbdc5]/25 focus:border-[#2bbdc5] bg-white ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            <label
              htmlFor="login-email"
              className="absolute left-4 top-3.5 text-xs font-medium text-gray-400 pointer-events-none transition-all duration-200
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold"
              style={{ color: errors.email ? "#f87171" : undefined }}
            >
              Email address
            </label>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password — floating label */}
          <div className="fade-in-up-4 relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="login-password"
              placeholder=" "
              autoComplete="current-password"
              className={`peer w-full px-4 pt-5 pb-2 pr-11 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-[#2bbdc5]/25 focus:border-[#2bbdc5] bg-white ${
                errors.password ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            <label
              htmlFor="login-password"
              className="absolute left-4 top-3.5 text-xs font-medium text-gray-400 pointer-events-none transition-all duration-200
                peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400
                peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-semibold"
              style={{ color: errors.password ? "#f87171" : undefined }}
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="fade-in-up-5 flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                {...register("remember")}
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 accent-[#2bbdc5] cursor-pointer"
              />
              <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors select-none">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "#2bbdc5" }}
            >
              Forgot password?
            </Link>
          </div>

          {/* CTA — shimmer button */}
          <div className="fade-in-up-6 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="shimmer-btn relative w-full py-3 rounded-xl text-white text-sm font-bold overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-[#2bbdc5]/25"
              style={{ background: "linear-gradient(135deg, #2bbdc5 0%, #1a9aa1 100%)" }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  {role === "teacher" ? <GraduationCap size={16} /> : <School size={16} />}
                  Sign in as {role === "teacher" ? "Teacher" : "School"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* OR divider */}
        <div className="fade-in-up-6 relative flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-3 text-[11px] font-semibold text-gray-400 tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social sign-in placeholders */}
        <div className="fade-in-up-6 grid grid-cols-2 gap-3">
          {/* Google */}
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-[#f0f7ff] hover:border-[#0a66c2]/30 transition-all duration-200 hover:shadow-sm"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
        </div>

        {/* Register link */}
        <p className="fade-in-up-7 text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold transition-opacity hover:opacity-70"
            style={{ color: "#2bbdc5" }}
          >
            Create account
          </Link>
        </p>
    </div>
  );
}
