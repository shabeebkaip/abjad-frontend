"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "How does Abjad help schools find teachers?",
    a: "Abjad connects schools with certified teachers through smart matching, reducing hiring time significantly. Schools post vacancies, and our platform instantly surfaces verified candidates who meet their subject, grade level, and curriculum requirements.",
  },
  {
    q: "Can I apply as a substitute teacher?",
    a: "Yes. Substitute teachers are in high demand in Riyadh, Jeddah, and Dammam schools. Abjad makes it easy to list your availability and get matched with schools needing cover on short notice.",
  },
  {
    q: "Do international schools use Abjad?",
    a: "Absolutely. Many international schools across Saudi Arabia hire teachers and substitutes using Abjad. Our platform caters specifically to schools using British, American, IB, and bilingual curricula.",
  },
  {
    q: "How can I become a teacher in Saudi Arabia?",
    a: "To become a teacher in Saudi Arabia, you need a bachelor's degree in education or your subject area, a teaching certification, and relevant classroom experience. International schools often prefer teachers with IB, British, or American curriculum experience. You can apply directly through Abjad to find verified schools hiring now.",
  },
  {
    q: "What qualifications do I need to be a teacher?",
    a: "Most schools require: a bachelor's degree (education or related field), a teaching licence or certification (e.g., PGCE, TEFL, CELTA), and experience in teaching your subject or grade level. International schools in Saudi Arabia may also look for IB curriculum experience.",
  },
  {
    q: "What is IB (International Baccalaureate)?",
    a: "The International Baccalaureate (IB) is a globally recognised educational programme that focuses on critical thinking, intercultural understanding, and academic excellence. Many international schools in Saudi Arabia use the IB framework for primary, middle, and high school levels.",
  },
  {
    q: "What are the IB sciences?",
    a: "IB Sciences include Biology, Chemistry, Physics, Environmental Systems, and Sports & Health Science. These courses follow inquiry-based learning and emphasise experimentation, analysis, and global context.",
  },
  {
    q: "What is the IB rate?",
    a: "The IB rate refers to a student's final International Baccalaureate (IB) Diploma score, which ranges from 1 to 45. A strong IB rate reflects high-quality teaching, strong student performance, and a school's overall academic excellence. For educators, it provides insight into instructional impact and opportunities for programme improvement.",
  },
  {
    q: "What is the IB rate in school?",
    a: "An IB rate in school indicates how well students perform in their IB exams, often used as a benchmark for a school's academic strength. High IB rates can attract international recognition and top teaching talent.",
  },
  {
    q: "What are IB classes?",
    a: "IB classes are specialised courses within the IB curriculum, including IB Sciences, IB Mathematics, IB English, IB Humanities, and IB Languages. Teachers in these programmes are trained to deliver a global, student-centred learning experience.",
  },
  {
    q: "What is IB in high school?",
    a: "In high school, IB refers to the IB Diploma Programme (DP): a rigorous, two-year pre-university programme for students aged 16–19. It prepares them for international university admission and global careers.",
  },
  {
    q: "What is an IB Diploma?",
    a: "The IB Diploma is awarded to students who complete the full IB Diploma Programme and meet its academic requirements. Teachers experienced with this programme are in high demand at international schools in Riyadh, Jeddah, and Dammam.",
  },
  {
    q: "What is the IB Program?",
    a: "The IB Programme is a holistic education model divided into four stages: PYP (Primary Years Programme), MYP (Middle Years Programme), DP (Diploma Programme), and CP (Career-related Programme). Abjad helps connect IB-trained teachers with schools using these systems in Saudi Arabia.",
  },
  {
    q: "What does 'international' mean in schools?",
    a: "An international school follows globally recognised curricula (e.g., IB, British, American) and serves both Saudi and expatriate students. These schools often offer competitive packages and modern teaching environments.",
  },
  {
    q: "How can I find English language teacher jobs in Saudi Arabia?",
    a: "You can find English language teacher jobs in Saudi Arabia directly on Abjad, where verified Riyadh, Jeddah, and Dammam schools list open positions for ESL, EFL, and English Literature teachers. Create a free profile and start receiving instant job matches today.",
  },
  {
    q: "Why did you decide to become a teacher?",
    a: "\"I became a teacher because I enjoy helping students grow, discover new ideas, and build confidence in learning. Teaching allows me to make a positive impact while continuously improving my own skills.\" — International School Teacher",
  },
  {
    q: "What is the best school in Riyadh?",
    a: "Some of the best Riyadh schools include American International School of Riyadh, Kingdom Schools, and British International School Riyadh — all of which actively hire teachers through Abjad.",
  },
  {
    q: "What is the best school in Dammam?",
    a: "Top Dammam schools include Al Hussan International School, International Programs School, and ISG Dammam, known for strong academic standards and international curricula.",
  },
  {
    q: "What is the best school in Jeddah?",
    a: "Leading Jeddah schools include British International School Jeddah, American International School Jeddah, and Jeddah Prep and Grammar School, offering high IB and IGCSE success rates.",
  },
  {
    q: "Which country has the best schools?",
    a: "Education quality varies globally, but Finland, Singapore, Japan, and Canada consistently rank among the top. However, Saudi Arabia's international schools have rapidly improved, offering competitive education and excellent teaching opportunities.",
  },
];

const INITIAL_VISIBLE = 6;

export default function TeachersFaq() {
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? faqs : faqs.slice(0, INITIAL_VISIBLE);

  return (
    <section className="bg-[#f8fafc] overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-200 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-primary)" }}
          >
            Questions About Hiring or Teaching?
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
              Everything Teachers and Schools{" "}
              <span style={{ color: "var(--brand-accent)" }}>Need to Know</span>
            </h2>

            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {visibleFaqs.map((faq, i) => {
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

            {/* Show more / less toggle */}
            <button
              type="button"
              onClick={() => { setShowAll(!showAll); if (showAll) setOpen(null); }}
              className="mt-6 flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: "var(--brand-accent)" }}
            >
              {showAll ? "Show fewer questions" : `Show all ${faqs.length} questions`}
              <span
                className="w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold transition-transform"
                style={{ borderColor: "var(--brand-accent)", transform: showAll ? "rotate(45deg)" : "none" }}
              >
                +
              </span>
            </button>

            {/* Inline CTA after FAQ */}
            <div
              className="mt-10 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ background: "var(--brand-gradient)" }}
            >
              <div>
                <p className="text-white font-bold mb-1">Find Teaching Jobs in Saudi Arabia Faster</p>
                <p className="text-white/55 text-sm">
                  Abjad connects you with top international schools, private institutions, and
                  Riyadh, Jeddah, and Dammam schools seeking passionate teachers today.
                </p>
              </div>
              <Link
                href="/register?role=teacher"
                className="inline-flex items-center gap-2 bg-white font-bold text-sm px-7 py-3 rounded-full whitespace-nowrap transition-all hover:shadow-xl hover:-translate-y-0.5 shrink-0"
                style={{ color: "var(--brand-primary-dark)" }}
              >
                Find Jobs <ArrowRight size={15} />
              </Link>
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
                    I became a teacher because I enjoy helping students grow, discover new ideas,
                    and build confidence in learning.
                  </p>
                  <span className="text-xs text-white/40">— International School Teacher, Riyadh</span>
                </div>
              </div>

              {/* Stats panel */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                {[
                  { val: "72 hrs", label: "Average time to first interview", i: 0 },
                  { val: "100%", label: "Verified school profiles", i: 1 },
                  { val: "KSA", label: "Nationwide reach", i: 2 },
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
