"use client";

// SRD 2.3.4 — dedicated Saved Jobs page. Lists everything the teacher has
// bookmarked, with Apply / Remove actions inline. Paginated at 20/page.

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Bookmark, MapPin, BookOpen, Clock, CheckCircle2, Loader2,
  Zap, Search, X, ChevronLeft, ChevronRight, Calendar,
} from "lucide-react";
import { getSavedJobs, unsaveJob, applyForJob } from "@/lib/api/teacher";
import type { Job } from "@/lib/api/teacher";
import { useAuth } from "@/lib/auth/useAuth";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatDate, formatNumber } from "@/lib/i18n/format";
import { ApplyJobModal } from "@/components/teacher/ApplyJobModal";
import { SARSymbol } from "@/components/ui/sar-symbol";

const PAGE_SIZE = 20;

export default function SavedJobsPage() {
  const { t, lang, isRTL } = useTranslation();
  const tt = t.teacher.savedJobs;
  const [jobs, setJobs]             = useState<Job[]>([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId]   = useState<string | null>(null);
  const [removingId, setRemovingId]   = useState<string | null>(null);

  const load = useCallback(async (nextPage = 1) => {
    setLoading(true);
    try {
      const res = await getSavedJobs(nextPage, PAGE_SIZE);
      setJobs(res.jobs);
      setTotal(res.total);
      setTotalPages(Math.max(1, res.totalPages));
      setPage(nextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1); }, [load]);

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await unsaveJob(id);
      // Remove from current page list
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setTotal((t2) => Math.max(0, t2 - 1));
      // If we just emptied the current page (and not the only one), step back
      if (jobs.length === 1 && page > 1) {
        load(page - 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  // SRD 2.4.1 — open the confirmation modal instead of applying immediately.
  const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);
  const { user } = useAuth();

  const handleApply = (id: string) => {
    const job = jobs.find((j) => j._id === id);
    if (!job) return;
    setApplyModalJob(job);
  };

  const handleApplyConfirm = async (coverLetter: string) => {
    if (!applyModalJob) return;
    const id = applyModalJob._id;
    setApplyingId(id);
    try {
      await applyForJob(id, coverLetter || undefined);
      setAppliedJobs((prev) => new Set([...prev, id]));
      setApplyModalJob(null);
    } catch (err) {
      console.error(err);
    } finally {
      setApplyingId(null);
    }
  };

  const handlePageChange = (next: number) => {
    if (next < 1 || next > totalPages || next === page) return;
    load(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const salaryText = (job: Job): React.ReactNode => {
    if (job.salary.display === "negotiable") return tt.salaryNegotiable;
    if (job.salary.display === "hide")       return tt.salaryUndisclosed;
    if (job.salary.min && job.salary.max) {
      return <><SARSymbol />{formatNumber(job.salary.min, lang)}–{formatNumber(job.salary.max, lang)}/mo</>;
    }
    return tt.salaryOnRequest;
  };

  const daysUntil = (isoStr: string): number =>
    Math.ceil((new Date(isoStr).getTime() - Date.now()) / 86_400_000);

  const deadlinePill = (deadline?: string): { label: string; cls: string } => {
    if (!deadline) return { label: "", cls: "" };
    const days = daysUntil(deadline);
    if (days < 0)  return { label: tt.closedLabel, cls: "bg-slate-100 text-slate-400" };
    if (days <= 3) return { label: tt.daysLeftLabel.replace("{n}", String(days)), cls: "bg-red-50 text-red-600" };
    if (days <= 7) return { label: tt.daysLeftLabel.replace("{n}", String(days)), cls: "bg-amber-50 text-amber-700" };
    return { label: tt.daysLeftLabel.replace("{n}", String(days)), cls: "bg-slate-50 text-slate-500" };
  };

  const postedLabel = (iso?: string): string => {
    if (!iso) return "";
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
    if (days === 0) return tt.postedToday;
    if (days === 1) return tt.postedOneDayAgo;
    return tt.postedDaysAgo.replace("{n}", String(days));
  };

  const schoolInitial = (job: Job): string => job.school?.name?.[0]?.toUpperCase() ?? "A";

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bookmark size={20} className="fill-current" style={{ color: "var(--brand-primary)" }} />
            {tt.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? tt.loading : total === 0 ? tt.emptyCount : tt.savedCount.replace("{n}", String(total)).replace("{plural}", total === 1 ? "" : lang === "ar" ? "" : "s")}
          </p>
        </div>
        <Link
          href="/jobs"
          className="text-sm font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <Search size={14} /> {tt.browseJobs}
        </Link>
      </div>

      {/* Body */}
      {loading ? (
        <SkeletonList />
      ) : jobs.length === 0 ? (
        <EmptyState tt={tt} />
      ) : (
        <>
          <div className="space-y-3">
            {jobs.map((job) => (
              <SavedJobCard
                key={job._id}
                job={job}
                isApplied={appliedJobs.has(job._id)}
                isApplying={applyingId === job._id}
                isRemoving={removingId === job._id}
                onApply={handleApply}
                onRemove={handleRemove}
                tt={tt}
                lang={lang}
                salaryText={salaryText}
                deadlinePill={deadlinePill}
                postedLabel={postedLabel}
                schoolInitial={schoolInitial}
              />
            ))}
          </div>

          {total > PAGE_SIZE && (
            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                {tt.showingOf
                  .replace("{start}", String((page - 1) * PAGE_SIZE + 1))
                  .replace("{end}", String(Math.min(page * PAGE_SIZE, total)))
                  .replace("{total}", String(total))}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label={tt.previousPageLabel}
                >
                  {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
                <span className="text-xs font-semibold text-slate-700 px-2">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label={tt.nextPageLabel}
                >
                  {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* SRD 2.4.1 — Apply confirmation modal */}
      {applyModalJob && (
        <ApplyJobModal
          job={applyModalJob}
          applicantName={user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : undefined}
          isOpen={!!applyModalJob}
          isSubmitting={applyingId === applyModalJob._id}
          onClose={() => { if (!applyingId) setApplyModalJob(null); }}
          onConfirm={handleApplyConfirm}
        />
      )}
    </div>
  );
}

// ── Components ────────────────────────────────────────────────────────────────

type TT = ReturnType<typeof useTranslation>["t"]["teacher"]["savedJobs"];

function SavedJobCard({ job, isApplied, isApplying, isRemoving, onApply, onRemove, tt, lang, salaryText, deadlinePill, postedLabel, schoolInitial }: {
  job: Job;
  isApplied: boolean;
  isApplying: boolean;
  isRemoving: boolean;
  onApply: (id: string) => void;
  onRemove: (id: string) => void;
  tt: TT;
  lang: "en" | "ar";
  salaryText: (job: Job) => React.ReactNode;
  deadlinePill: (deadline?: string) => { label: string; cls: string };
  postedLabel: (iso?: string) => string;
  schoolInitial: (job: Job) => string;
}) {
  const deadline = deadlinePill(job.deadline);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        {job.school?.logoUrl ? (
          <img src={job.school.logoUrl} alt="" className="w-12 h-12 rounded-xl shrink-0 object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-white font-bold" style={{ background: "var(--brand-gradient)" }}>
            {schoolInitial(job)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-900 leading-snug truncate">{job.title}</h3>
          {job.school?.name && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{job.school.name}</p>
          )}
        </div>
        <span className="text-[11px] text-slate-400 shrink-0">{postedLabel(job.createdAt)}</span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin size={12} />{tt.cityLabels[job.city] ?? job.city}</span>
        {job.subjects?.[0] && <span className="flex items-center gap-1"><BookOpen size={12} />{job.subjects[0]}</span>}
        <span className="flex items-center gap-1"><Clock size={12} />{job.employmentType?.replace("_", "-")}</span>
        {job.deadline && (
          <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(job.deadline, lang)}</span>
        )}
      </div>

      {/* Salary + badges */}
      <div className="flex items-center gap-2 flex-wrap pb-4 mb-4 border-b border-slate-100">
        <span className="text-sm font-semibold text-slate-800">{salaryText(job)}</span>
        {job.matchScore != null && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            job.matchScore >= 80 ? "bg-green-50 text-green-700" :
            job.matchScore >= 60 ? "bg-blue-50 text-blue-700" :
            "bg-slate-100 text-slate-500"
          }`}>
            {tt.matchPercent.replace("{n}", String(job.matchScore))}
          </span>
        )}
        {deadline.label && (
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${deadline.cls}`}>{deadline.label}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onRemove(job._id)}
          disabled={isRemoving}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
        >
          {isRemoving ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
          {tt.removeBtn}
        </button>
        <div className="flex-1" />
        {isApplied ? (
          <span className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={12} /> {tt.applied}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onApply(job._id)}
            disabled={isApplying}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            style={{ background: "var(--brand-gradient)" }}
          >
            {isApplying ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
            {isApplying ? tt.applying : tt.applyNow}
          </button>
        )}
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100" />
            <div className="flex-1">
              <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          </div>
          <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
          <div className="h-4 bg-slate-100 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ tt }: { tt: TT }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 px-6 py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
        <Bookmark size={24} className="text-slate-300" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{tt.emptyTitle}</h3>
      <p className="text-sm text-slate-400 mb-5">{tt.emptyBody}</p>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg text-white shadow-sm hover:opacity-90 transition-opacity"
        style={{ background: "var(--brand-gradient)" }}
      >
        <Search size={14} /> {tt.browseJobs}
      </Link>
    </div>
  );
}
