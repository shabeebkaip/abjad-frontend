"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How quickly will Abjad respond after I submit the contact form?",
    a: "Our team aims to respond to all submissions within 24 to 48 hours on working days. For urgent substitute teacher requests, we prioritise same-day matching where possible. If your need is immediate, please also call or email us directly.",
  },
  {
    q: "What qualifications does Abjad check before placing a teacher?",
    a: "Every educator on Abjad goes through a structured screening process that includes credential and licence verification, an in-person or virtual interview, reference checks, and where required, a trial teaching assignment. Schools can trust that every placement is verified before the first day.",
  },
  {
    q: "Is there a cost for teachers and substitute teachers to register with Abjad?",
    a: "No. Registration and placement assistance are completely free for teachers and substitute teachers. Abjad is designed to open doors for educators, not charge them for opportunities.",
  },
  {
    q: "Can international teachers apply through Abjad for positions in Saudi Arabia?",
    a: "Yes. Abjad welcomes applications from international educators interested in positions at international curriculum schools across Riyadh, Jeddah, Dammam, and beyond. Please specify your qualifications, teaching experience, and preferred curriculum in your message.",
  },
  {
    q: "What happens if a placement does not work out — is feedback provided?",
    a: "Yes. Abjad facilitates structured feedback between schools and educators at the end of every assignment. If a placement is not the right fit, our team steps in to find an alternative candidate quickly, minimising disruption for the school.",
  },
];

export default function ContactFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#f8fafc] py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-6 mb-14 items-end">
          <div className="lg:col-span-8">
            <div
              className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase mb-4"
              style={{ color: "var(--brand-accent)" }}
            >
              <span className="w-6 h-0.5 inline-block rounded" style={{ backgroundColor: "var(--brand-accent)" }} />
              FAQs
            </div>
            <h2
              className="font-extrabold text-gray-950 leading-tight"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
            >
              Common{" "}
              <span style={{ color: "var(--brand-accent)" }}>Questions</span>
            </h2>
          </div>
          <p className="lg:col-span-4 text-gray-500 text-sm leading-relaxed self-end">
            Quick answers to what schools and educators ask before reaching out.
          </p>
        </div>

        {/* Accordion rows */}
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
                    {faq.q}
                  </span>
                  <span
                    className="w-7 h-7 rounded-full border shrink-0 flex items-center justify-center text-base font-bold transition-all duration-200 mt-0.5"
                    style={{
                      borderColor: isOpen ? "var(--brand-accent)" : "#d1d5db",
                      color: isOpen ? "var(--brand-accent)" : "#6b7280",
                      backgroundColor: isOpen ? "var(--brand-accent-light)" : "transparent",
                    }}
                  >
                    {isOpen ? "×" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-6 pr-14">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
