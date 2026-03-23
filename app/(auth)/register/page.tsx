"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, ChevronLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Role = "teacher" | "school";

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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as Role) ?? "teacher";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const teacherForm = useForm<TeacherForm>({ resolver: zodResolver(teacherSchema) });
  const schoolForm = useForm<SchoolForm>({ resolver: zodResolver(schoolSchema) });

  const teacherTerms = teacherForm.watch("terms");
  const schoolTerms = schoolForm.watch("terms");

  const onSubmitTeacher = async (data: TeacherForm) => {
    setIsLoading(true);
    console.log(data);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  const onSubmitSchool = async (data: SchoolForm) => {
    setIsLoading(true);
    console.log(data);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  const selectClass = (hasError: boolean) =>
    `h-11 w-full rounded-xl border border-input bg-transparent ps-3 pe-3 text-sm outline-none focus-visible:border-ring transition-colors ${hasError ? "border-destructive" : ""}`;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t.register.title}</h2>
        <p className="text-muted-foreground text-sm mt-1">{t.register.subtitle}</p>
      </div>

      {/* ── Teacher form ── */}
      {role === "teacher" && (
        <form onSubmit={teacherForm.handleSubmit(onSubmitTeacher)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="t-firstName">{t.register.firstName}</Label>
              <Input id="t-firstName" placeholder="Ahmad" aria-invalid={!!teacherForm.formState.errors.firstName} className="h-11 rounded-xl" dir="ltr" {...teacherForm.register("firstName")} />
              <FieldError message={teacherForm.formState.errors.firstName?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-lastName">{t.register.lastName}</Label>
              <Input id="t-lastName" placeholder="Al-Rashid" aria-invalid={!!teacherForm.formState.errors.lastName} className="h-11 rounded-xl" dir="ltr" {...teacherForm.register("lastName")} />
              <FieldError message={teacherForm.formState.errors.lastName?.message} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="t-email">{t.register.email}</Label>
            <Input id="t-email" type="email" placeholder="you@example.com" aria-invalid={!!teacherForm.formState.errors.email} className="h-11 rounded-xl" dir="ltr" {...teacherForm.register("email")} />
            <FieldError message={teacherForm.formState.errors.email?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="t-phone">{t.register.phone}</Label>
            <Input id="t-phone" type="tel" placeholder="+966 5X XXX XXXX" aria-invalid={!!teacherForm.formState.errors.phone} className="h-11 rounded-xl" dir="ltr" {...teacherForm.register("phone")} />
            <FieldError message={teacherForm.formState.errors.phone?.message} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="t-subject">{t.register.subject}</Label>
              <select id="t-subject" {...teacherForm.register("subject")} className={selectClass(!!teacherForm.formState.errors.subject)}>
                <option value="">{t.register.selectPlaceholder}</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <FieldError message={teacherForm.formState.errors.subject?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-experience">{t.register.experience}</Label>
              <select id="t-experience" {...teacherForm.register("experience")} className={selectClass(!!teacherForm.formState.errors.experience)}>
                <option value="">{t.register.selectPlaceholder}</option>
                <option value="0-1">{t.register.experience0_1}</option>
                <option value="2-4">{t.register.experience2_4}</option>
                <option value="5-9">{t.register.experience5_9}</option>
                <option value="10+">{t.register.experience10}</option>
              </select>
              <FieldError message={teacherForm.formState.errors.experience?.message} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="t-password">{t.register.password}</Label>
            <div className="relative">
              <Input id="t-password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" aria-invalid={!!teacherForm.formState.errors.password} className="h-11 rounded-xl pe-11" dir="ltr" {...teacherForm.register("password")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <FieldError message={teacherForm.formState.errors.password?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="t-confirm">{t.register.confirmPassword}</Label>
            <div className="relative">
              <Input id="t-confirm" type={showConfirm ? "text" : "password"} placeholder="Repeat password" aria-invalid={!!teacherForm.formState.errors.confirmPassword} className="h-11 rounded-xl pe-11" dir="ltr" {...teacherForm.register("confirmPassword")} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1} className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <FieldError message={teacherForm.formState.errors.confirmPassword?.message} />
          </div>

          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <Checkbox id="t-terms" checked={!!teacherTerms} onCheckedChange={(v) => teacherForm.setValue("terms", v === true ? true : (undefined as unknown as true))} className="mt-0.5" />
              <Label htmlFor="t-terms" className="text-xs text-muted-foreground font-normal leading-relaxed cursor-pointer">
                {t.register.termsText}{" "}
                <Link href="/terms" className="font-semibold text-primary">{t.register.termsLink}</Link>
                {" "}{t.register.andText}{" "}
                <Link href="/privacy" className="font-semibold text-primary">{t.register.privacyLink}</Link>
              </Label>
            </div>
            <FieldError message={teacherForm.formState.errors.terms?.message} />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => router.push("/choose-role")} className="h-11 rounded-xl px-4">
              <ChevronLeft size={16} className="rtl:rotate-180" /> {t.register.back}
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 h-11 rounded-xl text-sm font-bold" style={{ background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%)" }}>
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> {t.register.creating}</> : t.register.createAccountBtn}
            </Button>
          </div>
        </form>
      )}

      {/* ── School form ── */}
      {role === "school" && (
        <form onSubmit={schoolForm.handleSubmit(onSubmitSchool)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="s-name">{t.register.schoolName}</Label>
            <Input id="s-name" placeholder="Al-Noor International School" aria-invalid={!!schoolForm.formState.errors.schoolName} className="h-11 rounded-xl" dir="ltr" {...schoolForm.register("schoolName")} />
            <FieldError message={schoolForm.formState.errors.schoolName?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-contact">{t.register.contactPerson}</Label>
            <Input id="s-contact" placeholder="Full name" aria-invalid={!!schoolForm.formState.errors.contactName} className="h-11 rounded-xl" dir="ltr" {...schoolForm.register("contactName")} />
            <FieldError message={schoolForm.formState.errors.contactName?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-email">{t.register.email}</Label>
            <Input id="s-email" type="email" placeholder="hr@school.com" aria-invalid={!!schoolForm.formState.errors.email} className="h-11 rounded-xl" dir="ltr" {...schoolForm.register("email")} />
            <FieldError message={schoolForm.formState.errors.email?.message} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="s-phone">{t.register.phone}</Label>
              <Input id="s-phone" type="tel" placeholder="+966 5X XXX XXXX" aria-invalid={!!schoolForm.formState.errors.phone} className="h-11 rounded-xl" dir="ltr" {...schoolForm.register("phone")} />
              <FieldError message={schoolForm.formState.errors.phone?.message} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-city">{t.register.city}</Label>
              <Input id="s-city" placeholder="Riyadh" aria-invalid={!!schoolForm.formState.errors.city} className="h-11 rounded-xl" dir="ltr" {...schoolForm.register("city")} />
              <FieldError message={schoolForm.formState.errors.city?.message} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-type">{t.register.schoolType}</Label>
            <select id="s-type" {...schoolForm.register("schoolType")} className={selectClass(!!schoolForm.formState.errors.schoolType)}>
              <option value="">{t.register.selectPlaceholder}</option>
              {schoolTypes.map((t2) => <option key={t2} value={t2}>{t2}</option>)}
            </select>
            <FieldError message={schoolForm.formState.errors.schoolType?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-password">{t.register.password}</Label>
            <div className="relative">
              <Input id="s-password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" aria-invalid={!!schoolForm.formState.errors.password} className="h-11 rounded-xl pe-11" dir="ltr" {...schoolForm.register("password")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <FieldError message={schoolForm.formState.errors.password?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-confirm">{t.register.confirmPassword}</Label>
            <div className="relative">
              <Input id="s-confirm" type={showConfirm ? "text" : "password"} placeholder="Repeat password" aria-invalid={!!schoolForm.formState.errors.confirmPassword} className="h-11 rounded-xl pe-11" dir="ltr" {...schoolForm.register("confirmPassword")} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1} className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <FieldError message={schoolForm.formState.errors.confirmPassword?.message} />
          </div>

          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <Checkbox id="s-terms" checked={!!schoolTerms} onCheckedChange={(v) => schoolForm.setValue("terms", v === true ? true : (undefined as unknown as true))} className="mt-0.5" />
              <Label htmlFor="s-terms" className="text-xs text-muted-foreground font-normal leading-relaxed cursor-pointer">
                {t.register.termsText}{" "}
                <Link href="/terms" className="font-semibold text-primary">{t.register.termsLink}</Link>
                {" "}{t.register.andText}{" "}
                <Link href="/privacy" className="font-semibold text-primary">{t.register.privacyLink}</Link>
              </Label>
            </div>
            <FieldError message={schoolForm.formState.errors.terms?.message} />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => router.push("/choose-role")} className="h-11 rounded-xl px-4">
              <ChevronLeft size={16} className="rtl:rotate-180" /> {t.register.back}
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 h-11 rounded-xl text-sm font-bold" style={{ background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%)" }}>
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> {t.register.creating}</> : t.register.createAccountBtn}
            </Button>
          </div>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground mt-6">
        {t.register.alreadyHaveAccount}{" "}
        <Link href="/login" className="font-bold text-primary hover:opacity-75 transition-opacity">
          {t.register.signIn}
        </Link>
      </p>
    </div>
  );
}
