"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Plus, Briefcase, MoreVertical, Eye, FileText, Pencil,
  Send, X, Trash2, Loader2, AlertCircle, CheckSquare,
  Square, MapPin, Clock, DollarSign, ChevronDown, ChevronLeft, ChevronRight,
  BookOpen, GraduationCap, Shield, Users, Calendar,
  Languages, Tag, Sparkles, BookCheck,
  CalendarPlus, RotateCcw, Copy,
} from "lucide-react";
import {
  listSchoolJobs,
  createJob,
  updateJob,
  publishJob,
  closeJob,
  deleteJob,
  extendJobDeadline,
} from "@/lib/api/school";
import type { SchoolJob } from "@/lib/api/school";
import { ApiError } from "@/lib/api/client";
import { PaywallModal } from "@/components/billing/PaywallModal";
import { SARSymbol } from "@/components/ui/sar-symbol";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatNumber, formatCurrency } from "@/lib/i18n/format";
import type { SchoolJobsTranslations, SchoolCommonTranslations } from "@/lib/i18n/types";

// ─── Constants ────────────────────────────────────────────────────────────────
// Option lists carry only stable `value`s now — display labels come from
// t.school.common.* (shared with candidates.tsx) / t.school.jobs.* (SRD 6.1.1).

const SUBJECT_VALUES = [
  "islamic_studies", "arabic", "english", "math", "science", "physics",
  "chemistry", "biology", "computer_science", "social_studies", "pe", "art", "other",
];

const GRADE_GROUPS: { key: "kg" | "elementary" | "middle" | "high"; values: string[] }[] = [
  { key: "kg",         values: ["kg"] },
  { key: "elementary", values: ["elementary_1","elementary_2","elementary_3","elementary_4","elementary_5","elementary_6"] },
  { key: "middle",     values: ["middle_7","middle_8","middle_9"] },
  { key: "high",       values: ["high_10","high_11","high_12"] },
];

const EMPLOYMENT_TYPE_VALUES = ["full_time", "part_time", "contract", "temporary"];

const CITY_VALUES = ["riyadh", "jeddah", "makkah", "madinah", "dammam", "khobar", "jubail", "taif", "tabuk", "other"];

const LANGUAGE_VALUES = ["arabic", "english", "bilingual"];

const EXPERIENCE_VALUES = ["0-1", "1-3", "3-5", "5-10", "10+"];

const DEGREE_VALUES = ["diploma", "bachelor", "master", "phd"];

const SALARY_DISPLAY_VALUES = ["show", "negotiable", "hidden"] as const;

type StatusFilter = "all" | "active" | "draft" | "closed" | "expired";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type DeadlineInfo = { kind: "expired" | "today" | "tomorrow" | "days"; days?: number };

function deadlineInfo(isoStr: string): DeadlineInfo {
  const d = new Date(isoStr);
  const now = new Date();
  const days = Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
  if (days < 0)   return { kind: "expired" };
  if (days === 0) return { kind: "today" };
  if (days === 1) return { kind: "tomorrow" };
  return { kind: "days", days };
}

function deadlineLabel(info: DeadlineInfo, tt: SchoolJobsTranslations, lang: "en" | "ar"): string {
  if (info.kind === "expired")  return tt.deadlineExpired;
  if (info.kind === "today")    return tt.deadlineToday;
  if (info.kind === "tomorrow") return tt.deadlineTomorrow;
  return tt.deadlineDaysLeft.replace("{n}", formatNumber(info.days ?? 0, lang));
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SchoolJob["status"] }) {
  const { t } = useTranslation();
  const tt = t.school.jobs;
  const map: Record<string, string> = {
    active:  "bg-green-100 text-green-700 border border-green-200",
    draft:   "bg-amber-100 text-amber-700 border border-amber-200",
    closed:  "bg-slate-100 text-slate-600 border border-slate-200",
    expired: "bg-red-100 text-red-600 border border-red-200",
  };
  const cls = map[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {tt.statusTabLabels[status] ?? status}
    </span>
  );
}

// ─── Job Form State ───────────────────────────────────────────────────────────

interface JobFormData {
  // Identity
  titleEn: string;
  titleAr: string;
  subjects: string[];
  gradeLevels: string[];
  employmentType: string;
  positions: string;
  isAnonymous: boolean;
  maxApplications: string;
  autoCloseOnMax: boolean;
  // Schedule
  startDate: string;
  deadline: string;
  contractDurationType: "day" | "month" | "year";
  contractDurationValue: string;
  // Salary
  salaryMin: string;
  salaryMax: string;
  dailyRate: string;
  salaryDisplay: string;
  // Location
  city: string;
  campus: string;
  // Description (4 bilingual sections)
  responsibilitiesEn: string; responsibilitiesAr: string;
  requirementsEn:     string; requirementsAr:     string;
  cultureEn:          string; cultureAr:          string;
  benefitsEn:         string; benefitsAr:         string;
  // Requirements
  languageRequirement: string;
  experienceRequired: string;
  degreeRequired: string;
  teachingLicenseRequired: boolean;
  certificationsRequired: string[];
  certificationsPreferred: string[];
}

const EMPTY_FORM: JobFormData = {
  titleEn: "", titleAr: "",
  subjects: [], gradeLevels: [],
  employmentType: "full_time",
  positions: "1",
  isAnonymous: false,
  maxApplications: "",
  autoCloseOnMax: false,
  startDate: "",
  deadline: "",
  contractDurationType: "month",
  contractDurationValue: "",
  salaryMin: "", salaryMax: "", dailyRate: "",
  salaryDisplay: "show",
  city: "riyadh",
  campus: "",
  responsibilitiesEn: "", responsibilitiesAr: "",
  requirementsEn:     "", requirementsAr:     "",
  cultureEn:          "", cultureAr:          "",
  benefitsEn:         "", benefitsAr:         "",
  languageRequirement: "arabic",
  experienceRequired: "1-3",
  degreeRequired: "bachelor",
  teachingLicenseRequired: false,
  certificationsRequired: [],
  certificationsPreferred: [],
};

const VALID_GRADES = [
  "kg","elementary_1","elementary_2","elementary_3","elementary_4","elementary_5","elementary_6",
  "middle_7","middle_8","middle_9","high_10","high_11","high_12",
];

function jobToForm(job: SchoolJob): JobFormData {
  const ds = job.descriptionSections;
  return {
    titleEn: job.titleEn ?? job.title ?? "",
    titleAr: job.titleAr ?? "",
    subjects: job.subjects ?? [],
    gradeLevels: (job.gradeLevels ?? []).filter((g) => VALID_GRADES.includes(g)),
    employmentType: job.employmentType ?? "full_time",
    positions: String(job.positions ?? 1),
    isAnonymous: job.isAnonymous ?? false,
    maxApplications: job.maxApplications != null ? String(job.maxApplications) : "",
    autoCloseOnMax: job.autoCloseOnMax ?? false,
    startDate: job.startDate ? job.startDate.slice(0, 10) : "",
    deadline:  job.deadline  ? job.deadline.slice(0, 10)  : "",
    contractDurationType:  (job.contractDuration?.type ?? "month") as "day" | "month" | "year",
    contractDurationValue: job.contractDuration?.value != null ? String(job.contractDuration.value) : "",
    salaryMin: job.salary?.min       != null ? String(job.salary.min)       : "",
    salaryMax: job.salary?.max       != null ? String(job.salary.max)       : "",
    dailyRate: job.salary?.dailyRate != null ? String(job.salary.dailyRate) : "",
    salaryDisplay: job.salary?.display ?? "show",
    city: job.city ?? "riyadh",
    campus: job.campus ?? "",
    responsibilitiesEn: ds?.responsibilities?.en ?? "",
    responsibilitiesAr: ds?.responsibilities?.ar ?? "",
    requirementsEn:     ds?.requirements?.en     ?? "",
    requirementsAr:     ds?.requirements?.ar     ?? "",
    cultureEn:          ds?.culture?.en          ?? "",
    cultureAr:          ds?.culture?.ar          ?? "",
    benefitsEn:         ds?.benefits?.en         ?? "",
    benefitsAr:         ds?.benefits?.ar         ?? "",
    languageRequirement: job.languageRequirement ?? "arabic",
    experienceRequired:  job.experienceRequired  ?? "1-3",
    degreeRequired:      job.degreeRequired      ?? "bachelor",
    teachingLicenseRequired: job.teachingLicenseRequired ?? false,
    certificationsRequired:  job.certificationsRequired  ?? [],
    certificationsPreferred: job.certificationsPreferred ?? [],
  };
}

// ─── Title auto-suggest (SRD 3.2.1) ──────────────────────────────────────────
// Bilingual suggestions display BOTH languages side by side regardless of the
// active UI language (the whole point is offering a pick for either title
// field) — this data is inherently bilingual, not a hardcoded UI string.

const SUBJECT_TITLES: Record<string, { en: string; ar: string }> = {
  islamic_studies:  { en: "Islamic Studies Teacher",  ar: "مدرس دراسات إسلامية" },
  arabic:           { en: "Arabic Language Teacher",  ar: "مدرس لغة عربية" },
  english:          { en: "English Language Teacher", ar: "مدرس لغة إنجليزية" },
  math:             { en: "Mathematics Teacher",      ar: "مدرس رياضيات" },
  science:          { en: "Science Teacher",          ar: "مدرس علوم" },
  physics:          { en: "Physics Teacher",          ar: "مدرس فيزياء" },
  chemistry:        { en: "Chemistry Teacher",        ar: "مدرس كيمياء" },
  biology:          { en: "Biology Teacher",          ar: "مدرس أحياء" },
  computer_science: { en: "Computer Science Teacher", ar: "مدرس حاسب آلي" },
  social_studies:   { en: "Social Studies Teacher",   ar: "مدرس دراسات اجتماعية" },
  pe:               { en: "PE Teacher",               ar: "مدرس تربية بدنية" },
  art:              { en: "Art Teacher",              ar: "مدرس تربية فنية" },
};

const GRADE_GROUP_TITLE_LABELS: Record<string, { en: string; ar: string }> = {
  kg:         { en: "KG",            ar: "روضة" },
  elementary: { en: "Elementary",    ar: "ابتدائي" },
  middle:     { en: "Middle School", ar: "متوسط" },
  high:       { en: "High School",   ar: "ثانوي" },
};

function gradeGroupOf(g: string): "kg" | "elementary" | "middle" | "high" | null {
  if (g === "kg") return "kg";
  if (g.startsWith("elementary")) return "elementary";
  if (g.startsWith("middle")) return "middle";
  if (g.startsWith("high")) return "high";
  return null;
}

function buildTitleSuggestions(
  subjects: string[],
  gradeLevels: string[],
): Array<{ en: string; ar: string }> {
  const out: Array<{ en: string; ar: string }> = [];
  const subjectTitles = subjects.map((s) => SUBJECT_TITLES[s]).filter(Boolean);
  if (subjectTitles.length === 0) return out;

  if (subjectTitles.length === 1) {
    out.push(subjectTitles[0]);
  } else if (subjectTitles.length >= 2) {
    const [a, b] = subjectTitles;
    out.push({
      en: `${a.en.replace(" Teacher", "")} & ${b.en}`,
      ar: `${a.ar} و${b.ar.replace("مدرس ", "")}`,
    });
  }

  const groups = Array.from(new Set(gradeLevels.map(gradeGroupOf).filter(Boolean))) as string[];
  if (subjectTitles.length === 1 && groups.length === 1) {
    const lbl = GRADE_GROUP_TITLE_LABELS[groups[0]];
    out.push({
      en: `${subjectTitles[0].en} — ${lbl.en}`,
      ar: `${subjectTitles[0].ar} — ${lbl.ar}`,
    });
  }

  return out.slice(0, 3);
}

// ─── Field atoms (kept inline — used only here) ───────────────────────────────

const inputCls =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition";
const inputStyle = { ["--tw-ring-color" as string]: "var(--brand-primary)" };

// SRD 3.2.1 — soft cap at 2000 words per description section, hard cap at 2200
// so accidental long paste isn't outright lost. Visual cue at 1800.
const WORD_SOFT_CAP = 2000;
const WORD_HARD_CAP = 2200;

function countWords(s: string): number {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function WordCounter({ count }: { count: number }) {
  const { t, lang } = useTranslation();
  const tt = t.school.jobs;
  const cls =
    count > WORD_SOFT_CAP
      ? "text-red-600"
      : count > WORD_SOFT_CAP * 0.9
      ? "text-amber-600"
      : "text-gray-400";
  return (
    <p className={`text-xs ${cls} mt-1 text-end tabular-nums`}>
      {tt.wordsCountTemplate
        .replace("{count}", formatNumber(count, lang))
        .replace("{cap}", formatNumber(WORD_SOFT_CAP, lang))}
      {count > WORD_SOFT_CAP && tt.overLimitSuffix}
    </p>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-2.5 pb-2 mb-3 border-b border-gray-100">
      <span
        className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg shrink-0"
        style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
      >
        <Icon size={14} />
      </span>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function TagInput({
  values,
  onChange,
  placeholder,
  removeAriaTemplate,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  removeAriaTemplate: string;
}) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const v = draft.trim();
    if (!v) return;
    if (values.includes(v)) { setDraft(""); return; }
    onChange([...values, v]);
    setDraft("");
  };

  return (
    <div className="border border-gray-200 rounded-xl p-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:border-transparent transition"
         style={inputStyle}>
      {values.map((v) => (
        <span key={v} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-lg">
          <Tag size={11} className="text-gray-400" />
          {v}
          <button
            type="button"
            onClick={() => onChange(values.filter((x) => x !== v))}
            className="text-gray-400 hover:text-gray-700"
            aria-label={removeAriaTemplate.replace("{v}", v)}
          >
            <X size={11} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); }
          else if (e.key === "Backspace" && !draft && values.length > 0) {
            onChange(values.slice(0, -1));
          }
        }}
        onBlur={commit}
        placeholder={values.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[140px] px-1.5 py-1 text-sm border-0 focus:outline-none focus:ring-0 bg-transparent"
      />
    </div>
  );
}

// Read-only preview block — only used in preview mode.
function PreviewBlock({ label, en, ar }: { label: string; en?: string; ar?: string }) {
  if (!en && !ar) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">{label}</p>
      {en && <p className="text-sm text-gray-700 whitespace-pre-wrap mb-1.5" dir="ltr">{en}</p>}
      {ar && <p className="text-sm text-gray-700 whitespace-pre-wrap" dir="rtl">{ar}</p>}
    </div>
  );
}

// ─── Job Modal ────────────────────────────────────────────────────────────────

interface JobModalProps {
  editJob: SchoolJob | null;
  // SRD 3.2.7 — Repost / Duplicate: pre-fill the form from an existing job but save as a new one.
  templateJob?: SchoolJob | null;
  // When templated as Repost, pre-set the deadline to today + 30 days. Duplicate clears it.
  templateMode?: "repost" | "duplicate";
  onClose: () => void;
  onSaved: (job: SchoolJob, published: boolean) => void;
  // Called when an action hits an entitlement gate (maxActiveJobs cap during
  // trial / free tier). The parent renders the paywall modal in response.
  onPaywall: (payload: { fromKey: string; message?: string; limit?: number }) => void;
}

function buildTemplateForm(source: SchoolJob, mode: "repost" | "duplicate"): JobFormData {
  const base = jobToForm(source);
  if (mode === "repost") {
    // 30 days out, ISO date string
    const d = new Date(); d.setDate(d.getDate() + 30);
    return { ...base, deadline: d.toISOString().slice(0, 10) };
  }
  // Duplicate: clear schedule dates so the school sets fresh ones.
  return { ...base, deadline: "", startDate: "" };
}

function JobModal({ editJob, templateJob, templateMode, onClose, onSaved, onPaywall }: JobModalProps) {
  const { t, lang } = useTranslation();
  const tt = t.school.jobs;
  const common = t.school.common;

  const [form, setForm] = useState<JobFormData>(() => {
    if (editJob) return jobToForm(editJob);
    if (templateJob) return buildTemplateForm(templateJob, templateMode ?? "duplicate");
    return EMPTY_FORM;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [mode, setMode]     = useState<"edit" | "preview">("edit");
  const backdropRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof JobFormData>(key: K, val: JobFormData[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const toggleSubject = (v: string) =>
    set("subjects", form.subjects.includes(v)
      ? form.subjects.filter((s) => s !== v)
      : [...form.subjects, v]);

  const toggleGradeGroup = (values: string[]) => {
    const allSelected = values.every((v) => form.gradeLevels.includes(v));
    if (allSelected) {
      set("gradeLevels", form.gradeLevels.filter((g) => !values.includes(g)));
    } else {
      set("gradeLevels", Array.from(new Set([...form.gradeLevels, ...values])));
    }
  };

  // SRD 3.2.1 — title auto-suggest based on subjects + grade levels.
  const suggestions =
    !form.titleEn.trim() && !form.titleAr.trim()
      ? buildTitleSuggestions(form.subjects, form.gradeLevels)
      : [];

  // Daily rate field is only meaningful for non-monthly comp.
  const isSubstituteLike =
    form.employmentType === "temporary" ||
    form.employmentType === "contract" ||
    form.contractDurationType === "day";

  // SRD 3.2.1 — contract duration is only meaningful for fixed-term roles.
  // Full-time / part-time roles are open-ended; hide the duration block for them.
  const needsContractDuration =
    form.employmentType === "contract" || form.employmentType === "temporary";

  const validate = (): string | null => {
    if (!form.titleEn.trim() && !form.titleAr.trim()) return tt.errorTitleRequired;
    if (form.subjects.length === 0) return tt.errorSubjectRequired;
    if (!form.city) return tt.errorCityRequired;
    return null;
  };

  const goPreview = () => {
    const v = validate();
    if (v) { setError(v); return; }
    setError(null);
    setMode("preview");
  };

  const handleSubmit = async (publish: boolean) => {
    const v = validate();
    if (v) { setError(v); return; }
    setError(null);
    setSaving(true);
    try {
      const titleEn = form.titleEn.trim() || undefined;
      const titleAr = form.titleAr.trim() || undefined;
      const payload: Record<string, unknown> = {
        titleEn,
        titleAr,
        // Legacy `title` (required server-side) — fall back if both bilingual slots are empty.
        title: (titleEn || titleAr || "").trim(),
        subjects: form.subjects,
        gradeLevels: form.gradeLevels,
        employmentType: form.employmentType as SchoolJob["employmentType"],
        positions: form.positions ? Number(form.positions) : undefined,
        startDate: form.startDate || undefined,
        deadline: form.deadline || undefined,
        // Only persist duration for Contract / Temporary roles.
        contractDuration: needsContractDuration
          ? {
              type: form.contractDurationType,
              value: form.contractDurationValue ? Number(form.contractDurationValue) : undefined,
            }
          : undefined,
        salary: {
          min: form.salaryMin ? Number(form.salaryMin) : undefined,
          max: form.salaryMax ? Number(form.salaryMax) : undefined,
          dailyRate: form.dailyRate ? Number(form.dailyRate) : undefined,
          display: form.salaryDisplay as SchoolJob["salary"]["display"],
        },
        city: form.city,
        campus: form.campus.trim() || undefined,
        descriptionSections: {
          responsibilities: { en: form.responsibilitiesEn.trim() || undefined, ar: form.responsibilitiesAr.trim() || undefined },
          requirements:     { en: form.requirementsEn.trim()     || undefined, ar: form.requirementsAr.trim()     || undefined },
          culture:          { en: form.cultureEn.trim()          || undefined, ar: form.cultureAr.trim()          || undefined },
          benefits:         { en: form.benefitsEn.trim()         || undefined, ar: form.benefitsAr.trim()         || undefined },
        },
        languageRequirement: form.languageRequirement as SchoolJob["languageRequirement"],
        experienceRequired:  form.experienceRequired || undefined,
        degreeRequired:      form.degreeRequired || undefined,
        teachingLicenseRequired: form.teachingLicenseRequired,
        certificationsRequired:  form.certificationsRequired,
        certificationsPreferred: form.certificationsPreferred,
        isAnonymous: form.isAnonymous,
        maxApplications: form.maxApplications ? Number(form.maxApplications) : undefined,
        autoCloseOnMax: form.autoCloseOnMax,
      };

      let job: SchoolJob;
      if (editJob) {
        job = await updateJob(editJob._id, payload as Partial<SchoolJob>);
      } else {
        job = await createJob(payload as Partial<SchoolJob>);
      }
      if (publish && (job.status === "draft" || !editJob)) {
        job = await publishJob(job._id);
      }
      onSaved(job, publish);
    } catch (e: unknown) {
      // Entitlement gate (HTTP 402) — surface the paywall instead of an
      // inline error so the user gets a clear path to upgrade.
      if (e instanceof ApiError && e.status === 402 && (e.payload?.code === "ENTITLEMENT_BLOCKED")) {
        // Save the draft if we already created it — close the modal cleanly.
        // The cap is on *publishing*, so any draft already exists in the DB.
        onClose();
        onPaywall({
          fromKey: "post_a_job",
          message: e.message,
          limit: typeof e.payload.limit === "number" ? e.payload.limit : undefined,
        });
        return;
      }
      setError((e as Error)?.message ?? common.somethingWentWrong);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative ms-auto w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === "preview"
                ? tt.modalTitlePreview
                : editJob
                ? tt.modalTitleEdit
                : templateJob
                ? (templateMode === "repost" ? tt.modalTitleRepost : tt.modalTitleDuplicate)
                : tt.modalTitleCreate}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === "preview"
                ? tt.modalSubtitlePreview
                : editJob
                ? tt.modalSubtitleEdit
                : templateJob
                ? (templateMode === "repost" ? tt.modalSubtitleRepost : tt.modalSubtitleDuplicate)
                : tt.modalSubtitleCreate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {/* ════════════════ EDIT MODE ════════════════ */}
          {mode === "edit" && (
            <>
              {/* ── Identity ───────────────────────────────────────────── */}
              <section>
                <SectionHeader icon={Briefcase} title={tt.sectionIdentityTitle} subtitle={tt.sectionIdentitySubtitle} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      {tt.titleEnLabel} <span className="text-gray-400 font-normal">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.titleEn}
                      onChange={(e) => set("titleEn", e.target.value)}
                      placeholder={tt.titleEnPlaceholder}
                      dir="ltr"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      {tt.titleArLabel} <span className="text-gray-400 font-normal">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.titleAr}
                      onChange={(e) => set("titleAr", e.target.value)}
                      placeholder={tt.titleArPlaceholder}
                      dir="rtl"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">{tt.titleHint}</p>

                {suggestions.length > 0 && (
                  <div className="mt-3 bg-purple-50/40 border border-purple-100 rounded-xl p-3">
                    <p className="text-xs font-semibold text-purple-700 flex items-center gap-1.5 mb-2">
                      <Sparkles size={12} /> {tt.suggestedTitlesLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => { set("titleEn", s.en); set("titleAr", s.ar); }}
                          className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
                        >
                          <span dir="ltr">{s.en}</span>
                          <span className="text-gray-300 mx-1.5">·</span>
                          <span dir="rtl">{s.ar}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subjects */}
                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {tt.subjectsLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_VALUES.map((value) => {
                      const active = form.subjects.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleSubject(value)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                            active
                              ? "border-transparent text-white"
                              : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                          }`}
                          style={active ? { background: "var(--brand-gradient)" } : {}}
                        >
                          {common.subjectLabels[value] ?? value}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grade Levels */}
                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">{tt.gradeLevelsLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GRADE_GROUPS.map(({ key, values }) => {
                      const allSelected = values.every((v) => form.gradeLevels.includes(v));
                      const someSelected = values.some((v) => form.gradeLevels.includes(v));
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleGradeGroup(values)}
                          className={`flex items-center gap-2 px-3.5 py-2.5 text-sm rounded-xl border transition-all text-start ${
                            allSelected
                              ? "border-transparent text-white"
                              : someSelected
                              ? "border-blue-300 text-blue-700 bg-blue-50"
                              : "border-gray-200 text-gray-700 bg-white hover:border-gray-300"
                          }`}
                          style={allSelected ? { background: "var(--brand-gradient)" } : {}}
                        >
                          {allSelected ? (
                            <CheckSquare size={14} className="shrink-0" />
                          ) : (
                            <Square size={14} className="shrink-0" />
                          )}
                          {tt.gradeGroupLabels[key]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Employment type + Positions */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.employmentTypeLabel}</label>
                    <div className="relative">
                      <select
                        value={form.employmentType}
                        onChange={(e) => set("employmentType", e.target.value)}
                        className={`${inputCls} appearance-none pe-9 bg-white`}
                        style={inputStyle}
                      >
                        {EMPLOYMENT_TYPE_VALUES.map((value) => (
                          <option key={value} value={value}>{common.employmentTypeLabels[value] ?? value}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.openPositionsLabel}</label>
                    <input
                      type="number"
                      min="1"
                      value={form.positions}
                      onChange={(e) => set("positions", e.target.value)}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </section>

              {/* ── Schedule ───────────────────────────────────────────── */}
              <section>
                <SectionHeader icon={Calendar} title={tt.sectionScheduleTitle} subtitle={tt.sectionScheduleSubtitle} />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.startDateLabel}</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => set("startDate", e.target.value)}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.deadlineLabel}</label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => set("deadline", e.target.value)}
                      min={new Date().toISOString().slice(0, 10)}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Contract duration — only shown for Contract / Temporary roles */}
                {needsContractDuration && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.contractDurationModeLabel}</label>
                      <div className="relative">
                        <select
                          value={form.contractDurationType}
                          onChange={(e) => set("contractDurationType", e.target.value as JobFormData["contractDurationType"])}
                          className={`${inputCls} appearance-none pe-9 bg-white`}
                          style={inputStyle}
                        >
                          <option value="day">{tt.contractDurationOptions.day}</option>
                          <option value="month">{tt.contractDurationOptions.month}</option>
                          <option value="year">{tt.contractDurationOptions.year}</option>
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        {tt.durationLabelTemplate.replace("{unit}", tt.durationUnitLabels[form.contractDurationType])}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form.contractDurationValue}
                        onChange={(e) => set("contractDurationValue", e.target.value)}
                        placeholder={tt.durationPlaceholder}
                        className={inputCls}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* Salary */}
                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">{tt.salaryLabel}</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      placeholder={tt.salaryMinPlaceholder}
                      value={form.salaryMin}
                      onChange={(e) => set("salaryMin", e.target.value)}
                      className={inputCls}
                      style={inputStyle}
                    />
                    <input
                      type="number"
                      placeholder={tt.salaryMaxPlaceholder}
                      value={form.salaryMax}
                      onChange={(e) => set("salaryMax", e.target.value)}
                      className={inputCls}
                      style={inputStyle}
                    />
                    <div className="relative">
                      <select
                        value={form.salaryDisplay}
                        onChange={(e) => set("salaryDisplay", e.target.value)}
                        className={`${inputCls} appearance-none pe-9 bg-white`}
                        style={inputStyle}
                      >
                        {SALARY_DISPLAY_VALUES.map((value) => (
                          <option key={value} value={value}>{tt.salaryDisplayOptions[value]}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Daily rate — substitute roles */}
                {isSubstituteLike && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      {tt.dailyRateLabel}
                      <span className="ms-2 text-xs text-gray-400 font-normal">{tt.dailyRateHint}</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.dailyRate}
                      onChange={(e) => set("dailyRate", e.target.value)}
                      placeholder={tt.dailyRatePlaceholder}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                )}
              </section>

              {/* ── Location ─────────────────────────────────────────── */}
              <section>
                <SectionHeader icon={MapPin} title={tt.sectionLocationTitle} subtitle={tt.sectionLocationSubtitle} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.cityLabel}</label>
                    <div className="relative">
                      <select
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        className={`${inputCls} appearance-none pe-9 bg-white`}
                        style={inputStyle}
                      >
                        {CITY_VALUES.map((value) => (
                          <option key={value} value={value}>{common.cityLabels[value] ?? value}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      {tt.campusLabel} <span className="text-gray-400 font-normal text-xs">{tt.campusHint}</span>
                    </label>
                    <input
                      type="text"
                      value={form.campus}
                      onChange={(e) => set("campus", e.target.value)}
                      placeholder={tt.campusPlaceholder}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </section>

              {/* ── Description (4 sections × Ar/En) ────────────────── */}
              <section>
                <SectionHeader icon={BookOpen} title={tt.sectionDescriptionTitle} subtitle={tt.sectionDescriptionSubtitle} />

                {(["responsibilities", "requirements", "culture", "benefits"] as const).map((key) => {
                  const label = tt.descriptionSectionLabels[key];
                  const placeholder = tt.descriptionSectionPlaceholders[key];
                  const enKey = (key + "En") as keyof JobFormData;
                  const arKey = (key + "Ar") as keyof JobFormData;
                  const enValue = form[enKey] as string;
                  const arValue = form[arKey] as string;
                  const enCount = countWords(enValue);
                  const arCount = countWords(arValue);
                  return (
                    <div key={key} className="mt-4 first:mt-0">
                      <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                        <BookCheck size={12} className="text-gray-400" />
                        {label}
                      </p>
                      <textarea
                        rows={3}
                        value={enValue}
                        onChange={(e) => {
                          const next = e.target.value;
                          // Hard cap: refuse the update if it would push past WORD_HARD_CAP.
                          if (countWords(next) > WORD_HARD_CAP && countWords(next) > enCount) return;
                          set(enKey, next as JobFormData[typeof enKey]);
                        }}
                        placeholder={`${placeholder} (English)`}
                        dir="ltr"
                        className={`${inputCls} resize-none`}
                        style={inputStyle}
                      />
                      <WordCounter count={enCount} />
                      <textarea
                        rows={3}
                        value={arValue}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (countWords(next) > WORD_HARD_CAP && countWords(next) > arCount) return;
                          set(arKey, next as JobFormData[typeof arKey]);
                        }}
                        placeholder={`${placeholder} (العربية)`}
                        dir="rtl"
                        className={`${inputCls} resize-none mt-2`}
                        style={inputStyle}
                      />
                      <WordCounter count={arCount} />
                    </div>
                  );
                })}
              </section>

              {/* ── Requirements ─────────────────────────────────────── */}
              <section>
                <SectionHeader icon={GraduationCap} title={tt.sectionRequirementsTitle} subtitle={tt.sectionRequirementsSubtitle} />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.languageRequirementLabel}</label>
                    <div className="relative">
                      <select
                        value={form.languageRequirement}
                        onChange={(e) => set("languageRequirement", e.target.value)}
                        className={`${inputCls} appearance-none pe-9 bg-white`}
                        style={inputStyle}
                      >
                        {LANGUAGE_VALUES.map((value) => (
                          <option key={value} value={value}>{tt.languageRequirementOptions[value]}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.experienceRequiredLabel}</label>
                    <div className="relative">
                      <select
                        value={form.experienceRequired}
                        onChange={(e) => set("experienceRequired", e.target.value)}
                        className={`${inputCls} appearance-none pe-9 bg-white`}
                        style={inputStyle}
                      >
                        {EXPERIENCE_VALUES.map((value) => (
                          <option key={value} value={value}>{tt.experienceOptions[value]}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.degreeRequiredLabel}</label>
                    <div className="relative">
                      <select
                        value={form.degreeRequired}
                        onChange={(e) => set("degreeRequired", e.target.value)}
                        className={`${inputCls} appearance-none pe-9 bg-white`}
                        style={inputStyle}
                      >
                        {DEGREE_VALUES.map((value) => (
                          <option key={value} value={value}>{tt.degreeOptions[value]}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.teachingLicenseLabel}</label>
                    <button
                      type="button"
                      onClick={() => set("teachingLicenseRequired", !form.teachingLicenseRequired)}
                      className={`w-full flex items-center gap-2 px-3.5 py-2.5 text-sm rounded-xl border transition-all ${
                        form.teachingLicenseRequired
                          ? "border-transparent text-white"
                          : "border-gray-200 text-gray-700 bg-white hover:border-gray-300"
                      }`}
                      style={form.teachingLicenseRequired ? { background: "var(--brand-gradient)" } : {}}
                    >
                      {form.teachingLicenseRequired ? <CheckSquare size={14} /> : <Square size={14} />}
                      <Shield size={13} />
                      {tt.teachingLicenseHint}
                    </button>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    {tt.certRequiredLabel}
                  </label>
                  <TagInput
                    values={form.certificationsRequired}
                    onChange={(v) => set("certificationsRequired", v)}
                    placeholder={tt.certRequiredPlaceholder}
                    removeAriaTemplate={tt.removeTagAriaTemplate}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    {tt.certPreferredLabel}
                  </label>
                  <TagInput
                    values={form.certificationsPreferred}
                    onChange={(v) => set("certificationsPreferred", v)}
                    placeholder={tt.certPreferredPlaceholder}
                    removeAriaTemplate={tt.removeTagAriaTemplate}
                  />
                </div>
              </section>

              {/* ── Visibility & Application Settings ─────────────────── */}
              <section>
                <SectionHeader icon={Users} title={tt.sectionVisibilityTitle} subtitle={tt.sectionVisibilitySubtitle} />

                <label className="flex items-center gap-3 cursor-pointer group">
                  <button
                    type="button"
                    onClick={() => set("isAnonymous", !form.isAnonymous)}
                    className={`relative w-10 h-5.5 rounded-full border transition-all shrink-0 ${
                      form.isAnonymous ? "border-transparent" : "border-gray-300 bg-gray-100"
                    }`}
                    style={form.isAnonymous ? { background: "var(--brand-gradient)" } : {}}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        form.isAnonymous ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{tt.anonymousLabel}</p>
                    <p className="text-xs text-gray-500">{tt.anonymousHint}</p>
                  </div>
                </label>

                {/* SRD 3.2.4 — application cap + auto-close */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    {tt.maxApplicationsLabel}
                    <span className="ms-2 text-xs text-gray-400 font-normal">{tt.maxApplicationsHint}</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxApplications}
                    onChange={(e) => set("maxApplications", e.target.value)}
                    placeholder={tt.maxApplicationsPlaceholder}
                    className={inputCls}
                    style={inputStyle}
                  />

                  <label className={`mt-3 flex items-start gap-3 ${form.maxApplications ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}>
                    <button
                      type="button"
                      onClick={() => form.maxApplications && set("autoCloseOnMax", !form.autoCloseOnMax)}
                      disabled={!form.maxApplications}
                      className={`relative w-10 h-5.5 rounded-full border transition-all shrink-0 mt-0.5 ${
                        form.autoCloseOnMax && form.maxApplications ? "border-transparent" : "border-gray-300 bg-gray-100"
                      }`}
                      style={form.autoCloseOnMax && form.maxApplications ? { background: "var(--brand-gradient)" } : {}}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          form.autoCloseOnMax && form.maxApplications ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{tt.autoCloseLabel}</p>
                      <p className="text-xs text-gray-500">
                        {form.maxApplications ? tt.autoCloseHintEnabled : tt.autoCloseHintDisabled}
                      </p>
                    </div>
                  </label>
                </div>
              </section>
            </>
          )}

          {/* ════════════════ PREVIEW MODE ════════════════ */}
          {mode === "preview" && (
            <div className="space-y-6">

              {/* Title + meta */}
              <div>
                {form.titleEn && <p className="text-xl font-bold text-gray-900" dir="ltr">{form.titleEn}</p>}
                {form.titleAr && <p className="text-lg font-semibold text-gray-700 mt-1" dir="rtl">{form.titleAr}</p>}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Briefcase size={12} />
                    {common.employmentTypeLabels[form.employmentType] ?? form.employmentType}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {(common.cityLabels[form.city] ?? form.city)}{form.campus ? ` (${form.campus})` : ""}
                  </span>
                  {form.positions && (
                    <>
                      <span>·</span>
                      <span>{form.positions} {form.positions === "1" ? tt.previewPositionsSuffixSingular : tt.previewPositionsSuffixPlural}</span>
                    </>
                  )}
                  {form.isAnonymous && (
                    <>
                      <span>·</span>
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{tt.previewAnonymousBadge}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Subjects + grades */}
              <div className="flex flex-wrap gap-1.5">
                {form.subjects.map((s) => (
                  <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {common.subjectLabels[s] ?? s}
                  </span>
                ))}
                {Array.from(new Set(form.gradeLevels.map(gradeGroupOf).filter(Boolean))).map((g) => (
                  <span key={g as string} className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                    {tt.gradeGroupLabels[g as string]}
                  </span>
                ))}
              </div>

              {/* Schedule + compensation */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div>
                  <p className="text-xs text-gray-500">{tt.previewStartDateLabel}</p>
                  <p className="text-sm font-semibold text-gray-800">{form.startDate || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{tt.previewDeadlineLabel}</p>
                  <p className="text-sm font-semibold text-gray-800">{form.deadline || "—"}</p>
                </div>
                {needsContractDuration && (
                  <div>
                    <p className="text-xs text-gray-500">{tt.previewContractLabel}</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {form.contractDurationValue
                        ? `${form.contractDurationValue} ${form.contractDurationValue === "1" ? tt.durationUnitSingularLabels[form.contractDurationType] : tt.durationUnitLabels[form.contractDurationType]}`
                        : tt.previewByUnitTemplate.replace("{unit}", tt.durationUnitSingularLabels[form.contractDurationType])}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">{tt.previewSalaryLabel}</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {form.salaryDisplay === "hidden"
                      ? tt.previewSalaryHidden
                      : form.salaryDisplay === "negotiable"
                      ? tt.previewSalaryNegotiable
                      : (form.salaryMin || form.salaryMax)
                        ? <><SARSymbol />{form.salaryMin || "?"} – {form.salaryMax || "?"}/mo</>
                        : "—"}
                  </p>
                </div>
                {form.dailyRate && (
                  <div>
                    <p className="text-xs text-gray-500">{tt.previewDailyRateLabel}</p>
                    <p className="text-sm font-semibold text-gray-800"><SARSymbol />{form.dailyRate}/day</p>
                  </div>
                )}
                {form.maxApplications && (
                  <div>
                    <p className="text-xs text-gray-500">{tt.previewApplicationCapLabel}</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {form.maxApplications}{form.autoCloseOnMax ? tt.previewAutoClosesSuffix : ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Description sections */}
              <div className="space-y-5">
                <PreviewBlock label={tt.descriptionSectionLabels.responsibilities} en={form.responsibilitiesEn} ar={form.responsibilitiesAr} />
                <PreviewBlock label={tt.descriptionSectionLabels.requirements}     en={form.requirementsEn}     ar={form.requirementsAr} />
                <PreviewBlock label={tt.descriptionSectionLabels.culture}          en={form.cultureEn}          ar={form.cultureAr} />
                <PreviewBlock label={tt.descriptionSectionLabels.benefits}         en={form.benefitsEn}         ar={form.benefitsAr} />
              </div>

              {/* Credentials + langs */}
              <div className="text-sm text-gray-700 space-y-1.5">
                <p className="flex items-center gap-2"><Languages size={13} className="text-gray-400" /> {tt.previewLanguageLabel} <span className="font-medium">{tt.languageRequirementOptions[form.languageRequirement]}</span></p>
                <p className="flex items-center gap-2"><Briefcase size={13} className="text-gray-400" /> {tt.previewExperienceLabel} <span className="font-medium">{tt.experienceOptions[form.experienceRequired] ?? form.experienceRequired}</span></p>
                <p className="flex items-center gap-2"><GraduationCap size={13} className="text-gray-400" /> {tt.previewDegreeLabel} <span className="font-medium">{tt.degreeOptions[form.degreeRequired] ?? form.degreeRequired}</span></p>
                {form.teachingLicenseRequired && (
                  <p className="flex items-center gap-2"><Shield size={13} className="text-gray-400" /> {tt.previewLicenseLabel}</p>
                )}
              </div>

              {(form.certificationsRequired.length > 0 || form.certificationsPreferred.length > 0) && (
                <div className="space-y-2">
                  {form.certificationsRequired.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">{tt.previewRequiredCertsLabel}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.certificationsRequired.map((c) => (
                          <span key={c} className="text-xs px-2 py-1 rounded-lg bg-red-50 border border-red-100 text-red-700">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {form.certificationsPreferred.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">{tt.previewPreferredCertsLabel}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.certificationsPreferred.map((c) => (
                          <span key={c} className="text-xs px-2 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-700">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          {mode === "edit" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {common.cancel}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : tt.saveAsDraft}
                </button>
                <button
                  type="button"
                  onClick={goPreview}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  <Eye size={14} />
                  {tt.previewCta}
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { setError(null); setMode("edit"); }}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {lang === "ar" ? <ChevronRight size={14} /> : <ChevronLeft size={14} />} {tt.backToEdit}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : tt.saveAsDraft}
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  {saving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={14} />
                      {editJob && editJob.status === "active" ? tt.saveChanges : tt.publish}
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: SchoolJob;
  onEdit: (job: SchoolJob) => void;
  onPublish: (jobId: string) => void;
  onClose: (jobId: string) => void;
  onDelete: (jobId: string) => void;
  // SRD 3.2.7
  onExtendDeadline: (job: SchoolJob) => void;
  onRepost: (job: SchoolJob) => void;
  onDuplicate: (job: SchoolJob) => void;
  actionLoading: string | null;
}

function JobCard({ job, onEdit, onPublish, onClose, onDelete, onExtendDeadline, onRepost, onDuplicate, actionLoading }: JobCardProps) {
  const { t, lang } = useTranslation();
  const tt = t.school.jobs;
  const common = t.school.common;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLoading = actionLoading === job._id;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const displayedSubjects = job.subjects.slice(0, 3);
  const extraSubjects = job.subjects.length - 3;
  const dInfo = job.deadline ? deadlineInfo(job.deadline) : null;
  const dLabel = dInfo ? deadlineLabel(dInfo, tt, lang) : null;
  const isDeadlineUrgent = dInfo?.kind === "days" && (dInfo.days ?? 99) <= 3;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all relative group">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center z-10">
          <Loader2 size={22} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2 flex-wrap">
          <StatusBadge status={job.status} />
          {dLabel && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                dInfo?.kind === "expired"
                  ? "bg-red-50 text-red-500"
                  : isDeadlineUrgent
                  ? "bg-orange-50 text-orange-600"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <Clock size={10} className="inline me-1" />
              {dLabel}
            </span>
          )}
        </div>

        {/* Action menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute end-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20">
              <button
                onClick={() => { setMenuOpen(false); onEdit(job); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil size={13} className="text-gray-400" /> {tt.menuEdit}
              </button>
              {job.status === "draft" && (
                <button
                  onClick={() => { setMenuOpen(false); onPublish(job._id); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Send size={13} className="text-blue-400" /> {tt.menuPublish}
                </button>
              )}
              {job.status === "active" && (
                <button
                  onClick={() => { setMenuOpen(false); onClose(job._id); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X size={13} className="text-amber-400" /> {tt.menuCloseJob}
                </button>
              )}
              {/* SRD 3.2.7 — Extend deadline (active + expired) */}
              {(job.status === "active" || job.status === "expired") && (
                <button
                  onClick={() => { setMenuOpen(false); onExtendDeadline(job); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <CalendarPlus size={13} className="text-emerald-400" /> {tt.menuExtendDeadline}
                </button>
              )}
              {/* SRD 3.2.7 — Repost (expired only) */}
              {job.status === "expired" && (
                <button
                  onClick={() => { setMenuOpen(false); onRepost(job); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw size={13} className="text-purple-400" /> {tt.menuRepost}
                </button>
              )}
              {/* SRD 3.2.7 — Duplicate (any status) */}
              <button
                onClick={() => { setMenuOpen(false); onDuplicate(job); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Copy size={13} className="text-sky-400" /> {tt.menuDuplicate}
              </button>
              <Link
                href={`/school/applications?jobId=${job._id}`}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <FileText size={13} className="text-indigo-400" /> {tt.menuViewApplications}
              </Link>
              {job.status === "draft" && (
                <>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(job._id); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} /> {tt.menuDelete}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2.5 line-clamp-2 leading-snug">
        {job.title}
      </h3>

      {/* Chips row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
          <MapPin size={10} className="text-gray-400" />
          {common.cityLabels[job.city] ?? job.city}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
          <Briefcase size={10} className="text-gray-400" />
          {common.employmentTypeLabels[job.employmentType] ?? job.employmentType}
        </span>
        {job.salary.display === "show" && (job.salary.min || job.salary.max) && (
          <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
            <DollarSign size={10} />
            {job.salary.min ? formatCurrency(job.salary.min, lang) : "–"}
            {job.salary.max ? `–${formatNumber(job.salary.max, lang)}` : "+"}
          </span>
        )}
        {job.salary.display === "negotiable" && (
          <span className="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
            {tt.negotiable}
          </span>
        )}
      </div>

      {/* Subjects */}
      {job.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {displayedSubjects.map((s) => (
            <span key={s} className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              {common.subjectLabels[s] ?? s}
            </span>
          ))}
          {extraSubjects > 0 && (
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
              {tt.moreSubjectsSuffix.replace("{n}", formatNumber(extraSubjects, lang))}
            </span>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Eye size={13} className="text-gray-400" />
          {tt.viewsSuffix.replace("{n}", formatNumber(job.viewsCount, lang))}
        </span>
        <Link
          href={`/school/applications?jobId=${job._id}`}
          className="flex items-center gap-1.5 text-xs font-medium hover:underline"
          style={{ color: job.applicationsCount > 0 ? "var(--brand-primary)" : undefined }}
        >
          <FileText size={13} className={job.applicationsCount > 0 ? "" : "text-gray-400"} />
          <span className={job.applicationsCount > 0 ? "" : "text-gray-500"}>
            {tt.applicationsSuffix.replace("{n}", formatNumber(job.applicationsCount, lang))}
          </span>
        </Link>
        {job.positions && job.positions > 1 && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users size={13} className="text-gray-400" />
            {tt.positionsSuffix.replace("{n}", formatNumber(job.positions, lang))}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  const { t } = useTranslation();
  const tt = t.school.jobs;
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
        style={{ background: "var(--brand-gradient)" }}
      >
        <Briefcase size={36} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{tt.emptyTitle}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        {tt.emptyBody}
      </p>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg"
        style={{ background: "var(--brand-gradient)" }}
      >
        <Plus size={16} />
        {tt.emptyCta}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_TAB_VALUES: StatusFilter[] = ["all", "active", "draft", "closed", "expired"];

export default function JobsPage() {
  const { t } = useTranslation();
  const tt = t.school.jobs;
  const common = t.school.common;

  const [jobs, setJobs]               = useState<SchoolJob[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [filter, setFilter]           = useState<StatusFilter>("all");
  const [showModal, setShowModal]     = useState(false);
  const [editJob, setEditJob]         = useState<SchoolJob | null>(null);
  // SRD 3.2.7 — Repost / Duplicate share JobModal with editJob=null + templateJob set
  const [templateJob, setTemplateJob] = useState<SchoolJob | null>(null);
  const [templateMode, setTemplateMode] = useState<"repost" | "duplicate">("duplicate");
  // SRD 3.2.7 — Extend deadline inline popover
  const [extendTarget, setExtendTarget] = useState<SchoolJob | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  // Paywall surface — flipped on when any job action returns the backend's
  // 402 ENTITLEMENT_BLOCKED response. Carries the source key so we can
  // attribute the conversion back to the action that triggered it.
  const [paywall, setPaywall] = useState<{ fromKey: string; message?: string; limit?: number } | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSchoolJobs({ limit: 100 });
      setJobs(res.jobs ?? []);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? tt.loadFailedFallback);
    } finally {
      setLoading(false);
    }
  }, [tt.loadFailedFallback]);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  // Counts per status
  const counts: Record<StatusFilter, number> = {
    all:     jobs.length,
    active:  jobs.filter((j) => j.status === "active").length,
    draft:   jobs.filter((j) => j.status === "draft").length,
    closed:  jobs.filter((j) => j.status === "closed").length,
    expired: jobs.filter((j) => j.status === "expired").length,
  };

  const filteredJobs = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  const handleSaved = (savedJob: SchoolJob, _published: boolean) => {
    setJobs((prev) => {
      const idx = prev.findIndex((j) => j._id === savedJob._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedJob;
        return next;
      }
      return [savedJob, ...prev];
    });
    setShowModal(false);
    setEditJob(null);
    setTemplateJob(null);
  };

  const handlePublish = async (jobId: string) => {
    setActionLoading(jobId);
    try {
      const updated = await publishJob(jobId);
      setJobs((prev) => prev.map((j) => (j._id === jobId ? updated : j)));
    } catch (e: unknown) {
      if (e instanceof ApiError && e.status === 402 && e.payload?.code === "ENTITLEMENT_BLOCKED") {
        setPaywall({
          fromKey: "publish_draft",
          message: e.message,
          limit: typeof e.payload.limit === "number" ? e.payload.limit : undefined,
        });
      }
      // Other failures: keep current row-silent behaviour for now.
    } finally {
      setActionLoading(null);
    }
  };

  const handleClose = async (jobId: string) => {
    setActionLoading(jobId);
    try {
      const updated = await closeJob(jobId);
      setJobs((prev) => prev.map((j) => (j._id === jobId ? updated : j)));
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm(tt.deleteConfirm)) return;
    setActionLoading(jobId);
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const openCreate = () => { setEditJob(null); setTemplateJob(null); setShowModal(true); };
  const openEdit   = (job: SchoolJob) => { setEditJob(job); setTemplateJob(null); setShowModal(true); };

  // SRD 3.2.7 — open the modal as a Repost / Duplicate flow
  const openRepost    = (job: SchoolJob) => { setEditJob(null); setTemplateJob(job); setTemplateMode("repost");    setShowModal(true); };
  const openDuplicate = (job: SchoolJob) => { setEditJob(null); setTemplateJob(job); setTemplateMode("duplicate"); setShowModal(true); };

  // SRD 3.2.7 — extend deadline inline
  const handleExtendDeadline = async (jobId: string, deadline: string) => {
    setActionLoading(jobId);
    try {
      const updated = await extendJobDeadline(jobId, deadline);
      setJobs((prev) => prev.map((j) => (j._id === jobId ? updated : j)));
      setExtendTarget(null);
    } catch (e: unknown) {
      if (e instanceof ApiError && e.status === 402 && e.payload?.code === "ENTITLEMENT_BLOCKED") {
        setExtendTarget(null);
        setPaywall({
          fromKey: "extend_deadline",
          message: e.message,
          limit: typeof e.payload.limit === "number" ? e.payload.limit : undefined,
        });
        return;
      }
      const msg = e instanceof Error ? e.message : tt.extendFailedFallback;
      alert(msg);
    } finally {
      setActionLoading(null);
    }
  };

  const closeModal = () => { setShowModal(false); setEditJob(null); setTemplateJob(null); };

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase size={20} style={{ color: "var(--brand-primary)" }} />
            {tt.pageTitle}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{tt.pageSubtitle}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg shrink-0"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Plus size={16} />
          {tt.postAJob}
        </button>
      </div>

      {/* ── Status filter tabs ───────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {STATUS_TAB_VALUES.map((value) => {
          const active = filter === value;
          const count = counts[value];
          const label = value === "all" ? common.all : tt.statusTabLabels[value];
          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
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

      {/* ── Content ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-gray-300" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle size={30} className="text-red-400" />
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={loadJobs}
            className="px-4 py-2 text-sm font-medium text-white rounded-xl"
            style={{ background: "var(--brand-gradient)" }}
          >
            {common.retry}
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState onCreateClick={openCreate} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onEdit={openEdit}
              onPublish={handlePublish}
              onClose={handleClose}
              onDelete={handleDelete}
              onExtendDeadline={(j) => setExtendTarget(j)}
              onRepost={openRepost}
              onDuplicate={openDuplicate}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {/* ── Modal ───────────────────────────────────────────────────── */}
      {showModal && (
        <JobModal
          editJob={editJob}
          templateJob={templateJob}
          templateMode={templateMode}
          onClose={closeModal}
          onSaved={handleSaved}
          onPaywall={setPaywall}
        />
      )}

      {/* ── Extend-deadline popover (SRD 3.2.7) ─────────────────────── */}
      {extendTarget && (
        <ExtendDeadlineDialog
          job={extendTarget}
          saving={actionLoading === extendTarget._id}
          onCancel={() => setExtendTarget(null)}
          onConfirm={(d) => handleExtendDeadline(extendTarget._id, d)}
        />
      )}

      {/* ── Paywall (fires on ENTITLEMENT_BLOCKED responses) ────────── */}
      <PaywallModal
        open={!!paywall}
        onClose={() => setPaywall(null)}
        audience="school"
        plansHref="/school/billing/plans"
        fromKey={paywall?.fromKey}
        message={paywall?.message}
        title={paywall && paywall.limit
          ? tt.paywallTitleTemplate.replace("{limit}", String(paywall.limit))
          : undefined}
        bullets={tt.paywallBullets}
      />
    </div>
  );
}

// ─── Extend Deadline Dialog (SRD 3.2.7) ───────────────────────────────────────

function ExtendDeadlineDialog({
  job,
  saving,
  onCancel,
  onConfirm,
}: {
  job: SchoolJob;
  saving: boolean;
  onCancel: () => void;
  onConfirm: (deadline: string) => void;
}) {
  const { t } = useTranslation();
  const tt = t.school.jobs;
  const common: SchoolCommonTranslations = t.school.common;
  // Default to 14 days from today.
  const defaultDeadline = (() => {
    const d = new Date(); d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  })();
  const [deadline, setDeadline] = useState(defaultDeadline);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-3 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0"
            style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}>
            <CalendarPlus size={16} />
          </span>
          <div>
            <h3 className="text-base font-bold text-gray-900">{tt.extendDialogTitle}</h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{job.title}</p>
          </div>
        </div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.extendDialogNewDeadlineLabel}</label>
        <input
          type="date"
          value={deadline}
          min={today}
          onChange={(e) => setDeadline(e.target.value)}
          className={inputCls}
          style={inputStyle}
        />
        {job.status === "expired" && (
          <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {tt.extendDialogReactivateNote}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {common.cancel}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(deadline)}
            disabled={saving || !deadline}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <CalendarPlus size={14} />}
            {tt.extendDialogConfirmCta}
          </button>
        </div>
      </div>
    </div>
  );
}
