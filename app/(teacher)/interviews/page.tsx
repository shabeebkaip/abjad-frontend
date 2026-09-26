"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Building2,
  Video,
  Phone,
  Users,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Bell,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  BookOpen,
  RefreshCw,
  AlertCircle,
  Star,
  Download,
  Loader2,
} from "lucide-react";
import { listInterviews, respondToInterview, submitInterviewFeedback } from "@/lib/api/teacher";
import { InterviewResponseModal, type InterviewResponseMode } from "@/components/teacher/InterviewResponseModal";
import { InterviewFeedbackModal } from "@/components/teacher/InterviewFeedbackModal";
import type { Interview as ApiInterview } from "@/lib/api/teacher";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatDate, formatTime } from "@/lib/i18n/format";

// ── Type mapping — canonical (English) keys used internally; display text
// always comes from tt.typeLabels / tt.statusLabels. ─────────────────────────

type UIInterviewType = "Video" | "In-Person" | "Phone";
type UIInterviewStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled" | "Rescheduled";

function toUIType(apiType: ApiInterview["type"]): UIInterviewType {
  if (apiType === "video")     return "Video";
  if (apiType === "in_person") return "In-Person";
  return "Phone";
}

function toUIStatus(apiStatus: ApiInterview["status"]): UIInterviewStatus {
  const map: Record<ApiInterview["status"], UIInterviewStatus> = {
    pending:    "Pending",
    accepted:   "Confirmed",
    declined:   "Cancelled",
    rescheduled:"Rescheduled",
    completed:  "Completed",
    cancelled:  "Cancelled",
  };
  return map[apiStatus] ?? "Pending";
}

// ── Style maps ────────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<UIInterviewType, React.ReactNode> = {
  Video:       <Video className="w-4 h-4" />,
  "In-Person": <Users className="w-4 h-4" />,
  Phone:       <Phone className="w-4 h-4" />,
};

const TYPE_STYLE: Record<UIInterviewType, string> = {
  Video:       "bg-blue-50 text-blue-600 border-blue-200",
  "In-Person": "bg-purple-50 text-purple-600 border-purple-200",
  Phone:       "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const STATUS_STYLE: Record<UIInterviewStatus, string> = {
  Confirmed:   "bg-emerald-50 text-emerald-600 border-emerald-200",
  Pending:     "bg-slate-50 text-slate-500 border-slate-200",
  Completed:   "bg-slate-100 text-slate-500 border-slate-200",
  Cancelled:   "bg-red-50 text-red-500 border-red-200",
  Rescheduled: "bg-orange-50 text-orange-600 border-orange-200",
};

const UPCOMING_API_STATUSES: ApiInterview["status"][] = ["pending", "accepted", "rescheduled"];

type TabView = "upcoming" | "all" | "completed";
type TT = ReturnType<typeof useTranslation>["t"]["teacher"]["interviews"];

function schoolName(schoolId: ApiInterview["schoolId"], fallback: string): string {
  return typeof schoolId === "object" ? schoolId.name : fallback;
}

function jobTitle(jobId: ApiInterview["jobId"], fallback: string): string {
  return typeof jobId === "object" ? jobId.title : fallback;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InterviewsPage() {
  const { t, lang, isRTL } = useTranslation();
  const tt = t.teacher.interviews;

  const [interviews, setInterviews] = useState<ApiInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabView>("upcoming");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [responding, setResponding] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await listInterviews({ limit: 50 });
      setInterviews(res.interviews);
      // Auto-expand first upcoming interview
      const first = res.interviews.find((i) => UPCOMING_API_STATUSES.includes(i.status));
      if (first) setExpandedId(first._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // SRD 2.6.2 — Decline and Reschedule require a reason (Reschedule also a
  // proposed new time). Accept stays one-tap. The modal collects the inputs
  // then calls handleSubmitResponse.
  const [responseModal, setResponseModal] = useState<{ id: string; mode: InterviewResponseMode } | null>(null);

  const handleRespond = async (id: string, action: "accepted" | "declined" | "reschedule_requested") => {
    if (action === "accepted") {
      setResponding(id);
      try {
        const updated = await respondToInterview(id, action);
        setInterviews((prev) => prev.map((i) => i._id === id ? updated : i));
      } catch (err) {
        console.error(err);
      } finally {
        setResponding(null);
      }
      return;
    }
    // declined / reschedule_requested → open modal first
    setResponseModal({ id, mode: action === "declined" ? "decline" : "reschedule" });
  };

  const handleSubmitResponse = async (reason: string, proposedTime?: string) => {
    if (!responseModal) return;
    const { id, mode } = responseModal;
    const action = mode === "decline" ? "declined" : "reschedule_requested";
    setResponding(id);
    try {
      const updated = await respondToInterview(id, action, reason, proposedTime);
      setInterviews((prev) => prev.map((i) => i._id === id ? updated : i));
      setResponseModal(null);
    } catch (err) {
      console.error(err);
    } finally {
      setResponding(null);
    }
  };

  // SRD 2.6.4 — teacher post-interview feedback modal
  const [feedbackModalId, setFeedbackModalId] = useState<string | null>(null);

  const handleSubmitFeedback = async (rating: number, comment?: string) => {
    if (!feedbackModalId) return;
    setResponding(feedbackModalId);
    try {
      const updated = await submitInterviewFeedback(feedbackModalId, rating, comment);
      setInterviews((prev) => prev.map((i) => i._id === feedbackModalId ? updated : i));
      setFeedbackModalId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setResponding(null);
    }
  };

  const filtered = interviews.filter((i) => {
    if (activeTab === "upcoming")  return UPCOMING_API_STATUSES.includes(i.status);
    if (activeTab === "completed") return i.status === "completed" || i.status === "cancelled" || i.status === "declined";
    return true;
  });

  const upcomingCount  = interviews.filter((i) => UPCOMING_API_STATUSES.includes(i.status)).length;
  const confirmedCount = interviews.filter((i) => i.status === "accepted").length;
  const completedCount = interviews.filter((i) => i.status === "completed").length;
  const cancelledCount = interviews.filter((i) => i.status === "cancelled" || i.status === "declined").length;

  const nextInterview = interviews.find((i) => i.status === "accepted");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-800">{tt.title}</h1>
        <p className="text-sm text-slate-500 mt-0.5">{tt.subtitle}</p>
      </div>

      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            {/* Next Interview Banner */}
            {nextInterview && (
              <div className="rounded-2xl p-5 text-white" style={{ background: "var(--brand-gradient)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-wide mb-1">
                      {tt.nextInterview}
                    </p>
                    <h2 className="text-xl font-bold">{jobTitle(nextInterview.jobId, tt.jobFallback)}</h2>
                    <p className="text-white/70 mt-0.5">{schoolName(nextInterview.schoolId, tt.schoolFallback)}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-white/60 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-4 h-4" /> {formatDate(nextInterview.scheduledAt, lang, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {formatTime(nextInterview.scheduledAt, lang)} · {nextInterview.duration} {tt.minutesSuffix}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {TYPE_ICONS[toUIType(nextInterview.type)]} {tt.typeLabels[toUIType(nextInterview.type)]}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    {nextInterview.meetingLink && (
                      <a
                        href={nextInterview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        <Video className="w-4 h-4" /> {tt.joinMeeting}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => openCalendar(nextInterview, tt)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                      <Download className="w-4 h-4" /> {tt.addToCalendar}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: tt.statUpcoming,  value: upcomingCount,  icon: <Calendar className="w-5 h-5 text-amber-500" />,   bg: "bg-amber-50" },
                { label: tt.statConfirmed, value: confirmedCount, icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, bg: "bg-emerald-50" },
                { label: tt.statCompleted, value: completedCount, icon: <Star className="w-5 h-5 text-blue-500" />,         bg: "bg-blue-50" },
                { label: tt.statCancelled, value: cancelledCount, icon: <XCircle className="w-5 h-5 text-red-400" />,       bg: "bg-red-50" },
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

            {/* Tab + List */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex border-b border-slate-200">
                {([
                  { value: "upcoming",  label: tt.tabUpcoming.replace("{n}", String(upcomingCount)) },
                  { value: "all",       label: tt.tabAll.replace("{n}", String(interviews.length)) },
                  { value: "completed", label: tt.tabPast },
                ] as { value: TabView; label: string }[]).map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.value
                        ? "border-brand-primary text-brand-primary bg-brand-primary-light"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-slate-500">{tt.emptyTitle}</p>
                  </div>
                ) : (
                  filtered.map((interview) => (
                    <InterviewCard
                      key={interview._id}
                      interview={interview}
                      expanded={expandedId === interview._id}
                      responding={responding === interview._id}
                      onToggle={() => setExpandedId(expandedId === interview._id ? null : interview._id)}
                      onRespond={handleRespond}
                      onOpenFeedback={() => setFeedbackModalId(interview._id)}
                      tt={tt}
                      lang={lang}
                      isRTL={isRTL}
                    />
                  ))
                )}
              </div>
            </div>

            {/* General Tips */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: "var(--brand-primary)" }} />
                {tt.generalTipsTitle}
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {tt.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                      style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
                    >
                      {i + 1}
                    </div>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* SRD 2.6.2 — Decline / Reschedule reason capture */}
      {responseModal && (() => {
        const interview = interviews.find((i) => i._id === responseModal.id);
        if (!interview) return null;
        return (
          <InterviewResponseModal
            interview={interview}
            mode={responseModal.mode}
            isOpen
            isSubmitting={responding === responseModal.id}
            onClose={() => { if (responding !== responseModal.id) setResponseModal(null); }}
            onConfirm={handleSubmitResponse}
          />
        );
      })()}

      {/* SRD 2.6.4 — post-interview feedback */}
      {feedbackModalId && (() => {
        const interview = interviews.find((i) => i._id === feedbackModalId);
        if (!interview) return null;
        return (
          <InterviewFeedbackModal
            interview={interview}
            isOpen
            isSubmitting={responding === feedbackModalId}
            onClose={() => { if (responding !== feedbackModalId) setFeedbackModalId(null); }}
            onConfirm={handleSubmitFeedback}
          />
        );
      })()}
    </div>
  );
}

// ── Interview Card ─────────────────────────────────────────────────────────────

function InterviewCard({
  interview,
  expanded,
  responding,
  onToggle,
  onRespond,
  onOpenFeedback,
  tt,
  lang,
  isRTL,
}: {
  interview: ApiInterview;
  expanded: boolean;
  responding: boolean;
  onToggle: () => void;
  onRespond: (id: string, action: "accepted" | "declined" | "reschedule_requested") => void;
  onOpenFeedback: () => void;
  tt: TT;
  lang: "en" | "ar";
  isRTL: boolean;
}) {
  const uiT  = toUIType(interview.type);
  const uiS  = toUIStatus(interview.status);
  const isActive = UPCOMING_API_STATUSES.includes(interview.status);
  const day = formatDate(interview.scheduledAt, lang, { day: "numeric" });
  const month = formatDate(interview.scheduledAt, lang, { month: "short" });
  const weekday = formatDate(interview.scheduledAt, lang, { weekday: "short" });

  return (
    <div className={`p-5 hover:bg-slate-50/50 transition-colors ${uiS === "Cancelled" ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-4">
        {/* Date block */}
        <div className="w-14 shrink-0 text-center">
          <div className="bg-slate-100 rounded-xl p-2">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">{weekday}</p>
            <p className="text-xl font-bold text-slate-800 leading-none mt-0.5">{day}</p>
            <p className="text-[10px] text-slate-500">{month}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-800 leading-snug">{jobTitle(interview.jobId, tt.jobFallback)}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5" /> {schoolName(interview.schoolId, tt.schoolFallback)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${TYPE_STYLE[uiT]}`}>
                {TYPE_ICONS[uiT]} {tt.typeLabels[uiT]}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${STATUS_STYLE[uiS]}`}>
                {tt.statusLabels[uiS]}
              </span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {formatTime(interview.scheduledAt, lang)} · {interview.duration} {tt.minutesSuffix}
            </span>
            {interview.meetingLink && (
              <span className="flex items-center gap-1">
                <Video className="w-3.5 h-3.5" /> {tt.meetingLinkAvailable}
              </span>
            )}
          </div>

          {/* Actions */}
          {isActive && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {interview.meetingLink && (
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-colors hover:opacity-90"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  <Video className="w-3.5 h-3.5" /> {tt.joinMeeting}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {interview.status === "pending" && (
                <>
                  <button
                    disabled={responding}
                    onClick={() => onRespond(interview._id, "accepted")}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {responding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    {tt.confirm}
                  </button>
                  <button
                    disabled={responding}
                    onClick={() => onRespond(interview._id, "reschedule_requested")}
                    className="flex items-center gap-1 px-3 py-1.5 border border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> {tt.reschedule}
                  </button>
                  <button
                    disabled={responding}
                    onClick={() => onRespond(interview._id, "declined")}
                    className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" /> {tt.decline}
                  </button>
                </>
              )}
              <button
                onClick={() => openCalendar(interview, tt)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> {tt.addToCalendar}
              </button>
            </div>
          )}

          {/* SRD 2.6.4 — feedback CTA on completed interviews */}
          {interview.status === "completed" && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <button
                onClick={onOpenFeedback}
                disabled={responding}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--brand-gradient)" }}
              >
                {responding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Star className="w-3.5 h-3.5" />}
                {interview.teacherFeedback ? tt.editFeedback : tt.submitFeedback}
              </button>
              {interview.teacherFeedback && (
                <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {interview.teacherFeedback.rating}/5
                </span>
              )}
            </div>
          )}

          {/* Expand toggle — disclosure caret, vertical-axis behavior, no RTL
              flip (same reasoning as applications page; edge case noted in
              M2 report since DESIGN_SPEC didn't cover this exact pattern). */}
          <button
            onClick={onToggle}
            className="mt-2 flex items-center gap-1 text-xs font-medium"
            style={{ color: "var(--brand-primary)" }}
          >
            {expanded ? tt.hideDetails : tt.showDetails}
            {isRTL
              ? <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${expanded ? "-rotate-90" : ""}`} />
              : <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
            }
          </button>

          {/* Expanded details */}
          {expanded && (
            <div className="mt-4 space-y-4">
              {(interview.interviewers ?? []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{tt.interviewersLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    {interview.interviewers!.map((iv, i) => (
                      <span key={i} className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {iv.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {interview.instructions && (
                <div className="flex items-start gap-2 text-sm text-slate-600 bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p>{interview.instructions}</p>
                </div>
              )}
              {interview.responseDeadline && interview.status === "pending" && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <Bell className="w-3.5 h-3.5 shrink-0" />
                  {tt.respondBy.replace("{date}", formatDate(interview.responseDeadline, lang))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Calendar helper ───────────────────────────────────────────────────────────

function openCalendar(interview: ApiInterview, tt: TT) {
  const title   = encodeURIComponent(`${jobTitle(interview.jobId, tt.jobFallback)} — ${schoolName(interview.schoolId, tt.schoolFallback)}`);
  const details = encodeURIComponent(
    `${tt.typeLabels[toUIType(interview.type)]}${interview.meetingLink ? `\n${interview.meetingLink}` : ""}`
  );
  window.open(`https://calendar.google.com/calendar/r/eventedit?text=${title}&details=${details}`, "_blank");
}
