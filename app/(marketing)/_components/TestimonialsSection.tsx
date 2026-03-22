"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is Abjad and how does it work?",
    a: "Abjad is a dedicated teacher hiring platform designed to connect educators and schools across Saudi Arabia; from Riyadh and Jeddah to Dammam. Schools can post jobs, and teachers can apply directly or get matched through our comprehensive assessment system, making the hiring process faster and more effective for both educators and institutions.",
  },
  {
    q: "Can international schools in Riyadh, Jeddah, or Dammam use Abjad?",
    a: "Yes. International schools throughout the Kingdom of Saudi Arabia — whether in Riyadh, Jeddah, Dammam, the Eastern Province, or any growing educational community — can confidently rely on Abjad to access a nationwide network of highly qualified educators, experienced teachers, and dependable substitute teachers.",
  },
  {
    q: "How does Abjad help substitute teachers and educators?",
    a: "Abjad makes it easy for substitute teachers and educators to register, create a professional profile, and receive instant alerts for openings at nearby schools. It is the fastest and most reliable way to find flexible teaching roles and short-term opportunities across Saudi Arabia.",
  },
  {
    q: "Is Abjad available for high schools and private schools?",
    a: "Yes, Abjad supports all types of educational institutions; international schools, private academies, and high schools throughout Saudi Arabia, making it a powerful tool for educators seeking a modern, reliable, and comprehensive learning platform.",
  },
  {
    q: "Why is Abjad better than other job platforms like LinkedIn?",
    a: "Unlike general job sites, Abjad is built specifically for the education sector, connecting Saudi schools with qualified educators and teachers. We offer faster matching, verified profiles, and localized support tailored to the needs of the Saudi education community.",
  },
  {
    q: "How do I start using Abjad?",
    a: "Click Join Now or Sign Up, create your account, and start connecting instantly. Schools can post openings within minutes, and teachers and educators can apply or get matched automatically.",
  },
  {
    q: "Can teachers from outside Saudi Arabia apply through Abjad?",
    a: "Yes. Abjad welcomes international educators seeking teaching opportunities in Saudi Arabia. Many Riyadh, Jeddah, and Dammam schools actively recruit qualified teachers from abroad through Abjad's verified global network.",
  },
  {
    q: "How does Abjad ensure the quality of teacher profiles?",
    a: "Every teacher undergoes a verification process, including credential checks, experience validation, and reference reviews, ensuring schools hire only the most qualified educators.",
  },
  {
    q: "Are there fees for teachers to join Abjad?",
    a: "No, registration for teachers, educators, and substitute teachers (مترجم) is completely free. All educators can create profiles, browse school listings, and apply to opportunities without any cost.",
  },
  {
    q: "What kinds of schools use Abjad?",
    a: "Abjad is trusted by international schools, high schools, and private academies across Saudi Arabia, providing educators in bilingual, American, British, and IB curriculum schools with a powerful platform for teaching and learning.",
  },
  {
    q: "How long does it take for a school to find a teacher using Abjad?",
    a: "Most schools find suitable candidates within days. With AI-powered matching and real-time notifications, Abjad shortens recruitment time by up to 70% compared to traditional methods.",
  },
  {
    q: "Can I use Abjad on mobile devices?",
    a: "Yes. Abjad's responsive platform allows teachers and schools to manage profiles, job posts, and applications seamlessly from smartphones and tablets.",
  },
  {
    q: "Does Abjad support Arabic and English users?",
    a: "Absolutely. Abjad operates in both Arabic and English to cater to local and international educators, ensuring full accessibility across Saudi Arabia.",
  },
  {
    q: "Can schools hire substitute teachers for short-term contracts?",
    a: "Yes. Abjad offers flexible options for hiring substitute teachers (مترجم) for temporary or emergency positions, making it ideal for last-minute staffing needs.",
  },
  {
    q: "What makes Abjad the #1 choice for schools and teachers in Saudi Arabia?",
    a: "Abjad focuses exclusively on the education sector, combining smart technology, verified profiles, and a nationwide network to deliver faster, higher-quality matches than any other platform.",
  },
  {
    q: "How does Abjad help schools in smaller cities or rural areas?",
    a: "Abjad extends its services beyond major cities like Riyadh, Jeddah, and Dammam; reaching schools across Saudi Arabia with advanced filters to connect them with qualified teachers nearby.",
  },
  {
    q: "How can I stay updated on new teaching opportunities?",
    a: "Registered teachers receive instant notifications when schools near them post new openings, ensuring no opportunity is missed.",
  },
  {
    q: "Can Abjad help schools recruit for non-teaching roles?",
    a: "Yes. In addition to teaching positions, schools can also recruit for administrative, leadership, and support staff roles through Abjad.",
  },
  {
    q: "Is Abjad approved or recognized by educational institutions?",
    a: "Many leading Saudi and international schools partner with Abjad as their primary hiring solution, reflecting strong industry credibility and consistent performance results.",
  },
  {
    q: "How does Abjad improve visibility for teachers?",
    a: "Teachers' profiles are featured in smart search results, giving them direct exposure to hundreds of verified schools actively hiring across the country.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm font-semibold text-gray-900 group-hover:text-[color:var(--brand-primary)] transition-colors">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-5 pr-8">
          {a}
        </p>
      )}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            FAQ
          </span>
          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Everything You Need to Know{" "}
            <span style={{ color: "var(--brand-accent)" }}>About Abjad</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Get clear, concise answers about how Abjad connects teachers and schools faster than any
            other platform in Saudi Arabia.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="bg-[#f8fafc] rounded-3xl border border-gray-100 px-8 py-2 shadow-sm">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
