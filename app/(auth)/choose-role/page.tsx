"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, School, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Role = "teacher" | "school";

export default function ChooseRolePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [role, setRole] = useState<Role>("teacher");

  const handleContinue = () => {
    router.push(`/register?role=${role}`);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t.register.title}</h2>
        <p className="text-muted-foreground text-sm mt-1">{t.register.subtitle}</p>
      </div>

      {/* Role selection */}
      <p className="text-sm text-muted-foreground mb-4">{t.register.iAmJoiningAs}</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setRole("teacher")}
          className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
            role === "teacher" ? "border-primary bg-accent" : "border-border bg-white hover:border-border/80"
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            role === "teacher" ? "bg-primary" : "bg-muted"
          }`}>
            <GraduationCap size={22} className={role === "teacher" ? "text-white" : "text-muted-foreground"} />
          </div>
          <div>
            <p className={`font-semibold text-sm ${role === "teacher" ? "text-primary" : "text-foreground"}`}>{t.register.teacher}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.register.teacherDesc}</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setRole("school")}
          className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
            role === "school" ? "border-primary bg-accent" : "border-border bg-white hover:border-border/80"
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            role === "school" ? "bg-primary" : "bg-muted"
          }`}>
            <School size={22} className={role === "school" ? "text-white" : "text-muted-foreground"} />
          </div>
          <div>
            <p className={`font-semibold text-sm ${role === "school" ? "text-primary" : "text-foreground"}`}>{t.register.school}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.register.schoolDesc}</p>
          </div>
        </button>
      </div>

      <Button
        type="button"
        onClick={handleContinue}
        className="w-full h-11 rounded-xl text-sm font-bold"
        style={{ background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%)" }}
      >
        {role === "teacher" ? t.register.continueAsTeacher : t.register.continueAsSchool}
        <ChevronRight size={16} className="ltr:ml-1 rtl:mr-1 rtl:rotate-180" />
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {t.register.alreadyHaveAccount}{" "}
        <Link href="/login" className="font-bold text-primary hover:opacity-75 transition-opacity">
          {t.register.signIn}
        </Link>
      </p>
    </div>
  );
}
