"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Plus, Briefcase, MoreVertical, Eye, FileText, Pencil,
  Send, X, Trash2, Loader2, AlertCircle, CheckSquare,
  Square, MapPin, Clock, DollarSign, ChevronDown, ChevronLeft,
  BookOpen, GraduationCap, Globe, Shield, Users, Calendar,
  Building, Languages, Tag, Sparkles, BookCheck,
} from "lucide-react";
import {
  listSchoolJobs,
  createJob,
  updateJob,
  publishJob,
  closeJob,
  deleteJob,
} from "@/lib/api/school";
import type { SchoolJob } from "@/lib/api/school";

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBJECT_OPTIONS: { label: string; value: string }[] = [
  { label: "Islamic Studies",    value: "islamic_studies"  },
  { label: "Arabic",             value: "arabic"           },
  { label: "English",            value: "english"          },
  { label: "Math",               value: "math"             },
  { label: "Science",            value: "science"          },
  { label: "Physics",            value: "physics"          },
  { label: "Chemistry",          value: "chemistry"        },
  { label: "Biology",            value: "biology"          },
  { label: "Computer Science",   value: "computer_science" },
  { label: "Social Studies",     value: "social_studies"   },
  { label: "PE",                 value: "pe"               },
  { label: "Art",                value: "art"              },
  { label: "Other",              value: "other"            },
];

const GRADE_GROUPS: { label: string; values: string[] }[] = [
  { label: "KG",               values: ["kg"] },
  { label: "Elementary (1–6)", values: ["elementary_1","elementary_2","elementary_3","elementary_4","elementary_5","elementary_6"] },
  { label: "Middle (7–9)",     values: ["middle_7","middle_8","middle_9"] },
  { label: "High (10–12)",     values: ["high_10","high_11","high_12"] },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { label: "Full Time",  value: "full_time"  },
  { label: "Part Time",  value: "part_time"  },
  { label: "Contract",   value: "contract"   },
  { label: "Temporary",  value: "temporary"  },
];

const CITY_OPTIONS = [
  { label: "Riyadh",  value: "riyadh"  },
  { label: "Jeddah",  value: "jeddah"  },
  { label: "Makkah",  value: "makkah"  },
  { label: "Madinah", value: "madinah" },
  { label: "Dammam",  value: "dammam"  },
  { label: "Khobar",  value: "khobar"  },
  { label: "Jubail",  value: "jubail"  },
  { label: "Taif",    value: "taif"    },
  { label: "Tabuk",   value: "tabuk"   },
  { label: "Other",   value: "other"   },
];

const LANGUAGE_OPTIONS = [
  { label: "Arabic",    value: "arabic"    },
  { label: "English",   value: "english"   },
  { label: "Bilingual", value: "bilingual" },
];

const EXPERIENCE_OPTIONS = [
  { label: "0–1 years",  value: "0-1"  },
  { label: "1–3 years",  value: "1-3"  },
  { label: "3–5 years",  value: "3-5"  },
  { label: "5–10 years", value: "5-10" },
  { label: "10+ years",  value: "10+"  },
];

const DEGREE_OPTIONS = [
  { label: "Diploma",     value: "diploma"   },
  { label: "Bachelor's",  value: "bachelor"  },
  { label: "Master's",    value: "master"    },
  { label: "PhD",         value: "phd"       },
];

const SALARY_DISPLAY_OPTIONS = [
  { label: "Show",        value: "show"        },
  { label: "Negotiable",  value: "negotiable"  },
  { label: "Hidden",      value: "hidden"      },
];

type StatusFilter = "all" | "active" | "draft" | "closed" | "expired";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDeadline(isoStr: string): string {
  const d = new Date(isoStr);
  const now = new Date();
  const days = Math.ceil((d.getTime() - now.getTime()) / 86_400_000);
  if (days < 0)   return "Expired";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days}d left`;
}

function cityLabel(v: string): string {
  return CITY_OPTIONS.find((c) => c.value === v)?.label ?? v;
}

function employmentLabel(v: string): string {
  return EMPLOYMENT_TYPE_OPTIONS.find((e) => e.value === v)?.label ?? v;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SchoolJob["status"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    active:  { label: "Active",  cls: "bg-green-100 text-green-700 border border-green-200"    },
    draft:   { label: "Draft",   cls: "bg-amber-100 text-amber-700 border border-amber-200"    },
    closed:  { label: "Closed",  cls: "bg-slate-100 text-slate-600 border border-slate-200"    },
    expired: { label: "Expired", cls: "bg-red-100 text-red-600 border border-red-200"          },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
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

const GRADE_GROUP_LABELS: Record<string, { en: string; ar: string }> = {
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
    const lbl = GRADE_GROUP_LABELS[groups[0]];
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
  const cls =
    count > WORD_SOFT_CAP
      ? "text-red-600"
      : count > WORD_SOFT_CAP * 0.9
      ? "text-amber-600"
      : "text-gray-400";
  return (
    <p className={`text-xs ${cls} mt-1 text-right tabular-nums`}>
      {count.toLocaleString()} / {WORD_SOFT_CAP.toLocaleString()} words
      {count > WORD_SOFT_CAP && " · over limit"}
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
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
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
            aria-label={`Remove ${v}`}
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
  onClose: () => void;
  onSaved: (job: SchoolJob, published: boolean) => void;
}

function JobModal({ editJob, onClose, onSaved }: JobModalProps) {
  const [form, setForm] = useState<JobFormData>(
    editJob ? jobToForm(editJob) : EMPTY_FORM
  );
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
    if (!form.titleEn.trim() && !form.titleAr.trim()) return "Add a job title in English or Arabic.";
    if (form.subjects.length === 0) return "Select at least one subject.";
    if (!form.city) return "City is required.";
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
      setError((e as Error)?.message ?? "Something went wrong.");
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
      <div className="relative ml-auto w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === "preview"
                ? "Review & Publish"
                : (editJob ? "Edit Job" : "Post a New Job")}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === "preview"
                ? "This is how teachers will see your job. Go back to edit anything."
                : (editJob ? "Update your job posting details" : "Fill in the details to create a job posting")}
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
                <SectionHeader icon={Briefcase} title="Job Identity" subtitle="What is this role and what does it cover?" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Job Title (English) <span className="text-gray-400 font-normal">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.titleEn}
                      onChange={(e) => set("titleEn", e.target.value)}
                      placeholder="e.g. Math Teacher — Middle School"
                      dir="ltr"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Job Title (Arabic) <span className="text-gray-400 font-normal">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.titleAr}
                      onChange={(e) => set("titleAr", e.target.value)}
                      placeholder="مثال: مدرس رياضيات — المرحلة المتوسطة"
                      dir="rtl"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Add at least one language — the other will display as a fallback.</p>

                {suggestions.length > 0 && (
                  <div className="mt-3 bg-purple-50/40 border border-purple-100 rounded-xl p-3">
                    <p className="text-xs font-semibold text-purple-700 flex items-center gap-1.5 mb-2">
                      <Sparkles size={12} /> Suggested titles
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
                    Subjects <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS.map(({ label, value }) => {
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
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grade Levels */}
                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Grade Levels</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GRADE_GROUPS.map(({ label, values }) => {
                      const allSelected = values.every((v) => form.gradeLevels.includes(v));
                      const someSelected = values.some((v) => form.gradeLevels.includes(v));
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleGradeGroup(values)}
                          className={`flex items-center gap-2 px-3.5 py-2.5 text-sm rounded-xl border transition-all text-left ${
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
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Employment type + Positions */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Employment Type</label>
                    <div className="relative">
                      <select
                        value={form.employmentType}
                        onChange={(e) => set("employmentType", e.target.value)}
                        className={`${inputCls} appearance-none pr-9 bg-white`}
                        style={inputStyle}
                      >
                        {EMPLOYMENT_TYPE_OPTIONS.map(({ label, value }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Open Positions</label>
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
                <SectionHeader icon={Calendar} title="Schedule & Compensation" subtitle="When does the role start, and how is it paid?" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => set("startDate", e.target.value)}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Application Deadline</label>
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
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">Contract Duration Mode</label>
                      <div className="relative">
                        <select
                          value={form.contractDurationType}
                          onChange={(e) => set("contractDurationType", e.target.value as JobFormData["contractDurationType"])}
                          className={`${inputCls} appearance-none pr-9 bg-white`}
                          style={inputStyle}
                        >
                          <option value="day">By Day (substitute)</option>
                          <option value="month">By Month</option>
                          <option value="year">By Year</option>
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Duration ({form.contractDurationType === "day" ? "days" : form.contractDurationType === "month" ? "months" : "years"})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={form.contractDurationValue}
                        onChange={(e) => set("contractDurationValue", e.target.value)}
                        placeholder="optional"
                        className={inputCls}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* Salary */}
                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Salary (SAR / Month)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      value={form.salaryMin}
                      onChange={(e) => set("salaryMin", e.target.value)}
                      className={inputCls}
                      style={inputStyle}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={form.salaryMax}
                      onChange={(e) => set("salaryMax", e.target.value)}
                      className={inputCls}
                      style={inputStyle}
                    />
                    <div className="relative">
                      <select
                        value={form.salaryDisplay}
                        onChange={(e) => set("salaryDisplay", e.target.value)}
                        className={`${inputCls} appearance-none pr-9 bg-white`}
                        style={inputStyle}
                      >
                        {SALARY_DISPLAY_OPTIONS.map(({ label, value }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Daily rate — substitute roles */}
                {isSubstituteLike && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Daily Rate (SAR)
                      <span className="ml-2 text-xs text-gray-400 font-normal">for substitute / per-diem roles</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.dailyRate}
                      onChange={(e) => set("dailyRate", e.target.value)}
                      placeholder="e.g. 400"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                )}
              </section>

              {/* ── Location ─────────────────────────────────────────── */}
              <section>
                <SectionHeader icon={MapPin} title="Location" subtitle="Where will the teacher be based?" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">City</label>
                    <div className="relative">
                      <select
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        className={`${inputCls} appearance-none pr-9 bg-white`}
                        style={inputStyle}
                      >
                        {CITY_OPTIONS.map(({ label, value }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                      Campus <span className="text-gray-400 font-normal text-xs">(if multiple)</span>
                    </label>
                    <input
                      type="text"
                      value={form.campus}
                      onChange={(e) => set("campus", e.target.value)}
                      placeholder="e.g. Al-Olaya branch"
                      className={inputCls}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </section>

              {/* ── Description (4 sections × Ar/En) ────────────────── */}
              <section>
                <SectionHeader icon={BookOpen} title="Job Description" subtitle="Structured sections — add at least one language per section." />

                {([
                  { key: "responsibilities", label: "Responsibilities", placeholder: "Teach, plan lessons, mentor students…" },
                  { key: "requirements",     label: "Requirements",     placeholder: "Education, experience, certifications, soft skills…" },
                  { key: "culture",          label: "School Culture",   placeholder: "Values, work environment, team…" },
                  { key: "benefits",         label: "Benefits",         placeholder: "Housing, transport, professional development…" },
                ] as const).map(({ key, label, placeholder }) => {
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
                <SectionHeader icon={GraduationCap} title="Candidate Requirements" subtitle="Who are you looking for?" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Language Requirement</label>
                    <div className="relative">
                      <select
                        value={form.languageRequirement}
                        onChange={(e) => set("languageRequirement", e.target.value)}
                        className={`${inputCls} appearance-none pr-9 bg-white`}
                        style={inputStyle}
                      >
                        {LANGUAGE_OPTIONS.map(({ label, value }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Experience Required</label>
                    <div className="relative">
                      <select
                        value={form.experienceRequired}
                        onChange={(e) => set("experienceRequired", e.target.value)}
                        className={`${inputCls} appearance-none pr-9 bg-white`}
                        style={inputStyle}
                      >
                        {EXPERIENCE_OPTIONS.map(({ label, value }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Degree Required</label>
                    <div className="relative">
                      <select
                        value={form.degreeRequired}
                        onChange={(e) => set("degreeRequired", e.target.value)}
                        className={`${inputCls} appearance-none pr-9 bg-white`}
                        style={inputStyle}
                      >
                        {DEGREE_OPTIONS.map(({ label, value }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Teaching License</label>
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
                      Saudi license required
                    </button>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Required Certifications
                  </label>
                  <TagInput
                    values={form.certificationsRequired}
                    onChange={(v) => set("certificationsRequired", v)}
                    placeholder="Type a certification (e.g. TEFL, IB Educator) and press Enter…"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Preferred Certifications
                  </label>
                  <TagInput
                    values={form.certificationsPreferred}
                    onChange={(v) => set("certificationsPreferred", v)}
                    placeholder="Nice-to-have credentials…"
                  />
                </div>
              </section>

              {/* ── Visibility & Application Settings ─────────────────── */}
              <section>
                <SectionHeader icon={Users} title="Visibility & Applications" subtitle="Control who sees the post and how many candidates can apply." />

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
                    <p className="text-sm font-semibold text-gray-800">Post Anonymously</p>
                    <p className="text-xs text-gray-500">Hide school name from public job listing</p>
                  </div>
                </label>

                {/* SRD 3.2.4 — application cap + auto-close */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Maximum Applications
                    <span className="ml-2 text-xs text-gray-400 font-normal">optional cap</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxApplications}
                    onChange={(e) => set("maxApplications", e.target.value)}
                    placeholder="e.g. 50 — leave blank for unlimited"
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
                      <p className="text-sm font-semibold text-gray-800">Auto-close when full</p>
                      <p className="text-xs text-gray-500">
                        {form.maxApplications
                          ? "Job will be moved to Closed automatically once it reaches the application cap."
                          : "Set a cap above to enable auto-close."}
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
                    {employmentLabel(form.employmentType)}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {cityLabel(form.city)}{form.campus ? ` (${form.campus})` : ""}
                  </span>
                  {form.positions && (
                    <>
                      <span>·</span>
                      <span>{form.positions} position{form.positions === "1" ? "" : "s"}</span>
                    </>
                  )}
                  {form.isAnonymous && (
                    <>
                      <span>·</span>
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Anonymous</span>
                    </>
                  )}
                </div>
              </div>

              {/* Subjects + grades */}
              <div className="flex flex-wrap gap-1.5">
                {form.subjects.map((s) => (
                  <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {SUBJECT_OPTIONS.find((o) => o.value === s)?.label ?? s}
                  </span>
                ))}
                {Array.from(new Set(form.gradeLevels.map(gradeGroupOf).filter(Boolean))).map((g) => (
                  <span key={g as string} className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                    {GRADE_GROUP_LABELS[g as string]?.en}
                  </span>
                ))}
              </div>

              {/* Schedule + compensation */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div>
                  <p className="text-xs text-gray-500">Start date</p>
                  <p className="text-sm font-semibold text-gray-800">{form.startDate || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Application deadline</p>
                  <p className="text-sm font-semibold text-gray-800">{form.deadline || "—"}</p>
                </div>
                {needsContractDuration && (
                  <div>
                    <p className="text-xs text-gray-500">Contract</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {form.contractDurationValue
                        ? `${form.contractDurationValue} ${form.contractDurationType}${form.contractDurationValue === "1" ? "" : "s"}`
                        : `By ${form.contractDurationType}`}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Salary</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {form.salaryDisplay === "hidden"
                      ? "Hidden"
                      : form.salaryDisplay === "negotiable"
                      ? "Negotiable"
                      : (form.salaryMin || form.salaryMax)
                        ? `${form.salaryMin || "?"} – ${form.salaryMax || "?"} SAR/mo`
                        : "—"}
                  </p>
                </div>
                {form.dailyRate && (
                  <div>
                    <p className="text-xs text-gray-500">Daily rate</p>
                    <p className="text-sm font-semibold text-gray-800">{form.dailyRate} SAR/day</p>
                  </div>
                )}
                {form.maxApplications && (
                  <div>
                    <p className="text-xs text-gray-500">Application cap</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {form.maxApplications}{form.autoCloseOnMax ? " · auto-closes" : ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Description sections */}
              <div className="space-y-5">
                <PreviewBlock label="Responsibilities" en={form.responsibilitiesEn} ar={form.responsibilitiesAr} />
                <PreviewBlock label="Requirements"     en={form.requirementsEn}     ar={form.requirementsAr} />
                <PreviewBlock label="School Culture"   en={form.cultureEn}          ar={form.cultureAr} />
                <PreviewBlock label="Benefits"         en={form.benefitsEn}         ar={form.benefitsAr} />
              </div>

              {/* Credentials + langs */}
              <div className="text-sm text-gray-700 space-y-1.5">
                <p className="flex items-center gap-2"><Languages size={13} className="text-gray-400" /> Language: <span className="font-medium">{form.languageRequirement}</span></p>
                <p className="flex items-center gap-2"><Briefcase size={13} className="text-gray-400" /> Experience: <span className="font-medium">{form.experienceRequired}</span></p>
                <p className="flex items-center gap-2"><GraduationCap size={13} className="text-gray-400" /> Degree: <span className="font-medium">{form.degreeRequired}</span></p>
                {form.teachingLicenseRequired && (
                  <p className="flex items-center gap-2"><Shield size={13} className="text-gray-400" /> Saudi teaching license required</p>
                )}
              </div>

              {(form.certificationsRequired.length > 0 || form.certificationsPreferred.length > 0) && (
                <div className="space-y-2">
                  {form.certificationsRequired.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Required Certifications</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.certificationsRequired.map((c) => (
                          <span key={c} className="text-xs px-2 py-1 rounded-lg bg-red-50 border border-red-100 text-red-700">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {form.certificationsPreferred.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Preferred Certifications</p>
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
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : "Save as Draft"}
                </button>
                <button
                  type="button"
                  onClick={goPreview}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  <Eye size={14} />
                  Preview
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
                <ChevronLeft size={14} /> Back to Edit
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 size={15} className="animate-spin" /> : "Save as Draft"}
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
                      {editJob && editJob.status === "active" ? "Save Changes" : "Publish"}
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
  actionLoading: string | null;
}

function JobCard({ job, onEdit, onPublish, onClose, onDelete, actionLoading }: JobCardProps) {
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
  const deadlineLabel = job.deadline ? formatDeadline(job.deadline) : null;
  const isDeadlineUrgent = deadlineLabel && deadlineLabel !== "Expired" && parseInt(deadlineLabel) <= 3;

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
          {deadlineLabel && (
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                deadlineLabel === "Expired"
                  ? "bg-red-50 text-red-500"
                  : isDeadlineUrgent
                  ? "bg-orange-50 text-orange-600"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              <Clock size={10} className="inline mr-1" />
              {deadlineLabel}
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
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-20">
              <button
                onClick={() => { setMenuOpen(false); onEdit(job); }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil size={13} className="text-gray-400" /> Edit
              </button>
              {job.status === "draft" && (
                <button
                  onClick={() => { setMenuOpen(false); onPublish(job._id); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Send size={13} className="text-blue-400" /> Publish
                </button>
              )}
              {job.status === "active" && (
                <button
                  onClick={() => { setMenuOpen(false); onClose(job._id); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X size={13} className="text-amber-400" /> Close Job
                </button>
              )}
              <Link
                href={`/school/applications?jobId=${job._id}`}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <FileText size={13} className="text-indigo-400" /> View Applications
              </Link>
              {job.status === "draft" && (
                <>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(job._id); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
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
          {cityLabel(job.city)}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
          <Briefcase size={10} className="text-gray-400" />
          {employmentLabel(job.employmentType)}
        </span>
        {job.salary.display === "show" && (job.salary.min || job.salary.max) && (
          <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
            <DollarSign size={10} />
            SAR {job.salary.min?.toLocaleString() ?? "–"}
            {job.salary.max ? `–${job.salary.max.toLocaleString()}` : "+"}
          </span>
        )}
        {job.salary.display === "negotiable" && (
          <span className="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
            Negotiable
          </span>
        )}
      </div>

      {/* Subjects */}
      {job.subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {displayedSubjects.map((s) => {
            const label = SUBJECT_OPTIONS.find((o) => o.value === s)?.label ?? s;
            return (
              <span key={s} className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                {label}
              </span>
            );
          })}
          {extraSubjects > 0 && (
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
              +{extraSubjects} more
            </span>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Eye size={13} className="text-gray-400" />
          {job.viewsCount.toLocaleString()} views
        </span>
        <Link
          href={`/school/applications?jobId=${job._id}`}
          className="flex items-center gap-1.5 text-xs font-medium hover:underline"
          style={{ color: job.applicationsCount > 0 ? "var(--brand-primary)" : undefined }}
        >
          <FileText size={13} className={job.applicationsCount > 0 ? "" : "text-gray-400"} />
          <span className={job.applicationsCount > 0 ? "" : "text-gray-500"}>
            {job.applicationsCount.toLocaleString()} applications
          </span>
        </Link>
        {job.positions && job.positions > 1 && (
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users size={13} className="text-gray-400" />
            {job.positions} positions
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
        style={{ background: "var(--brand-gradient)" }}
      >
        <Briefcase size={36} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No job postings yet</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        Create your first job to start attracting qualified teachers and build your hiring pipeline.
      </p>
      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg"
        style={{ background: "var(--brand-gradient)" }}
      >
        <Plus size={16} />
        Post Your First Job
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all",     label: "All"     },
  { value: "active",  label: "Active"  },
  { value: "draft",   label: "Draft"   },
  { value: "closed",  label: "Closed"  },
  { value: "expired", label: "Expired" },
];

export default function JobsPage() {
  const [jobs, setJobs]               = useState<SchoolJob[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [filter, setFilter]           = useState<StatusFilter>("all");
  const [showModal, setShowModal]     = useState(false);
  const [editJob, setEditJob]         = useState<SchoolJob | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSchoolJobs({ limit: 100 });
      setJobs(res.jobs ?? []);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

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
  };

  const handlePublish = async (jobId: string) => {
    setActionLoading(jobId);
    try {
      const updated = await publishJob(jobId);
      setJobs((prev) => prev.map((j) => (j._id === jobId ? updated : j)));
    } catch {
      // silently fail; could toast here
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
    if (!confirm("Delete this draft job? This cannot be undone.")) return;
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

  const openCreate = () => { setEditJob(null); setShowModal(true); };
  const openEdit   = (job: SchoolJob) => { setEditJob(job); setShowModal(true); };

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase size={20} style={{ color: "var(--brand-primary)" }} />
            Job Postings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your open positions</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg shrink-0"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Plus size={16} />
          Post a Job
        </button>
      </div>

      {/* ── Status filter tabs ───────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {STATUS_TABS.map(({ value, label }) => {
          const active = filter === value;
          const count = counts[value];
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
            Retry
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
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {/* ── Modal ───────────────────────────────────────────────────── */}
      {showModal && (
        <JobModal
          editJob={editJob}
          onClose={() => { setShowModal(false); setEditJob(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
