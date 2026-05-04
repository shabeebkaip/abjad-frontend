"use client";

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
import type { DashboardData, Job, Interview, Notification } from "@/lib/api/teacher";
import { useAuth } from "@/lib/auth/useAuth";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function MatchBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "bg-green-100 text-green-700" :
    score >= 75 ? "bg-blue-100 text-blue-700" :
    "bg-gray-100 text-gray-600";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {score}% match
    </span>
  );
}

function formatSalary(job: Job): string {
  if (job.salary.display === "negotiable") return "Negotiable";
  if (job.salary.display === "hide") return "Undisclosed";
  if (job.salary.min && job.salary.max) {
    return `SAR ${job.salary.min.toLocaleString()}–${job.salary.max.toLocaleString()}`;
  }
  return "Salary on request";
}

function daysAgo(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

function postedLabel(dateStr: string): string {
  const d = daysAgo(dateStr);
  if (d === 0) return "Posted today";
  if (d === 1) return "1 day ago";
  return `${d} days ago`;
}

function formatInterviewDate(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatInterviewTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function schoolName(schoolId: Interview["schoolId"]): string {
  if (typeof schoolId === "object" && schoolId.name) return schoolId.name;
  return "School";
}

function appStatusLabel(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    submitted:          { label: "Submitted",    color: "bg-gray-100 text-gray-600" },
    reviewing:          { label: "Under Review", color: "bg-blue-100 text-blue-700" },
    shortlisted:        { label: "Shortlisted",  color: "bg-green-100 text-green-700" },
    interview_scheduled:{ label: "Interview",    color: "bg-purple-100 text-purple-700" },
    offer_extended:     { label: "Offer",        color: "bg-teal-100 text-teal-700" },
    hired:              { label: "Hired",        color: "bg-emerald-100 text-emerald-700" },
    rejected:           { label: "Rejected",     color: "bg-red-100 text-red-600" },
    withdrawn:          { label: "Withdrawn",    color: "bg-gray-100 text-gray-500" },
  };
  return map[status] ?? { label: status, color: "bg-gray-100 text-gray-600" };
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

function timeAgo(isoStr: string): string {
  const secs = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (secs < 3600) return `${Math.floor(secs / 60)} min ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} hours ago`;
  if (secs < 172800) return "Yesterday";
  return `${Math.floor(secs / 86400)} days ago`;
}

const PROFILE_SECTION_KEYS = [
  { label: "Personal Info",     key: "personal" },
  { label: "Professional Info", key: "professional" },
  { label: "Education",         key: "education" },
  { label: "Certifications",    key: "certifications" },
  { label: "Resume / CV",       key: "resume" },
  { label: "Languages",         key: "languages" },
  { label: "Location Prefs",    key: "location" },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth();
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

  const stats = [
    {
      label: "Applications",
      value: appStats?.total ?? 0,
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
      change: `${appStats?.submitted ?? 0} submitted`,
    },
    {
      label: "Interviews",
      value: data?.upcomingInterviews.length ?? 0,
      icon: Calendar,
      color: "bg-purple-50 text-purple-600",
      change: "upcoming",
    },
    {
      label: "Offers",
      value: data?.activeOffers.length ?? 0,
      icon: Award,
      color: "bg-green-50 text-green-600",
      change: data?.activeOffers.length ? "Awaiting reply" : "None active",
    },
    {
      label: "Active",
      value: data?.applications.activeCount ?? 0,
      icon: Briefcase,
      color: "bg-orange-50 text-orange-600",
      change: "in progress",
    },
  ];

  const firstName = user?.firstName ?? user?.email?.split("@")[0] ?? "there";

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome back, {firstName} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here&apos;s what&apos;s happening with your job search</p>
        </div>
        <Link
          href="/jobs"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Briefcase size={15} />
          Browse Jobs
        </Link>
      </div>

      {/* Profile Completion Banner */}
      {profileCompleteness < 100 && (
        <div className="bg-white rounded-2xl border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertCircle size={16} className="text-amber-500" />
              <p className="text-sm font-semibold text-gray-900">
                Complete your profile to get more opportunities
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Schools with 100% profiles get <span className="font-medium text-brand-primary-dark">3x more views</span>. You&apos;re {profileCompleteness}% there.
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
            Complete Profile
          </Link>
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
                  Recommended for You
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Based on your profile • Updated today</p>
              </div>
              <Link href="/jobs" className="text-xs text-brand-primary font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {(data?.recommendations ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No recommendations yet — complete your profile to get matched.</p>
              ) : (
                (data?.recommendations ?? []).map((job) => (
                  <div key={job._id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-brand-primary-dark transition-colors">
                            {job.title}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {job.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen size={11} /> {job.subjects?.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs font-medium text-gray-700">{formatSalary(job)}</span>
                          <span className="text-xs text-gray-400">{postedLabel(job.createdAt)}</span>
                        </div>
                      </div>
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
                  Active Offers
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {data!.activeOffers.map((offer) => (
                  <div key={offer._id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{offer.position ?? offer.jobId.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{schoolName(offer.schoolId)} · SAR {offer.salary?.toLocaleString()}/mo</p>
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
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Upcoming Interviews */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar size={16} className="text-purple-500" />
                Upcoming Interviews
              </h2>
              <Link href="/interviews" className="text-xs text-brand-primary font-medium hover:underline flex items-center gap-1">
                All <ChevronRight size={13} />
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
                      {interview.status === "accepted" ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <Building2 size={10} /> {schoolName(interview.schoolId)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                    <Clock size={11} className="text-brand-primary shrink-0" />
                    <span>{formatInterviewDate(interview.scheduledAt)} · {formatInterviewTime(interview.scheduledAt)}</span>
                    <span className="ml-auto text-brand-primary font-medium capitalize">{interview.type.replace("_", " ")}</span>
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <Link href="/interviews" className="flex-1 text-xs py-1.5 rounded-lg bg-brand-primary-light text-brand-primary-dark font-medium hover:bg-brand-primary/20 transition-colors text-center">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
              {(data?.upcomingInterviews ?? []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No upcoming interviews</p>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bell size={16} className="text-red-500" />
                Notifications
                {(data?.notifications.unreadCount ?? 0) > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
                    {data!.notifications.unreadCount}
                  </span>
                )}
              </h2>
              <Link href="/notifications" className="text-xs text-brand-primary font-medium hover:underline flex items-center gap-1">
                All <ChevronRight size={13} />
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
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.isRead && <div className="shrink-0 w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5" />}
                  </div>
                );
              })}
              {(data?.notifications.recent ?? []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">No notifications</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Update Resume", icon: Upload, href: "/profile", color: "bg-blue-50 text-blue-600" },
                { label: "Browse Jobs",  icon: Search, href: "/jobs",    color: "bg-brand-primary-light text-brand-primary-dark" },
                { label: "View Applications", icon: TrendingUp, href: "/applications", color: "bg-green-50 text-green-600" },
                { label: "Edit Profile", icon: User,  href: "/profile",  color: "bg-purple-50 text-purple-600" },
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
                Profile Strength
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
                    <Link href="/profile" className="ml-auto text-brand-primary hover:underline">Add</Link>
                  </div>
                ))}
                {PROFILE_SECTION_KEYS.filter((sec) => !suggestions.some((s) => s.toLowerCase().includes(sec.label.toLowerCase()))).map((sec) => (
                  <div key={sec.label} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                    <span className="text-gray-600">{sec.label}</span>
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
