"use client";

// SRD 2.9.5 — Post-hire feedback. Teachers rate the school and the hiring
// experience after being hired, with an optional anonymous toggle so they can
// speak freely without identifying themselves.

import { useEffect, useState } from "react";
import { X, Loader2, Star, MessageSquare, ShieldCheck } from "lucide-react";

export interface PostHireFeedbackPayload {
  rating: number;
  content: string;
  isAnonymous: boolean;
}

export interface PostHireFeedbackModalProps {
  schoolName?: string;
  jobTitle?: string;
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: PostHireFeedbackPayload) => void | Promise<void>;
}

const CONTENT_MAX = 2000;

export function PostHireFeedbackModal({
  schoolName, jobTitle, isOpen, isSubmitting, onClose, onConfirm,
}: PostHireFeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover]   = useState(0);
  const [content, setContent]         = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHover(0);
      setContent("");
      setIsAnonymous(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !isSubmitting) onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const trimmed   = content.trim();
  const overLimit = content.length > CONTENT_MAX;
  const canSubmit = rating >= 1 && rating <= 5 && trimmed.length > 0 && !overLimit && !isSubmitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    await onConfirm({ rating, content: trimmed, isAnonymous });
  };

  const ratingHints: Record<number, string> = {
    1: "Poor",
    2: "Below expectations",
    3: "OK",
    4: "Good",
    5: "Excellent",
  };
  const activeRating = hover || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-slate-900/50 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-hire-title"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-full overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <MessageSquare size={16} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <h2 id="post-hire-title" className="text-base font-semibold text-slate-900 leading-snug">
                Share your hiring experience
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {jobTitle ?? "Post-hire feedback"}
                {schoolName ? ` · ${schoolName}` : ""}
              </p>
            </div>
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

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Star rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              How was the school and hiring process? <span className="text-red-500">*</span>
            </label>
            <div
              className="flex items-center gap-1.5"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = activeRating >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    disabled={isSubmitting}
                    className="p-1 rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50"
                  >
                    <Star
                      size={32}
                      className={filled ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                    />
                  </button>
                );
              })}
              {activeRating > 0 && (
                <span className="ml-2 text-sm font-medium text-slate-600">
                  {ratingHints[activeRating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label htmlFor="post-hire-comment" className="text-xs font-semibold text-slate-700">
                What went well? Anything Abjad should know? <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] tabular-nums ${overLimit ? "text-red-500 font-semibold" : "text-slate-400"}`}>
                {content.length} / {CONTENT_MAX}
              </span>
            </div>
            <textarea
              id="post-hire-comment"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, CONTENT_MAX))}
              disabled={isSubmitting}
              rows={6}
              maxLength={CONTENT_MAX}
              placeholder="Share your experience working with the school's recruitment team, the interview process, and your onboarding."
              className="w-full px-3 py-2.5 text-sm leading-relaxed border border-slate-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-y min-h-[140px] disabled:bg-slate-50"
            />
          </div>

          {/* Anonymous toggle */}
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              disabled={isSubmitting}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-slate-500" /> Submit anonymously
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                The school won't see your name on this feedback. Abjad still keeps it on file for moderation.
              </p>
            </div>
          </label>
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
            disabled={!canSubmit}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            style={{ background: "var(--brand-gradient)" }}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
            Submit feedback
          </button>
        </div>
      </div>
    </div>
  );
}
