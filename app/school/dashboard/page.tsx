"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Calendar,
  UserCheck,
  AlertCircle,
  ChevronRight,
  Loader2,
  Video,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Users,
  Gift,
  CheckCircle2,
  CircleDot,
  Plus,
  BarChart2,
} from "lucide-react";
import { TrialBanner } from "@/components/billing/TrialBanner";
import { getSchoolDashboard } from "@/lib/api/school";
import type {
  DashboardData,
  SchoolApplication,
  SchoolInterview,
  SchoolOffer,
} from "@/lib/api/school";
import { useAuth } from "@/lib/auth/useAuth";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(isoStr: string): string {
  const secs = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (secs < 60)    return "just now";
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 172800) return "Yesterday";
  return `${Math.floor(secs / 86400)}d ago`;
}

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
}

function formatTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function formatDeadline(isoStr: string): string {
  const d = new Date(isoStr);
  const now = new Date();
  const days = Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
  if (days < 0)  return "Expired";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days}d left`;
}

function candidateName(
  teacherId: SchoolApplication["teacherId"]
): string {
  if (typeof teacherId === "object" && teacherId.name) return teacherId.name;
  return "Candidate";
}

function jobTitle(
  jobId: SchoolApplication["jobId"] | SchoolInterview["jobId"] | SchoolOffer["jobId"]
): string {
  if (typeof jobId === "object" && "title" in jobId) return jobId.title;
  return "Position";
}

function interviewCandidateName(teacherId: SchoolInterview["teacherId"]): string {
  if (typeof teacherId === "object" && "name" in teacherId && teacherId.name) return teacherId.name;
  return "Candidate";
}

function offerCandidateName(teacherId: SchoolOffer["teacherId"]): string {
  if (typeof teacherId === "object" && "name" in teacherId && teacherId.name) return teacherId.name;
  return "Candidate";
}

function ApplicationStatusBadge({ status }: { status: SchoolApplication["status"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    submitted:           { label: "Submitted",  cls: "bg-gray-100 text-gray-600" },
    reviewing:           { label: "Reviewing",  cls: "bg-blue-100 text-blue-700" },
    shortlisted:         { label: "Shortlisted",cls: "bg-green-100 text-green-700" },
    interview_scheduled: { label: "Interview",  cls: "bg-purple-100 text-purple-700" },
    offer_extended:      { label: "Offer Sent", cls: "bg-teal-100 text-teal-700" },
    hired:               { label: "Hired",      cls: "bg-emerald-100 text-emerald-700" },
    rejected:            { label: "Rejected",   cls: "bg-red-100 text-red-600" },
    withdrawn:           { label: "Withdrawn",  cls: "bg-gray-100 text-gray-400" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

function InterviewStatusBadge({ status }: { status: SchoolInterview["status"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:    { label: "Pending",    cls: "bg-amber-100 text-amber-700" },
    accepted:   { label: "Confirmed",  cls: "bg-green-100 text-green-700" },
    declined:   { label: "Declined",   cls: "bg-red-100 text-red-600" },
    rescheduled:{ label: "Rescheduled",cls: "bg-blue-100 text-blue-700" },
    completed:  { label: "Completed",  cls: "bg-gray-100 text-gray-500" },
    cancelled:  { label: "Cancelled",  cls: "bg-gray-100 text-gray-400" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

function OfferStatusBadge({ status }: { status: SchoolOffer["status"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    sent:        { label: "Sent",        cls: "bg-blue-100 text-blue-700" },
    viewed:      { label: "Viewed",      cls: "bg-indigo-100 text-indigo-700" },
    accepted:    { label: "Accepted",    cls: "bg-emerald-100 text-emerald-700" },
    declined:    { label: "Declined",    cls: "bg-red-100 text-red-600" },
    negotiating: { label: "Negotiating", cls: "bg-amber-100 text-amber-700" },
    expired:     { label: "Expired",     cls: "bg-gray-100 text-gray-400" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

function MatchScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 90 ? "bg-green-100 text-green-700" :
    score >= 75 ? "bg-blue-100 text-blue-700"   :
    "bg-gray-100 text-gray-500";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {score}%
    </span>
  );
}

function InterviewTypeIcon({ type }: { type: SchoolInterview["type"] }) {
  if (type === "video")   return <Video  size={13} className="text-blue-500" />;
  if (type === "phone")   return <Phone  size={13} className="text-green-500" />;
  if (type === "in_person") return <MapPin size={13} className="text-purple-500" />;
  return <Calendar size={13} className="text-teal-500" />;
}

// ─── Hiring Funnel Bar ────────────────────────────────────────────────────────

const FUNNEL_STEPS: { key: keyof DashboardData["hiringFunnel"]; label: string; color: string }[] = [
  { key: "total",       label: "Submitted",    color: "#6b7280" },
  { key: "reviewing",   label: "Reviewing",    color: "#3b82f6" },
  { key: "shortlisted", label: "Shortlisted",  color: "#8b5cf6" },
  { key: "interviewed", label: "Interviewed",  color: "#f59e0b" },
  { key: "offered",     label: "Offered",      color: "#14b8a6" },
  { key: "hired",       label: "Hired",        color: "#10b981" },
];

function HiringFunnel({ funnel }: { funnel: DashboardData["hiringFunnel"] }) {
  const maxVal = funnel.total || 1;
  return (
    <div className="space-y-2.5">
      {FUNNEL_STEPS.map(({ key, label, color }) => {
        const val = funnel[key] ?? 0;
        const pct = Math.round((val / maxVal) * 100);
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-20 shrink-0 text-right">{label}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${Math.max(pct, val > 0 ? 4 : 0)}%`, backgroundColor: color }}
              />
              <span className="absolute inset-0 flex items-center px-2 text-xs font-semibold text-gray-700">
                {val}
              </span>
            </div>
            <span className="text-xs text-gray-400 w-8 shrink-0">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchoolDashboardPage() {
  const { user } = useAuth();
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    getSchoolDashboard()
      .then(setData)
      .catch((err) => setError(err?.message ?? "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 size={26} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={() => { setError(null); setLoading(true); getSchoolDashboard().then(setData).catch((e) => setError(e?.message ?? "Error")).finally(() => setLoading(false)); }}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: "var(--brand-gradient)" }}
        >
          Retry
        </button>
      </div>
    );
  }

  const schoolDisplayName =
    data?.profile.nameEn ?? data?.profile.nameAr ?? user?.schoolName ?? "School";
  const completion     = data?.profile.completionPercentage ?? 0;
  const profileStatus  = data?.profile.status ?? "draft";
  const isVerified     = profileStatus === "verified";
  const isPendingVerif = profileStatus === "pending";
  const funnel      = data?.hiringFunnel ?? { total: 0, reviewing: 0, shortlisted: 0, interviewed: 0, offered: 0, hired: 0 };
  const jobsByStatus = data?.jobs.byStatus ?? {};
  const recentApps  = (data?.applications.recent ?? []).slice(0, 5);
  const upcoming    = (data?.upcomingInterviews ?? []).slice(0, 3);
  const offers      = data?.activeOffers ?? [];

  // Derive "this month" app count from byStatus total
  const totalAppsThisMonth = Object.values(data?.applications.byStatus ?? {}).reduce((a, b) => a + b, 0);

  const statCards = [
    {
      label: "Active Jobs",
      value: data?.jobs.active ?? 0,
      icon: Briefcase,
      iconCls: "bg-blue-50 text-blue-600",
      sub: `${data?.jobs.total ?? 0} total`,
      href: "/school/jobs",
    },
    {
      label: "Applications",
      value: totalAppsThisMonth,
      icon: FileText,
      iconCls: "bg-indigo-50 text-indigo-600",
      sub: "this month",
      href: "/school/applications",
    },
    {
      label: "Interviews This Week",
      value: upcoming.length,
      icon: Calendar,
      iconCls: "bg-purple-50 text-purple-600",
      sub: "upcoming",
      href: "/school/interviews",
    },
    {
      label: "Hired This Month",
      value: funnel.hired,
      icon: UserCheck,
      iconCls: "bg-emerald-50 text-emerald-600",
      sub: "confirmed hires",
      href: "/school/offers",
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">

      {/* ── Trial / subscription banner — hidden when paid ───────────── */}
      <TrialBanner audience="school" plansHref="/school/billing/plans" />

      {/* ── Welcome header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back, {schoolDisplayName}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here&apos;s your hiring overview for today
          </p>
        </div>
        <Link
          href="/school/jobs/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors shrink-0"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Plus size={15} />
          Post a Job
        </Link>
      </div>

      {/* ── Profile completion alert ─────────────────────────────────── */}
      {completion < 60 && (
        <div className="bg-white rounded-2xl border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertCircle size={16} className="text-amber-500" />
              <p className="text-sm font-semibold text-gray-900">
                Complete your school profile to attract top teachers
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Verified schools with complete profiles receive{" "}
              <span className="font-medium text-gray-700">4x more applications</span>.
              You&apos;re {completion}% complete.
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${completion}%`, background: "var(--brand-gradient)" }}
              />
            </div>
          </div>
          <Link
            href="/school/profile"
            className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* ── Verification nudge — non-blocking ───────────────────────── */}
      {!isVerified && !isPendingVerif && completion >= 60 && (
        <div className="bg-white rounded-2xl border border-teal-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Get your school verified</p>
              <p className="text-xs text-gray-500 mt-0.5">
                A <span className="text-teal-600 font-medium">Verified by Abjad</span> badge builds trust with teachers — you can post jobs freely while we verify.
              </p>
            </div>
          </div>
          <Link
            href="/school/profile"
            className="shrink-0 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Submit for Verification
          </Link>
        </div>
      )}

      {isPendingVerif && (
        <div className="bg-white rounded-2xl border border-amber-100 p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Loader2 size={16} className="text-amber-500 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Verification in progress</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Our team is reviewing your school profile. You can continue posting jobs and receiving applications in the meantime.
            </p>
          </div>
        </div>
      )}

      {/* ── Stat cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {statCards.map(({ label, value, icon: Icon, iconCls, sub, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm hover:border-gray-200 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconCls} mb-3`}>
              <Icon size={18} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-600 mt-0.5">{label}</div>
            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              {sub}
              <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main 2-column grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left col: Funnel + Recent Applications + Active Offers */}
        <div className="xl:col-span-2 space-y-5">

          {/* Hiring Funnel */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
              <div>
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart2 size={16} className="text-indigo-500" />
                  Hiring Funnel
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">All-time pipeline breakdown</p>
              </div>
              <Link
                href="/school/applications"
                className="text-xs font-medium hover:underline flex items-center gap-1"
                style={{ color: "var(--brand-primary)" }}
              >
                View All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="p-5">
              <HiringFunnel funnel={funnel} />
            </div>
          </div>

          {/* Jobs by Status summary */}
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { key: "active",  label: "Active",  cls: "bg-green-50  border-green-100  text-green-700",  dot: "bg-green-400"  },
                { key: "draft",   label: "Draft",   cls: "bg-gray-50   border-gray-100   text-gray-500",   dot: "bg-gray-300"   },
                { key: "closed",  label: "Closed",  cls: "bg-slate-50  border-slate-100  text-slate-500",  dot: "bg-slate-300"  },
              ] as const
            ).map(({ key, label, cls, dot }) => (
              <Link
                key={key}
                href={`/school/jobs?status=${key}`}
                className={`rounded-2xl border p-4 hover:shadow-sm transition-all ${cls}`}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <span className="text-xs font-medium">{label} Jobs</span>
                </div>
                <p className="text-2xl font-bold">{jobsByStatus[key] ?? 0}</p>
              </Link>
            ))}
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                Recent Applications
              </h2>
              <Link
                href="/school/applications"
                className="text-xs font-medium hover:underline flex items-center gap-1"
                style={{ color: "var(--brand-primary)" }}
              >
                All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentApps.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">
                  No applications yet. Post a job to start receiving applications.
                </p>
              ) : (
                recentApps.map((app) => (
                  <div
                    key={app._id}
                    className="px-5 py-4 hover:bg-gray-50/50 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {candidateName(app.teacherId)}
                          </span>
                          {app.matchScore != null && (
                            <MatchScoreBadge score={app.matchScore} />
                          )}
                          {!app.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {jobTitle(app.jobId)}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        <ApplicationStatusBadge status={app.status} />
                        <span className="text-xs text-gray-400">{timeAgo(app.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Offers */}
          {offers.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Gift size={16} className="text-teal-500" />
                  Active Offers
                </h2>
                <Link
                  href="/school/offers"
                  className="text-xs font-medium hover:underline flex items-center gap-1"
                  style={{ color: "var(--brand-primary)" }}
                >
                  All <ChevronRight size={13} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {offers.map((offer) => {
                  const deadlineLabel = formatDeadline(offer.deadline);
                  const deadlineUrgent =
                    !["Expired"].includes(deadlineLabel) &&
                    parseInt(deadlineLabel) <= 2;
                  return (
                    <div
                      key={offer._id}
                      className="px-5 py-4 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {offer.position}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">
                              {offerCandidateName(offer.teacherId)}
                            </span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs font-medium text-gray-700">
                              SAR {offer.salary.toLocaleString()}/mo
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1.5">
                          <OfferStatusBadge status={offer.status} />
                          <span
                            className={`text-xs font-medium ${
                              deadlineUrgent || deadlineLabel === "Expired"
                                ? "text-red-500"
                                : "text-gray-400"
                            }`}
                          >
                            {deadlineLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right col: Upcoming Interviews + Quick Actions */}
        <div className="space-y-5">

          {/* Upcoming Interviews */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar size={16} className="text-purple-500" />
                Upcoming Interviews
              </h2>
              <Link
                href="/school/interviews"
                className="text-xs font-medium hover:underline flex items-center gap-1"
                style={{ color: "var(--brand-primary)" }}
              >
                All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  No upcoming interviews scheduled
                </p>
              ) : (
                upcoming.map((interview) => (
                  <div
                    key={interview._id}
                    className="rounded-xl border border-gray-100 p-3.5 hover:border-purple-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <InterviewTypeIcon type={interview.type} />
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {interviewCandidateName(interview.teacherId)}
                        </p>
                      </div>
                      <InterviewStatusBadge status={interview.status} />
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-2">
                      {jobTitle(interview.jobId)}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5">
                      <Clock size={11} className="shrink-0" style={{ color: "var(--brand-primary)" }} />
                      <span>{formatDate(interview.scheduledAt)}</span>
                      <span className="text-gray-300">·</span>
                      <span>{formatTime(interview.scheduledAt)}</span>
                      <span className="ml-auto capitalize text-xs font-medium text-gray-600">
                        {interview.type.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Post Job",         icon: Plus,        href: "/school/jobs/new",        iconCls: "bg-blue-50 text-blue-600" },
                { label: "Search Teachers",  icon: Users,       href: "/school/candidates",      iconCls: "bg-indigo-50 text-indigo-600" },
                { label: "View Pipeline",    icon: TrendingUp,  href: "/school/applications",    iconCls: "bg-green-50 text-green-600" },
                { label: "Edit Profile",     icon: CircleDot,   href: "/school/profile",         iconCls: "bg-purple-50 text-purple-600" },
              ].map(({ label, icon: Icon, href, iconCls }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all text-center"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconCls}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Pipeline Health */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-500" />
                Pipeline Health
              </h2>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Unreviewed",  value: data?.applications.byStatus?.submitted  ?? 0, cls: "bg-gray-400",   href: "/school/applications?status=submitted" },
                { label: "Shortlisted", value: data?.applications.byStatus?.shortlisted ?? 0, cls: "bg-purple-500", href: "/school/applications?status=shortlisted" },
                { label: "Offers Out",  value: data?.applications.byStatus?.offer_extended ?? 0, cls: "bg-teal-500", href: "/school/offers" },
              ].map(({ label, value, cls, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-1 py-0.5 transition-colors group"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${cls}`} />
                  <span className="text-xs text-gray-600 flex-1">{label}</span>
                  <span className="text-sm font-bold text-gray-900">{value}</span>
                  <ChevronRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
