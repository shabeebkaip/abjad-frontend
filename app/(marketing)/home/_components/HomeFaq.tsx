"use client";

import Link from "@/components/MarketingLink";
import { Plus } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

/** Curated homepage FAQ. Native <details> gives keyboard + screen-reader behaviour for free. */
export default function HomeFaq() {
  const { t } = useTranslation();
  const f = t.home.faq;

  return (
    <section id="faq" className="bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <h2 className="font-extrabold text-(--brand-primary) leading-[1.15] mb-4 text-3xl sm:text-4xl ltr:tracking-tight">
            {f.title}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-7">{f.sub}</p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full border border-(--brand-primary)/20 px-6 py-3 text-sm font-bold text-(--brand-primary) transition-colors hover:bg-(--brand-primary) hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-accent)/40"
          >
            {f.contactCta}
          </Link>
        </div>

        <div className="lg:col-span-8 divide-y divide-gray-200 border-y border-gray-200">
          {f.items.map((item, i) => (
            <details key={i} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-start font-semibold text-(--brand-primary) sm:text-lg [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-accent)/50 rounded-md">
                {item.q}
                <Plus size={20} className="shrink-0 text-(--brand-accent-dark) transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="pb-6 pe-10 text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
