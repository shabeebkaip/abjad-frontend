"use client";

import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { PHOTOS, usePhotoAlt } from "../../_components/PhotoStrip";
import RoleCtas from "./RoleCtas";

/** Closing band: photo under a navy scrim, same two role entry points as the hero. */
export default function FinalCta() {
  const { t } = useTranslation();
  const alt = usePhotoAlt();

  return (
    <section className="relative isolate overflow-hidden bg-(--brand-primary)">
      <Image src={PHOTOS.maleClassroom.src} alt={alt("maleClassroom")} fill sizes="100vw" className="object-cover -z-10" />
      <div className="absolute inset-0 -z-10 bg-(--brand-primary)/80 lg:bg-transparent lg:bg-linear-to-r lg:from-(--brand-primary) lg:from-35% lg:via-(--brand-primary)/85 lg:to-(--brand-primary)/30 rtl:lg:bg-linear-to-l" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="max-w-xl">
          <h2 className="font-extrabold text-white leading-[1.15] mb-4 text-3xl sm:text-4xl lg:text-5xl ltr:tracking-tight">
            {t.home.cta.title}
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-9">{t.home.cta.sub}</p>
          <RoleCtas onDark />
        </div>
      </div>
    </section>
  );
}
