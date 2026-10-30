"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Doc = "terms" | "privacy" | "cookies";

// Interim page: the real legal text is being finalised. Deliberately states
// no terms — see docs/QA_FIX_PLAN.md D6.
export default function LegalHolding({ doc }: { doc: Doc }) {
  const { t } = useTranslation();
  const l = t.legal;
  return (
    <section className="max-w-2xl mx-auto px-6 pt-36 pb-24 min-h-[70vh]">
      <h1 className="text-3xl font-extrabold text-gray-950 mb-6">{l[doc]}</h1>
      <p className="text-gray-600 leading-relaxed mb-4">{l.statement}</p>
      <p className="text-sm text-gray-500 mb-4">
        {l.effectiveDateLabel}: <span className="font-semibold">{l.effectiveDatePending}</span>
      </p>
      <p className="text-gray-600 mb-8">
        {l.contactPrefix}{" "}
        <a href="mailto:hello@abjad.sa" dir="ltr" className="font-semibold underline" style={{ color: "var(--brand-primary)" }}>
          hello@abjad.sa
        </a>
      </p>
      <Link href="/" className="text-sm font-semibold" style={{ color: "var(--brand-primary)" }}>
        {l.backHome}
      </Link>
    </section>
  );
}
