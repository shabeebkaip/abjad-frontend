"use client";

import Image from "next/image";
import Link from "@/components/MarketingLink";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { PHOTOS, usePhotoAlt, type PhotoKey } from "../../_components/PhotoStrip";

/** How it works, told once per audience. Steps are a real sequence, so they are numbered. */
export default function PathsSection() {
  const { t } = useTranslation();
  const alt = usePhotoAlt();
  const p = t.home.paths;
  const paths: { key: string; photo: PhotoKey; href: string; data: typeof p.teacher; dark: boolean }[] = [
    { key: "teacher", photo: "femaleClassroom", href: "/register?role=teacher", data: p.teacher, dark: false },
    { key: "school", photo: "studentsWalking", href: "/register?role=school", data: p.school, dark: true },
  ];

  return (
    <section id="how-it-works" className="bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <h2 className="font-extrabold text-(--brand-primary) leading-[1.15] mb-4 text-3xl sm:text-4xl lg:text-[2.75rem] ltr:tracking-tight">
            {p.title}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{p.sub}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {paths.map(({ key, photo, href, data, dark }) => (
            <article
              key={key}
              className={`flex flex-col rounded-3xl overflow-hidden ${dark ? "bg-(--brand-primary) text-white" : "bg-[#f3f6f9] text-(--brand-primary)"}`}
            >
              <div className="relative aspect-16/9">
                <Image src={PHOTOS[photo].src} alt={alt(photo)} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col flex-1 p-7 sm:p-9">
                <p className={`text-sm font-semibold mb-2 ${dark ? "text-(--brand-accent)" : "text-(--brand-accent-dark)"}`}>{data.label}</p>
                <h3 className="font-extrabold text-2xl sm:text-[1.75rem] leading-snug mb-7">{data.title}</h3>
                <ol className="flex flex-col gap-5 mb-9">
                  {data.steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${dark ? "bg-white/12 text-white" : "bg-white text-(--brand-primary) ring-1 ring-(--brand-primary)/10"}`}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span className={`pt-1 leading-relaxed ${dark ? "text-white/80" : "text-gray-700"}`}>{step}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  href={href}
                  className={`mt-auto self-start inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-accent)/40 ${dark ? "bg-white text-(--brand-primary)" : "bg-(--brand-primary) text-white"}`}
                >
                  {data.cta}
                  <ArrowRight size={16} className="rtl:-scale-x-100" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
