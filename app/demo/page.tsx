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
  CreditCard, ShieldCheck, BarChart3, TrendingUp, UserCheck,
  Receipt, Layers, Download, BadgeCheck, ToggleLeft,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   ABJAD — End-to-End Hiring Workflow Demo
   Every screen mirrors the actual product UI as built today.
   ───────────────────────────────────────────────────────────── */

const PHASES = [
  { num: "01", title: "Post Job",        day: "Day 0", actor: "school",   act: 1 },
  { num: "02", title: "Discover",        day: "Day 1", actor: "teacher",  act: 1 },
  { num: "03", title: "Apply",           day: "Day 1", actor: "teacher",  act: 1 },
  { num: "04", title: "Review",          day: "Day 2", actor: "school",   act: 1 },
  { num: "05", title: "Shortlist",       day: "Day 2", actor: "school",   act: 1 },
  { num: "06", title: "Schedule",        day: "Day 3", actor: "school",   act: 1 },
  { num: "07", title: "Confirm",         day: "Day 3", actor: "teacher",  act: 1 },
  { num: "08", title: "Feedback",        day: "Day 5", actor: "school",   act: 1 },
  { num: "09", title: "Offer",           day: "Day 6", actor: "school",   act: 1 },
  { num: "10", title: "Hire",            day: "Day 7", actor: "both",     act: 1 },
  { num: "11", title: "Subscribe",       day: "Billing", actor: "school", act: 2 },
  { num: "12", title: "Checkout",        day: "Billing", actor: "school", act: 2 },
  { num: "13", title: "Billing Hub",     day: "Billing", actor: "school", act: 2 },
  { num: "14", title: "Queue",           day: "Admin",  actor: "admin",   act: 3 },
  { num: "15", title: "Verify Users",    day: "Admin",  actor: "admin",   act: 3 },
  { num: "16", title: "Analytics",       day: "Admin",  actor: "admin",   act: 3 },
];

/* ── Reusable: Browser frame wrapper ── */
function BrowserFrame({
  url,
  actor,
  children,
}: {
  url: string;
  actor: "school" | "teacher" | "both" | "admin";
  children: React.ReactNode;
}) {
  const actorLabel =
    actor === "school" ? "School Dashboard" :
    actor === "teacher" ? "Teacher Dashboard" :
    actor === "admin" ? "Admin Panel" : "Both Views";
  const Icon = actor === "school" ? Building2 : actor === "teacher" ? GraduationCap : actor === "admin" ? ShieldCheck : Users;
  const actorColor =
    actor === "school" ? "var(--brand-primary)" :
    actor === "teacher" ? "var(--brand-accent)" :
    actor === "admin" ? "#7c3aed" : "#a78bfa";

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
  actor: "school" | "teacher" | "both" | "admin";
  title: string; subtitle: string;
}) {
  const actorLabel =
    actor === "school" ? "School" :
    actor === "teacher" ? "Teacher" :
    actor === "admin" ? "Admin" : "School + Teacher";
  const actorColor =
    actor === "school" ? "var(--brand-primary)" :
    actor === "teacher" ? "var(--brand-accent)" :
    actor === "admin" ? "#7c3aed" : "#a78bfa";

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
          <div className="flex-1 hidden md:flex items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PHASES.map((p, i) => {
              const actColor =
                p.act === 2 ? "#0d9488" :
                p.act === 3 ? "#7c3aed" : "var(--brand-primary)";
              const isActive = activePhase === p.num;
              return (
                <a
                  key={p.num}
                  href={`#phase-${p.num}`}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
                    isActive ? "text-white" : "text-gray-400 hover:text-gray-700"
                  }`}
                  style={isActive ? { backgroundColor: actColor } : undefined}
                  title={p.title}
                >
                  {p.num}
                </a>
              );
            })}
          </div>
          <div className="text-xs font-bold text-gray-500 shrink-0">
            <span style={{ color: "var(--brand-primary)" }}>{activePhase}</span>
            <span className="text-gray-300"> / {PHASES.length}</span>
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
              { val: "7 days",    label: "Post → Hire",       color: "var(--brand-accent)" },
              { val: "16 steps",  label: "Full coverage",     color: "#34d399" },
              { val: "3 journeys", label: "Hire · Bill · Admin", color: "#a78bfa" },
              { val: "Live UI",   label: "Real product",      color: "#fbbf24" },
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 flex-wrap">
            <a
              href="https://abjad-frontend.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              <ExternalLink size={14} /> Open School App
            </a>
            <a
              href="https://abjad-admin.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-sm px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              <ShieldCheck size={14} /> Open Admin Panel
            </a>
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
              3 Journeys · 16 Phases
            </p>
            <h2
              className="font-extrabold text-gray-950 leading-tight max-w-3xl mx-auto"
              style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)", letterSpacing: "-0.03em" }}
            >
              Hire. Subscribe. Administrate. All in one.
            </h2>
          </div>

          {/* Act 1 — Hiring */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full" style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}>Part 1</span>
              <span className="text-sm font-bold text-gray-700">Hiring Journey</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="relative">
              <div className="hidden md:block absolute left-0 right-0 top-[34px] h-px bg-gray-200" />
              <div className="grid grid-cols-5 lg:grid-cols-10 gap-3">
                {PHASES.filter(p => p.act === 1).map((p) => {
                  const color =
                    p.actor === "school" ? "var(--brand-primary)" :
                    p.actor === "teacher" ? "var(--brand-accent)" : "#a78bfa";
                  return (
                    <a key={p.num} href={`#phase-${p.num}`} className="relative flex flex-col items-center text-center group">
                      <div
                        className="w-[60px] h-[60px] rounded-full border-4 border-white bg-white flex items-center justify-center font-black text-sm transition-all group-hover:scale-110 z-10"
                        style={{ boxShadow: `0 0 0 2px ${color}, 0 4px 12px ${color}40`, color }}
                      >
                        {p.num}
                      </div>
                      <div className="mt-2 text-[10px] font-bold text-gray-950 leading-tight">{p.title}</div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Act 2 — Billing */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-teal-50 text-teal-700">Part 2</span>
              <span className="text-sm font-bold text-gray-700">Billing & Subscriptions</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-xs">
              {PHASES.filter(p => p.act === 2).map((p) => (
                <a key={p.num} href={`#phase-${p.num}`} className="flex flex-col items-center text-center group">
                  <div
                    className="w-[60px] h-[60px] rounded-full border-4 border-white bg-white flex items-center justify-center font-black text-sm transition-all group-hover:scale-110"
                    style={{ boxShadow: "0 0 0 2px #0d9488, 0 4px 12px #0d948840", color: "#0d9488" }}
                  >
                    {p.num}
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-gray-950 leading-tight">{p.title}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Act 3 — Admin */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-violet-50 text-violet-700">Part 3</span>
              <span className="text-sm font-bold text-gray-700">Admin Control Center</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-xs">
              {PHASES.filter(p => p.act === 3).map((p) => (
                <a key={p.num} href={`#phase-${p.num}`} className="flex flex-col items-center text-center group">
                  <div
                    className="w-[60px] h-[60px] rounded-full border-4 border-white bg-white flex items-center justify-center font-black text-sm transition-all group-hover:scale-110"
                    style={{ boxShadow: "0 0 0 2px #7c3aed, 0 4px 12px #7c3aed40", color: "#7c3aed" }}
                  >
                    {p.num}
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-gray-950 leading-tight">{p.title}</div>
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-5 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--brand-primary)" }} />
              School action
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--brand-accent)" }} />
              Teacher action
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
              Billing
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
              Admin
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
      {/*    ACT DIVIDER — Billing & Subscriptions                    */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section className="py-20 border-t-4 border-teal-500 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #0d9488 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-black tracking-widest uppercase mb-5">
              <CreditCard size={12} /> Part 2 of 3
            </span>
            <h2 className="font-extrabold text-gray-950 leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}>
              Billing &amp; Subscriptions
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl leading-relaxed">
              Schools purchase a subscription to unlock premium sourcing, candidate access, and verified-teacher rankings — paid via card or bank transfer, with a ZATCA-compliant invoice generated instantly.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 shrink-0">
            {[
              { icon: CreditCard, label: "Choose plan" },
              { icon: CheckCircle2, label: "Pay securely" },
              { icon: Receipt, label: "Billing hub" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 bg-teal-50 border border-teal-100 rounded-2xl px-4 py-5">
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-xs font-bold text-teal-800 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 11 — School Chooses a Plan                        */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-11" data-phase="11" className="py-16 lg:py-24 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="11"
            day="Setup"
            actor="school"
            title="School Chooses a Plan"
            subtitle="Manarat Riyadh opens the Plans page. Three billing durations (Monthly, 6-Month, Annual) are shown with an inline savings badge. Schools with no subscription see a 5-day free trial banner — no card required."
          />

          <BrowserFrame url="/school/billing/plans" actor="school">
            <div className="p-6 bg-[#fafbfc] space-y-5">
              {/* Trial banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-900">Start your 5-day free trial</p>
                  <p className="text-xs text-amber-700 mt-0.5">Try all platform features for free. No card required.</p>
                </div>
                <button className="shrink-0 px-4 py-2 text-sm font-semibold text-white rounded-xl bg-amber-500">
                  Start free trial
                </button>
              </div>

              {/* Duration toggle */}
              <div className="flex justify-center">
                <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm gap-1">
                  {[
                    { label: "Monthly",  savings: null },
                    { label: "6 Months", savings: "−17%" },
                    { label: "Annual",   savings: "−33%" },
                  ].map((t, i) => (
                    <div
                      key={t.label}
                      className={`flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-full transition-all ${
                        i === 2 ? "text-white shadow-sm" : "text-gray-600"
                      }`}
                      style={i === 2 ? { background: "var(--brand-gradient)" } : undefined}
                    >
                      {t.label}
                      {t.savings && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          i === 2 ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                        }`}>{t.savings}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan card */}
              <div className="bg-white rounded-3xl border-2 shadow-sm overflow-hidden" style={{ borderColor: "var(--brand-primary)" }}>
                <div className="flex justify-center py-2" style={{ background: "var(--brand-gradient)" }}>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-white">
                    <Star size={11} fill="currentColor" /> Most Popular
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-6 border-e border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">School Annual</p>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-5xl font-black text-gray-900 tabular-nums">1,083</span>
                      <span className="text-sm font-medium text-gray-500">SAR/month</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">Billed annually as 13,000 SAR · excl. 15% VAT</p>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 mb-5 text-center">
                      <p className="text-sm font-semibold text-emerald-700">💰 Save 3,200 SAR vs monthly</p>
                    </div>
                    <button
                      className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                      style={{ background: "var(--brand-gradient)" }}
                    >
                      <CreditCard size={15} /> Continue to checkout
                    </button>
                    <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> 7-day money-back guarantee</div>
                      <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> ZATCA-compliant invoice</div>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50/50">
                    <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-4">Everything included</p>
                    <ul className="grid grid-cols-2 gap-3">
                      {["Unlimited job postings","Candidate search access","Best Match AI ranking","Bulk CV export","Team seats (5)","Priority support","Analytics dashboard","Verified badge"].map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "var(--brand-primary-light)" }}>
                            <CheckCircle2 size={10} style={{ color: "var(--brand-primary)" }} />
                          </div>
                          <span className="text-xs text-gray-700 leading-snug">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </BrowserFrame>

          <FlowArrow text="School clicks 'Continue to checkout'" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 12 — Checkout & Payment                           */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-12" data-phase="12" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="12"
            day="Setup"
            actor="school"
            title="Secure Checkout"
            subtitle="The checkout form shows the order summary, VAT breakdown, and 5 payment methods (Mada, Visa/Mastercard, AMEX, STC Pay, Bank Transfer). Powered by Moyasar — all PCI-compliant, no card data touches the server."
          />

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Checkout form */}
            <BrowserFrame url="/school/billing/checkout/school_annual" actor="school">
              <div className="p-5 bg-[#fafbfc]">
                {/* Order summary */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</p>
                  <div className="flex items-center justify-between text-sm text-gray-700 mb-1.5">
                    <span>School Annual Plan</span>
                    <span className="font-semibold">13,000.00 SAR</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>VAT (15%)</span>
                    <span>1,950.00 SAR</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-base">14,950.00 SAR</span>
                  </div>
                </div>

                {/* Payment methods */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</p>
                  {[
                    { id: "mada",    label: "Mada",          note: "Saudi debit card",  active: true  },
                    { id: "card",    label: "Visa / MC / AMEX", note: "Credit or debit" },
                    { id: "stc",     label: "STC Pay",        note: "Mobile wallet"     },
                    { id: "bank",    label: "Bank Transfer",  note: "Manual, 1–3 days"  },
                  ].map((m) => (
                    <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${m.active ? "border-[var(--brand-primary)] bg-blue-50/40" : "border-gray-200 bg-white"}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${m.active ? "border-[var(--brand-primary)]" : "border-gray-300"}`}>
                        {m.active && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--brand-primary)" }} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{m.label}</p>
                        <p className="text-xs text-gray-400">{m.note}</p>
                      </div>
                    </label>
                  ))}

                  {/* Card fields */}
                  <div className="mt-2 space-y-2">
                    <div className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 bg-white">Ahmed Al-Rashidi</div>
                    <div className="px-3 py-2 border-2 rounded-xl text-sm font-mono text-gray-700 bg-white" style={{ borderColor: "var(--brand-primary)" }}>
                      4111 1111 1111 1111
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 bg-white">12 / 30</div>
                      <div className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 bg-white">123</div>
                    </div>
                  </div>

                  <button
                    className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    <CreditCard size={14} /> Continue to Payment
                  </button>
                </div>
              </div>
            </BrowserFrame>

            {/* Success screen */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">After payment — success screen</p>
              <BrowserFrame url="/school/billing/success" actor="school">
                <div className="p-8 bg-white flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg" style={{ background: "var(--brand-gradient)" }}>
                    <CheckCircle2 size={38} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Subscription activated!</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-xs">
                    You can now post jobs, search verified teachers, and access all premium features.
                  </p>

                  <div className="w-full bg-gray-50 rounded-2xl border border-gray-100 p-4 mb-5 text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Plan</span>
                      <span className="font-semibold text-gray-800">School Annual</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Amount paid</span>
                      <span className="font-semibold text-gray-800">14,950.00 SAR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Invoice</span>
                      <span className="font-semibold font-mono text-gray-800">INV-2026-00042</span>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full">
                    <button className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700">
                      Manage subscription
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--brand-gradient)" }}>
                      Go to dashboard
                    </button>
                  </div>
                </div>
              </BrowserFrame>
            </div>
          </div>

          <FlowArrow text="Subscription is live — full platform access unlocked" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 13 — Billing Hub                                   */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-13" data-phase="13" className="py-16 lg:py-24 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="13"
            day="Ongoing"
            actor="school"
            title="Billing Hub"
            subtitle="The Billing page shows the active subscription badge, next renewal date, one-click invoice PDF download, and buttons to change or cancel the plan. Schools stay in control of every SAR they spend."
          />

          <BrowserFrame url="/school/billing" actor="school">
            <div className="p-5 space-y-4 bg-[#fafbfc]">
              {/* Subscription card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">ACTIVE</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">School Annual — 1,083 SAR / month</h3>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <RefreshCw size={10} /> Renews in 365 days
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600">Change plan</button>
                    <button className="px-3 py-1.5 text-xs font-semibold border border-red-100 rounded-lg text-red-600">Cancel</button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: "Billed",    value: "Annually" },
                    { label: "Amount",    value: "14,950 SAR" },
                    { label: "Next due",  value: "Jun 2027" },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                      <div className="text-sm font-bold text-gray-800">{s.value}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoices */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" /> Invoices
                </h4>
                <div className="space-y-2">
                  {[
                    { num: "INV-2026-00042", date: "Jun 24, 2026", amount: "14,950.00 SAR", status: "PAID"    },
                    { num: "INV-2026-00029", date: "May 10, 2026", amount: "14,950.00 SAR", status: "PAID"    },
                    { num: "INV-2026-00018", date: "Apr 02, 2026", amount: "14,950.00 SAR", status: "PAID"    },
                  ].map((inv) => (
                    <div key={inv.num} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-50 bg-gray-50/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <Receipt size={14} className="text-gray-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-700 font-mono">{inv.num}</p>
                          <p className="text-[10px] text-gray-400">{inv.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-semibold text-gray-700">{inv.amount}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{inv.status}</span>
                        <button className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700">
                          <Download size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BrowserFrame>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    ACT DIVIDER — Admin Control Center                      */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section className="py-20 border-t-4 border-violet-600 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-black tracking-widest uppercase mb-5">
              <ShieldCheck size={12} /> Part 3 of 3
            </span>
            <h2 className="font-extrabold text-gray-950 leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}>
              Admin Control Center
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl leading-relaxed mb-6">
              The Abjad team manages everything from a dedicated admin panel — approving users, monitoring the platform, managing billing, and resolving support tickets — all in one unified interface.
            </p>
            <a
              href="https://abjad-admin.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-violet-600 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-violet-700 transition-colors"
            >
              <ExternalLink size={14} /> Open Live Admin Panel
            </a>
          </div>
          <div className="grid grid-cols-3 gap-3 shrink-0">
            {[
              { icon: Layers,      label: "Mission Control" },
              { icon: UserCheck,   label: "Verify Users"    },
              { icon: BarChart3,   label: "Analytics"       },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 bg-violet-50 border border-violet-100 rounded-2xl px-4 py-5">
                <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-xs font-bold text-violet-800 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 14 — Mission Control / Approval Queue             */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-14" data-phase="14" className="py-16 lg:py-24 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="14"
            day="Admin"
            actor="admin"
            title="Mission Control — Approval Queue"
            subtitle="Every pending teacher, school, and bank-transfer invoice lands in the unified Mission Control inbox. Items are priority-scored automatically — urgent items float to the top. Admins claim an item to own it."
          />

          <BrowserFrame url="/queue" actor="admin">
            <div className="flex h-[600px] bg-[#0f0f1a] overflow-hidden">
              {/* Sidebar */}
              <aside className="w-52 shrink-0 border-r border-white/5 bg-[#0f0f1a] flex flex-col">
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
                      <ShieldCheck size={14} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-white">Abjad Admin</span>
                  </div>
                </div>
                <nav className="p-2 space-y-0.5 flex-1">
                  {[
                    { label: "Mission Control", count: 8,  active: true  },
                    { label: "Teachers",         count: 24, active: false },
                    { label: "Schools",          count: 11, active: false },
                    { label: "Billing",          count: 3,  active: false },
                    { label: "Support Tickets",  count: 5,  active: false },
                    { label: "Analytics",        count: 0,  active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                        item.active ? "bg-violet-600 text-white" : "text-white/50 hover:text-white/80"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.count > 0 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.active ? "bg-white/20 text-white" : "bg-white/10 text-white/60"}`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  ))}
                </nav>
              </aside>

              {/* Queue */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                <div className="shrink-0 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h1 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Layers size={14} className="text-violet-600" /> Mission Control
                    </h1>
                    <p className="text-xs text-gray-400 mt-0.5">8 items need attention · Priority order</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600 flex items-center gap-1.5">
                      <Filter size={11} /> Filter
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {[
                    { type: "Teacher",  name: "Fatima Al-Zahra",       action: "Pending Approval",   priority: "HIGH",   age: "2h ago",  tag: "bg-red-100 text-red-700"     },
                    { type: "School",   name: "Dar Al-Ulum Academy",   action: "Pending Verification", priority: "HIGH", age: "3h ago",  tag: "bg-red-100 text-red-700"     },
                    { type: "Invoice",  name: "INV-2026-00041",        action: "Bank Transfer — Verify", priority: "MED", age: "5h ago", tag: "bg-amber-100 text-amber-700" },
                    { type: "Teacher",  name: "Khaled Al-Mutairi",     action: "Pending Approval",   priority: "MED",    age: "6h ago",  tag: "bg-amber-100 text-amber-700" },
                    { type: "School",   name: "Al-Noor International", action: "Pending Verification", priority: "LOW",  age: "1d ago",  tag: "bg-gray-100 text-gray-600"   },
                  ].map((item, i) => (
                    <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs"
                        style={{ backgroundColor: item.type === "Teacher" ? "var(--brand-accent)" : item.type === "School" ? "var(--brand-primary)" : "#0d9488" }}>
                        {item.type[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-gray-400">{item.type}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.tag}`}>{item.priority}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.action} · {item.age}</p>
                      </div>
                      <button className="shrink-0 px-3 py-1.5 text-xs font-bold text-violet-700 border border-violet-200 rounded-lg bg-violet-50 hover:bg-violet-100">
                        Claim
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BrowserFrame>

          <FlowArrow text="Admin claims item → opens full detail panel" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 15 — User Verification                            */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-15" data-phase="15" className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="15"
            day="Admin"
            actor="admin"
            title="User Verification"
            subtitle="Admins review a teacher's complete profile — documents, certifications, employment history — and either approve or reject with a typed reason. Every action is audit-logged with timestamp and admin ID."
          />

          <BrowserFrame url="/users/teachers/detail" actor="admin">
            <div className="flex h-[600px] bg-white overflow-hidden">
              {/* Profile left */}
              <div className="w-72 shrink-0 border-r border-gray-100 p-5 flex flex-col gap-4 overflow-y-auto">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xl mb-3" style={{ background: "var(--brand-gradient)" }}>FA</div>
                  <h2 className="text-sm font-bold text-gray-900">Fatima Al-Zahra</h2>
                  <p className="text-xs text-gray-400">fatima.alzahra@email.com</p>
                </div>

                <div className="space-y-2">
                  {[
                    { l: "Subject",     v: "Mathematics" },
                    { l: "Grades",      v: "High (10–12)" },
                    { l: "City",        v: "Riyadh" },
                    { l: "Experience",  v: "7 years" },
                    { l: "Degree",      v: "Master's in Math" },
                    { l: "Nationality", v: "Saudi" },
                  ].map((r) => (
                    <div key={r.l} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{r.l}</span>
                      <span className="font-semibold text-gray-700">{r.v}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Documents</p>
                  {[
                    { name: "National ID", status: "ok" },
                    { name: "Degree Certificate", status: "ok" },
                    { name: "Experience Letter", status: "ok" },
                    { name: "CV (PDF)", status: "ok" },
                  ].map((d) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                      <span className="text-gray-700 flex-1">{d.name}</span>
                      <span className="text-gray-400">View</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action panel */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="shrink-0 flex border-b border-gray-100">
                  {["Profile", "Documents", "History", "Audit Log"].map((t, i) => (
                    <button key={t} className={`px-4 py-3 text-xs font-semibold border-b-2 ${i === 0 ? "border-violet-600 text-violet-700" : "border-transparent text-gray-400"}`}>
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle size={14} className="text-amber-600" />
                      <span className="text-sm font-bold text-amber-800">Pending Approval</span>
                    </div>
                    <p className="text-xs text-amber-700">Submitted 2h ago. All 4 documents uploaded. Match score: 92%.</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Strength</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: "88%" }} />
                      </div>
                      <span className="text-sm font-bold text-emerald-600 shrink-0">88%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Experience</p>
                    {[
                      { school: "King Abdulaziz School", years: "2020–2024", subject: "Math" },
                      { school: "Riyadh Model School",   years: "2017–2020", subject: "Math & Physics" },
                    ].map((e) => (
                      <div key={e.school} className="bg-gray-50 rounded-xl p-3 text-xs">
                        <p className="font-semibold text-gray-800">{e.school}</p>
                        <p className="text-gray-400">{e.years} · {e.subject}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action footer */}
                <div className="shrink-0 p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                  <textarea
                    readOnly
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white resize-none"
                    rows={2}
                    placeholder="Rejection reason (required when rejecting)…"
                  />
                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50">
                      Reject
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                      <BadgeCheck size={13} /> Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </BrowserFrame>

          <FlowArrow text="Teacher is approved — profile goes live for schools to discover" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════ */}
      {/*    PHASE 16 — Analytics & Billing Admin                    */}
      {/* ═════════════════════════════════════════════════════════ */}
      <section id="phase-16" data-phase="16" className="py-16 lg:py-24 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <PhaseHeader
            num="16"
            day="Admin"
            actor="admin"
            title="Analytics & Billing Admin"
            subtitle="The admin dashboard gives the Abjad team a live view of platform health — registrations, revenue, conversion rates, and subscription breakdowns — plus full billing controls to manage invoices, trigger refunds, and audit payment history."
          />

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Dashboard stats */}
            <BrowserFrame url="/dashboard" actor="admin">
              <div className="p-5 bg-[#0f0f1a] text-white">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 size={14} className="text-violet-400" /> Platform Overview
                  </h2>
                  <span className="text-[10px] text-white/40">Last 30 days</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { l: "Total Teachers",    v: "1,842",   d: "+124 this month",  color: "var(--brand-accent)"  },
                    { l: "Total Schools",     v: "263",     d: "+18 this month",   color: "var(--brand-primary)" },
                    { l: "Revenue (SAR)",     v: "482,000", d: "+23% vs last mo",  color: "#34d399"              },
                    { l: "Active Subs",       v: "198",     d: "12 in trial",      color: "#a78bfa"              },
                  ].map((s) => (
                    <div key={s.l} className="bg-white/5 border border-white/8 rounded-2xl p-4">
                      <div className="font-black text-xl mb-0.5" style={{ color: s.color }}>{s.v}</div>
                      <div className="text-[10px] font-semibold text-white/60">{s.l}</div>
                      <div className="text-[9px] text-white/35 mt-1">{s.d}</div>
                    </div>
                  ))}
                </div>

                {/* Conversion funnel */}
                <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">Hiring Funnel</p>
                  {[
                    { label: "Applications",  count: 1247, pct: 100 },
                    { label: "Shortlisted",   count: 389,  pct: 31  },
                    { label: "Interviewed",   count: 214,  pct: 17  },
                    { label: "Offers Sent",   count: 108,  pct: 9   },
                    { label: "Hired",         count: 87,   pct: 7   },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] text-white/50 w-20 shrink-0">{f.label}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${f.pct}%`, backgroundColor: "var(--brand-primary)" }} />
                      </div>
                      <span className="text-[10px] font-bold text-white/70 w-8 text-right">{f.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </BrowserFrame>

            {/* Billing admin */}
            <BrowserFrame url="/billing" actor="admin">
              <div className="p-5 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard size={14} className="text-violet-600" /> Billing Admin
                  </h2>
                  <div className="flex gap-2">
                    <button className="px-2.5 py-1.5 text-[10px] font-bold border border-gray-200 rounded-lg text-gray-600">Export CSV</button>
                  </div>
                </div>

                {/* Revenue summary */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "MRR",       v: "40,167 SAR", color: "text-emerald-700", bg: "bg-emerald-50" },
                    { l: "ARR",       v: "482k SAR",   color: "text-blue-700",    bg: "bg-blue-50"    },
                    { l: "Unpaid",    v: "3 invoices", color: "text-amber-700",   bg: "bg-amber-50"   },
                  ].map((s) => (
                    <div key={s.l} className={`rounded-xl p-3 ${s.bg}`}>
                      <div className={`text-sm font-black ${s.color}`}>{s.v}</div>
                      <div className={`text-[10px] font-semibold ${s.color} opacity-70`}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {/* Recent subscriptions */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recent Subscriptions</p>
                  {[
                    { school: "Manarat Riyadh",    plan: "School Annual",  amount: "14,950",  status: "active" },
                    { school: "Al-Noor Academy",   plan: "School 6-Month", amount: "9,430",   status: "active" },
                    { school: "Future School",     plan: "School Monthly", amount: "1,840",   status: "trialing" },
                    { school: "Dar Al-Ulum",       plan: "School Annual",  amount: "14,950",  status: "pending" },
                  ].map((s) => (
                    <div key={s.school} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-50 bg-gray-50/50">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shrink-0" style={{ background: "var(--brand-gradient)" }}>
                        {s.school[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{s.school}</p>
                        <p className="text-[10px] text-gray-400">{s.plan}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-gray-700">{s.amount} SAR</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          s.status === "active" ? "bg-emerald-100 text-emerald-700" :
                          s.status === "trialing" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                        }`}>{s.status.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <button className="flex-1 py-2 text-xs font-semibold border border-violet-200 rounded-lg text-violet-700 bg-violet-50">
                    View all subscriptions
                  </button>
                  <button className="flex-1 py-2 text-xs font-semibold border border-gray-200 rounded-lg text-gray-600">
                    Invoice ledger
                  </button>
                </div>
              </div>
            </BrowserFrame>
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="https://abjad-frontend.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              <ExternalLink size={15} /> Open School App — Try it live
            </a>
            <a
              href="https://abjad-admin.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-white px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-700 transition-colors shadow-lg"
            >
              <ShieldCheck size={15} /> Open Admin Panel
            </a>
          </div>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Replay from the top <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            Abjad · Hiring · Billing · Admin · Full product walkthrough
          </p>
          <div className="flex items-center gap-4">
            <a href="https://abjad-frontend.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors">
              <ExternalLink size={11} /> School App
            </a>
            <a href="https://abjad-admin.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="text-xs font-bold text-violet-500 hover:text-violet-800 flex items-center gap-1 transition-colors">
              <ShieldCheck size={11} /> Admin Panel
            </a>
          </div>
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
