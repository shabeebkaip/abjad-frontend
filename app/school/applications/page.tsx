"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText, ChevronRight, ChevronLeft, Loader2, AlertCircle,
  Circle, Video, Phone, MapPin, Calendar,
  Clock, X, CheckCircle2, UserX, Send,
  ArrowUpDown, Briefcase, Users,
} from "lucide-react";
import {
  listSchoolJobs,
  listSchoolApplications,
  updateApplicationStatus,
  scheduleInterview,
  extendOffer,
} from "@/lib/api/school";
import type { SchoolJob, SchoolApplication } from "@/lib/api/school";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatNumber } from "@/lib/i18n/format";

// ─── Constants ────────────────────────────────────────────────────────────────

type AppStatus =
  | "all"
  | "submitted"
  | "reviewing"
  | "shortlisted"
  | "interview_scheduled"
  | "offer_extended"
  | "hired"
  | "rejected";

type SortMode = "newest" | "match_score" | "unread_first";

// Labels come from t.school.applications.statusTabLabels / statusTabShortLabels at render time.
const STATUS_TAB_VALUES: AppStatus[] = [
  "all", "submitted", "reviewing", "shortlisted", "interview_scheduled", "offer_extended", "hired", "rejected",
];

const PIPELINE_STEPS: { status: SchoolApplication["status"]; color: string }[] = [
  { status: "submitted",           color: "#6b7280" },
  { status: "reviewing",           color: "#3b82f6" },
  { status: "shortlisted",         color: "#8b5cf6" },
  { status: "interview_scheduled", color: "#f59e0b" },
  { status: "offer_extended",      color: "#14b8a6" },
  { status: "hired",               color: "#10b981" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Time-ago strings reuse the already-authored dashboard namespace (same
// relative-time vocabulary as the dashboard's recent-activity feed).
type DashTT = ReturnType<typeof useTranslation>["t"]["school"]["dashboard"];

function timeAgo(isoStr: string, dash: DashTT, lang: "en" | "ar"): string {
  const secs = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (secs < 60)     return dash.justNow;
  if (secs < 3600)   return dash.minAgo.replace("{n}", formatNumber(Math.floor(secs / 60), lang));
  if (secs < 86400)  return dash.hoursAgo.replace("{n}", formatNumber(Math.floor(secs / 3600), lang));
  if (secs < 172800) return dash.yesterday;
  return dash.daysAgo.replace("{n}", formatNumber(Math.floor(secs / 86400), lang));
}

function candidateName(teacherId: SchoolApplication["teacherId"], fallback: string): string {
  if (typeof teacherId === "object" && teacherId.name) return teacherId.name;
  return fallback;
}

function candidateId(teacherId: SchoolApplication["teacherId"]): string {
  if (typeof teacherId === "object") return teacherId._id;
  return teacherId;
}

function jobInfo(jobId: SchoolApplication["jobId"], fallback: string): { title: string; city?: string } {
  if (typeof jobId === "object") return { title: jobId.title, city: jobId.city };
  return { title: fallback };
}

function jobId(jobId: SchoolApplication["jobId"]): string {
  if (typeof jobId === "object") return jobId._id;
  return jobId;
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SchoolApplication["status"] }) {
  const { t } = useTranslation();
  const labels = t.school.dashboard.applicationStatusLabels;
  const clsMap: Record<string, string> = {
    submitted:           "bg-gray-100 text-gray-600",
    reviewing:           "bg-blue-100 text-blue-700",
    shortlisted:         "bg-violet-100 text-violet-700",
    interview_scheduled: "bg-amber-100 text-amber-700",
    offer_extended:      "bg-teal-100 text-teal-700",
    hired:               "bg-emerald-100 text-emerald-700",
    rejected:            "bg-red-100 text-red-600",
    withdrawn:           "bg-gray-100 text-gray-400",
  };
  const label = labels[status] ?? status;
  const cls   = clsMap[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
  );
}

function MatchBadge({ score }: { score: number }) {
  const { lang } = useTranslation();
  const cls =
    score >= 80 ? "bg-green-100 text-green-700 border-green-200"
    : score >= 60 ? "bg-amber-100 text-amber-700 border-amber-200"
    : "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cls}`}>
      {formatNumber(score, lang)}%
    </span>
  );
}

// ─── Pipeline Stats Bar ───────────────────────────────────────────────────────

function PipelineStatsBar({ applications }: { applications: SchoolApplication[] }) {
  const { t, lang } = useTranslation();
  const tt = t.school.applications;
  const total = applications.filter((a) => a.status !== "rejected" && a.status !== "withdrawn").length || 1;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-800">{tt.pipelineOverviewTitle}</p>
        <span className="text-xs text-gray-400">
          {tt.totalApplicationsSuffixTemplate.replace("{n}", formatNumber(applications.length, lang))}
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {PIPELINE_STEPS.map(({ status, color }) => {
          const count = applications.filter((a) => a.status === status).length;
          const pct   = Math.round((count / total) * 100);
          return (
            <div key={status} className="text-center">
              <div className="h-1.5 bg-gray-100 rounded-full mb-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(pct, count > 0 ? 5 : 0)}%`, backgroundColor: color }}
                />
              </div>
              <p className="text-sm font-bold text-gray-900">{formatNumber(count, lang)}</p>
              <p className="text-xs text-gray-400 truncate">{tt.statusTabShortLabels[status]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────

interface RejectModalProps {
  applicationId: string;
  candidateName: string;
  onClose: () => void;
  onConfirm: (applicationId: string, reason: string) => Promise<void>;
}

function RejectModal({ applicationId, candidateName: name, onClose, onConfirm }: RejectModalProps) {
  const { t } = useTranslation();
  const tt = t.school.applications;
  const [reason, setReason]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!reason.trim()) { setError(tt.rejectReasonRequiredError); return; }
    setLoading(true);
    setError(null);
    try {
      await onConfirm(applicationId, reason.trim());
      onClose();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? tt.rejectFailedFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <UserX size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{tt.rejectModalTitle}</h3>
            <p className="text-xs text-gray-500">{tt.rejectModalForNameTemplate.replace("{name}", name)}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl mb-4">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            {tt.rejectReasonLabel} <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={tt.rejectReasonPlaceholder}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
            style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            autoFocus
          />
          <p className="text-xs text-gray-400 mt-1">{tt.rejectReasonHint}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t.school.common.cancel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : tt.confirmRejectionButton}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Schedule Interview Modal ─────────────────────────────────────────────────

interface ScheduleModalProps {
  application: SchoolApplication;
  onClose: () => void;
  onScheduled: (applicationId: string) => void;
}

function ScheduleInterviewModal({ application, onClose, onScheduled }: ScheduleModalProps) {
  const { t } = useTranslation();
  const tt = t.school.applications;
  const [type, setType]           = useState<"video" | "in_person" | "phone">("video");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration]   = useState("60");
  const [meetingLink, setMeetingLink] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const jInfo  = jobInfo(application.jobId, t.school.common.positionFallback);
  const tName  = candidateName(application.teacherId, t.school.common.candidateFallback);
  const tId    = candidateId(application.teacherId);
  const jId    = jobId(application.jobId);

  const handleSubmit = async () => {
    if (!scheduledAt) { setError(tt.scheduleDateRequiredError); return; }
    setLoading(true);
    setError(null);
    try {
      await scheduleInterview({
        applicationId: application._id,
        jobId: jId,
        teacherId: tId,
        type,
        scheduledAt: new Date(scheduledAt).toISOString(),
        duration: Number(duration) || 60,
        meetingLink: type === "video" ? meetingLink.trim() || undefined : undefined,
        instructions: instructions.trim() || undefined,
      });
      onScheduled(application._id);
      onClose();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? tt.scheduleFailedFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--brand-gradient)" }}>
              <Calendar size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">{tt.scheduleModalTitle}</h3>
              <p className="text-xs text-gray-500">{tName} · {jInfo.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl mb-4">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Interview type */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">{tt.interviewTypeLabel}</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "video",     label: tt.interviewTypeOptions.video,     icon: Video  },
                { value: "in_person", label: tt.interviewTypeOptions.in_person, icon: MapPin },
                { value: "phone",     label: tt.interviewTypeOptions.phone,     icon: Phone  },
              ] as const).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                    type === value
                      ? "border-transparent text-white shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                  }`}
                  style={type === value ? { background: "var(--brand-gradient)" } : {}}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date / time + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                {tt.dateTimeLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.durationMinLabel}</label>
              <input
                type="number"
                min="15"
                step="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              />
            </div>
          </div>

          {/* Meeting link (video only) */}
          {type === "video" && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.meetingLinkLabel}</label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder={tt.meetingLinkPlaceholder}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              />
            </div>
          )}

          {/* Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.instructionsLabel}</label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={tt.instructionsPlaceholder}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t.school.common.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !scheduledAt}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : (
              <><Calendar size={14} /> {tt.scheduleConfirmButton}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Offer Modal ──────────────────────────────────────────────────────────────

interface OfferModalProps {
  application: SchoolApplication;
  onClose: () => void;
  onExtended: (applicationId: string) => void;
}

function OfferModal({ application, onClose, onExtended }: OfferModalProps) {
  const { t } = useTranslation();
  const tt = t.school.applications;
  const [position, setPosition]   = useState("");
  const [salary, setSalary]       = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline]   = useState("");
  const [benefits, setBenefits]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const jInfo = jobInfo(application.jobId, t.school.common.positionFallback);
  const tName = candidateName(application.teacherId, t.school.common.candidateFallback);
  const tId   = candidateId(application.teacherId);
  const jId   = jobId(application.jobId);

  const handleSubmit = async () => {
    if (!position.trim()) { setError(tt.positionRequiredError); return; }
    if (!salary || isNaN(Number(salary))) { setError(tt.salaryRequiredError); return; }
    if (!deadline) { setError(tt.deadlineRequiredError); return; }
    setLoading(true);
    setError(null);
    try {
      await extendOffer({
        applicationId: application._id,
        jobId: jId,
        teacherId: tId,
        position: position.trim(),
        salary: Number(salary),
        startDate: startDate || undefined,
        deadline: new Date(deadline).toISOString(),
        benefits: benefits.trim() || undefined,
      });
      onExtended(application._id);
      onClose();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? tt.extendFailedFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--brand-gradient)" }}>
              <Send size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">{tt.offerModalTitle}</h3>
              <p className="text-xs text-gray-500">{tName} · {jInfo.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl mb-4">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Position */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              {tt.positionLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder={tt.positionPlaceholder}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              {tt.monthlySalaryLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder={tt.salaryPlaceholder}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>

          {/* Start date + Offer deadline */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.offerStartDateLabel}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                {tt.offerDeadlineLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              />
            </div>
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.benefitsLabel}</label>
            <textarea
              rows={3}
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder={tt.benefitsPlaceholder}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t.school.common.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !position.trim() || !salary || !deadline}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : (
              <><Send size={14} /> {tt.extendOfferConfirmButton}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Application Card ─────────────────────────────────────────────────────────

interface AppCardProps {
  application: SchoolApplication;
  actionLoading: string | null;
  onStartReview:       (app: SchoolApplication) => void;
  onShortlist:         (app: SchoolApplication) => void;
  onRejectClick:       (app: SchoolApplication) => void;
  onScheduleInterview: (app: SchoolApplication) => void;
  onExtendOffer:       (app: SchoolApplication) => void;
}

function ApplicationCard({
  application: app,
  actionLoading,
  onStartReview,
  onShortlist,
  onRejectClick,
  onScheduleInterview,
  onExtendOffer,
}: AppCardProps) {
  const { t, lang } = useTranslation();
  const tt = t.school.applications;
  const isLoading = actionLoading === app._id;
  const jInfo     = jobInfo(app.jobId, t.school.common.positionFallback);
  const tName     = candidateName(app.teacherId, t.school.common.candidateFallback);

  return (
    <div className={`bg-white rounded-2xl border transition-all hover:shadow-md relative ${
      !app.isRead ? "border-blue-200" : "border-gray-100 hover:border-gray-200"
    }`}>
      {/* Unread indicator */}
      {!app.isRead && (
        <span className="absolute top-4 end-4 w-2 h-2 rounded-full bg-blue-500" />
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center z-10">
          <Loader2 size={22} className="animate-spin text-gray-400" />
        </div>
      )}

      <div className="p-5">
        {/* Top: candidate + match score */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: "var(--brand-gradient)" }}
          >
            {tName[0]?.toUpperCase() ?? "C"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-gray-900">{tName}</span>
              {app.matchScore != null && <MatchBadge score={app.matchScore} />}
              {app.referenceNumber && (
                <span className="text-xs text-gray-400 font-mono">#{app.referenceNumber}</span>
              )}
            </div>
            {/* Job info */}
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500">
              <Briefcase size={11} className="text-gray-400 shrink-0" />
              <span className="truncate">{jInfo.title}</span>
              {jInfo.city && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin size={10} className="text-gray-400" />
                    {jInfo.city}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Status badge (top right, desktop) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <StatusBadge status={app.status} />
          </div>
        </div>

        {/* Cover letter preview */}
        {app.coverLetter && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed bg-gray-50 rounded-xl px-3 py-2 italic">
            &ldquo;{app.coverLetter}&rdquo;
          </p>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* Mobile status */}
            <span className="sm:hidden">
              <StatusBadge status={app.status} />
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              {timeAgo(app.createdAt, t.school.dashboard, lang)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {app.status === "submitted" && (
              <button
                onClick={() => onStartReview(app)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all disabled:opacity-60 hover:shadow-sm"
                style={{ background: "var(--brand-gradient)" }}
              >
                <Circle size={11} /> {tt.startReviewButton}
              </button>
            )}

            {app.status === "reviewing" && (
              <>
                <button
                  onClick={() => onShortlist(app)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg transition-all hover:bg-violet-100 disabled:opacity-60"
                >
                  <CheckCircle2 size={11} /> {tt.shortlistButton}
                </button>
                <button
                  onClick={() => onRejectClick(app)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg transition-all hover:bg-red-100 disabled:opacity-60"
                >
                  <X size={11} /> {tt.rejectButton}
                </button>
              </>
            )}

            {app.status === "shortlisted" && (
              <>
                <button
                  onClick={() => onScheduleInterview(app)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all disabled:opacity-60 hover:shadow-sm"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  <Calendar size={11} /> {tt.scheduleInterviewButton}
                </button>
                <button
                  onClick={() => onRejectClick(app)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg transition-all hover:bg-red-100 disabled:opacity-60"
                >
                  <X size={11} /> {tt.rejectButton}
                </button>
              </>
            )}

            {app.status === "interview_scheduled" && (
              <>
                <button
                  onClick={() => onExtendOffer(app)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all disabled:opacity-60 hover:shadow-sm"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  <Send size={11} /> {tt.extendOfferButton}
                </button>
                <button
                  onClick={() => onRejectClick(app)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg transition-all hover:bg-red-100 disabled:opacity-60"
                >
                  <X size={11} /> {tt.rejectButton}
                </button>
              </>
            )}

            {app.status === "offer_extended" && (
              <button
                disabled
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
              >
                <Clock size={11} /> {tt.awaitingResponseButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApplicationsPage() {
  const { t, lang, isRTL } = useTranslation();
  const tt = t.school.applications;
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") ?? null;

  const [applications, setApplications] = useState<SchoolApplication[]>([]);
  const [jobs, setJobs]                 = useState<SchoolJob[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(initialJobId);
  const [statusTab, setStatusTab]       = useState<AppStatus>("all");
  const [sortMode, setSortMode]         = useState<SortMode>("newest");
  const [sortOpen, setSortOpen]         = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [rejectTarget,   setRejectTarget]   = useState<SchoolApplication | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<SchoolApplication | null>(null);
  const [offerTarget,    setOfferTarget]    = useState<SchoolApplication | null>(null);
  const [actionLoading,  setActionLoading]  = useState<string | null>(null);

  // Load data
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [appRes, jobRes] = await Promise.all([
        listSchoolApplications({ limit: 50 }),
        listSchoolJobs({ status: "active", limit: 100 }),
      ]);
      setApplications(appRes.applications ?? []);
      setJobs(jobRes.jobs ?? []);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? tt.loadFailedFallback);
    } finally {
      setLoading(false);
    }
  }, [tt.loadFailedFallback]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    if (sortOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortOpen]);

  // Filtered + sorted applications
  const filtered = applications
    .filter((a) => !selectedJobId || jobId(a.jobId) === selectedJobId)
    .filter((a) => statusTab === "all" || a.status === statusTab);

  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === "match_score") {
      return (b.matchScore ?? 0) - (a.matchScore ?? 0);
    }
    if (sortMode === "unread_first") {
      if (!a.isRead && b.isRead) return -1;
      if (a.isRead && !b.isRead) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Job application counts
  const appCountByJob: Record<string, number> = {};
  for (const app of applications) {
    const jid = jobId(app.jobId);
    appCountByJob[jid] = (appCountByJob[jid] ?? 0) + 1;
  }

  // Status counts for current job filter
  const countForTab = (s: AppStatus) =>
    s === "all"
      ? applications.filter((a) => !selectedJobId || jobId(a.jobId) === selectedJobId).length
      : applications.filter(
          (a) => a.status === s && (!selectedJobId || jobId(a.jobId) === selectedJobId)
        ).length;

  // Status transition helpers
  const mutateApp = (id: string, updated: SchoolApplication) => {
    setApplications((prev) => prev.map((a) => (a._id === id ? updated : a)));
  };

  const performStatusUpdate = async (
    appId: string,
    status: string,
    extra?: { rejectionReason?: string }
  ) => {
    setActionLoading(appId);
    try {
      const updated = await updateApplicationStatus(appId, { status, ...extra });
      mutateApp(appId, updated);
    } catch {
      // silently fail; toast could go here
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartReview   = (app: SchoolApplication) => performStatusUpdate(app._id, "reviewing");
  const handleShortlist     = (app: SchoolApplication) => performStatusUpdate(app._id, "shortlisted");
  const handleRejectConfirm = async (appId: string, reason: string) => {
    await performStatusUpdate(appId, "rejected", { rejectionReason: reason });
  };
  const handleScheduled = (appId: string) =>
    setApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: "interview_scheduled" as const } : a))
    );
  const handleOfferExtended = (appId: string) =>
    setApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: "offer_extended" as const } : a))
    );

  const SORT_LABELS = tt.sortLabels as Record<SortMode, string>;

  return (
    <div className="flex h-[calc(100vh-7.5rem)] overflow-hidden">

      {/* ── Left Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 border-e border-gray-100 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{tt.filterByJobTitle}</h2>

          {/* All Jobs */}
          <button
            onClick={() => setSelectedJobId(null)}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
              !selectedJobId
                ? "text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            style={!selectedJobId ? { background: "var(--brand-gradient)" } : {}}
          >
            <span className="flex items-center gap-2">
              <Users size={14} className={!selectedJobId ? "text-white/80" : "text-gray-400"} />
              {tt.allJobsLabel}
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center ${
                !selectedJobId ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {applications.length}
            </span>
          </button>
        </div>

        {/* Job list */}
        <div className="flex-1 p-3 space-y-1">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))
          ) : jobs.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">{tt.noActiveJobsLabel}</p>
          ) : (
            jobs.map((job) => {
              const count   = appCountByJob[job._id] ?? 0;
              const active  = selectedJobId === job._id;
              return (
                <button
                  key={job._id}
                  onClick={() => setSelectedJobId(active ? null : job._id)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-start ${
                    active
                      ? "text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={active ? { background: "var(--brand-gradient)" } : {}}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Briefcase
                      size={13}
                      className={active ? "text-white/80 shrink-0" : "text-gray-400 shrink-0"}
                    />
                    <span className="truncate text-xs">{job.title}</span>
                  </span>
                  {count > 0 && (
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center shrink-0 ${
                        active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {formatNumber(count, lang)}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Link to post jobs */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/school/jobs"
            className="flex items-center gap-2 text-xs font-medium hover:underline"
            style={{ color: "var(--brand-primary)" }}
          >
            <FileText size={12} />
            {tt.manageJobPostingsLink}
            {isRTL ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 size={28} className="animate-spin text-gray-300" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3">
            <AlertCircle size={30} className="text-red-400" />
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={loadAll}
              className="px-4 py-2 text-sm font-medium text-white rounded-xl"
              style={{ background: "var(--brand-gradient)" }}
            >
              {t.school.common.retry}
            </button>
          </div>
        ) : (
          <>
            {/* Pipeline stats */}
            <div className="px-4 lg:px-6 pt-5 pb-3 border-b border-gray-100 bg-white">
              <PipelineStatsBar
                applications={
                  selectedJobId
                    ? applications.filter((a) => jobId(a.jobId) === selectedJobId)
                    : applications
                }
              />
            </div>

            {/* Controls: status tabs + sort */}
            <div className="flex items-center justify-between gap-3 px-4 lg:px-6 py-3 border-b border-gray-100 bg-white">
              {/* Status tabs — scrollable */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1">
                {STATUS_TAB_VALUES.map((value) => {
                  const active = statusTab === value;
                  const count  = countForTab(value);
                  return (
                    <button
                      key={value}
                      onClick={() => setStatusTab(value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                        active
                          ? "text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                      style={active ? { background: "var(--brand-gradient)" } : {}}
                    >
                      <span className="hidden sm:inline">{tt.statusTabLabels[value]}</span>
                      <span className="sm:hidden">{tt.statusTabShortLabels[value]}</span>
                      {count > 0 && (
                        <span
                          className={`text-xs font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center ${
                            active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {formatNumber(count, lang)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sort dropdown */}
              <div className="relative shrink-0" ref={sortRef}>
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowUpDown size={12} />
                  <span className="hidden sm:inline">{SORT_LABELS[sortMode]}</span>
                </button>
                {sortOpen && (
                  <div className="absolute end-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20">
                    {(Object.entries(SORT_LABELS) as [SortMode, string][]).map(([mode, label]) => (
                      <button
                        key={mode}
                        onClick={() => { setSortMode(mode); setSortOpen(false); }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                          sortMode === mode
                            ? "font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                        style={sortMode === mode ? { color: "var(--brand-primary)" } : {}}
                      >
                        {sortMode === mode && <CheckCircle2 size={12} />}
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Application list */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
              {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <FileText size={28} className="text-gray-400" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{tt.emptyTitle}</h3>
                  <p className="text-sm text-gray-400">
                    {statusTab !== "all"
                      ? tt.emptyBodyFilteredTemplate.replace("{status}", tt.statusTabLabels[statusTab])
                      : selectedJobId
                      ? tt.emptyBodyJobSelected
                      : tt.emptyBodyDefault}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sorted.map((app) => (
                    <ApplicationCard
                      key={app._id}
                      application={app}
                      actionLoading={actionLoading}
                      onStartReview={handleStartReview}
                      onShortlist={handleShortlist}
                      onRejectClick={setRejectTarget}
                      onScheduleInterview={setScheduleTarget}
                      onExtendOffer={setOfferTarget}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      {rejectTarget && (
        <RejectModal
          applicationId={rejectTarget._id}
          candidateName={candidateName(rejectTarget.teacherId, t.school.common.candidateFallback)}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleRejectConfirm}
        />
      )}
      {scheduleTarget && (
        <ScheduleInterviewModal
          application={scheduleTarget}
          onClose={() => setScheduleTarget(null)}
          onScheduled={handleScheduled}
        />
      )}
      {offerTarget && (
        <OfferModal
          application={offerTarget}
          onClose={() => setOfferTarget(null)}
          onExtended={handleOfferExtended}
        />
      )}
    </div>
  );
}
