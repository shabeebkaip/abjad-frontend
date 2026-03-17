"use client";

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
} from "lucide-react";

// ─── Mock data ──────────────────────────────────────────────────────────────

const profileSections = [
  { label: "Personal Info", done: true },
  { label: "Professional Info", done: true },
  { label: "Education", done: true },
  { label: "Certifications", done: false },
  { label: "Resume / CV", done: false },
  { label: "Languages", done: true },
  { label: "Location Prefs", done: false },
];

const profileCompleteness = Math.round(
  (profileSections.filter((s) => s.done).length / profileSections.length) * 100
);

const stats = [
  { label: "Applications", value: 8, icon: FileText, color: "bg-blue-50 text-blue-600", change: "+2 this week" },
  { label: "Interviews", value: 2, icon: Calendar, color: "bg-purple-50 text-purple-600", change: "1 upcoming" },
  { label: "Offers", value: 1, icon: Award, color: "bg-green-50 text-green-600", change: "Awaiting reply" },
  { label: "Saved Jobs", value: 5, icon: Briefcase, color: "bg-orange-50 text-orange-600", change: "2 closing soon" },
];

const upcomingInterviews = [
  {
    id: 1,
    school: "Al Rowad International School",
    role: "Math Teacher – Grade 7-9",
    date: "Sat, 14 Mar 2026",
    time: "10:00 AM",
    type: "Video Call",
    status: "confirmed",
  },
  {
    id: 2,
    school: "Dar Al Fikr School",
    role: "Science Teacher – Elementary",
    date: "Mon, 16 Mar 2026",
    time: "2:30 PM",
    type: "In-Person",
    status: "pending",
  },
];

const recentApplications = [
  {
    id: 1,
    school: "Manarat Riyadh School",
    role: "Mathematics Teacher",
    city: "Riyadh",
    appliedDate: "10 Mar 2026",
    status: "Shortlisted",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    school: "Al Injaz International School",
    role: "Physics Teacher – High School",
    city: "Jeddah",
    appliedDate: "8 Mar 2026",
    status: "Under Review",
    statusColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    school: "Riyadh Schools",
    role: "Math & Science Teacher",
    city: "Riyadh",
    appliedDate: "5 Mar 2026",
    status: "Submitted",
    statusColor: "bg-gray-100 text-gray-600",
  },
];

const jobRecommendations = [
  {
    id: 1,
    school: "International School of Riyadh",
    role: "Mathematics Teacher",
    city: "Riyadh",
    salary: "SAR 12,000 – 15,000",
    grades: "Grades 7–12",
    matchScore: 94,
    postedDays: 1,
  },
  {
    id: 2,
    school: "Almadares Private School",
    role: "Math & Computer Science",
    city: "Jeddah",
    salary: "SAR 10,000 – 13,000",
    grades: "Grades 9–12",
    matchScore: 88,
    postedDays: 2,
  },
  {
    id: 3,
    school: "Al Faris Academy",
    role: "Senior Mathematics Teacher",
    city: "Riyadh",
    salary: "Negotiable",
    grades: "Grades 10–12",
    matchScore: 82,
    postedDays: 3,
  },
  {
    id: 4,
    school: "Dar Al Elm School",
    role: "Middle School Math Teacher",
    city: "Khobar",
    salary: "SAR 9,000 – 11,000",
    grades: "Grades 6–9",
    matchScore: 79,
    postedDays: 4,
  },
  {
    id: 5,
    school: "Al Andalus Academy",
    role: "Mathematics Teacher (Female)",
    city: "Riyadh",
    salary: "SAR 11,000 – 14,000",
    grades: "Grades 7–12",
    matchScore: 76,
    postedDays: 5,
  },
];

const notifications = [
  { id: 1, text: "Manarat Riyadh shortlisted your application!", time: "2 hours ago", type: "success", unread: true },
  { id: 2, text: "Interview confirmed for Al Rowad – Sat 10:00 AM", time: "5 hours ago", type: "info", unread: true },
  { id: 3, text: "Job offer received from Future Leaders School", time: "Yesterday", type: "offer", unread: true },
  { id: 4, text: "5 new jobs match your profile today", time: "Yesterday", type: "jobs", unread: false },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome back, Ahmed 👋</h1>
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
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profileSections.filter(s => !s.done).map(s => (
                <span key={s.label} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  + {s.label}
                </span>
              ))}
            </div>
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
        {/* Left: Recommendations */}
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
              {jobRecommendations.map((job) => (
                <div key={job.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-brand-primary-dark transition-colors">
                          {job.role}
                        </span>
                        <MatchBadge score={job.matchScore} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Building2 size={11} /> {job.school}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {job.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen size={11} /> {job.grades}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs font-medium text-gray-700">{job.salary}</span>
                        <span className="text-xs text-gray-400">
                          {job.postedDays === 1 ? "Posted today" : `${job.postedDays} days ago`}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button className="text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-colors"
                        style={{ background: "var(--brand-gradient)" }}>
                        Quick Apply
                      </button>
                      <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                Recent Applications
              </h2>
              <Link href="/applications" className="text-xs text-brand-primary font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentApplications.map((app) => (
                <div key={app.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{app.role}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                        <Building2 size={11} /> {app.school}
                        <span>·</span>
                        <MapPin size={11} /> {app.city}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${app.statusColor}`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-gray-400">{app.appliedDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-50">
              <Link href="/applications" className="text-xs text-brand-primary font-medium hover:underline flex items-center gap-1">
                <TrendingUp size={12} /> Track all 8 applications
              </Link>
            </div>
          </div>
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
              {upcomingInterviews.map((interview) => (
                <div key={interview.id} className="rounded-xl border border-gray-100 p-3.5 hover:border-brand-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-gray-900 leading-tight">{interview.role}</p>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      interview.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {interview.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <Building2 size={10} /> {interview.school}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
                    <Clock size={11} className="text-brand-primary shrink-0" />
                    <span>{interview.date} · {interview.time}</span>
                    <span className="ml-auto text-brand-primary font-medium">{interview.type}</span>
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <button className="flex-1 text-xs py-1.5 rounded-lg bg-brand-primary-light text-brand-primary-dark font-medium hover:bg-brand-primary/20 transition-colors">
                      View Details
                    </button>
                    {interview.status === "pending" && (
                      <button className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {upcomingInterviews.length === 0 && (
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
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">3</span>
              </h2>
              <Link href="/notifications" className="text-xs text-brand-primary font-medium hover:underline flex items-center gap-1">
                All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {notifications.map((n) => {
                const iconColor =
                  n.type === "success" ? "bg-green-100 text-green-600" :
                  n.type === "offer" ? "bg-purple-100 text-purple-600" :
                  n.type === "jobs" ? "bg-blue-100 text-blue-600" :
                  "bg-gray-100 text-gray-600";
                const Icon =
                  n.type === "success" ? CheckCircle2 :
                  n.type === "offer" ? Award :
                  n.type === "jobs" ? Briefcase :
                  Bell;
                return (
                  <div key={n.id} className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50/50 transition-colors ${n.unread ? "bg-blue-50/30" : ""}`}>
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${iconColor} mt-0.5`}>
                      <Icon size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${n.unread ? "font-medium text-gray-900" : "text-gray-600"}`}>
                        {n.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    {n.unread && <div className="shrink-0 w-1.5 h-1.5 bg-brand-primary rounded-full mt-1.5" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Update Resume", icon: Upload, href: "/profile#cv", color: "bg-blue-50 text-blue-600" },
                { label: "Browse Jobs", icon: Search, href: "/jobs", color: "bg-brand-primary-light text-brand-primary-dark" },
                { label: "View Offers", icon: Award, href: "/applications?tab=offers", color: "bg-green-50 text-green-600" },
                { label: "Edit Profile", icon: User, href: "/profile", color: "bg-purple-50 text-purple-600" },
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
            <div className="space-y-1.5">
              {profileSections.map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-xs">
                  {s.done
                    ? <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                    : <div className="w-3 h-3 rounded-full border-2 border-gray-300 shrink-0" />
                  }
                  <span className={s.done ? "text-gray-600" : "text-gray-400"}>{s.label}</span>
                  {!s.done && (
                    <Link href="/profile" className="ml-auto text-brand-primary hover:underline">Add</Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


