"use client";

import { X, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const beforeEn = [
  "Posting on 5 different job boards",
  "Hundreds of unfiltered CVs to sift through",
  "Weeks of back-and-forth scheduling",
  "No way to verify teacher credentials",
  "Losing candidates to slow response times",
  "Starting from scratch every hiring cycle",
];

const afterEn = [
  "One profile. Visible to the right schools",
  "Candidates matched to your exact criteria",
  "Built-in scheduling, no email chains",
  "Every profile verified before it reaches you",
  "Real-time notifications keep deals moving",
  "Your talent pool grows with every hire",
];

const beforeAr = [
  "النشر على ٥ لوحات وظائف مختلفة",
  "مئات السير الذاتية غير المصفّاة",
  "أسابيع من التنسيق ذهاباً وإياباً",
  "لا طريقة للتحقق من بيانات المعلمين",
  "خسارة المرشحين بسبب بطء الاستجابة",
  "البدء من الصفر في كل دورة توظيف",
];

const afterAr = [
  "ملف واحد. مرئي للمدارس المناسبة",
  "مرشحون مطابقون لمعاييرك بدقة",
  "جدولة مدمجة، بلا رسائل بريد متراكمة",
  "كل ملف موثّق قبل أن يصلك",
  "إشعارات فورية تُبقي الأمور تتحرك",
  "مجموعة المواهب لديك تكبر مع كل توظيف",
];

export default function StatsSection() {
  const { isRTL } = useTranslation();
  const before = isRTL ? beforeAr : beforeEn;
  const after = isRTL ? afterAr : afterEn;

  return (
    <section className="py-28 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "#fce4e4", color: "#c0392b" }}
          >
            {isRTL ? "قبل أبجد / بعد أبجد" : "Before Abjad / After Abjad"}
          </span>
          <h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            style={{ letterSpacing: isRTL ? "0" : "-0.03em" }}
          >
            {isRTL ? "التوظيف كان هكذا. لم يعد كذلك." : "Hiring used to look like this. Not anymore."}
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            {isRTL
              ? "قارن بين الطريقة القديمة وما يقدمه أبجد بدلاً منها."
              : "See the old way side-by-side with what Abjad replaces it with."}
          </p>
        </div>

        {/* Two-column contrast */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Before */}
          <div className="rounded-2xl border border-red-100 bg-white p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                <X className="w-4 h-4 text-red-500" strokeWidth={2.5} />
              </div>
              <span className="text-base font-semibold text-red-500">
                {isRTL ? "الطريقة القديمة" : "The old way"}
              </span>
            </div>
            <ul className="space-y-4">
              {before.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-300 mt-0.5 shrink-0" strokeWidth={2} />
                  <span className="text-gray-500 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0e7a81 0%, #2bbdc5 100%)" }}
          >
            {/* Subtle dot texture */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-base font-semibold text-white">
                  {isRTL ? "مع أبجد" : "With Abjad"}
                </span>
              </div>
              <ul className="space-y-4">
                {after.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-white/70 mt-0.5 shrink-0" strokeWidth={2} />
                    <span className="text-white/90 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
