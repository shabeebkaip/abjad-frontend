"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, GraduationCap, School, Loader2, ChevronRight, ChevronLeft } from "lucide-react";

type Role = "teacher" | "school";

// ── Step 1 schema ──────────────────────────────────────────────────
const step1Schema = z.object({
  role: z.enum(["teacher", "school"]),
});

// ── Teacher schema ─────────────────────────────────────────────────
const teacherSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(9, "Enter a valid phone number"),
  subject: z.string().min(1, "Please select a subject"),
  experience: z.string().min(1, "Please select experience level"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  terms: z.literal(true, { message: "You must accept the terms" }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// ── School schema ──────────────────────────────────────────────────
const schoolSchema = z.object({
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(9, "Enter a valid phone number"),
  city: z.string().min(1, "Please enter the city"),
  schoolType: z.string().min(1, "Please select school type"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  terms: z.literal(true, { message: "You must accept the terms" }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type TeacherForm = z.infer<typeof teacherSchema>;
type SchoolForm = z.infer<typeof schoolSchema>;

const subjects = [
  "Arabic Language", "English Language", "Mathematics", "Science",
  "Physics", "Chemistry", "Biology", "History", "Geography",
  "Islamic Studies", "Art", "Physical Education", "Computer Science", "Other",
];

const schoolTypes = [
  "Public School", "Private School", "International School",
  "Islamic School", "Special Needs School", "Kindergarten",
];

function InputField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-[#2bbdc5]/20 focus:border-[#2bbdc5] ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
  }`;

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("teacher");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const teacherForm = useForm<TeacherForm>({
    resolver: zodResolver(teacherSchema),
  });

  const schoolForm = useForm<SchoolForm>({
    resolver: zodResolver(schoolSchema),
  });

  const onSubmitTeacher = async (data: TeacherForm) => {
    setIsLoading(true);
    console.log({ role, ...data });
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    // TODO: navigate to OTP
  };

  const onSubmitSchool = async (data: SchoolForm) => {
    setIsLoading(true);
    console.log({ role, ...data });
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    // TODO: navigate to OTP
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Create account</h2>
        <p className="text-gray-500 text-sm mt-1">Join Abjad and start your journey</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            style={{ backgroundColor: "#2bbdc5" }}
          >
            {step > 1 ? "✓" : "1"}
          </div>
          <span className="text-xs font-medium text-gray-600">Choose Role</span>
        </div>
        <div className="flex-1 h-px bg-gray-200 mx-1" />
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
              step === 2 ? "text-white" : "text-gray-400 border border-gray-300"
            }`}
            style={step === 2 ? { backgroundColor: "#2bbdc5" } : {}}
          >
            2
          </div>
          <span className={`text-xs font-medium ${step === 2 ? "text-gray-600" : "text-gray-400"}`}>
            Your Details
          </span>
        </div>
      </div>

      {/* Step 1 – Role */}
      {step === 1 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">I am joining as a…</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                role === "teacher"
                  ? "border-[#2bbdc5] bg-[#e0f7f8]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: role === "teacher" ? "#2bbdc5" : "#f3f4f6" }}
              >
                <GraduationCap
                  size={22}
                  color={role === "teacher" ? "#fff" : "#9ca3af"}
                />
              </div>
              <div>
                <p className={`font-semibold text-sm ${role === "teacher" ? "text-[#2bbdc5]" : "text-gray-700"}`}>
                  Teacher
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Find teaching jobs</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("school")}
              className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                role === "school"
                  ? "border-[#2bbdc5] bg-[#e0f7f8]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: role === "school" ? "#2bbdc5" : "#f3f4f6" }}
              >
                <School
                  size={22}
                  color={role === "school" ? "#fff" : "#9ca3af"}
                />
              </div>
              <div>
                <p className={`font-semibold text-sm ${role === "school" ? "text-[#2bbdc5]" : "text-gray-700"}`}>
                  School
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Hire great teachers</p>
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ backgroundColor: "#2bbdc5" }}
          >
            Continue as {role === "teacher" ? "Teacher" : "School"}
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2 – Teacher form */}
      {step === 2 && role === "teacher" && (
        <form onSubmit={teacherForm.handleSubmit(onSubmitTeacher)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <InputField label="First name" error={teacherForm.formState.errors.firstName?.message}>
              <input
                {...teacherForm.register("firstName")}
                placeholder="Ahmad"
                className={inputClass(!!teacherForm.formState.errors.firstName)}
              />
            </InputField>
            <InputField label="Last name" error={teacherForm.formState.errors.lastName?.message}>
              <input
                {...teacherForm.register("lastName")}
                placeholder="Al-Rashid"
                className={inputClass(!!teacherForm.formState.errors.lastName)}
              />
            </InputField>
          </div>

          <InputField label="Email address" error={teacherForm.formState.errors.email?.message}>
            <input
              {...teacherForm.register("email")}
              type="email"
              placeholder="you@example.com"
              className={inputClass(!!teacherForm.formState.errors.email)}
            />
          </InputField>

          <InputField label="Phone number" error={teacherForm.formState.errors.phone?.message}>
            <input
              {...teacherForm.register("phone")}
              type="tel"
              placeholder="+966 5X XXX XXXX"
              className={inputClass(!!teacherForm.formState.errors.phone)}
            />
          </InputField>

          <div className="grid grid-cols-2 gap-3">
            <InputField label="Subject" error={teacherForm.formState.errors.subject?.message}>
              <select
                {...teacherForm.register("subject")}
                className={inputClass(!!teacherForm.formState.errors.subject)}
              >
                <option value="">Select…</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </InputField>

            <InputField label="Experience" error={teacherForm.formState.errors.experience?.message}>
              <select
                {...teacherForm.register("experience")}
                className={inputClass(!!teacherForm.formState.errors.experience)}
              >
                <option value="">Select…</option>
                <option value="0-1">0–1 years</option>
                <option value="2-4">2–4 years</option>
                <option value="5-9">5–9 years</option>
                <option value="10+">10+ years</option>
              </select>
            </InputField>
          </div>

          <InputField label="Password" error={teacherForm.formState.errors.password?.message}>
            <div className="relative">
              <input
                {...teacherForm.register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className={`${inputClass(!!teacherForm.formState.errors.password)} pr-11`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </InputField>

          <InputField label="Confirm password" error={teacherForm.formState.errors.confirmPassword?.message}>
            <div className="relative">
              <input
                {...teacherForm.register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                className={`${inputClass(!!teacherForm.formState.errors.confirmPassword)} pr-11`}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </InputField>

          {/* Terms */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              {...teacherForm.register("terms")}
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#2bbdc5]"
            />
            <span className="text-xs text-gray-600">
              I agree to the{" "}
              <Link href="/terms" className="font-medium" style={{ color: "#2bbdc5" }}>Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="font-medium" style={{ color: "#2bbdc5" }}>Privacy Policy</Link>
            </span>
          </label>
          {teacherForm.formState.errors.terms && (
            <p className="text-xs text-red-500">{teacherForm.formState.errors.terms.message}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#2bbdc5" }}
            >
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : "Create Account"}
            </button>
          </div>
        </form>
      )}

      {/* Step 2 – School form */}
      {step === 2 && role === "school" && (
        <form onSubmit={schoolForm.handleSubmit(onSubmitSchool)} className="space-y-4">
          <InputField label="School name" error={schoolForm.formState.errors.schoolName?.message}>
            <input
              {...schoolForm.register("schoolName")}
              placeholder="Al-Noor International School"
              className={inputClass(!!schoolForm.formState.errors.schoolName)}
            />
          </InputField>

          <InputField label="Contact person" error={schoolForm.formState.errors.contactName?.message}>
            <input
              {...schoolForm.register("contactName")}
              placeholder="Full name"
              className={inputClass(!!schoolForm.formState.errors.contactName)}
            />
          </InputField>

          <InputField label="Email address" error={schoolForm.formState.errors.email?.message}>
            <input
              {...schoolForm.register("email")}
              type="email"
              placeholder="hr@school.com"
              className={inputClass(!!schoolForm.formState.errors.email)}
            />
          </InputField>

          <div className="grid grid-cols-2 gap-3">
            <InputField label="Phone number" error={schoolForm.formState.errors.phone?.message}>
              <input
                {...schoolForm.register("phone")}
                type="tel"
                placeholder="+966 5X XXX XXXX"
                className={inputClass(!!schoolForm.formState.errors.phone)}
              />
            </InputField>

            <InputField label="City" error={schoolForm.formState.errors.city?.message}>
              <input
                {...schoolForm.register("city")}
                placeholder="Riyadh"
                className={inputClass(!!schoolForm.formState.errors.city)}
              />
            </InputField>
          </div>

          <InputField label="School type" error={schoolForm.formState.errors.schoolType?.message}>
            <select
              {...schoolForm.register("schoolType")}
              className={inputClass(!!schoolForm.formState.errors.schoolType)}
            >
              <option value="">Select…</option>
              {schoolTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </InputField>

          <InputField label="Password" error={schoolForm.formState.errors.password?.message}>
            <div className="relative">
              <input
                {...schoolForm.register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className={`${inputClass(!!schoolForm.formState.errors.password)} pr-11`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </InputField>

          <InputField label="Confirm password" error={schoolForm.formState.errors.confirmPassword?.message}>
            <div className="relative">
              <input
                {...schoolForm.register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                className={`${inputClass(!!schoolForm.formState.errors.confirmPassword)} pr-11`}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </InputField>

          {/* Terms */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              {...schoolForm.register("terms")}
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#2bbdc5]"
            />
            <span className="text-xs text-gray-600">
              I agree to the{" "}
              <Link href="/terms" className="font-medium" style={{ color: "#2bbdc5" }}>Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="font-medium" style={{ color: "#2bbdc5" }}>Privacy Policy</Link>
            </span>
          </label>
          {schoolForm.formState.errors.terms && (
            <p className="text-xs text-red-500">{schoolForm.formState.errors.terms.message}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#2bbdc5" }}
            >
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : "Create Account"}
            </button>
          </div>
        </form>
      )}

      {/* Login link */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold" style={{ color: "#2bbdc5" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
