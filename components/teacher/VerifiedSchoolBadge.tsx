"use client";

import { BadgeCheck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

/** Shown next to a school's name when the Abjad team has verified that school. */
export function VerifiedSchoolBadge({ verified, size = "sm" }: { verified?: boolean; size?: "sm" | "md" }) {
  const { t } = useTranslation();
  if (!verified) return null;
  const label = t.teacher.jobs.verifiedByAbjad;
  return (
    <span
      className={`inline-flex items-center gap-1 shrink-0 rounded-full font-semibold text-emerald-700 bg-emerald-50 ${size === "md" ? "text-xs px-2 py-0.5" : "text-[10px] px-1.5 py-0.5"}`}
      title={label}
    >
      <BadgeCheck size={size === "md" ? 13 : 11} aria-hidden="true" />
      {label}
    </span>
  );
}
