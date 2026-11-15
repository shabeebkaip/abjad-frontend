"use client";

import Link from "next/link";
import { GraduationCap, School, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

/**
 * The two role entry points (client feedback R1 §1.7). Used in the hero and the
 * closing band so both moments carry the same labels.
 * `onDark` swaps the teacher tile to white so it holds contrast on navy/photo.
 */
export default function RoleCtas({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  const { t } = useTranslation();
  const tiles = [
    {
      href: "/register?role=teacher",
      icon: GraduationCap,
      label: t.hero.ctaTeacher,
      sub: t.hero.ctaTeacherSub,
      cls: onDark ? "bg-white text-(--brand-primary)" : "bg-(--brand-primary) text-white",
      iconCls: onDark ? "bg-(--brand-primary)/8" : "bg-white/15",
      subCls: onDark ? "text-gray-600" : "text-white/80",
    },
    {
      href: "/register?role=school",
      icon: School,
      label: t.hero.ctaSchool,
      sub: t.hero.ctaSchoolSub,
      // #00799a keeps white text above 4.5:1; brand sky alone is too light for text.
      cls: "bg-[#00799a] text-white",
      iconCls: "bg-white/15",
      subCls: "text-white",
    },
  ];

  return (
    <div className={`grid w-full grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
      {tiles.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className={`group flex items-center gap-4 rounded-2xl px-5 py-4 shadow-[0_10px_30px_-12px_rgba(13,37,66,0.45)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-accent)/40 ${c.cls}`}
        >
          <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.iconCls}`}>
            <c.icon size={22} strokeWidth={2} />
          </span>
          <span className="flex-1 min-w-0 text-start">
            <span className="block font-bold text-lg leading-tight">{c.label}</span>
            <span className={`block text-sm mt-0.5 ${c.subCls}`}>{c.sub}</span>
          </span>
          <ArrowRight
            size={18}
            className="shrink-0 transition-[translate] rtl:-scale-x-100 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
          />
        </Link>
      ))}
    </div>
  );
}
