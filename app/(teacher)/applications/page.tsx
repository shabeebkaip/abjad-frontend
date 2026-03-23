"use client";

import { useState } from "react";
import {
  FileText,
  Building2,
  MapPin,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
  Star,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Briefcase,
  Timer,
  Award,
  X,
} from "lucide-react";

type ApplicationStatus =
  | "Submitted"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Offer Received"
  | "Hired"
  | "Rejected"
  | "Withdrawn";

interface Application {
  id: number;
  jobTitle: string;
  school: string;
  schoolType: "Private" | "International" | "Government";
  subject: string;
  city: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  matchScore: number;
  salary: string;
  contractType: string;
  timeline: TimelineEvent[];
  notes?: string;
  interviewDate?: string;
  offerAmount?: string;
}

interface TimelineEvent {
  status: ApplicationStatus;
  date: string;
  note?: string;
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { color: string; bg: string; icon: React.ReactNode; step: number }
> = {
  Submitted: {
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: <Send className="w-3.5 h-3.5" />,
    step: 1,
  },
  Shortlisted: {
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    icon: <Star className="w-3.5 h-3.5" />,
    step: 2,
  },
  "Interview Scheduled": {
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: <Calendar className="w-3.5 h-3.5" />,
    step: 3,
  },
  "Offer Received": {
    color: "text-teal-700",
    bg: "bg-teal-50 border-teal-200",
    icon: <Award className="w-3.5 h-3.5" />,
    step: 4,
  },
  Hired: {
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    step: 5,
  },
  Rejected: {
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
    step: 0,
  },
  Withdrawn: {
    color: "text-slate-500",
    bg: "bg-slate-50 border-slate-200",
    icon: <X className="w-3.5 h-3.5" />,
    step: 0,
  },
};

const PIPELINE_STEPS: ApplicationStatus[] = [
  "Submitted",
  "Shortlisted",
  "Interview Scheduled",
  "Offer Received",
  "Hired",
];

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    jobTitle: "Mathematics Teacher – High School",
    school: "Al-Noor International School",
    schoolType: "International",
    subject: "Mathematics",
    city: "Riyadh",
    status: "Interview Scheduled",
    appliedDate: "Jun 10, 2025",
    lastUpdated: "Jun 14, 2025",
    matchScore: 92,
    salary: "SAR 8,000–12,000/mo",
    contractType: "Full-time",
    interviewDate: "Jun 18, 2025 at 10:00 AM",
    timeline: [
      { status: "Submitted", date: "Jun 10", note: "Application submitted successfully" },
      { status: "Shortlisted", date: "Jun 12", note: "Your profile impressed us!" },
      { status: "Interview Scheduled", date: "Jun 14", note: "Video interview via Zoom" },
    ],
  },
  {
    id: 2,
    jobTitle: "Physics & Chemistry Teacher",
    school: "Manarat Schools",
    schoolType: "Private",
    subject: "Physics",
    city: "Jeddah",
    status: "Shortlisted",
    appliedDate: "Jun 8, 2025",
    lastUpdated: "Jun 13, 2025",
    matchScore: 85,
    salary: "SAR 6,500–9,000/mo",
    contractType: "Full-time",
    timeline: [
      { status: "Submitted", date: "Jun 8" },
      { status: "Shortlisted", date: "Jun 13", note: "You've been shortlisted for further review" },
    ],
  },
  {
    id: 3,
    jobTitle: "English Language Teacher",
    school: "Dhahran British Grammar School",
    schoolType: "International",
    subject: "English Language",
    city: "Khobar",
    status: "Offer Received",
    appliedDate: "Jun 1, 2025",
    lastUpdated: "Jun 15, 2025",
    matchScore: 78,
    salary: "Negotiable",
    contractType: "Full-time",
    offerAmount: "SAR 10,500/mo",
    timeline: [
      { status: "Submitted", date: "Jun 1" },
      { status: "Shortlisted", date: "Jun 5" },
      { status: "Interview Scheduled", date: "Jun 9", note: "In-person interview" },
      { status: "Offer Received", date: "Jun 15", note: "Formal offer letter sent via email" },
    ],
  },
  {
    id: 4,
    jobTitle: "Islamic Studies Teacher",
    school: "Al-Rajhi Model Schools",
    schoolType: "Private",
    subject: "Islamic Studies",
    city: "Riyadh",
    status: "Rejected",
    appliedDate: "May 28, 2025",
    lastUpdated: "Jun 5, 2025",
    matchScore: 71,
    salary: "SAR 5,500–7,500/mo",
    contractType: "Full-time",
    notes: "Position filled internally",
    timeline: [
      { status: "Submitted", date: "May 28" },
      { status: "Rejected", date: "Jun 5", note: "Thank you for applying. Position filled." },
    ],
  },
  {
    id: 5,
    jobTitle: "Computer Science Teacher",
    school: "KFUPM Schools",
    schoolType: "Government",
    subject: "Computer Science",
    city: "Dammam",
    status: "Submitted",
    appliedDate: "Jun 15, 2025",
    lastUpdated: "Jun 15, 2025",
    matchScore: 68,
    salary: "Salary hidden",
    contractType: "Contract",
    timeline: [
      { status: "Submitted", date: "Jun 15", note: "Application under review" },
    ],
  },
  {
    id: 6,
    jobTitle: "Arabic Language & Literature",
    school: "Bayan Bilingual School",
    schoolType: "Private",
    subject: "Arabic Language",
    city: "Riyadh",
    status: "Withdrawn",
    appliedDate: "May 20, 2025",
    lastUpdated: "May 25, 2025",
    matchScore: 60,
    salary: "SAR 7,000–9,500/mo",
    contractType: "Full-time",
    timeline: [
      { status: "Submitted", date: "May 20" },
      { status: "Withdrawn", date: "May 25", note: "Withdrew application" },
    ],
  },
  {
    id: 7,
    jobTitle: "Biology Teacher",
    school: "King Abdullah Schools",
    schoolType: "Government",
    subject: "Biology",
    city: "Jeddah",
    status: "Hired",
    appliedDate: "Apr 10, 2025",
    lastUpdated: "May 15, 2025",
    matchScore: 88,
    salary: "SAR 9,000/mo",
    contractType: "Full-time",
    offerAmount: "SAR 9,000/mo",
    timeline: [
      { status: "Submitted", date: "Apr 10" },
      { status: "Shortlisted", date: "Apr 15" },
      { status: "Interview Scheduled", date: "Apr 22" },
      { status: "Offer Received", date: "May 1" },
      { status: "Hired", date: "May 15", note: "Employment contract signed" },
    ],
  },
];

const ALL_TABS: { label: string; value: ApplicationStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Submitted", value: "Submitted" },
  { label: "Shortlisted", value: "Shortlisted" },
  { label: "Interview Scheduled", value: "Interview Scheduled" },
  { label: "Offer Received", value: "Offer Received" },
  { label: "Hired", value: "Hired" },
  { label: "Rejected", value: "Rejected" },
];

function ProgressBar({ status }: { status: ApplicationStatus }) {
  const step = STATUS_CONFIG[status].step;
  if (step === 0) return null;
  const percent = ((step - 1) / 4) * 100;
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.max(5, percent)}%`, background: "var(--brand-primary)" }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}
      {status}
    </span>
  );
}

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<ApplicationStatus | "All">("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = MOCK_APPLICATIONS.filter(
    (a) => activeTab === "All" || a.status === activeTab
  );

  const tabCount = (tab: ApplicationStatus | "All") =>
    tab === "All"
      ? MOCK_APPLICATIONS.length
      : MOCK_APPLICATIONS.filter((a) => a.status === tab).length;

  // Analytics
  const total = MOCK_APPLICATIONS.length;
  const responded = MOCK_APPLICATIONS.filter((a) =>
    ["Shortlisted", "Interview Scheduled", "Offer Received", "Hired", "Rejected"].includes(a.status)
  ).length;
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
  const avgMatchScore = Math.round(
    MOCK_APPLICATIONS.reduce((sum, a) => sum + a.matchScore, 0) / total
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-800">My Applications</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track all your job applications in one place</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Analytics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Applied",
              value: total,
              icon: <FileText className="w-5 h-5 text-blue-500" />,
              bg: "bg-blue-50",
            },
            {
              label: "Response Rate",
              value: `${responseRate}%`,
              icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
              bg: "bg-emerald-50",
            },
            {
              label: "Avg Match Score",
              value: `${avgMatchScore}%`,
              icon: <Star className="w-5 h-5 text-amber-500" />,
              bg: "bg-amber-50",
            },
            {
              label: "Active Offers",
              value: MOCK_APPLICATIONS.filter((a) => a.status === "Offer Received").length,
              icon: <Award className="w-5 h-5" style={{ color: "var(--brand-primary)" }} />,
              bg: "bg-slate-100",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Status Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Application Pipeline</h2>
          <div className="flex items-center gap-0">
            {PIPELINE_STEPS.map((step, idx) => {
              const count = MOCK_APPLICATIONS.filter((a) => a.status === step).length;
              const cfg = STATUS_CONFIG[step];
              return (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`flex-1 flex flex-col items-center cursor-pointer group`}
                    onClick={() => setActiveTab(step)}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 transition-all ${
                      count > 0 ? `${cfg.bg} ${cfg.color} border-current` : "bg-slate-50 border-slate-200 text-slate-300"
                    } group-hover:scale-110`}>
                      {cfg.icon}
                    </div>
                    <p className={`text-xs font-semibold ${count > 0 ? cfg.color : "text-slate-400"}`}>
                      {count}
                    </p>
                    <p className="text-[10px] text-slate-400 text-center leading-tight mt-0.5 hidden md:block">
                      {step}
                    </p>
                  </div>
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <div className="w-full h-px bg-slate-200 -mt-5 flex-1 max-w-8" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-200">
            {ALL_TABS.map((tab) => {
              const count = tabCount(tab.value);
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.value
                      ? "border-[var(--brand-primary)] text-[var(--brand-primary)] bg-slate-50/70"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.value ? "bg-[var(--brand-primary)] text-white" : "bg-slate-100 text-slate-500"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Application Cards */}
          <div className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-medium text-slate-600">No applications yet</p>
                <p className="text-sm text-slate-400 mt-1">Applications in this status will appear here</p>
              </div>
            ) : (
              filtered.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  expanded={expandedId === app.id}
                  onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Application Card ───────────────────────────────────────────────────────────

function ApplicationCard({
  app,
  expanded,
  onToggle,
}: {
  app: Application;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isActive = !["Rejected", "Withdrawn"].includes(app.status);

  return (
    <div className="p-5 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* School logo */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ background: "var(--brand-gradient)" }}
        >
          {app.school[0]}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-800 leading-snug">{app.jobTitle}</h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <Building2 className="w-3.5 h-3.5" /> {app.school}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="w-3.5 h-3.5" /> {app.city}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <BookOpen className="w-3.5 h-3.5" /> {app.subject}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={app.status} />
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {isActive && app.status !== "Hired" && (
            <div className="mt-3 mb-2">
              <ProgressBar status={app.status} />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Submitted</span>
                <span>Shortlisted</span>
                <span>Interview</span>
                <span>Offer</span>
                <span>Hired</span>
              </div>
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Applied {app.appliedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Updated {app.lastUpdated}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400" /> {app.matchScore}% match
            </span>
            <span>{app.salary}</span>
          </div>

          {/* Alerts */}
          {app.status === "Interview Scheduled" && app.interviewDate && (
            <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Interview scheduled: <strong>{app.interviewDate}</strong></span>
            </div>
          )}
          {app.status === "Offer Received" && app.offerAmount && (
            <div className="mt-3 flex items-center gap-2 text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
              <Award className="w-4 h-4 shrink-0" />
              <span>Offer received: <strong>{app.offerAmount}</strong> — Review and respond</span>
              <div className="flex gap-2 ml-auto shrink-0">
                <button className="px-3 py-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                  Accept
                </button>
                <button className="px-3 py-1 text-xs bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  Negotiate
                </button>
                <button className="px-3 py-1 text-xs bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  Decline
                </button>
              </div>
            </div>
          )}
          {app.status === "Hired" && (
            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>🎉 Congratulations! You were hired at <strong>{app.school}</strong></span>
            </div>
          )}

          {/* Expand / collapse */}
          <button
            onClick={onToggle}
            className="mt-3 flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity"
            style={{ color: "var(--brand-primary)" }}
          >
            <Eye className="w-3.5 h-3.5" />
            {expanded ? "Hide timeline" : "View timeline"}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>

          {/* Timeline */}
          {expanded && (
            <div className="mt-4 pl-4 border-l-2 border-slate-200 space-y-3">
              {app.timeline.map((event, idx) => {
                const cfg = STATUS_CONFIG[event.status];
                return (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-5.25 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                      idx === app.timeline.length - 1 ? "text-white" : "bg-white border-slate-300 text-slate-400"
                    }`}
                      style={idx === app.timeline.length - 1 ? { backgroundColor: "var(--brand-primary)" } : {}}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-xs font-semibold ${cfg.color}`}>{event.status}</span>
                        {event.note && (
                          <p className="text-xs text-slate-500 mt-0.5">{event.note}</p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{event.date}</span>
                    </div>
                  </div>
                );
              })}
              {app.notes && (
                <p className="text-xs text-slate-500 italic mt-1">Note: {app.notes}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused = { Timer };
