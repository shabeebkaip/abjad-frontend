"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "How should schools greet teachers when onboarding?",
    a: "A warm, respectful welcome sets the tone for collaboration. Schools are encouraged to greet new teachers with an introduction to staff, a brief overview of school culture, and an orientation to help them feel valued from day one.",
  },
  {
    q: "What is your screening and vetting process for teachers you supply?",
    a: "Abjad conducts a comprehensive 4-stage process: (1) Qualifications & Certification Verification — academic degrees, teaching licences, and subject certifications; (2) Local & International Background Screening — safety, ethics, and professional conduct; (3) Employment History & Reference Validation; (4) Skills & Capability Assessment including online teaching readiness.",
  },
  {
    q: "How many teachers are currently in your database?",
    a: "Abjad's growing database includes a vast network of qualified teachers across Saudi Arabia, covering all grade levels and curricula — including British, American, IB, and Saudi national programs. Schools receive filtered candidate matches that fit their exact subject and grade requirements.",
  },
  {
    q: "What is your track record for placing teachers in Saudi schools?",
    a: "Abjad has a strong, Kingdom-wide track record placing highly qualified educators in leading private and international schools. With a high retention rate, schools report exceptional satisfaction noting teachers' professionalism, long-term commitment, and meaningful contributions to student success.",
  },
  {
    q: "How do you ensure cultural fit for Saudi Arabia?",
    a: "We assess every teacher's adaptability, openness to cultural norms, and understanding of the Saudi educational environment. Candidates receive orientation on local customs, regulations, and school culture to ensure a smooth integration.",
  },
  {
    q: "What happens if a teacher does not perform or leaves early?",
    a: "We offer a replacement guarantee within the initial contract period. Schools can request a replacement teacher at no additional cost under the agreed terms.",
  },
  {
    q: "What is the minimum experience required?",
    a: "Most roles require 1–2 years of professional experience, including classroom teaching, training or instructional roles, tutoring, or curriculum assistance. We also welcome candidates with practicum or early career teaching exposure.",
  },
  {
    q: "How will teachers be interviewed?",
    a: "In Saudi Arabia, interviews follow a structured, professional process assessing both teaching ability and alignment with national education standards — whether for public, private, international schools, or training centres.",
  },
  {
    q: "How do you match teachers' teaching styles with our curriculum?",
    a: "Abjad's platform evaluates each candidate's pedagogical approach, classroom methodology, and curriculum familiarity. We match teachers whose teaching philosophy aligns with your school's mission and learning outcomes.",
  },
  {
    q: "How do you handle urgent staffing needs or emergencies?",
    a: "Abjad's rapid-response system connects schools with qualified substitute teachers immediately. Whether due to a mid-year resignation or unexpected absence, schools can find vetted replacements within hours.",
  },
  {
    q: "Are the teachers you supply familiar with our curriculum?",
    a: "Yes. We categorise all candidates by curriculum experience — British, American, IB, or Saudi national curriculum — and ensure each teacher's familiarity and training align with your school's framework before placement.",
  },
  {
    q: "How do you present candidate information to schools?",
    a: "Schools receive a complete candidate portfolio including CV and verified certifications, reference reports and interview summaries, sample demo lessons (if available), and personality and teaching-style insights.",
  },
  {
    q: "How do you use technology or AI in your recruitment process?",
    a: "Abjad integrates AI-driven tools to enhance matching accuracy. Our system analyses qualifications, experience, subject expertise, and teaching style to predict classroom performance, ensuring each placement aligns perfectly with the school's needs.",
  },
  {
    q: "Can you provide references from other Saudi schools?",
    a: "Yes. We maintain a list of partner schools across Riyadh, Jeddah, and Dammam who have successfully used Abjad to fill teaching and substitute positions. References are available upon request.",
  },
  {
    q: "How do you maintain compliance with Saudi regulations?",
    a: "Abjad operates in full alignment with Saudi labour law, visa and permit regulations, and Saudization requirements. We also adhere to international education accreditation standards, ensuring complete compliance for every placement.",
  },
];

export default function SchoolsFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#f8fafc] overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-200 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-primary)" }}
          >
            FAQ for Schools
          </span>
          <span className="text-xs text-gray-400">{faqs.length} questions answered</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* Left — accordion */}
          <div className="lg:col-span-8">
            <h2
              className="font-extrabold text-gray-950 mb-10"
              style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", letterSpacing: "-0.04em" }}
            >
              Everything Schools{" "}
              <span style={{ color: "var(--brand-accent)" }}>Need to Know</span>
            </h2>

            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {faqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-6 py-5 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
                        {faq.q}
                      </span>
                      <span
                        className="w-6 h-6 rounded-full border shrink-0 flex items-center justify-center text-sm font-bold transition-all duration-200 mt-0.5"
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
                      <div className="pb-5 pr-12">
                        <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — sticky sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-5">

              {/* Quote card */}
              <div
                className="rounded-2xl p-7 relative overflow-hidden"
                style={{ background: "var(--brand-gradient)" }}
              >
                <span
                  className="absolute top-2 left-4 font-black text-white/8 leading-none select-none pointer-events-none"
                  style={{ fontSize: "6rem" }}
                >
                  &ldquo;
                </span>
                <div className="relative z-10">
                  <p className="text-white/80 text-sm leading-relaxed italic mb-4">
                    Schools using Abjad report exceptional satisfaction with teachers placed —
                    noting their professionalism and meaningful contributions to student success.
                  </p>
                  <span className="text-xs text-white/40">— Abjad School Partners</span>
                </div>
              </div>

              {/* Stats panel */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                {[
                  { val: "15 min", label: "Average time to first match", i: 0 },
                  { val: "100%",   label: "Verified educator profiles",   i: 1 },
                  { val: "KSA",    label: "Nationwide reach",             i: 2 },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{s.label}</span>
                    <span
                      className="font-black text-sm"
                      style={{
                        color: s.i === 0 ? "var(--brand-accent)" : s.i === 1 ? "#10b981" : "var(--brand-primary)",
                      }}
                    >
                      {s.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 text-sm font-bold py-3.5 rounded-xl transition-all hover:shadow-lg text-white"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                Still Have Questions? <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
