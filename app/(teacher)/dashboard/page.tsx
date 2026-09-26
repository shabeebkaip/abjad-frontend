"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Calendar,
  Briefcase,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building2,
  ChevronRight,
  ChevronLeft,
  Star,
  Bell,
  ArrowUpRight,
  User,
  BookOpen,
  Award,
  Upload,
  Search,
  Loader2,
} from "lucide-react";
import { getDashboard } from "@/lib/api/teacher";
import type { DashboardData, Job, Interview, Notification, ActivityEntry } from "@/lib/api/teacher";
import { useAuth } from "@/lib/auth/useAuth";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatCurrency, formatNumber, formatDate, formatTime, type Locale } from "@/lib/i18n/format";
import { TrialBanner } from "@/components/billing/TrialBanner";
import { PasswordPromptBanner } from "@/components/auth/PasswordPromptBanner";

// ─── Types ────────────────────────────────────────────────────────────────────

type DashboardTT = ReturnType<typeof useTranslation>["t"]["teacher"]["dashboard"];
type NotifTT = ReturnType<typeof useTranslation>["t"]["teacher"]["notifications"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MatchBadge({ score, label }: { score: number; label: string }) {
  const color =
    score >= 90 ? "bg-green-100 text-green-700" :
    score >= 75 ? "bg-blue-100 text-blue-700" :
    "bg-gray-100 text-gray-600";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {label}
    </span>
  );
}

// SRD 5.1.1 — "Why this match" criteria breakdown. Surfaces any criterion
// scoring 70+ as a small chip ("Subject", "City", "Experience" etc.) so the
// teacher can see WHY a job was recommended.
function WhyThisMatch({ breakdown, tt }: {
  breakdown?: {
    subjects: number; gradeLevels: number; experience: number;
    location: number; language: number; qualifications: number;
  };
  tt: DashboardTT;
}) {
  if (!breakdown) return null;
  const criterionLabels: Record<string, string> = {
    subjects:       tt.criterionSubject,
    gradeLevels:    tt.criterionGrade,
    experience:     tt.criterionExperience,
    location:       tt.criterionCity,
    language:       tt.criterionLanguage,
    qualifications: tt.criterionQualifications,
  };
  const strong = Object.entries(breakdown)
    .filter(([, v]) => v >= 70)
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => k);

  if (strong.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{tt.why}</span>
      {strong.map((k) => (
        <span
          key={k}
          className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700"
        >
          <CheckCircle2 size={9} />
          {criterionLabels[k] ?? k}
        </span>
      ))}
    </div>
  );
}

// SRD 2.10.3 — Activity Feed (recent applications/interviews/offers/profile updates)
const ACTIVITY_ICON: Record<ActivityEntry["type"], { Icon: React.ElementType; cls: string }> = {
  application_submitted: { Icon: Upload,       cls: "text-blue-500    bg-blue-50" },
  application_status:    { Icon: TrendingUp,   cls: "text-violet-500  bg-violet-50" },
  interview_scheduled:   { Icon: Calendar,     cls: "text-amber-500   bg-amber-50" },
  interview_response:    { Icon: CheckCircle2, cls: "text-emerald-500 bg-emerald-50" },
  offer_received:        { Icon: Award,        cls: "text-pink-500    bg-pink-50" },
  offer_response:        { Icon: CheckCircle2, cls: "text-emerald-500 bg-emerald-50" },
  profile_update:        { Icon: User,         cls: "text-slate-500   bg-slate-100" },
};

function ActivityFeed({ entries, tt, relativeTime }: {
  entries: ActivityEntry[];
  tt: DashboardTT;
  relativeTime: (iso: string) => string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Clock size={16} className="text-slate-500" />
          {tt.recentActivity}
        </h2>
      </div>
      <div className="p-4">
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-2">
              <Clock size={16} className="text-slate-300" />
            </div>
            <p className="text-sm text-gray-500">{tt.noActivityTitle}</p>
            <p className="text-xs text-gray-400 mt-0.5">{tt.noActivityBody}</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {entries.map((e, i) => {
              const { Icon, cls } = ACTIVITY_ICON[e.type];
              const row = (
                <div className="flex items-start gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cls}`}>
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-800 leading-snug truncate">{e.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{relativeTime(e.timestamp)}</p>
                  </div>
                </div>
              );
              return (
                <li key={i}>
                  {e.link ? (
                    <Link href={e.link} className="block">{row}</Link>
                  ) : row}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatSalary(job: Job, tt: DashboardTT, lang: Locale): React.ReactNode {
  if (job.salary.display === "negotiable") return tt.salaryNegotiable;
  if (job.salary.display === "hide") return tt.salaryUndisclosed;
  if (job.salary.min && job.salary.max) {
    return `SAR ${formatNumber(job.salary.min, lang)}–${formatNumber(job.salary.max, lang)}`;
  }
  return tt.salaryOnRequest;
}

function daysAgo(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

function postedLabel(dateStr: string, tt: DashboardTT): string {
  const d = daysAgo(dateStr);
  if (d === 0) return tt.postedToday;
  if (d === 1) return tt.postedOneDayAgo;
  return tt.postedDaysAgo.replace("{n}", String(d));
}

// School display name shared by the offer + interview rows below. Falls back
// to a translated placeholder when the API hasn't populated the school ref.
function schoolName(schoolId: Interview["schoolId"], fallback: string): string {
  if (typeof schoolId === "object" && schoolId.name) return schoolId.name;
  return fallback;
}

function notifIcon(type: Notification["type"]) {
  const map: Record<string, typeof Bell> = {
    application_status: CheckCircle2,
    offer_received:     Award,
    job_match:          Briefcase,
  };
  return map[type] ?? Bell;
}

function notifIconColor(type: Notification["type"]): string {
  const map: Record<string, string> = {
    application_status: "bg-green-100 text-green-600",
    offer_received:     "bg-purple-100 text-purple-600",
    job_match:          "bg-blue-100 text-blue-600",
  };
  return map[type] ?? "bg-gray-100 text-gray-600";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, lang, isRTL } = useTranslation();
  const tt = t.teacher.dashboard;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  const profile = data?.profile;
  const appStats = data?.applications.stats;
  const profileCompleteness = profile?.completionPercentage ?? 0;
  const suggestions = profile?.suggestions ?? [];
  const profileStatus = profile?.profileStatus ?? "draft";
  const isVerified = profileStatus === "approved";
  const isPendingVerification = profileStatus === "pending";

  // Shared relative-time formatter for the activity feed + notifications list.
  // Reuses the existing notifications-namespace strings (minAgo/hoursAgo/
  // yesterday) plus this namespace's postedDaysAgo, then falls back to a full
  // localized date beyond a week — no new i18n keys needed.
  const relativeTime = (iso: string): string => {
    const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    const notifTT: NotifTT = t.teacher.notifications;
    if (secs < 3600) return notifTT.minAgo.replace("{n}", String(Math.floor(secs / 60)));
    if (secs < 86400) return notifTT.hoursAgo.replace("{n}", String(Math.floor(secs / 3600)));
    if (secs < 172800) return notifTT.yesterday;
    const days = Math.floor(secs / 86400);
    if (days < 7) return tt.postedDaysAgo.replace("{n}", String(days));
    return formatDate(iso, lang, { dateStyle: "medium" });
  };

  const schoolFallback = t.teacher.interviews.schoolFallback;

  const stats = [
    {
      label: tt.statApplications,
      value: appStats?.total ?? 0,
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
      change: tt.statSubmittedChange.replace("{n}", String(appStats?.submitted ?? 0)),
    },
    {
      label: tt.statInterviews,
      value: data?.upcomingInterviews.length ?? 0,
      icon: Calendar,
      color: "bg-purple-50 text-purple-600",
      change: tt.statUpcomingChange,
    },
    {
      label: tt.statOffers,
      value: data?.activeOffers.length ?? 0,
      icon: Award,
      color: "bg-green-50 text-green-600",
      change: data?.activeOffers.length ? tt.statAwaitingReply : tt.statNoneActive,
    },
    {
      label: tt.statActive,
      value: data?.applications.activeCount ?? 0,
      icon: Briefcase,
      color: "bg-orange-50 text-orange-600",
      change: tt.statInProgressChange,
    },
  ];

  const firstName = user?.firstName ?? user?.email?.split("@")[0] ?? "there";

  // Profile-strength checklist: keep the matching key in English (matches the
  // backend's dynamic `suggestions` copy, which isn't localized) while showing
  // the localized label to the user.
  const PROFILE_SECTIONS: { display: string; matchKey: string }[] = [
    { display: tt.sectionPersonal,      matchKey: "personal info" },
    { display: tt.sectionProfessional,  matchKey: "professional info" },
    { display: tt.sectionEducation,     matchKey: "education" },
    { display: tt.sectionCertifications,matchKey: "certifications" },
    { display: tt.sectionResume,        matchKey: "resume" },
    { display: tt.sectionLanguages,     matchKey: "languages" },
    { display: tt.sectionLocation,      matchKey: "location" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Premium upgrade banner — hidden when already subscribed */}
      <TrialBanner audience="teacher_premium" plansHref="/billing/plans" />

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{tt.welcomeBack.replace("{name}", firstName)} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tt.subtitle}</p>
        </div>
        <Link
          href="/jobs"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Briefcase size={15} />
          {tt.browseJobs}
        </Link>
      </div>

      {/* Soft, dismissible "set a password" prompt — OTP-only users only */}
      <PasswordPromptBanner settingsHref="/settings" />

      {/* Profile Completion Banner */}
      {profileCompleteness < 100 && (
        <div className="bg-white rounded-2xl border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertCircle size={16} className="text-amber-500" />
              <p className="text-sm font-semibold text-gray-900">
                {tt.completeProfileTitle}
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              {(() => {
                const [pre, rest] = tt.completeProfileBody.split("{bold}");
                return (
                  <>
                    {pre}
                    <span className="font-medium text-brand-primary-dark">{tt.moreViews}</span>
                    {rest.replace("{percent}", String(profileCompleteness))}
                  </>
                );
              })()}
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{ width: `${profileCompleteness}%`, background: "var(--brand-gradient)" }}
              />
            </div>
            {suggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <span key={s} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                    + {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/profile"
            className="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {tt.completeProfileCta}
          </Link>
        </div>
      )}

      {/* Verification nudge — non-blocking, only shown when not yet verified */}
      {!isVerified && !isPendingVerification && profileCompleteness >= 60 && (
        <div className="bg-white rounded-2xl border border-teal-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              <Award size={16} className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{tt.getVerifiedTitle}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {(() => {
                  const [pre, rest] = tt.getVerifiedBody.split("{badge}");
                  return (
                    <>
                      {pre}
                      <span className="text-teal-600 font-medium">{tt.verifiedBadge}</span>
                      {rest}
                    </>
                  );
                })()}
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="shrink-0 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {tt.submitForVerification}
          </Link>
        </div>
      )}

      {isPendingVerification && (
        <div className="bg-white rounded-2xl border border-amber-100 p-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Loader2 size={16} className="text-amber-500 animate-spin" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{tt.verificationInProgressTitle}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {tt.verificationInProgressBody}
            </p>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3`}>
              <Icon size={18} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-600 mt-0.5">{label}</div>
            <div className="text-xs text-gray-400 mt-1">{change}</div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Recommendations + Recent Applications */}
        <div className="xl:col-span-2 space-y-4">
          {/* Job Recommendations */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
              <div>
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  {tt.recommendedForYou}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{tt.recommendedSubtitle}</p>
              </div>
              <Link href="/jobs" className="text-xs text-brand-primary font-medium hover:underline flex items-center gap-1">
                {tt.viewAllLink} {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {(data?.recommendations ?? []).length === 0 ? (
                <div className="text-center py-10 px-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                    <Star size={20} className="text-amber-400 fill-amber-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">{tt.noRecommendationsTitle}</p>
                  <p className="text-xs text-gray-400 mb-4">
                    {tt.noRecommendationsBody}
                  </p>
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-sm hover:opacity-90 transition-opacity"
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    <User size={12} /> {tt.completeProfileButton}
                  </Link>
                </div>
              ) : (
                (data?.recommendations ?? []).map((job) => (
                  <div key={job._id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-brand-primary-dark transition-colors">
                            {job.title}
                          </span>
                          {job.matchScore != null && (
                            <MatchBadge
                              score={job.matchScore}
                              label={t.teacher.jobs.matchPercent.replace("{n}", String(job.matchScore))}
                            />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {t.teacher.jobs.cityLabels[job.city] ?? job.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen size={11} /> {job.subjects?.map((s) => t.teacher.jobs.subjectLabels[s] ?? s).join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs font-medium text-gray-700">{formatSalary(job, tt, lang)}</span>
                          <span className="text-xs text-gray-400">{postedLabel(job.createdAt, tt)}</span>
                        </div>
                        <WhyThisMatch breakdown={job.matchBreakdown} tt={tt} />
                      </div>
                      <Link
                        href="/jobs"
                        className="shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-brand-primary hover:bg-brand-primary/5 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Offers */}
          {(data?.activeOffers ?? []).length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Award size={16} className="text-teal-500" />
                  {tt.activeOffers}
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {data!.activeOffers.map((offer) => (
                  <div key={offer._id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{offer.position ?? offer.jobId.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {schoolName(offer.schoolId, schoolFallback)} · {offer.salary != null ? formatCurrency(offer.salary, lang) : ""}{t.teacher.profile.perMonth}
                        </p>
                      </div>
                      <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full font-medium capitalize">
                        {offer.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SRD 2.10.3 — Activity Feed */}
          <ActivityFeed entries={data?.activity ?? []} tt={tt} relativeTime={relativeTime} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Upcoming Interviews */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar size={16} className="text-purple-500" />
                {tt.upcomingInterviews}
              </h2>
              <Link href="/interviews" className="text-xs text-brand-primary font-medium hover:underline flex items-center gap-1">
                {tt.allLink} {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {(data?.upcomingInterviews ?? []).map((interview) => (
                <div key={interview._id} className="rounded-xl border border-gray-100 p-3.5 hover:border-brand-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-900 leading-tight">{interview.jobId.title}</p>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      interview.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {interview.status === "accepted" ? tt.interviewConfirmed : tt.interviewPending}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <Building2 size={10} /> {schoolName(interview.schoolId, schoolFallback)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                    <Clock size={11} className="text-brand-primary shrink-0" />
                    <span>
                      {formatDate(interview.scheduledAt, lang, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      {" · "}
                      {formatTime(interview.scheduledAt, lang)}
                    </span>
                    <span className="ms-auto text-brand-primary font-medium capitalize">{interview.type.replace("_", " ")}</span>
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <Link href="/interviews" className="flex-1 text-xs py-1.5 rounded-lg bg-brand-primary-light text-brand-primary-dark font-medium hover:bg-brand-primary/20 transition-colors text-center">
                      {tt.viewDetails}
                    </Link>
                  </div>
                </div>
              ))}
              {(data?.upcomingInterviews ?? []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">{tt.noUpcomingInterviews}</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bell size={16} className="text-red-500" />
                {tt.notifications}
                {(data?.notifications.unreadCount ?? 0) > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
                    {data!.notifications.unreadCount}
                  </span>
                )}
              </h2>
              <Link href="/notifications" className="text-xs text-brand-primary font-medium hover:underline flex items-center gap-1">
                {tt.allLink} {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {(data?.notifications.recent ?? []).map((n) => {
                const Icon = notifIcon(n.type);
                const iconColor = notifIconColor(n.type);
                return (
                  <div key={n._id} className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50/50 transition-colors ${!n.isRead ? "bg-blue-50/30" : ""}`}>
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${iconColor} mt-0.5`}>
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${!n.isRead ? "font-medium text-gray-900" : "text-gray-600"}`}>
                        {n.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{relativeTime(n.createdAt)}</p>
                    </div>
                    {!n.isRead && <div className="shrink-0 w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5" />}
                  </div>
                );
              })}
              {(data?.notifications.recent ?? []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">{tt.noNotifications}</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">{tt.quickActions}</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: tt.qaUpdateResume, icon: Upload, href: "/profile", color: "bg-blue-50 text-blue-600" },
                { label: tt.qaBrowseJobs,  icon: Search, href: "/jobs",    color: "bg-brand-primary-light text-brand-primary-dark" },
                { label: tt.qaViewApplications, icon: TrendingUp, href: "/applications", color: "bg-green-50 text-green-600" },
                { label: tt.qaEditProfile, icon: User,  href: "/profile",  color: "bg-purple-50 text-purple-600" },
              ].map(({ label, icon: Icon, href, color }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-brand-primary/30 hover:shadow-sm transition-all text-center"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Strength */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                <ArrowUpRight size={15} className="text-brand-primary" />
                {tt.profileStrength}
              </h2>
              <span className="text-sm font-bold text-brand-primary">{profileCompleteness}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
              <div
                className="h-2 rounded-full"
                style={{ width: `${profileCompleteness}%`, background: "var(--brand-gradient)" }}
              />
            </div>
            {suggestions.length > 0 && (
              <div className="space-y-1.5">
                {suggestions.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full border-2 border-gray-300 shrink-0" />
                    <span className="text-gray-400">{s}</span>
                    <Link href="/profile" className="ms-auto text-brand-primary hover:underline">{tt.addAction}</Link>
                  </div>
                ))}
                {PROFILE_SECTIONS.filter((sec) => !suggestions.some((s) => s.toLowerCase().includes(sec.matchKey))).map((sec) => (
                  <div key={sec.matchKey} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                    <span className="text-gray-600">{sec.display}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
