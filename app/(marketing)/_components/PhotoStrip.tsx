"use client";

import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Client-approved photography (feedback R1 §1.5, §9). Files live in public/images/marketing.
export const PHOTOS = {
  classroom: { src: "/images/marketing/abjad-classroom.jpg", en: "Teacher working with young students in a classroom", ar: "معلمة مع طلاب صغار في الفصل" },
  femaleClassroom: { src: "/images/marketing/abjad-female-classroom.jpg", en: "Teacher leading a lesson for female students", ar: "معلمة تقدم درساً للطالبات" },
  scienceLab: { src: "/images/marketing/abjad-female-science-lab.jpg", en: "Students in a science lab with their teacher", ar: "طالبات في مختبر العلوم مع معلمتهن" },
  femaleTeacher: { src: "/images/marketing/abjad-female-teacher-hero.jpg", en: "Smiling female teacher at school", ar: "معلمة مبتسمة في المدرسة" },
  artClass: { src: "/images/marketing/abjad-girls-art-class.jpg", en: "Students painting in an art class", ar: "طالبات يرسمن في حصة الفنون" },
  maleClassroom: { src: "/images/marketing/abjad-male-classroom.jpg", en: "Students working in a STEM lab", ar: "طلاب في مختبر العلوم والتقنية" },
  maleTeacher: { src: "/images/marketing/abjad-male-teacher-hero.jpg", en: "Confident male teacher at school", ar: "معلم واثق في المدرسة" },
  studentsWalking: { src: "/images/marketing/abjad-students-walking-school.jpg", en: "Students walking across a school campus", ar: "طلاب يسيرون في ساحة المدرسة" },
} as const;

export type PhotoKey = keyof typeof PHOTOS;

export function usePhotoAlt() {
  const { isRTL } = useTranslation();
  return (k: PhotoKey) => (isRTL ? PHOTOS[k].ar : PHOTOS[k].en);
}

/** Full-width band of 3 photos between sections. Mobile shows the first only. */
export default function PhotoStrip({ photos }: { photos: [PhotoKey, PhotoKey, PhotoKey] }) {
  const alt = usePhotoAlt();
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-1 bg-white">
      {photos.map((k, i) => (
        <div key={k} className={`relative h-56 sm:h-64 lg:h-80 ${i > 0 ? "hidden sm:block" : ""}`}>
          <Image src={PHOTOS[k].src} alt={alt(k)} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
        </div>
      ))}
    </section>
  );
}
