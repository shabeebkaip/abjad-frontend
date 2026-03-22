"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
    <section
      className="py-24 overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-10">

        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 bg-white/10 text-white/70">
            FAQs
          </span>
          <h2
            className="font-extrabold text-white mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Common{" "}
            <span style={{ color: "var(--brand-accent)" }}>Questions</span>
          </h2>
          <p className="text-white/55 text-base max-w-xl mx-auto">
            Quick answers to the questions schools and educators ask most often before reaching out.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/10 overflow-hidden transition-all duration-200"
                style={{ backgroundColor: isOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 px-7 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-white leading-relaxed">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    strokeWidth={2}
                    className={`text-white/50 shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-7 pb-6">
                    <p className="text-sm text-white/60 leading-relaxed">{faq.a}</p>
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
