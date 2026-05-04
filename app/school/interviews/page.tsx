"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Video, Phone, MapPin, Calendar, Clock,
  Loader2, AlertCircle, X, Star, CheckCircle2,
  XCircle, Users, ChevronDown, ExternalLink,
} from "lucide-react";
import {
  listSchoolInterviews,
  cancelInterview,
  completeInterview,
} from "@/lib/api/school";
import type { SchoolInterview } from "@/lib/api/school";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatScheduledAt(isoStr: string): string {
  const d    = new Date(isoStr);
  const now  = new Date();
  const diff = d.getTime() - now.getTime();
  const todayStr    = now.toDateString();
  const tomorrowStr = new Date(now.getTime() + 86_400_000).toDateString();
  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (d.toDateString() === todayStr)    return `Today at ${timeStr}`;
  if (d.toDateString() === tomorrowStr) return `Tomorrow at ${timeStr}`;
  if (diff < 0) {
    const days = Math.abs(Math.floor(diff / 86_400_000));
    return `${days}d ago — ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${timeStr}`;
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ` at ${timeStr}`;
}

function teacherName(teacherId: SchoolInterview["teacherId"]): string {
  if (typeof teacherId === "object" && teacherId.name) return teacherId.name;
  return "Candidate";
}

function teacherEmail(teacherId: SchoolInterview["teacherId"]): string | null {
  if (typeof teacherId === "object" && teacherId.email) return teacherId.email;
  return null;
}

function jobTitleStr(jobId: SchoolInterview["jobId"]): string {
  if (typeof jobId === "object") return jobId.title;
  return "Position";
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

interface StatsRowProps {
  interviews: SchoolInterview[];
}

function StatsRow({ interviews }: StatsRowProps) {
  const stats = [
    { label: "Total",     count: interviews.length,                                              color: "text-gray-900", bg: "bg-gray-100" },
    { label: "Pending",   count: interviews.filter((i) => i.status === "pending").length,        color: "text-amber-700", bg: "bg-amber-100" },
    { label: "Accepted",  count: interviews.filter((i) => i.status === "accepted").length,       color: "text-green-700", bg: "bg-green-100" },
    { label: "Completed", count: interviews.filter((i) => i.status === "completed").length,      color: "text-slate-600", bg: "bg-slate-100" },
    { label: "Cancelled", count: interviews.filter((i) => i.status === "cancelled").length,      color: "text-red-600",   bg: "bg-red-100"   },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {stats.map(({ label, count, color, bg }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <div className={`text-2xl font-bold ${color} mb-0.5`}>{count}</div>
          <div className="text-xs text-gray-400">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SchoolInterview["status"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:     { label: "Pending",    cls: "bg-amber-100 text-amber-700 border-amber-200"     },
    accepted:    { label: "Accepted",   cls: "bg-green-100 text-green-700 border-green-200"     },
    declined:    { label: "Declined",   cls: "bg-red-100 text-red-600 border-red-200"           },
    rescheduled: { label: "Rescheduled",cls: "bg-blue-100 text-blue-700 border-blue-200"        },
    completed:   { label: "Completed",  cls: "bg-slate-100 text-slate-600 border-slate-200"     },
    cancelled:   { label: "Cancelled",  cls: "bg-red-100 text-red-500 border-red-200"           },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cls}`}>{label}</span>
  );
}

// ─── Type Icon ────────────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: SchoolInterview["type"] }) {
  if (type === "video")            return <Video size={15} className="text-blue-500" />;
  if (type === "phone")            return <Phone size={15} className="text-emerald-500" />;
  if (type === "in_person")        return <MapPin size={15} className="text-purple-500" />;
  return <Users size={15} className="text-indigo-500" />;
}

function typeLabel(type: SchoolInterview["type"]): string {
  const m: Record<string, string> = {
    video:              "Video",
    phone:              "Phone",
    in_person:          "In-Person",
    abjad_coordinated:  "Abjad Coordinated",
  };
  return m[type] ?? type;
}

// ─── Feedback Modal ───────────────────────────────────────────────────────────

interface FeedbackModalProps {
  interview: SchoolInterview;
  onClose: () => void;
  onCompleted: (updated: SchoolInterview) => void;
}

function FeedbackModal({ interview, onClose, onCompleted }: FeedbackModalProps) {
  const [rating, setRating]                 = useState(0);
  const [hoverRating, setHoverRating]       = useState(0);
  const [strengths, setStrengths]           = useState("");
  const [weaknesses, setWeaknesses]         = useState("");
  const [recommendation, setRecommendation] = useState<"hire" | "maybe" | "reject" | "">("");
  const [notes, setNotes]                   = useState("");
  const [evaluator, setEvaluator]           = useState("");
  const [saving, setSaving]                 = useState(false);
  const [error, setError]                   = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0)          { setError("Please provide a rating."); return; }
    if (!recommendation)       { setError("Please select a recommendation."); return; }
    setSaving(true);
    setError(null);
    try {
      const updated = await completeInterview(interview._id, {
        rating,
        strengths:      strengths.trim()  || undefined,
        weaknesses:     weaknesses.trim() || undefined,
        recommendation: recommendation as "hire" | "maybe" | "reject",
        notes:          notes.trim()      || undefined,
        evaluator:      evaluator.trim()  || undefined,
      });
      onCompleted(updated);
      onClose();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to submit feedback.");
    } finally {
      setSaving(false);
    }
  };

  const tName = teacherName(interview.teacherId);
  const jTitle = jobTitleStr(interview.jobId);

  const recOptions: { value: "hire" | "maybe" | "reject"; label: string; cls: string; activeCls: string }[] = [
    { value: "hire",   label: "Hire",   cls: "border-gray-200 text-gray-600",      activeCls: "border-transparent text-white bg-green-500"  },
    { value: "maybe",  label: "Maybe",  cls: "border-gray-200 text-gray-600",      activeCls: "border-transparent text-white bg-amber-500"  },
    { value: "reject", label: "Reject", cls: "border-gray-200 text-gray-600",      activeCls: "border-transparent text-white bg-red-500"    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--brand-gradient)" }}
            >
              <CheckCircle2 size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Complete Interview</h3>
              <p className="text-xs text-gray-500">{tName} · {jTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl mb-4">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-500 ml-1">{rating}/5</span>
              )}
            </div>
          </div>

          {/* Strengths */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Strengths</label>
            <textarea
              rows={3}
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="What did the candidate do well?"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>

          {/* Weaknesses */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Areas for Improvement</label>
            <textarea
              rows={3}
              value={weaknesses}
              onChange={(e) => setWeaknesses(e.target.value)}
              placeholder="What areas need development?"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Recommendation <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {recOptions.map(({ value, label, cls, activeCls }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRecommendation(value)}
                  className={`py-2.5 text-sm font-semibold rounded-xl border transition-all ${
                    recommendation === value ? activeCls : `bg-white ${cls} hover:bg-gray-50`
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Additional Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other observations or comments…"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>

          {/* Evaluator */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Your Name (Evaluator)</label>
            <input
              type="text"
              value={evaluator}
              onChange={(e) => setEvaluator(e.target.value)}
              placeholder="e.g. Ahmed Al-Farsi"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || rating === 0 || !recommendation}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : (
              <><CheckCircle2 size={14} /> Submit Feedback</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Interview Card ───────────────────────────────────────────────────────────

interface InterviewCardProps {
  interview: SchoolInterview;
  actionLoading: string | null;
  onCancelClick: (interview: SchoolInterview) => void;
  onCompleteClick: (interview: SchoolInterview) => void;
}

function InterviewCard({ interview: iv, actionLoading, onCancelClick, onCompleteClick }: InterviewCardProps) {
  const isLoading = actionLoading === iv._id;
  const tName     = teacherName(iv.teacherId);
  const tEmail    = teacherEmail(iv.teacherId);
  const jTitle    = jobTitleStr(iv.jobId);
  const canCancel = iv.status === "pending" || iv.status === "accepted";
  const canComplete = iv.status === "accepted";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center z-10">
          <Loader2 size={22} className="animate-spin text-gray-400" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Type icon badge */}
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
          <TypeIcon type={iv.type} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Top row: name + status */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">{tName}</h3>
              {tEmail && <p className="text-xs text-gray-400 truncate">{tEmail}</p>}
            </div>
            <StatusBadge status={iv.status} />
          </div>

          {/* Job title */}
          <p className="text-xs text-gray-500 mb-3 truncate">
            {jTitle}
          </p>

          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
              <Calendar size={11} className="text-gray-400" />
              {formatScheduledAt(iv.scheduledAt)}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
              <Clock size={11} className="text-gray-400" />
              {iv.duration} min
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
              <TypeIcon type={iv.type} />
              {typeLabel(iv.type)}
            </span>
          </div>

          {/* Meeting link */}
          {iv.meetingLink && (
            <a
              href={iv.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium mb-3 hover:underline"
              style={{ color: "var(--brand-primary)" }}
            >
              <ExternalLink size={11} />
              Join Meeting
            </a>
          )}

          {/* Feedback summary (if completed) */}
          {iv.status === "completed" && iv.feedback && (
            <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-3 text-xs text-gray-600">
              <div className="flex items-center gap-2 mb-1">
                {iv.feedback.rating && (
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < iv.feedback!.rating! ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                )}
                {iv.feedback.recommendation && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      iv.feedback.recommendation === "hire"
                        ? "bg-green-100 text-green-700"
                        : iv.feedback.recommendation === "maybe"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {iv.feedback.recommendation.charAt(0).toUpperCase() + iv.feedback.recommendation.slice(1)}
                  </span>
                )}
              </div>
              {iv.feedback.notes && (
                <p className="text-gray-500 line-clamp-1 italic">{iv.feedback.notes}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {canComplete && (
              <button
                onClick={() => onCompleteClick(iv)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all hover:shadow-sm disabled:opacity-60"
                style={{ background: "var(--brand-gradient)" }}
              >
                <CheckCircle2 size={12} /> Mark Complete
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => onCancelClick(iv)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60"
              >
                <XCircle size={12} /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabFilter = "all" | "upcoming" | "pending_response" | "completed" | "cancelled";

const TABS: { value: TabFilter; label: string }[] = [
  { value: "all",              label: "All"              },
  { value: "upcoming",         label: "Upcoming"         },
  { value: "pending_response", label: "Pending Response" },
  { value: "completed",        label: "Completed"        },
  { value: "cancelled",        label: "Cancelled"        },
];

export default function InterviewsPage() {
  const [interviews, setInterviews]     = useState<SchoolInterview[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [tab, setTab]                   = useState<TabFilter>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedbackTarget, setFeedbackTarget] = useState<SchoolInterview | null>(null);

  const loadInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSchoolInterviews({ limit: 50 });
      setInterviews(res.interviews ?? []);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadInterviews(); }, [loadInterviews]);

  const filtered = interviews.filter((iv) => {
    if (tab === "all") return true;
    if (tab === "upcoming") {
      const future = new Date(iv.scheduledAt) > new Date();
      return future && (iv.status === "pending" || iv.status === "accepted");
    }
    if (tab === "pending_response") return iv.status === "pending";
    if (tab === "completed")  return iv.status === "completed";
    if (tab === "cancelled")  return iv.status === "cancelled";
    return true;
  });

  const countTab = (t: TabFilter) => {
    if (t === "all") return interviews.length;
    if (t === "upcoming") return interviews.filter((iv) => new Date(iv.scheduledAt) > new Date() && (iv.status === "pending" || iv.status === "accepted")).length;
    if (t === "pending_response") return interviews.filter((iv) => iv.status === "pending").length;
    if (t === "completed")  return interviews.filter((iv) => iv.status === "completed").length;
    if (t === "cancelled")  return interviews.filter((iv) => iv.status === "cancelled").length;
    return 0;
  };

  const handleCancel = async (iv: SchoolInterview) => {
    if (!confirm(`Cancel interview with ${teacherName(iv.teacherId)}?`)) return;
    setActionLoading(iv._id);
    try {
      const updated = await cancelInterview(iv._id);
      setInterviews((prev) => prev.map((i) => (i._id === iv._id ? updated : i)));
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleted = (updated: SchoolInterview) => {
    setInterviews((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar size={20} style={{ color: "var(--brand-primary)" }} />
          Interviews
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your scheduled interviews</p>
      </div>

      {/* Stats */}
      {!loading && !error && (
        <StatsRow interviews={interviews} />
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {TABS.map(({ value, label }) => {
          const active = tab === value;
          const count  = countTab(value);
          return (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                active ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
              style={active ? { color: "var(--brand-primary)" } : {}}
            >
              {label}
              {count > 0 && (
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-5 text-center ${
                    active ? "text-white" : "bg-gray-200 text-gray-600"
                  }`}
                  style={active ? { background: "var(--brand-gradient)" } : {}}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-gray-300" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle size={30} className="text-red-400" />
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={loadInterviews}
            className="px-4 py-2 text-sm font-medium text-white rounded-xl"
            style={{ background: "var(--brand-gradient)" }}
          >
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Calendar size={28} className="text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No interviews found</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            {tab === "all"
              ? "No interviews scheduled yet. Schedule interviews from the Applications page."
              : `No ${tab.replace("_", " ")} interviews.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((iv) => (
            <InterviewCard
              key={iv._id}
              interview={iv}
              actionLoading={actionLoading}
              onCancelClick={handleCancel}
              onCompleteClick={setFeedbackTarget}
            />
          ))}
        </div>
      )}

      {/* Feedback modal */}
      {feedbackTarget && (
        <FeedbackModal
          interview={feedbackTarget}
          onClose={() => setFeedbackTarget(null)}
          onCompleted={handleCompleted}
        />
      )}
    </div>
  );
}
