"use client";

import Image from "next/image";
import { ShieldCheck, SlidersHorizontal, CalendarRange, Languages } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { PHOTOS, usePhotoAlt } from "../../_components/PhotoStrip";

const ICONS = [ShieldCheck, SlidersHorizontal, CalendarRange, Languages];

/** Bento: one photo tile + one tile per real platform capability (4 items, 5 cells). */
export default function WhySection() {
  const { t } = useTranslation();
  const alt = usePhotoAlt();
  const w = t.home.why;

  return (
    <section id="why-abjad" className="bg-[#f3f6f9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="max-w-2xl mb-12 lg:mb-14">
          <h2 className="font-extrabold text-(--brand-primary) leading-[1.15] mb-4 text-3xl sm:text-4xl lg:text-[2.75rem] ltr:tracking-tight">
            {w.title}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{w.sub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4">
          <div className="relative sm:col-span-2 lg:row-span-2 aspect-16/10 lg:aspect-auto lg:min-h-[440px] rounded-3xl overflow-hidden">
            <Image src={PHOTOS.artClass.src} alt={alt("artClass")} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          {w.items.map((item, i) => {
            const Icon = ICONS[i];
            const featured = i === 0;
            return (
              <div
                key={i}
                className={`flex flex-col rounded-3xl p-7 ${featured ? "bg-(--brand-primary) text-white" : "bg-white text-(--brand-primary)"}`}
              >
                <Icon size={24} strokeWidth={1.8} className={`mb-6 ${featured ? "text-(--brand-accent)" : "text-(--brand-accent-dark)"}`} />
                <h3 className="font-bold text-lg leading-snug mb-2">{item.title}</h3>
                <p className={`text-sm leading-relaxed ${featured ? "text-white/75" : "text-gray-600"}`}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
