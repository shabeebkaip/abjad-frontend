"use client";

import { useState, useEffect } from "react";
import {
  Briefcase, GraduationCap, Building2, Users, Search, MapPin,
  Clock, CheckCircle2, ChevronDown, Calendar, Video, Phone,
  Star, Send, Bookmark, Zap, Award, PartyPopper, XCircle,
  Sparkles, Eye, FileText, ArrowRight, CalendarDays, Bell,
  ExternalLink, RefreshCw, MoreHorizontal, AlertCircle,
  Filter, ChevronRight, SlidersHorizontal, BookOpen,
  Banknote, ArrowRightLeft, CheckSquare, Square, X,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   ABJAD — End-to-End Hiring Workflow Demo
   Every screen mirrors the actual product UI as built today.
   ───────────────────────────────────────────────────────────── */

const PHASES = [
  { num: "01", title: "Post Job",        day: "Day 0", actor: "school"  },
  { num: "02", title: "Discover",        day: "Day 1", actor: "teacher" },
  { num: "03", title: "Apply",           day: "Day 1", actor: "teacher" },
  { num: "04", title: "Review",          day: "Day 2", actor: "school"  },
  { num: "05", title: "Shortlist",       day: "Day 2", actor: "school"  },
  { num: "06", title: "Schedule",        day: "Day 3", actor: "school"  },
  { num: "07", title: "Confirm",         day: "Day 3", actor: "teacher" },
  { num: "08", title: "Feedback",        day: "Day 5", actor: "school"  },
  { num: "09", title: "Offer",           day: "Day 6", actor: "school"  },
  { num: "10", title: "Hire",            day: "Day 7", actor: "both"    },
];

/* ── Reusable: Browser frame wrapper ── */
function BrowserFrame({
  url,
  actor,
  children,
}: {
  url: string;
  actor: "school" | "teacher" | "both";
  children: React.ReactNode;
}) {
  const actorLabel =
    actor === "school" ? "School Dashboard" :
    actor === "teacher" ? "Teacher Dashboard" : "Both Views";
  const Icon = actor === "school" ? Building2 : actor === "teacher" ? GraduationCap : Users;
  const actorColor =
    actor === "school" ? "var(--brand-primary)" :
    actor === "teacher" ? "var(--brand-accent)" : "#a78bfa";

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-2xl shadow-gray-300/30 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xs font-medium text-gray-400 bg-white border border-gray-200 rounded-full px-4 py-1 max-w-md truncate">
            <span className="text-gray-300">abjad.sa</span>
            <span className="text-gray-500">{url}</span>
          </div>
        </div>
        <div
          className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
          style={{ backgroundColor: `${actorColor}15`, color: actorColor }}
        >
          <Icon size={11} strokeWidth={2.5} />
          {actorLabel}
        </div>
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

/* ── Reusable: Phase header ── */
function PhaseHeader({
  num, day, actor, title, subtitle,
}: {
  num: string; day: string;
  actor: "school" | "teacher" | "both";
  title: string; subtitle: string;
}) {
  const actorLabel =
    actor === "school" ? "School" : actor === "teacher" ? "Teacher" : "School + Teacher";
  const actorColor =
    actor === "school" ? "var(--brand-primary)" :
    actor === "teacher" ? "var(--brand-accent)" : "#a78bfa";

  return (
    <div className="mb-10 lg:mb-14">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span
          className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
          style={{ backgroundColor: `${actorColor}15`, color: actorColor }}
        >
          {actorLabel}
        </span>
        <span className="text-xs font-bold tracking-widest uppercase text-gray-400 flex items-center gap-1.5">
          <Clock size={11} /> {day}
        </span>
      </div>
      <div className="flex items-baseline gap-4 sm:gap-6 mb-4">
        <span
          className="font-black leading-none text-gray-100 select-none"
          style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "-0.05em" }}
        >
          {num}
        </span>
        <div>
          <h2
            className="font-extrabold text-gray-950 leading-[1.05]"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", letterSpacing: "-0.03em" }}
          >
            {title}
          </h2>
        </div>
      </div>
      <p className="text-gray-500 text-base sm:text-lg max-w-2xl leading-relaxed">{subtitle}</p>
    </div>
  );
}

/* ── Status badge matching the actual app ── */
function StatusBadge({
  status,
}: {
  status: "submitted" | "reviewing" | "shortlisted" | "interview" | "offer" | "hired" | "pending" | "accepted" | "completed" | "sent" | "viewed";
}) {
  const map: Record<string, { label: string; cls: string }> = {
    submitted:    { label: "Submitted",     cls: "bg-gray-100 text-gray-600" },
    reviewing:    { label: "Reviewing",     cls: "bg-blue-100 text-blue-700" },
    shortlisted:  { label: "Shortlisted",   cls: "bg-violet-100 text-violet-700" },
    interview:    { label: "Interview",     cls: "bg-amber-100 text-amber-700" },
    offer:        { label: "Offer Sent",    cls: "bg-teal-100 text-teal-700" },
    hired:        { label: "Hired",         cls: "bg-emerald-100 text-emerald-700" },
    pending:      { label: "Pending",       cls: "bg-amber-100 text-amber-700 border border-amber-200" },
    accepted:     { label: "Accepted",      cls: "bg-green-100 text-green-700 border border-green-200" },
    completed:    { label: "Completed",     cls: "bg-slate-100 text-slate-600 border border-slate-200" },
    sent:         { label: "Sent",          cls: "bg-blue-100 text-blue-700 border border-blue-200" },
    viewed:       { label: "Viewed",        cls: "bg-indigo-100 text-indigo-700 border border-indigo-200" },
  };
  const { label, cls } = map[status];
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

function MatchBadge({ score }: { score: number }) {
  const cls =
    score >= 80 ? "bg-green-100 text-green-700 border-green-200" :
    score >= 60 ? "bg-amber-100 text-amber-700 border-amber-200" :
    "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cls}`}>
      {score}%
    </span>
  );
}

function FlowArrow({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center mt-12 mb-2">
      <div
        className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider"
        style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-primary)" }}
      >
        {text}
      </div>
      <div className="w-px h-10 bg-gradient-to-b from-gray-300 to-transparent mt-3" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*    PAGE                                                       */
/* ──────────────────────────────────────────────────────────── */

export default function WorkflowDemoPage() {
  const [activePhase, setActivePhase] = useState("01");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const phase = entry.target.getAttribute("data-phase");
            if (phase) setActivePhase(phase);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    document.querySelectorAll("[data-phase]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc]">

      {/* ───────────────────── Sticky Progress Nav ───────────────────── */}
      <div className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-extrabold text-gray-950 text-sm">Abjad Workflow</span>
          </div>
          <div className="flex-1 hidden md:flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PHASES.map((p) => (
              <a
                key={p.num}
                href={`#phase-${p.num}`}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  activePhase === p.num ? "text-white" : "text-gray-400 hover:text-gray-700"
                }`}
                style={activePhase === p.num ? { backgroundColor: "var(--brand-primary)" } : undefined}
              >
                {p.num}
              </a>
            ))}
          </div>
          <div className="text-xs font-bold text-gray-500 shrink-0">
            <span style={{ color: "var(--brand-primary)" }}>{activePhase}</span>
            <span className="text-gray-300"> / 10</span>
          </div>
        </div>
      </div>

      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "var(--brand-gradient)" }}>
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div
          className="absolute -top-40 -left-40 w-160 h-160 rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,172,211,0.18) 0%, transparent 65%)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-20 sm:pt-28 pb-16 sm:pb-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-bold tracking-widest uppercase mb-8">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
            </span>
            Live Product Walkthrough
          </span>

          <h1
            className="font-extrabold text-white leading-[1.05] mb-6 max-w-4xl mx-auto"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)", letterSpacing: "-0.04em" }}
          >
            From Job Posted to{" "}
            <span style={{ color: "var(--brand-accent)" }}>Teacher Hired</span>
          </h1>
          <p className="text-white/65 text-base sm:text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            A complete tour of the Abjad hiring workflow — every screen below is the real product UI exactly as it appears in the live application.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10">
            {[
              { val: "7 days",   label: "Post → Hire",      color: "var(--brand-accent)" },
              { val: "10 steps", label: "End-to-end",       color: "#34d399" },
              { val: "2 roles",  label: "School & Teacher", color: "#a78bfa" },
              { val: "Live UI",  label: "Real screens",     color: "#fbbf24" },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-white/6 border border-white/10 px-4 py-5 backdrop-blur-sm">
                <div
                  className="font-black leading-none mb-1.5"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", color: m.color }}
                >
                  {m.val}
                </div>
                <div className="text-white/45 text-xs font-medium">{m.label}</div>
              </div>
            ))}
          </div>

          <a
            href="#phase-01"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-semibold"
          >
            Begin the journey
            <ChevronDown size={16} className="animate-bounce" />
          </a>
        </div>
      </section>

      {/* ───────────────────── TIMELINE OVERVIEW ───────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: "var(--brand-accent)" }}>
              The 10-Phase Journey
            </p>
            <h2
              className="font-extrabold text-gray-950 leading-tight max-w-3xl mx-auto"
              style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)", letterSpacing: "-0.03em" }}
            >
              One platform. Two roles. One verified hire.
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-0 right-0 top-[34px] h-px bg-gray-200" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
              {PHASES.map((p) => {
                const color =
                  p.actor === "school" ? "var(--brand-primary)" :
                  p.actor === "teacher" ? "var(--brand-accent)" : "#a78bfa";
                return (
                  <a key={p.num} href={`#phase-${p.num}`} className="relative flex flex-col items-center text-center group">
                    <div
                      className="w-[68px] h-[68px] rounded-full border-4 border-white bg-white flex items-center justify-center font-black text-sm transition-all group-hover:scale-110 z-10"
                      style={{ boxShadow: `0 0 0 2px ${color}, 0 4px 12px ${color}40`, color }}
                    >
                      {p.num}
                    </div>
                    <div className="mt-3 text-[11px] font-bold text-gray-950 leading-tight">{p.title}</div>
                    <div className="text-[10px] font-medium text-gray-400 mt-0.5">{p.day}</div>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 mt-12 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--brand-primary)" }} />
              School action
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--brand-accent)" }} />
              Teacher action
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              Both parties
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 01 — Post Job (slide-in modal mockup)              */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-01" data-phase="01" className="py-16 lg:py-24 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="01"
            day="Day 0"
            actor="school"
            title="School Posts a Job"
            subtitle="Manarat Riyadh International logs in to their school dashboard, opens the Job Postings page, and clicks 'Post a Job'. A slide-in panel opens with the full job posting form."
          />

          <BrowserFrame url="/school/jobs" actor="school">
            <div className="relative h-[640px] flex bg-[#fafbfc] overflow-hidden">
              {/* Background page (dimmed) */}
              <div className="flex-1 p-6 opacity-40">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h1 className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Briefcase size={16} style={{ color: "var(--brand-primary)" }} />
                      Job Postings
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">Manage your open positions</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-5">
                  {["All", "Active", "Draft", "Closed"].map((t, i) => (
                    <div key={t} className={`text-xs font-medium px-3 py-1.5 rounded-lg ${i === 0 ? "bg-white text-gray-900" : "text-gray-500"}`}>
                      {t}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 h-28" />
                  ))}
                </div>
              </div>

              {/* Slide-in modal (right) */}
              <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Post a New Job</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Fill in the details to create a job posting</p>
                  </div>
                  <button className="p-2 rounded-lg text-gray-400">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <div className="px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-xl bg-white">
                      Mathematics Teacher – High School
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-1.5">Description</label>
                    <div className="px-3 py-2 text-xs text-gray-600 border border-gray-200 rounded-xl bg-white leading-relaxed">
                      Looking for an experienced Math teacher to join our High School team. Strong curriculum knowledge required.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-2">
                      Subjects <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["Math", "Physics", "Chemistry", "Biology", "English", "Arabic", "Science", "Computer Science"].map((s, i) => (
                        <div
                          key={s}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${i < 2 ? "border-transparent text-white" : "border-gray-200 text-gray-600 bg-white"}`}
                          style={i < 2 ? { background: "var(--brand-gradient)" } : undefined}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-2">Grade Levels</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["KG", "Elementary (1–6)", "Middle (7–9)", "High (10–12)"].map((g, i) => (
                        <div
                          key={g}
                          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border ${i === 3 ? "border-transparent text-white" : "border-gray-200 text-gray-700 bg-white"}`}
                          style={i === 3 ? { background: "var(--brand-gradient)" } : undefined}
                        >
                          {i === 3 ? <CheckSquare size={11} /> : <Square size={11} className="text-gray-400" />}
                          {g}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormBlock label="Employment" value="Full Time" />
                    <FormBlock label="Positions" value="1" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormBlock label="City" value="Riyadh" />
                    <FormBlock label="Language" value="Bilingual" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormBlock label="Experience" value="3–5 years" />
                    <FormBlock label="Degree" value="Bachelor's" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-2">Salary (SAR / Month)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white">9,000</div>
                      <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white">12,000</div>
                      <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white">Show</div>
                    </div>
                  </div>

                  <FormBlock label="Application Deadline" value="Aug 25, 2026" />
                </div>

                <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                  <button className="px-3 py-2 text-xs font-medium text-gray-600 rounded-xl">Cancel</button>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 text-xs font-medium text-gray-700 border border-gray-200 bg-white rounded-xl">
                      Save as Draft
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-xl"
                      style={{ background: "var(--brand-gradient)" }}
                    >
                      <Send size={12} /> Save &amp; Publish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </BrowserFrame>

          <FlowArrow text="Job goes live — instantly visible to matching teachers" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 02 — Teacher Discovers (3-panel layout)             */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-02" data-phase="02" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="02"
            day="Day 1"
            actor="teacher"
            title="Teacher Discovers the Job"
            subtitle="Ahmed Al-Faraj logs into his teacher dashboard. The Jobs page surfaces a 92% match — the AI matches his subject, grade level, city, and experience against the new posting."
          />

          <BrowserFrame url="/teacher/jobs" actor="teacher">
            <div className="h-[620px] flex flex-col bg-slate-50">
              {/* Search bar */}
              <div className="shrink-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border" style={{ color: "var(--brand-primary)", backgroundColor: "var(--brand-primary-light)", borderColor: "var(--brand-primary)" }}>
                  <SlidersHorizontal size={13} />
                  Filters
                  <span className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: "var(--brand-primary)" }}>2</span>
                </div>
                <div className="flex-1 relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <div className="w-full pl-8 pr-3 py-2 text-xs text-slate-400 border border-slate-200 rounded-lg bg-white">
                    Search by job title, subject, or city…
                  </div>
                </div>
                <div className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-600 flex items-center gap-1.5">
                  Newest <ChevronDown size={11} />
                </div>
              </div>

              {/* 3-panel body */}
              <div className="flex flex-1 min-h-0">
                {/* Filters */}
                <aside className="w-48 shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Filter size={10} /> Filters
                    </span>
                    <span className="text-[10px] font-semibold" style={{ color: "var(--brand-primary)" }}>Clear</span>
                  </div>
                  <div className="px-2 py-2">
                    <FilterSectionTitle label="City" />
                    <FilterCheckbox label="Riyadh" checked />
                    <FilterCheckbox label="Jeddah" />
                    <FilterCheckbox label="Dammam" />
                    <FilterCheckbox label="Khobar" />
                    <FilterSectionTitle label="Subject" />
                    <FilterCheckbox label="Mathematics" checked />
                    <FilterCheckbox label="Physics" />
                    <FilterCheckbox label="Chemistry" />
                    <FilterCheckbox label="Biology" />
                  </div>
                </aside>

                {/* Job list */}
                <div className="w-72 shrink-0 flex flex-col bg-white border-r border-slate-200 overflow-hidden">
                  <div className="shrink-0 bg-slate-50 border-b border-slate-100 px-3 py-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">14</span> of 87 jobs
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {/* Selected job */}
                    <div className="px-3 py-3 bg-slate-50 border-l-2" style={{ borderLeftColor: "var(--brand-primary)" }}>
                      <div className="flex items-start gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ background: "var(--brand-gradient)" }}>
                          M
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="text-xs font-semibold leading-snug" style={{ color: "var(--brand-primary)" }}>
                              Mathematics Teacher – High School
                            </h3>
                            <Bookmark size={11} className="text-slate-300 shrink-0 mt-0.5" />
                          </div>
                          <div className="flex flex-wrap items-center gap-x-2 mt-1.5 text-[10px] text-slate-400">
                            <span className="flex items-center gap-0.5"><MapPin size={9} />Riyadh</span>
                            <span className="flex items-center gap-0.5"><BookOpen size={9} />math</span>
                            <span className="flex items-center gap-0.5"><Clock size={9} />full-time</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <span className="text-[10px] font-semibold text-slate-700">SAR 9,000–12,000/mo</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700">92% match</span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">7d left</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Other jobs (faded) */}
                    {[
                      { ini: "B", color: "#7c3aed", title: "Math Teacher – Middle School", city: "Jeddah", match: 78 },
                      { ini: "A", color: "#10b981", title: "Physics & Math – Grade 9", city: "Dammam", match: 71 },
                      { ini: "K", color: "#f59e0b", title: "Mathematics – KG to Grade 3", city: "Riyadh", match: 64 },
                    ].map((j) => (
                      <div key={j.title} className="px-3 py-3 opacity-70">
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ background: j.color }}>
                            {j.ini}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-semibold text-slate-700 leading-snug">{j.title}</h3>
                            <div className="flex flex-wrap items-center gap-x-2 mt-1 text-[10px] text-slate-400">
                              <span className="flex items-center gap-0.5"><MapPin size={9} />{j.city}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{j.match}% match</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detail panel */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                  <div className="shrink-0 px-5 pt-4 pb-3 border-b border-slate-100" style={{ borderTop: "3px solid var(--brand-primary)" }}>
                    <div className="flex items-start gap-2.5 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "var(--brand-gradient)" }}>
                        M
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800">Manarat Riyadh International</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={9} />Riyadh
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="p-1.5 rounded-lg border border-slate-200 text-slate-400">
                          <Bookmark size={11} />
                        </div>
                      </div>
                    </div>
                    <h2 className="text-sm font-bold text-slate-900 mb-2">Mathematics Teacher – High School</h2>
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      <span className="flex items-center gap-0.5 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        <Clock size={9} />full-time
                      </span>
                      <span className="flex items-center gap-0.5 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        <GraduationCap size={9} />High
                      </span>
                      <span className="flex items-center gap-0.5 text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        <CalendarDays size={9} />Closes Aug 25
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Banknote size={11} className="text-slate-400" />
                        SAR 9,000–12,000/mo
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 ring-1 ring-green-200">
                        92% match
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Job Overview</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { i: Clock,         l: "Employment", v: "full-time" },
                          { i: MapPin,        l: "City",       v: "Riyadh" },
                          { i: BookOpen,      l: "Subjects",   v: "math, physics" },
                          { i: GraduationCap, l: "Grades",     v: "High" },
                        ].map((r) => (
                          <div key={r.l} className="flex items-start gap-1.5">
                            <r.i size={10} className="text-slate-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[8px] font-bold text-slate-400 uppercase">{r.l}</p>
                              <p className="text-[11px] font-semibold text-slate-700">{r.v}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">About the Role</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Looking for an experienced Math teacher to join our High School team. Strong curriculum knowledge required.
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Requirements</p>
                      <ul className="space-y-1">
                        {["Bachelor's degree in Mathematics", "3–5 years teaching experience", "Bilingual (English & Arabic)"].map((r) => (
                          <li key={r} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                            <CheckCircle2 size={10} className="shrink-0 mt-0.5 text-emerald-500" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="shrink-0 px-5 py-3 bg-white border-t border-slate-100">
                    <button
                      className="w-full py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5"
                      style={{ background: "var(--brand-gradient)" }}
                    >
                      <Zap size={12} /> Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </BrowserFrame>

          <FlowArrow text="Ahmed reviews the role. Clicks 'Apply Now'." />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 03 — Teacher Applies                                */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-03" data-phase="03" className="py-16 lg:py-24 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="03"
            day="Day 1"
            actor="teacher"
            title="One-Tap Application"
            subtitle="Because Ahmed's profile is already verified, applying is a single tap. His verified CV, credentials, and references are attached automatically. Confirmation appears instantly."
          />

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Before */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Before — Apply button</p>
              <BrowserFrame url="/teacher/jobs" actor="teacher">
                <div className="p-6 bg-white">
                  <div className="border-t-4 -mt-6 -mx-6 mb-5" style={{ borderTopColor: "var(--brand-primary)" }} />
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0" style={{ background: "var(--brand-gradient)" }}>M</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">Manarat Riyadh International</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} />Riyadh</p>
                    </div>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mb-3">Mathematics Teacher – High School</h2>
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">SAR 9,000–12,000/mo</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 ring-1 ring-green-200">92% match</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 mb-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Auto-attached from your profile</p>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> Verified CV (resume.pdf)</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> Bachelor's in Mathematics</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> 2 reference letters</div>
                    </div>
                  </div>
                  <button
                    className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    <Zap size={14} /> Apply Now
                  </button>
                </div>
              </BrowserFrame>
            </div>

            {/* After */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">After — confirmation</p>
              <BrowserFrame url="/teacher/jobs" actor="teacher">
                <div className="p-6 bg-white">
                  <div className="border-t-4 -mt-6 -mx-6 mb-5" style={{ borderTopColor: "var(--brand-primary)" }} />
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0" style={{ background: "var(--brand-gradient)" }}>M</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">Manarat Riyadh International</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} />Riyadh</p>
                    </div>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mb-3">Mathematics Teacher – High School</h2>
                  <div className="flex items-center gap-2 mb-5 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">SAR 9,000–12,000/mo</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 ring-1 ring-green-200">92% match</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 mb-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Auto-attached from your profile</p>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> Verified CV (resume.pdf)</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> Bachelor's in Mathematics</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> 2 reference letters</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-center py-3 bg-emerald-50 rounded-xl text-emerald-600 font-semibold text-sm">
                    <CheckCircle2 size={15} /> Application Submitted
                  </div>
                  <p className="text-center text-[10px] text-slate-400 mt-3">
                    Reference number: <span className="font-mono font-semibold">ABJ-2026-0247</span>
                  </p>
                </div>
              </BrowserFrame>
            </div>
          </div>

          <FlowArrow text="Application appears in Manarat Riyadh's dashboard within seconds" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 04 — School Reviews                                 */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-04" data-phase="04" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="04"
            day="Day 2"
            actor="school"
            title="School Reviews Applicants"
            subtitle="The HR lead opens the Applications page. The Pipeline Stats Bar shows the funnel at a glance, applicants are sorted by match score, and Ahmed's card sits at the top with a 'New' unread indicator."
          />

          <BrowserFrame url="/school/applications" actor="school">
            <div className="flex h-[640px] bg-white overflow-hidden">
              {/* Sidebar */}
              <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-gray-100 bg-white">
                <div className="p-3 border-b border-gray-100">
                  <h2 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Filter by Job</h2>
                  <div className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium text-white shadow-sm mb-1"
                    style={{ background: "var(--brand-gradient)" }}>
                    <span className="flex items-center gap-1.5">
                      <Users size={12} />
                      All Jobs
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">47</span>
                  </div>
                </div>
                <div className="flex-1 p-2 space-y-0.5">
                  {[
                    { t: "Mathematics – High School", n: 23, active: true },
                    { t: "Arabic – Middle School", n: 12 },
                    { t: "Science – KG", n: 8 },
                    { t: "Physical Education", n: 4 },
                  ].map((j) => (
                    <div key={j.t} className={`flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-xl text-[11px] ${j.active ? "text-white" : "text-gray-700"}`}
                      style={j.active ? { background: "var(--brand-gradient)" } : undefined}>
                      <span className="flex items-center gap-1.5 truncate">
                        <Briefcase size={10} className={j.active ? "text-white/80" : "text-gray-400"} />
                        <span className="truncate">{j.t}</span>
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 rounded-full ${j.active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>{j.n}</span>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Main */}
              <main className="flex-1 flex flex-col overflow-hidden">
                {/* Pipeline stats */}
                <div className="px-4 pt-4 pb-2 border-b border-gray-100 bg-white">
                  <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3">
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-xs font-semibold text-gray-800">Pipeline Overview</p>
                      <span className="text-[10px] text-gray-400">23 total applications</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        { l: "Submitted",   n: 14, c: "#6b7280", w: 60 },
                        { l: "Reviewing",   n: 5,  c: "#3b82f6", w: 22 },
                        { l: "Shortlisted", n: 3,  c: "#8b5cf6", w: 13 },
                        { l: "Interview",   n: 1,  c: "#f59e0b", w: 5 },
                        { l: "Offer",       n: 0,  c: "#14b8a6", w: 0 },
                        { l: "Hired",       n: 0,  c: "#10b981", w: 0 },
                      ].map((s) => (
                        <div key={s.l} className="text-center">
                          <div className="h-1.5 bg-gray-100 rounded-full mb-1.5">
                            <div className="h-full rounded-full" style={{ width: `${Math.max(s.w, s.n > 0 ? 5 : 0)}%`, backgroundColor: s.c }} />
                          </div>
                          <p className="text-xs font-bold text-gray-900">{s.n}</p>
                          <p className="text-[9px] text-gray-400 truncate">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-gray-100 bg-white">
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {[
                      { l: "All", n: 23, active: true },
                      { l: "Submitted", n: 14 },
                      { l: "Reviewing", n: 5 },
                      { l: "Shortlisted", n: 3 },
                      { l: "Interview", n: 1 },
                    ].map((t) => (
                      <div key={t.l} className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg ${t.active ? "text-white shadow-sm" : "text-gray-500"}`}
                        style={t.active ? { background: "var(--brand-gradient)" } : undefined}>
                        {t.l}
                        <span className={`text-[9px] font-bold px-1 rounded-full ${t.active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>{t.n}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-gray-600 border border-gray-200 rounded-lg">
                    <SlidersHorizontal size={10} /> Match Score
                  </div>
                </div>

                {/* Application list */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
                  {/* Top candidate — unread */}
                  <div className="bg-white rounded-2xl border-2 border-blue-200 p-4 relative">
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                        style={{ background: "var(--brand-gradient)" }}>
                        A
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-bold text-gray-900">Ahmed Al-Faraj</span>
                          <MatchBadge score={92} />
                          <span className="text-[10px] text-gray-400 font-mono">#ABJ-2026-0247</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-500">
                          <Briefcase size={10} className="text-gray-400" />
                          <span className="truncate">Mathematics Teacher – High School</span>
                          <span className="text-gray-300">·</span>
                          <MapPin size={9} className="text-gray-400" />
                          Riyadh
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-2 bg-gray-50 rounded-lg px-2.5 py-1.5 italic">
                          &ldquo;5 years teaching IB and Cambridge Mathematics at high school level. Strong track record with grades 10–12 across the Saudi national and international curricula.&rdquo;
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <StatusBadge status="submitted" />
                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                              <Clock size={10} /> just now
                            </span>
                          </div>
                          <button
                            className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-white rounded-lg"
                            style={{ background: "var(--brand-gradient)" }}
                          >
                            <Eye size={10} /> Start Review
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other candidates */}
                  {[
                    { name: "Khalid Al-Otaibi", score: 84, status: "reviewing" as const, time: "2h ago" },
                    { name: "Layla Hassan",     score: 79, status: "shortlisted" as const, time: "5h ago" },
                    { name: "Mohammed Al-Saud", score: 71, status: "interview" as const, time: "1d ago" },
                  ].map((c) => (
                    <div key={c.name} className="bg-white rounded-2xl border border-gray-100 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                          style={{ background: "var(--brand-gradient)" }}>
                          {c.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-sm font-bold text-gray-900">{c.name}</span>
                            <MatchBadge score={c.score} />
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-500">
                            <Briefcase size={10} className="text-gray-400" />
                            Mathematics Teacher – High School
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <StatusBadge status={c.status} />
                              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                <Clock size={10} /> {c.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          </BrowserFrame>

          <FlowArrow text="HR clicks 'Start Review' on Ahmed's card" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 05 — Shortlist                                      */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-05" data-phase="05" className="py-16 lg:py-24 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="05"
            day="Day 2"
            actor="school"
            title="Candidate Shortlisted"
            subtitle="After moving Ahmed to Reviewing, the action buttons update. The HR lead clicks Shortlist — the card immediately moves into the Shortlisted column."
          />

          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Reviewing → Shortlist or Reject</p>
              <BrowserFrame url="/school/applications" actor="school">
                <div className="p-5 bg-white">
                  <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                        style={{ background: "var(--brand-gradient)" }}>
                        A
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-bold text-gray-900">Ahmed Al-Faraj</span>
                          <MatchBadge score={92} />
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-500">
                          <Briefcase size={10} className="text-gray-400" />
                          Mathematics Teacher – High School
                        </div>
                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <StatusBadge status="reviewing" />
                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                              <Clock size={10} /> 1m ago
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg">
                              <CheckCircle2 size={10} /> Shortlist
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg">
                              <X size={10} /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BrowserFrame>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">After shortlisting → Schedule Interview</p>
              <BrowserFrame url="/school/applications" actor="school">
                <div className="p-5 bg-white">
                  <div className="bg-white rounded-2xl border-2 border-violet-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                        style={{ background: "var(--brand-gradient)" }}>
                        A
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-sm font-bold text-gray-900">Ahmed Al-Faraj</span>
                          <MatchBadge score={92} />
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-500">
                          <Briefcase size={10} className="text-gray-400" />
                          Mathematics Teacher – High School
                        </div>
                        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <StatusBadge status="shortlisted" />
                            <span className="flex items-center gap-1 text-[10px] text-gray-400">
                              <Clock size={10} /> just now
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-white rounded-lg"
                              style={{ background: "var(--brand-gradient)" }}
                            >
                              <Calendar size={10} /> Schedule Interview
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg">
                              <X size={10} /> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BrowserFrame>
            </div>
          </div>

          <FlowArrow text="HR clicks 'Schedule Interview'" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 06 — Schedule Interview Modal                       */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-06" data-phase="06" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="06"
            day="Day 3"
            actor="school"
            title="Interview Scheduled"
            subtitle="A centered modal opens. The HR lead picks the interview type (Video), date & time, duration, attaches a meeting link, and writes a short note — then sends."
          />

          <BrowserFrame url="/school/applications" actor="school">
            <div className="relative h-[560px] bg-[#fafbfc] flex items-center justify-center p-6">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

              {/* Modal */}
              <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "var(--brand-gradient)" }}>
                      <Calendar size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Schedule Interview</h3>
                      <p className="text-xs text-gray-500">Ahmed Al-Faraj · Mathematics Teacher – High School</p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg text-gray-400">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-2">Interview Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { v: "Video", icon: Video, active: true },
                        { v: "In-Person", icon: MapPin, active: false },
                        { v: "Phone", icon: Phone, active: false },
                      ].map((t) => (
                        <div
                          key={t.v}
                          className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-xs font-medium ${t.active ? "border-transparent text-white shadow-md" : "border-gray-200 text-gray-700 bg-white"}`}
                          style={t.active ? { background: "var(--brand-gradient)" } : undefined}
                        >
                          <t.icon size={14} />
                          {t.v}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                        Date &amp; Time <span className="text-red-500">*</span>
                      </label>
                      <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white flex items-center justify-between">
                        Aug 15, 2026 · 10:30 AM
                        <Calendar size={11} className="text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-800 mb-1.5">Duration (min)</label>
                      <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white">60</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-1.5">Meeting Link</label>
                    <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white">
                      https://meet.google.com/abj-xyz-123
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-1.5">Instructions (optional)</label>
                    <div className="px-3 py-2 text-xs text-gray-600 border border-gray-200 rounded-xl bg-white leading-relaxed">
                      Please prepare a 10-min sample lesson plan for Grade 11 Calculus. Have your portfolio ready.
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button className="flex-1 py-2.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl">
                    Cancel
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white rounded-xl"
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    <Calendar size={12} /> Schedule Interview
                  </button>
                </div>
              </div>
            </div>
          </BrowserFrame>

          <FlowArrow text="Invitation lands instantly in Ahmed's notifications" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 07 — Teacher Accepts                                */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-07" data-phase="07" className="py-16 lg:py-24 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="07"
            day="Day 3"
            actor="teacher"
            title="Teacher Accepts"
            subtitle="Ahmed opens his Interviews page. The 'Next Interview' banner shows the full details — he taps Confirm. The interview moves from Pending to Confirmed in both calendars."
          />

          <BrowserFrame url="/teacher/interviews" actor="teacher">
            <div className="p-6 bg-slate-50 space-y-5">
              {/* Page header */}
              <div className="-mx-6 -mt-6 bg-white border-b border-slate-200 px-6 py-4">
                <h1 className="text-base font-bold text-slate-800">Interviews</h1>
                <p className="text-xs text-slate-500 mt-0.5">Manage your scheduled interviews and preparation</p>
              </div>

              {/* Next Interview Banner */}
              <div className="rounded-2xl p-5 text-white" style={{ background: "var(--brand-gradient)" }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">Next Interview</p>
                    <h2 className="text-lg font-bold">Mathematics Teacher – High School</h2>
                    <p className="text-white/70 text-sm mt-0.5">Manarat Riyadh International</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-white/60 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={13} /> Sat, Aug 15, 2026
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} /> 10:30 AM · 60 min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Video size={13} /> Video
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>
                      <Video size={13} /> Join Meeting <ExternalLink size={10} />
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl text-xs font-medium">
                      <CalendarDays size={13} /> Add to Calendar
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { l: "Upcoming",  v: 1, c: "text-amber-500",   bg: "bg-amber-50" },
                  { l: "Confirmed", v: 0, c: "text-emerald-500", bg: "bg-emerald-50" },
                  { l: "Completed", v: 0, c: "text-blue-500",    bg: "bg-blue-50" },
                  { l: "Cancelled", v: 0, c: "text-red-400",     bg: "bg-red-50" },
                ].map((s) => (
                  <div key={s.l} className="bg-white rounded-2xl border border-slate-200 p-3 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                      <Calendar size={16} className={s.c} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-800">{s.v}</p>
                      <p className="text-[10px] text-slate-500">{s.l}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interview card */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200">
                  <div className="px-4 py-2.5 text-xs font-medium border-b-2 bg-slate-50/70" style={{ borderColor: "var(--brand-primary)", color: "var(--brand-primary)" }}>
                    Upcoming (1)
                  </div>
                  <div className="px-4 py-2.5 text-xs font-medium text-slate-500">All (1)</div>
                  <div className="px-4 py-2.5 text-xs font-medium text-slate-500">Past</div>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Date block */}
                    <div className="w-12 shrink-0 text-center">
                      <div className="bg-slate-100 rounded-xl p-1.5">
                        <p className="text-[9px] text-slate-500 uppercase font-semibold">Sat</p>
                        <p className="text-lg font-bold text-slate-800 leading-none mt-0.5">15</p>
                        <p className="text-[9px] text-slate-500">Aug</p>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-800">Mathematics Teacher – High School</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 size={11} /> Manarat Riyadh International
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium bg-blue-50 text-blue-600 border-blue-200">
                            <Video size={10} /> Video
                          </span>
                          <StatusBadge status="pending" />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Clock size={10} /> 10:30 AM · 60 min</span>
                        <span className="flex items-center gap-1"><Video size={10} /> Meeting link available</span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-white text-[11px] font-medium rounded-lg" style={{ backgroundColor: "var(--brand-primary)" }}>
                          <Video size={11} /> Join Meeting <ExternalLink size={9} />
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-[11px] font-medium rounded-lg">
                          <CheckCircle2 size={11} /> Confirm
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 border border-amber-300 text-amber-600 bg-amber-50 text-[11px] font-medium rounded-lg">
                          <RefreshCw size={11} /> Reschedule
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-500 bg-red-50 text-[11px] font-medium rounded-lg">
                          <XCircle size={11} /> Decline
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BrowserFrame>

          <FlowArrow text="Both parties get a confirmation. Interview is now Confirmed." />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 08 — Mark Complete + Feedback                       */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-08" data-phase="08" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="08"
            day="Day 5"
            actor="school"
            title="Interview Completed — Feedback Submitted"
            subtitle="After the video call (held via the linked Google Meet), the HR lead opens the School Interviews page, clicks 'Mark Complete', and a structured feedback form appears with a 5-star rating, strengths, areas for improvement, and a Hire / Maybe / Reject recommendation."
          />

          <BrowserFrame url="/school/interviews" actor="school">
            <div className="relative h-[640px] bg-[#fafbfc] flex items-center justify-center p-6">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

              {/* Feedback modal */}
              <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 max-h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "var(--brand-gradient)" }}>
                      <CheckCircle2 size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Complete Interview</h3>
                      <p className="text-xs text-gray-500">Ahmed Al-Faraj · Mathematics Teacher – High School</p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg text-gray-400">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-2">
                      Overall Rating <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={26}
                          className={star <= 5 ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">5/5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-1.5">Strengths</label>
                    <div className="px-3 py-2 text-xs text-gray-700 border border-gray-200 rounded-xl bg-white leading-relaxed">
                      Excellent subject knowledge. Sample lesson plan was outstanding — engaging delivery, real-world examples. Strong classroom presence and clear communication.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-1.5">Areas for Improvement</label>
                    <div className="px-3 py-2 text-xs text-gray-700 border border-gray-200 rounded-xl bg-white leading-relaxed">
                      Could expand on tech tools used in the classroom. Otherwise, very well prepared.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-2">
                      Recommendation <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="py-2.5 text-xs font-semibold rounded-xl border border-transparent text-white bg-green-500 text-center">Hire</div>
                      <div className="py-2.5 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-600 text-center">Maybe</div>
                      <div className="py-2.5 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-600 text-center">Reject</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-800 mb-1.5">Your Name (Evaluator)</label>
                    <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white">
                      Khalid Al-Otaibi — HR Lead
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button className="flex-1 py-2.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-xl">
                    Cancel
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white rounded-xl"
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    <CheckCircle2 size={12} /> Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </BrowserFrame>

          <FlowArrow text="Recommendation: Hire — HR proceeds to extend an offer" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 09 — Extend Offer                                   */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-09" data-phase="09" className="py-16 lg:py-24 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="09"
            day="Day 6"
            actor="school"
            title="Offer Extended"
            subtitle="From the applications board, the HR lead clicks 'Extend Offer' on Ahmed's now interview-scheduled card. A modal opens to compose the offer — position, salary, start date, deadline, and benefits."
          />

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* School composes offer */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">School — Compose offer</p>
              <BrowserFrame url="/school/applications" actor="school">
                <div className="relative h-[520px] bg-[#fafbfc] flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                  <div className="relative w-full bg-white rounded-2xl shadow-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background: "var(--brand-gradient)" }}>
                          <Send size={15} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">Extend an Offer</h3>
                          <p className="text-[10px] text-gray-500">Ahmed Al-Faraj · Math Teacher – High School</p>
                        </div>
                      </div>
                      <X size={14} className="text-gray-400" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-800 mb-1">
                          Position Title <span className="text-red-500">*</span>
                        </label>
                        <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white">
                          Mathematics Teacher – High School
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-gray-800 mb-1">
                          Monthly Salary (SAR) <span className="text-red-500">*</span>
                        </label>
                        <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white font-semibold">
                          11,500
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-800 mb-1">Start Date</label>
                          <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white">Sep 1, 2026</div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-800 mb-1">
                            Offer Deadline <span className="text-red-500">*</span>
                          </label>
                          <div className="px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-xl bg-white">Jun 19, 2026</div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-gray-800 mb-1">Benefits (optional)</label>
                        <div className="px-3 py-2 text-[11px] text-gray-600 border border-gray-200 rounded-xl bg-white leading-relaxed">
                          Housing allowance, transport, medical insurance, annual flights, end-of-service gratuity.
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 text-xs text-gray-600 border border-gray-200 rounded-xl">Cancel</button>
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white rounded-xl"
                        style={{ background: "var(--brand-gradient)" }}
                      >
                        <Send size={11} /> Extend Offer
                      </button>
                    </div>
                  </div>
                </div>
              </BrowserFrame>
            </div>

            {/* Teacher receives offer alert */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Teacher — Offer received</p>
              <BrowserFrame url="/teacher/applications" actor="teacher">
                <div className="p-5 bg-slate-50 space-y-4">
                  <div className="-mx-5 -mt-5 bg-white border-b border-slate-200 px-5 py-3">
                    <h1 className="text-sm font-bold text-slate-800">My Applications</h1>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                        style={{ background: "var(--brand-gradient)" }}>
                        M
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800">Mathematics Teacher – High School</h3>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                              <MapPin size={10} /> Riyadh
                              <span className="text-slate-300">·</span>
                              <span className="font-mono">ABJ-2026-0247</span>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium text-teal-700 bg-teal-50 border-teal-200">
                            <Award size={10} /> Offer Received
                          </span>
                        </div>

                        <div className="mt-3 mb-2">
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className="h-full rounded-full" style={{ width: "80%", background: "var(--brand-primary)" }} />
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                            <span>Submitted</span>
                            <span>Shortlisted</span>
                            <span>Interview</span>
                            <span>Offer</span>
                            <span>Hired</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
                          <Award size={13} className="shrink-0" />
                          <span>Offer received — Review and respond</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats summary */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { l: "Total", v: "1", c: "text-blue-500", bg: "bg-blue-50" },
                      { l: "Response", v: "100%", c: "text-emerald-500", bg: "bg-emerald-50" },
                      { l: "Avg Match", v: "92%", c: "text-amber-500", bg: "bg-amber-50" },
                      { l: "Offers", v: "1", c: "", bg: "bg-slate-100" },
                    ].map((s) => (
                      <div key={s.l} className="bg-white rounded-xl border border-slate-200 p-2.5 flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                          <Star size={11} className={s.c} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{s.v}</p>
                          <p className="text-[9px] text-slate-500">{s.l}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BrowserFrame>
            </div>
          </div>

          <FlowArrow text="Ahmed reviews. Accepts the offer." />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 10 — Hire Confirmed                                 */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-10" data-phase="10" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="10"
            day="Day 7"
            actor="both"
            title="Hire Confirmed"
            subtitle="Ahmed accepts the offer. The School's Offers page surfaces a 'Confirm Hire' button. One click — and the platform celebrates with the official Hire Confirmation modal."
          />

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* School Offers page with Confirm Hire button */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">School — Offers page</p>
              <BrowserFrame url="/school/offers" actor="school">
                <div className="p-5 bg-white">
                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { l: "Total Sent", v: 1, c: "text-gray-900" },
                      { l: "Active",     v: 0, c: "text-blue-700" },
                      { l: "Accepted",   v: 1, c: "text-green-700" },
                      { l: "Hired",      v: 0, c: "text-emerald-700" },
                    ].map((s) => (
                      <div key={s.l} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                        <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
                        <div className="text-[10px] text-gray-400">{s.l}</div>
                      </div>
                    ))}
                  </div>

                  {/* Offer card */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <h3 className="text-sm font-bold text-gray-900">Mathematics Teacher – High School</h3>
                          <StatusBadge status="accepted" />
                        </div>
                        <p className="text-xs text-gray-500">Ahmed Al-Faraj · ahmed.alfaraj@email.com</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        <Banknote size={10} /> SAR 11,500/month
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                        <Calendar size={10} className="text-gray-400" /> Starts Sep 1, 2026
                      </span>
                    </div>

                    <button
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg"
                      style={{ background: "var(--brand-gradient)" }}
                    >
                      <PartyPopper size={12} /> Confirm Hire
                    </button>
                  </div>
                </div>
              </BrowserFrame>
            </div>

            {/* Hire Celebration Modal */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Celebration modal</p>
              <BrowserFrame url="/school/offers" actor="school">
                <div className="relative h-[400px] bg-white flex items-center justify-center p-6">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                  <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                      style={{ background: "var(--brand-gradient)" }}>
                      <PartyPopper size={36} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Hire Confirmed!</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      <span className="font-semibold text-gray-800">Ahmed Al-Faraj</span> has been officially hired. Welcome to the team!
                    </p>
                    <button
                      className="w-full py-2.5 text-sm font-semibold text-white rounded-xl"
                      style={{ background: "var(--brand-gradient)" }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </BrowserFrame>
            </div>
          </div>

          {/* Final summary stats */}
          <div className="mt-16 rounded-3xl overflow-hidden relative" style={{ background: "var(--brand-gradient)" }}>
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="relative z-10 p-8 sm:p-12 text-center">
              <Award size={36} style={{ color: "var(--brand-accent)" }} className="mx-auto mb-5" />
              <h3 className="font-extrabold text-white leading-tight mb-3"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.03em" }}>
                Hired in <span style={{ color: "var(--brand-accent)" }}>7 days</span>.
              </h3>
              <p className="text-white/65 text-sm leading-relaxed max-w-xl mx-auto mb-8">
                From job posting to signed contract — Manarat Riyadh has a verified High School Math teacher, and Ahmed has his next classroom.
              </p>
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {[
                  { v: "7",  l: "Days" },
                  { v: "23", l: "Applicants" },
                  { v: "92%", l: "Match" },
                ].map((m) => (
                  <div key={m.l} className="rounded-xl bg-white/8 border border-white/10 px-3 py-3">
                    <div className="font-black text-xl text-white leading-none">{m.v}</div>
                    <div className="text-[10px] text-white/40 font-medium uppercase tracking-wider mt-1">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    CLOSING                                                   */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-[#fafbfc] border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: "var(--brand-accent)" }}>
            Every screen above is the live product
          </p>
          <h2 className="font-extrabold text-gray-950 leading-tight mb-6"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", letterSpacing: "-0.04em" }}>
            What you've just seen is what your team will use.
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
            These are not mockups — every form, button, modal, and status above is implemented in the application. Same colors, same flows, same data structures. Ready to test today.
          </p>

          <div className="grid sm:grid-cols-3 gap-px bg-gray-100 rounded-3xl overflow-hidden mb-10">
            {[
              { label: "Pipeline Tracked", val: "Full lifecycle", note: "Submitted → Reviewing → Shortlisted → Interview → Offer → Hired" },
              { label: "Both Sides Connected", val: "Real-time", note: "School actions instantly notify the teacher and vice-versa" },
              { label: "Verified Throughout", val: "100%", note: "Every school and every teacher is verified before they can act" },
            ].map((s, i) => (
              <div key={s.label} className={`p-6 ${i === 1 ? "text-white" : "bg-white"}`}
                style={i === 1 ? { background: "var(--brand-gradient)" } : undefined}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${i === 1 ? "text-white/50" : "text-gray-400"}`}>
                  {s.label}
                </div>
                <div className="font-black leading-none mb-2"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: i === 1 ? "var(--brand-accent)" : "var(--brand-primary)" }}>
                  {s.val}
                </div>
                <div className={`text-xs ${i === 1 ? "text-white/55" : "text-gray-500"}`}>{s.note}</div>
              </div>
            ))}
          </div>

          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 text-sm font-bold text-white px-7 py-3.5 rounded-full"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            Replay from the top <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="text-xs text-gray-400">
            Abjad · End-to-End Hiring Workflow · Live product walkthrough
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Small reusable bits ─── */

function FormBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-800 mb-1.5">{label}</label>
      <div className="px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-xl bg-white flex items-center justify-between">
        {value}
        <ChevronDown size={11} className="text-gray-400" />
      </div>
    </div>
  );
}

function FilterSectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 mb-1">
      {label}
      <ChevronDown size={10} className="text-slate-400" />
    </div>
  );
}

function FilterCheckbox({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <label className="flex items-center gap-2 px-2 py-1.5 rounded-md">
      <div
        className={`w-3.5 h-3.5 rounded shrink-0 flex items-center justify-center ${checked ? "" : "border border-slate-300 bg-white"}`}
        style={checked ? { backgroundColor: "var(--brand-primary)" } : undefined}
      >
        {checked && <CheckCircle2 size={9} className="text-white" />}
      </div>
      <span className="text-[11px] text-slate-600 leading-none truncate">{label}</span>
    </label>
  );
}
