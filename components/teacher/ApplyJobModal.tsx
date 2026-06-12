"use client";

// SRD 2.4.1 — One-Tap Apply confirmation modal. Shows job summary + applicant
// preview + optional cover letter (capped at 500 chars), then submits with the
// cover letter to the parent-supplied onConfirm handler.

import { useEffect, useRef, useState } from "react";
import { X, Loader2, Zap, MapPin, BookOpen, Briefcase, Banknote, CalendarDays } from "lucide-react";
import type { Job } from "@/lib/api/teacher";

const COVER_LETTER_MAX = 500;

const CITY_LABELS: Record<string, string> = {
  riyadh: "Riyadh", jeddah: "Jeddah", khobar: "Khobar", dammam: "Dammam",
  mecca: "Makkah", medina: "Madinah", abha: "Abha", tabuk: "Tabuk",
};

function salaryText(job: Job): string {
  if (job.salary.display === "negotiable") return "Negotiable";
  if (job.salary.display === "hide")       return "Undisclosed";
  if (job.salary.min && job.salary.max) {
    return `SAR ${job.salary.min.toLocaleString()}–${job.salary.max.toLocaleString()}/mo`;
  }
  return "Salary on request";
}

export interface ApplyJobModalProps {
  job: Job;
  applicantName?: string;
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (coverLetter: string) => void | Promise<void>;
}

export function ApplyJobModal({
  job, applicantName, isOpen, isSubmitting, onClose, onConfirm,
}: ApplyJobModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset the form when the modal opens for a new job (or re-opens)
  useEffect(() => {
    if (isOpen) setCoverLetter("");
  }, [isOpen, job._id]);

  // Esc to close + lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !isSubmitting) onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const remaining = COVER_LETTER_MAX - coverLetter.length;
  const overLimit = remaining < 0;

  const handleConfirm = async () => {
    if (overLimit || isSubmitting) return;
    await onConfirm(coverLetter.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-slate-900/50 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-full overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Confirm application
            </p>
            <h2 id="apply-modal-title" className="text-lg font-semibold text-slate-900 leading-snug truncate">
              {job.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Job summary */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40">
          <p className="text-xs font-semibold text-slate-500 mb-2">{job.school?.name ?? ""}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" />{CITY_LABELS[job.city] ?? job.city}</div>
            {job.subjects?.[0] && (
              <div className="flex items-center gap-1.5"><BookOpen size={12} className="text-slate-400" />{job.subjects.join(", ")}</div>
            )}
            <div className="flex items-center gap-1.5"><Briefcase size={12} className="text-slate-400" />{job.employmentType?.replace("_", "-")}</div>
            <div className="flex items-center gap-1.5"><Banknote size={12} className="text-slate-400" />{salaryText(job)}</div>
            {job.deadline && (
              <div className="flex items-center gap-1.5 col-span-2"><CalendarDays size={12} className="text-slate-400" />Deadline {new Date(job.deadline).toLocaleDateString("en-SA")}</div>
            )}
          </div>
        </div>

        {/* Applicant preview */}
        {applicantName && (
          <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ background: "var(--brand-gradient)" }}>
              {applicantName[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-400">Applying as</p>
              <p className="text-sm font-semibold text-slate-700 truncate">{applicantName}</p>
            </div>
          </div>
        )}

        {/* Cover letter */}
        <div className="px-6 py-4">
          <div className="flex items-baseline justify-between mb-2">
            <label htmlFor="apply-cover-letter" className="text-xs font-semibold text-slate-700">
              Cover letter <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <span className={`text-[11px] tabular-nums ${overLimit ? "text-red-500 font-semibold" : "text-slate-400"}`}>
              {coverLetter.length} / {COVER_LETTER_MAX}
            </span>
          </div>
          <textarea
            id="apply-cover-letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value.slice(0, COVER_LETTER_MAX))}
            disabled={isSubmitting}
            rows={8}
            maxLength={COVER_LETTER_MAX}
            placeholder="Add a short note about why you're a great fit (max 500 characters)…"
            className="w-full px-3 py-2.5 text-sm leading-relaxed border rounded-lg outline-none transition-all resize-y min-h-[180px] disabled:bg-slate-50"
            style={{ borderColor: overLimit ? "rgb(239 68 68)" : "rgb(226 232 240)" }}
            onFocus={(e) => {
              if (!overLimit) {
                e.currentTarget.style.borderColor = "var(--brand-primary)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--brand-primary-light)";
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "";
              if (!overLimit) e.currentTarget.style.borderColor = "rgb(226 232 240)";
            }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting || overLimit}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            style={{ background: "var(--brand-gradient)" }}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            {isSubmitting ? "Applying…" : "Confirm & Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}
