"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Building2,
  MapPin,
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
  Award,
  Download,
  X,
  Loader2,
} from "lucide-react";
import { listApplications, getApplicationStats, withdrawApplication, respondToOffer, listOffers, submitFeedback } from "@/lib/api/teacher";
import type { Offer } from "@/lib/api/teacher";
import { PostHireFeedbackModal, type PostHireFeedbackPayload } from "@/components/teacher/PostHireFeedbackModal";
import type { Application, ApplicationStats } from "@/lib/api/teacher";

// ── Status display config ─────────────────────────────────────────────────────

type UIStatus = "Submitted" | "Reviewing" | "Shortlisted" | "Interview Scheduled" | "Offer Received" | "Hired" | "Rejected" | "Withdrawn";

function toUIStatus(apiStatus: Application["status"]): UIStatus {
  const map: Record<Application["status"], UIStatus> = {
    submitted:          "Submitted",
    reviewing:          "Reviewing",
    shortlisted:        "Shortlisted",
    interview_scheduled:"Interview Scheduled",
    offer_extended:     "Offer Received",
    hired:              "Hired",
    rejected:           "Rejected",
    withdrawn:          "Withdrawn",
  };
  return map[apiStatus] ?? "Submitted";
}

const STATUS_CONFIG: Record<UIStatus, { color: string; bg: string; icon: React.ReactNode; step: number }> = {
  Submitted:           { color: "text-blue-600",    bg: "bg-blue-50 border-blue-200",    icon: <Send className="w-3.5 h-3.5" />,        step: 1 },
  Reviewing:           { color: "text-sky-600",     bg: "bg-sky-50 border-sky-200",      icon: <Eye className="w-3.5 h-3.5" />,         step: 2 },
  Shortlisted:         { color: "text-purple-600",  bg: "bg-purple-50 border-purple-200",icon: <Star className="w-3.5 h-3.5" />,        step: 3 },
  "Interview Scheduled":{ color: "text-amber-600", bg: "bg-amber-50 border-amber-200",  icon: <Calendar className="w-3.5 h-3.5" />,    step: 4 },
  "Offer Received":    { color: "text-teal-700",    bg: "bg-teal-50 border-teal-200",    icon: <Award className="w-3.5 h-3.5" />,       step: 5 },
  Hired:               { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" />, step: 6 },
  Rejected:            { color: "text-red-600",     bg: "bg-red-50 border-red-200",      icon: <XCircle className="w-3.5 h-3.5" />,     step: 0 },
  Withdrawn:           { color: "text-slate-500",   bg: "bg-slate-50 border-slate-200",  icon: <X className="w-3.5 h-3.5" />,          step: 0 },
};

const PIPELINE_STEPS: UIStatus[] = ["Submitted", "Shortlisted", "Interview Scheduled", "Offer Received", "Hired"];

const ALL_TABS: { label: string; value: Application["status"] | "all" }[] = [
  { label: "All",                value: "all" },
  { label: "Submitted",          value: "submitted" },
  { label: "Shortlisted",        value: "shortlisted" },
  { label: "Interview Scheduled",value: "interview_scheduled" },
  { label: "Offer Received",     value: "offer_extended" },
  { label: "Hired",              value: "hired" },
  { label: "Rejected",           value: "rejected" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function jobCity(app: Application): string {
  return typeof app.jobId === "object" ? app.jobId.city ?? "" : "";
}

function jobTitle(app: Application): string {
  return typeof app.jobId === "object" ? app.jobId.title : "Job";
}

function jobSalary(app: Application): string {
  if (typeof app.jobId !== "object") return "";
  const s = app.jobId.salary;
  if (!s || s.display === "hide") return "Undisclosed";
  if (s.display === "negotiable") return "Negotiable";
  if (s.min && s.max) return `SAR ${s.min.toLocaleString()}–${s.max.toLocaleString()}/mo`;
  return "";
}

function ProgressBar({ uiStatus }: { uiStatus: UIStatus }) {
  const step = STATUS_CONFIG[uiStatus].step;
  if (step === 0) return null;
  const percent = ((step - 1) / 5) * 100;
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.max(5, percent)}%`, background: "var(--brand-primary)" }}
      />
    </div>
  );
}

function StatusBadge({ uiStatus }: { uiStatus: UIStatus }) {
  const cfg = STATUS_CONFIG[uiStatus];
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color} ${cfg.bg}`}>
      {cfg.icon} {uiStatus}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Application["status"] | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);
  const [respondingOffer, setRespondingOffer] = useState<string | null>(null);

  // SRD 2.7.3 — keep offers keyed by applicationId so the Hired card can show
  // a "Download Contract" link without an extra round-trip per card.
  const [offersByApp, setOffersByApp] = useState<Record<string, Offer>>({});

  // SRD 2.9.5 — post-hire feedback modal state. Tracks both which application
  // we're submitting for AND which ones the teacher has already given feedback
  // for in this session (no server state for the latter yet).
  const [feedbackAppId, setFeedbackAppId]                 = useState<string | null>(null);
  const [submittingFeedback, setSubmittingFeedback]       = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted]         = useState<Set<string>>(new Set());

  const handleSubmitPostHireFeedback = async (payload: PostHireFeedbackPayload) => {
    if (!feedbackAppId) return;
    setSubmittingFeedback(true);
    try {
      await submitFeedback({
        type: "post_hire",
        rating: payload.rating,
        content: payload.content,
        isAnonymous: payload.isAnonymous,
        relatedId: feedbackAppId,
        relatedModel: "Application",
      });
      setFeedbackSubmitted((prev) => new Set([...prev, feedbackAppId]));
      setFeedbackAppId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const load = useCallback(async () => {
    try {
      const [appsRes, statsRes, offersRes] = await Promise.all([
        listApplications({ limit: 50 }),
        getApplicationStats(),
        listOffers({ limit: 50 }).catch(() => ({ offers: [] as Offer[] })),
      ]);
      setApplications(appsRes.applications);
      setStats(statsRes);
      const map: Record<string, Offer> = {};
      for (const o of offersRes.offers ?? []) {
        if (o.applicationId) map[o.applicationId] = o;
      }
      setOffersByApp(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleWithdraw = async (appId: string) => {
    setWithdrawing(appId);
    try {
      const updated = await withdrawApplication(appId);
      setApplications((prev) => prev.map((a) => a._id === appId ? updated : a));
    } catch (err) {
      console.error(err);
    } finally {
      setWithdrawing(null);
    }
  };

  const filtered = applications.filter(
    (a) => activeTab === "all" || a.status === activeTab
  );

  const tabCount = (tab: Application["status"] | "all") =>
    tab === "all" ? applications.length : applications.filter((a) => a.status === tab).length;

  // Pipeline counts by UI status
  const pipelineCount = (s: UIStatus) => applications.filter((a) => toUIStatus(a.status) === s).length;

  const responseRate = stats?.responseRate ?? 0;
  const successRate = stats?.successRate ?? 0;
  // SRD 2.5.4 — format avg response hours: "—" if no responses yet, "Xh" under
  // a day, "Xd" otherwise.
  const avgResponse = (() => {
    const h = stats?.avgResponseHours;
    if (h == null) return "—";
    if (h < 24) return `${Math.round(h)}h`;
    return `${Math.round(h / 24)}d`;
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-800">My Applications</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track all your job applications in one place</p>
      </div>

      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            {/* Analytics Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Applied",     value: stats?.total ?? 0,     icon: <FileText className="w-5 h-5 text-blue-500" />,     bg: "bg-blue-50" },
                { label: "Response Rate",     value: `${responseRate}%`,    icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, bg: "bg-emerald-50" },
                { label: "Avg Response Time", value: avgResponse,           icon: <Clock className="w-5 h-5 text-amber-500" />,       bg: "bg-amber-50" },
                { label: "Success Rate",      value: `${successRate}%`,     icon: <Award className="w-5 h-5" style={{ color: "var(--brand-primary)" }} />, bg: "bg-slate-100" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>{s.icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Application Pipeline</h2>
              <div className="flex items-center gap-0">
                {PIPELINE_STEPS.map((step, idx) => {
                  const count = pipelineCount(step);
                  const cfg   = STATUS_CONFIG[step];
                  return (
                    <div key={step} className="flex items-center flex-1">
                      <div
                        className="flex-1 flex flex-col items-center cursor-pointer group"
                        onClick={() => {
                          const apiKey = Object.entries(STATUS_CONFIG).find(([, v]) => v === cfg);
                          if (step === "Submitted")          setActiveTab("submitted");
                          else if (step === "Shortlisted")   setActiveTab("shortlisted");
                          else if (step === "Interview Scheduled") setActiveTab("interview_scheduled");
                          else if (step === "Offer Received") setActiveTab("offer_extended");
                          else if (step === "Hired")          setActiveTab("hired");
                          void apiKey;
                        }}
                      >
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 transition-all ${
                          count > 0 ? `${cfg.bg} ${cfg.color} border-current` : "bg-slate-50 border-slate-200 text-slate-300"
                        } group-hover:scale-110`}>
                          {cfg.icon}
                        </div>
                        <p className={`text-xs font-semibold ${count > 0 ? cfg.color : "text-slate-400"}`}>{count}</p>
                        <p className="text-[10px] text-slate-400 text-center leading-tight mt-0.5 hidden md:block">{step}</p>
                      </div>
                      {idx < PIPELINE_STEPS.length - 1 && (
                        <div className="w-full h-px bg-slate-200 -mt-5 flex-1 max-w-8" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabs + list */}
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
                      key={app._id}
                      app={app}
                      offer={offersByApp[app._id]}
                      expanded={expandedId === app._id}
                      withdrawing={withdrawing === app._id}
                      respondingOffer={respondingOffer === app._id}
                      hasFeedback={feedbackSubmitted.has(app._id)}
                      onToggle={() => setExpandedId(expandedId === app._id ? null : app._id)}
                      onWithdraw={handleWithdraw}
                      onOpenFeedback={() => setFeedbackAppId(app._id)}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* SRD 2.9.5 — post-hire feedback modal */}
      {feedbackAppId && (() => {
        const app = applications.find((a) => a._id === feedbackAppId);
        if (!app) return null;
        return (
          <PostHireFeedbackModal
            jobTitle={app.jobId?.title}
            schoolName={undefined}
            isOpen
            isSubmitting={submittingFeedback}
            onClose={() => { if (!submittingFeedback) setFeedbackAppId(null); }}
            onConfirm={handleSubmitPostHireFeedback}
          />
        );
      })()}
    </div>
  );
}

// ── Application Card ──────────────────────────────────────────────────────────

function ApplicationCard({
  app,
  offer,
  expanded,
  withdrawing,
  respondingOffer,
  hasFeedback,
  onToggle,
  onWithdraw,
  onOpenFeedback,
}: {
  app: Application;
  offer?: Offer;
  expanded: boolean;
  withdrawing: boolean;
  respondingOffer: boolean;
  hasFeedback: boolean;
  onToggle: () => void;
  onWithdraw: (id: string) => void;
  onOpenFeedback: () => void;
}) {
  const uiStatus = toUIStatus(app.status);
  const isActive = !["Rejected", "Withdrawn"].includes(uiStatus);
  const canWithdraw = app.status === "submitted" || app.status === "reviewing";

  return (
    <div className="p-5 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ background: "var(--brand-gradient)" }}
        >
          {jobTitle(app)[0]}
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-800 leading-snug">{jobTitle(app)}</h3>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {jobCity(app) && (
                  <span className="flex items-center gap-1 text-sm text-slate-500">
                    <MapPin className="w-3.5 h-3.5" /> {jobCity(app)}
                  </span>
                )}
                {app.referenceNumber && (
                  <span className="flex items-center gap-1 text-sm text-slate-400">
                    <Building2 className="w-3.5 h-3.5" /> {app.referenceNumber}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge uiStatus={uiStatus} />
              {canWithdraw && (
                <button
                  disabled={withdrawing}
                  onClick={() => onWithdraw(app._id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Withdraw application"
                >
                  {withdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Progress */}
          {isActive && uiStatus !== "Hired" && (
            <div className="mt-3 mb-2">
              <ProgressBar uiStatus={uiStatus} />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Submitted</span>
                <span>Shortlisted</span>
                <span>Interview</span>
                <span>Offer</span>
                <span>Hired</span>
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Applied {formatDate(app.createdAt)}
            </span>
            {app.updatedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Updated {formatDate(app.updatedAt)}
              </span>
            )}
            {app.matchScore !== undefined && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400" /> {app.matchScore}% match
              </span>
            )}
            {jobSalary(app) && <span>{jobSalary(app)}</span>}
          </div>

          {/* Alerts */}
          {app.status === "offer_extended" && (
            <div className="mt-3 flex items-center gap-2 text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
              <Award className="w-4 h-4 shrink-0" />
              <span>Offer received — Review and respond</span>
            </div>
          )}
          {app.status === "hired" && (() => {
            // SRD 2.7.3 — prefer the school-uploaded signed contract; fall back
            // to the original offer letter so the teacher always has something
            // to download if either is present.
            const contractHref = offer?.contractUrl ?? offer?.offerLetterUrl;
            const hiredOn = offer?.hireConfirmedAt
              ? new Date(offer.hireConfirmedAt).toLocaleDateString("en-SA", { dateStyle: "medium" })
              : null;
            return (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-medium">
                    Congratulations! You were hired for this position{hiredOn ? ` on ${hiredOn}` : ""}.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {contractHref ? (
                    <a
                      href={contractHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {offer?.contractUrl ? "Download Contract" : "Download Offer Letter"}
                    </a>
                  ) : (
                    <span className="text-xs text-emerald-600/70 italic">
                      Contract document will appear here when the school uploads it.
                    </span>
                  )}
                  {/* SRD 2.9.5 — post-hire feedback */}
                  {hasFeedback ? (
                    <span className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" /> Feedback shared
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenFeedback}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-emerald-600 text-emerald-700 bg-white hover:bg-emerald-100 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5" /> Share Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Timeline toggle */}
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
              {app.statusHistory.map((event, idx) => {
                const eventUI = toUIStatus(event.status as Application["status"]);
                const cfg     = STATUS_CONFIG[eventUI] ?? STATUS_CONFIG.Submitted;
                return (
                  <div key={idx} className="relative">
                    <div
                      className="absolute -left-5.25 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
                      style={idx === app.statusHistory.length - 1 ? { backgroundColor: "var(--brand-primary)" } : { backgroundColor: "#fff", border: "2px solid #cbd5e1" }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-current" style={{ color: idx === app.statusHistory.length - 1 ? "#fff" : "#94a3b8" }} />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-xs font-semibold ${cfg.color}`}>{eventUI}</span>
                        {event.note && (
                          <p className="text-xs text-slate-500 mt-0.5">{event.note}</p>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{formatDate(event.timestamp)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// silence unused import warning
void respondToOffer;
void AlertCircle;
