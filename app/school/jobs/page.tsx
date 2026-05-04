"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Plus, Briefcase, MoreVertical, Eye, FileText, Pencil,
  Send, X, Trash2, Loader2, AlertCircle, CheckSquare,
  Square, MapPin, Clock, DollarSign, ChevronDown,
  BookOpen, GraduationCap, Globe, Shield, Users,
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
  title: string;
  description: string;
  subjects: string[];
  gradeLevels: string[];
  employmentType: string;
  positions: string;
  city: string;
  languageRequirement: string;
  experienceRequired: string;
  degreeRequired: string;
  teachingLicenseRequired: boolean;
  salaryMin: string;
  salaryMax: string;
  salaryDisplay: string;
  deadline: string;
  isAnonymous: boolean;
}

const EMPTY_FORM: JobFormData = {
  title: "",
  description: "",
  subjects: [],
  gradeLevels: [],
  employmentType: "full_time",
  positions: "1",
  city: "riyadh",
  languageRequirement: "arabic",
  experienceRequired: "1-3",
  degreeRequired: "bachelor",
  teachingLicenseRequired: false,
  salaryMin: "",
  salaryMax: "",
  salaryDisplay: "show",
  deadline: "",
  isAnonymous: false,
};

function jobToForm(job: SchoolJob): JobFormData {
  return {
    title: job.title ?? "",
    description: job.description ?? "",
    subjects: job.subjects ?? [],
    gradeLevels: (job.gradeLevels ?? []).filter(g =>
      ["kg","elementary_1","elementary_2","elementary_3","elementary_4","elementary_5","elementary_6",
       "middle_7","middle_8","middle_9","high_10","high_11","high_12"].includes(g)
    ),
    employmentType: job.employmentType ?? "full_time",
    positions: String(job.positions ?? 1),
    city: job.city ?? "riyadh",
    languageRequirement: job.languageRequirement ?? "arabic",
    experienceRequired: job.experienceRequired ?? "1-3",
    degreeRequired: job.degreeRequired ?? "bachelor",
    teachingLicenseRequired: job.teachingLicenseRequired ?? false,
    salaryMin: job.salary?.min != null ? String(job.salary.min) : "",
    salaryMax: job.salary?.max != null ? String(job.salary.max) : "",
    salaryDisplay: job.salary?.display ?? "show",
    deadline: job.deadline ? job.deadline.slice(0, 10) : "",
    isAnonymous: job.isAnonymous ?? false,
  };
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

  const handleSubmit = async (publish: boolean) => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (form.subjects.length === 0) { setError("Select at least one subject."); return; }
    if (!form.city) { setError("City is required."); return; }
    setError(null);
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        subjects: form.subjects,
        gradeLevels: form.gradeLevels,
        employmentType: form.employmentType as SchoolJob["employmentType"],
        positions: form.positions ? Number(form.positions) : undefined,
        city: form.city,
        languageRequirement: form.languageRequirement as SchoolJob["languageRequirement"],
        experienceRequired: form.experienceRequired || undefined,
        degreeRequired: form.degreeRequired || undefined,
        teachingLicenseRequired: form.teachingLicenseRequired,
        salary: {
          min: form.salaryMin ? Number(form.salaryMin) : undefined,
          max: form.salaryMax ? Number(form.salaryMax) : undefined,
          display: form.salaryDisplay as SchoolJob["salary"]["display"],
        },
        deadline: form.deadline || undefined,
        isAnonymous: form.isAnonymous,
      };
      let job: SchoolJob;
      if (editJob) {
        job = await updateJob(editJob._id, payload);
      } else {
        job = await createJob(payload);
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
      <div className="relative ml-auto w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {editJob ? "Edit Job" : "Post a New Job"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {editJob ? "Update your job posting details" : "Fill in the details to create a job posting"}
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
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Math Teacher – Middle School"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe the role, responsibilities, and what you're looking for…"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>

          {/* Subjects */}
          <div>
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
          <div>
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

          {/* Row: Employment Type + Positions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Employment Type</label>
              <div className="relative">
                <select
                  value={form.employmentType}
                  onChange={(e) => set("employmentType", e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-9"
                  style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
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
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              />
            </div>
          </div>

          {/* Row: City + Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">City</label>
              <div className="relative">
                <select
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-9"
                  style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
                >
                  {CITY_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Language Requirement</label>
              <div className="relative">
                <select
                  value={form.languageRequirement}
                  onChange={(e) => set("languageRequirement", e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-9"
                  style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
                >
                  {LANGUAGE_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Row: Experience + Degree */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Experience Required</label>
              <div className="relative">
                <select
                  value={form.experienceRequired}
                  onChange={(e) => set("experienceRequired", e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-9"
                  style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
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
                  className="w-full appearance-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-9"
                  style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
                >
                  {DEGREE_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Teaching License */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <button
                type="button"
                onClick={() => set("teachingLicenseRequired", !form.teachingLicenseRequired)}
                className={`w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0 ${
                  form.teachingLicenseRequired
                    ? "border-transparent text-white"
                    : "border-gray-300 bg-white group-hover:border-gray-400"
                }`}
                style={form.teachingLicenseRequired ? { background: "var(--brand-gradient)" } : {}}
              >
                {form.teachingLicenseRequired && <CheckSquare size={12} />}
              </button>
              <div>
                <p className="text-sm font-semibold text-gray-800">Teaching License Required</p>
                <p className="text-xs text-gray-500">Candidates must hold a valid Saudi teaching license</p>
              </div>
            </label>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Salary (SAR / Month)</label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                placeholder="Min"
                value={form.salaryMin}
                onChange={(e) => set("salaryMin", e.target.value)}
                className="px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              />
              <input
                type="number"
                placeholder="Max"
                value={form.salaryMax}
                onChange={(e) => set("salaryMax", e.target.value)}
                className="px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              />
              <div className="relative">
                <select
                  value={form.salaryDisplay}
                  onChange={(e) => set("salaryDisplay", e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-9"
                  style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
                >
                  {SALARY_DISPLAY_OPTIONS.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Application Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>

          {/* Anonymous */}
          <div>
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
                <p className="text-xs text-gray-500">Hide school name from job listing</p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
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
                  {editJob && editJob.status === "active" ? "Save Changes" : "Save & Publish"}
                </>
              )}
            </button>
          </div>
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
