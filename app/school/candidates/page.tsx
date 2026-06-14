"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, X, Loader2, AlertCircle, Filter, Users,
  MapPin, Briefcase, GraduationCap, ChevronDown,
  Download, Star, StickyNote, BookmarkPlus, Eye,
  CheckSquare, Square, Plus, FileText, Globe,
  Award, ChevronLeft, ChevronRight,
  History, MessageSquare, FileSignature, Calendar as CalendarIcon,
} from "lucide-react";
import {
  searchCandidates,
  listShortlists,
  addToShortlist,
  addToShortlistBulk,
  createShortlist,
  addCandidateNote,
  exportCandidatesPdf,
  getCandidateHistory,
} from "@/lib/api/school";
import type { CandidateProfile, Shortlist, CandidateHistory } from "@/lib/api/school";

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBJECT_OPTIONS = [
  { label: "Islamic Studies",  value: "islamic_studies"  },
  { label: "Arabic",           value: "arabic"           },
  { label: "English",          value: "english"          },
  { label: "Math",             value: "math"             },
  { label: "Science",          value: "science"          },
  { label: "Physics",          value: "physics"          },
  { label: "Chemistry",        value: "chemistry"        },
  { label: "Biology",          value: "biology"          },
  { label: "Computer Science", value: "computer_science" },
  { label: "Social Studies",   value: "social_studies"   },
  { label: "PE",               value: "pe"               },
  { label: "Art",              value: "art"              },
  { label: "Other",            value: "other"            },
];

const GRADE_LEVEL_OPTIONS = [
  { label: "KG",          value: "kg"           },
  { label: "Elementary",  value: "elementary"   },
  { label: "Middle",      value: "middle"       },
  { label: "High",        value: "high"         },
];

const EXPERIENCE_OPTIONS = [
  { label: "Any",        value: ""     },
  { label: "0–1 years",  value: "0-1"  },
  { label: "1–3 years",  value: "1-3"  },
  { label: "3–5 years",  value: "3-5"  },
  { label: "5–10 years", value: "5-10" },
  { label: "10+ years",  value: "10+"  },
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
];

const DEGREE_OPTIONS = [
  { label: "Any",        value: ""         },
  { label: "Diploma",    value: "diploma"  },
  { label: "Bachelor's", value: "bachelor" },
  { label: "Master's",   value: "master"   },
  { label: "PhD",        value: "phd"      },
];

const SORT_OPTIONS = [
  { label: "Newest",              value: "newest"     },
  { label: "Profile Completeness",value: "completion" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function candidateDisplayName(c: CandidateProfile): string {
  return c.personal?.fullNameEn ?? c.personal?.fullNameAr ?? "Unnamed Candidate";
}

function candidateInitials(c: CandidateProfile): string {
  const name = candidateDisplayName(c);
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function subjectLabel(v: string): string {
  return SUBJECT_OPTIONS.find((s) => s.value === v)?.label ?? v;
}

function cityLabel(v: string): string {
  return CITY_OPTIONS.find((c) => c.value === v)?.label ?? v;
}

function gradeGroupLabel(levels: string[]): string {
  const groups: string[] = [];
  if (levels.some((l) => l.startsWith("kg"))) groups.push("KG");
  if (levels.some((l) => l.startsWith("elementary"))) groups.push("Elementary");
  if (levels.some((l) => l.startsWith("middle"))) groups.push("Middle");
  if (levels.some((l) => l.startsWith("high"))) groups.push("High");
  return groups.join(", ") || levels.join(", ");
}

// ─── Filter State ─────────────────────────────────────────────────────────────

interface FilterState {
  subjects: string[];
  gradeLevels: string[];
  experienceRange: string;
  city: string[];
  gender: string;
  degreeType: string;
  // SRD 3.3.2 — added 2026-06-15
  certificationsKeyword: string;
  language: string;
  languageProficiency: string;
  employmentStatus: string;       // serves as "Availability"
  salaryMaxAcceptable: string;
  sortBy: string;
}

const DEFAULT_FILTERS: FilterState = {
  subjects: [],
  gradeLevels: [],
  experienceRange: "",
  city: [],
  gender: "",
  degreeType: "",
  certificationsKeyword: "",
  language: "",
  languageProficiency: "",
  employmentStatus: "",
  salaryMaxAcceptable: "",
  sortBy: "newest",
};

// SRD 3.3.2 — option lists for the new filter controls
const LANGUAGE_OPTIONS = [
  { label: "Any",        value: ""        },
  { label: "Arabic",     value: "arabic"  },
  { label: "English",    value: "english" },
  { label: "French",     value: "french"  },
  { label: "Urdu",       value: "urdu"    },
  { label: "Other",      value: "other"   },
];
const PROFICIENCY_OPTIONS = [
  { label: "Any",         value: ""        },
  { label: "Basic",       value: "basic"   },
  { label: "Intermediate",value: "intermediate" },
  { label: "Fluent",      value: "fluent"  },
  { label: "Native",      value: "native"  },
];
const AVAILABILITY_OPTIONS = [
  { label: "Any",                 value: ""           },
  { label: "Available immediately", value: "unemployed" },
  { label: "Currently employed",    value: "employed"   },
  { label: "Freelance / Open",      value: "freelance"  },
];

// ─── Add-to-Shortlist Dropdown ────────────────────────────────────────────────

interface ShortlistDropdownProps {
  teacherId: string;
  shortlists: Shortlist[];
  onAdded: () => void;
  onCreateNew: (teacherId: string) => void;
  onClose: () => void;
}

function ShortlistDropdown({ teacherId, shortlists, onAdded, onCreateNew, onClose }: ShortlistDropdownProps) {
  const [adding, setAdding] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleAdd = async (shortlistId: string) => {
    setAdding(shortlistId);
    try {
      await addToShortlist(shortlistId, teacherId);
      onAdded();
      onClose();
    } catch {
      // silently fail
    } finally {
      setAdding(null);
    }
  };

  const active = shortlists.filter((s) => !s.isArchived);

  return (
    <div
      ref={ref}
      className="absolute right-0 bottom-full mb-1 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30"
    >
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-1.5">
        Add to Shortlist
      </p>
      {active.length === 0 ? (
        <p className="text-xs text-gray-500 px-3 py-2">No shortlists yet.</p>
      ) : (
        active.map((sl) => (
          <button
            key={sl._id}
            onClick={() => handleAdd(sl._id)}
            disabled={adding === sl._id}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: sl.color ?? "#3B82F6" }}
              />
              <span className="truncate">{sl.name}</span>
            </span>
            {adding === sl._id ? (
              <Loader2 size={12} className="animate-spin text-gray-400 shrink-0" />
            ) : (
              <span className="text-xs text-gray-400 shrink-0">{sl.teachers.length}</span>
            )}
          </button>
        ))
      )}
      <hr className="my-1 border-gray-100" />
      <button
        onClick={() => { onCreateNew(teacherId); onClose(); }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        style={{ color: "var(--brand-primary)" }}
      >
        <Plus size={13} />
        New Shortlist
      </button>
    </div>
  );
}

// ─── Candidate Card ───────────────────────────────────────────────────────────

interface CandidateCardProps {
  candidate: CandidateProfile;
  shortlists: Shortlist[];
  onViewProfile: (c: CandidateProfile) => void;
  onShortlistAdded: () => void;
  onCreateShortlist: (teacherId: string) => void;
  // SRD 3.3.5 — bulk selection
  selected: boolean;
  onToggleSelect: (id: string) => void;
}

function CandidateCard({
  candidate: c,
  shortlists,
  onViewProfile,
  onShortlistAdded,
  onCreateShortlist,
  selected,
  onToggleSelect,
}: CandidateCardProps) {
  const [showShortlistDrop, setShowShortlistDrop] = useState(false);
  const displaySubjects = (c.professional?.subjects ?? []).slice(0, 3);
  const extraSubjects = (c.professional?.subjects?.length ?? 0) - 3;
  const cities = c.locationPreferences?.preferredCities ?? [];

  return (
    <div
      className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all flex flex-col gap-3 relative ${
        selected ? "border-transparent ring-2" : "border-gray-100 hover:border-gray-200"
      }`}
      style={selected ? { ["--tw-ring-color" as string]: "var(--brand-primary)" } : {}}
    >
      {/* SRD 3.3.5 — selection checkbox */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleSelect(c._id); }}
        aria-label={selected ? "Deselect candidate" : "Select candidate"}
        className={`absolute top-3 right-3 w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
          selected ? "border-transparent text-white" : "border-gray-300 bg-white text-transparent hover:border-gray-400"
        }`}
        style={selected ? { background: "var(--brand-gradient)" } : {}}
      >
        <CheckSquare size={12} />
      </button>

      {/* Avatar + name row */}
      <div className="flex items-start gap-3 pr-8">
        {c.personal?.photoUrl ? (
          <img
            src={c.personal.photoUrl}
            alt={candidateDisplayName(c)}
            className="w-11 h-11 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: "var(--brand-gradient)" }}
          >
            {candidateInitials(c)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 truncate">
            {candidateDisplayName(c)}
          </h3>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            {c.personal?.gender && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                {c.personal.gender}
              </span>
            )}
            {c.personal?.nationality && (
              <span className="text-xs text-gray-400">{c.personal.nationality}</span>
            )}
          </div>
        </div>
      </div>

      {/* Subjects */}
      {displaySubjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {displaySubjects.map((s) => (
            <span key={s} className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
              {subjectLabel(s)}
            </span>
          ))}
          {extraSubjects > 0 && (
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              +{extraSubjects}
            </span>
          )}
        </div>
      )}

      {/* Details */}
      <div className="space-y-1.5 text-xs text-gray-500">
        {(c.professional?.gradeLevels?.length ?? 0) > 0 && (
          <div className="flex items-center gap-1.5">
            <GraduationCap size={12} className="text-gray-400 shrink-0" />
            <span>{gradeGroupLabel(c.professional!.gradeLevels!)}</span>
          </div>
        )}
        {c.professional?.experienceRange && (
          <div className="flex items-center gap-1.5">
            <Briefcase size={12} className="text-gray-400 shrink-0" />
            <span>{c.professional.experienceRange} years</span>
          </div>
        )}
        {cities.length > 0 && (
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-gray-400 shrink-0" />
            <span className="truncate">{cities.map(cityLabel).join(", ")}</span>
          </div>
        )}
      </div>

      {/* Completion bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Profile completeness</span>
          <span className="text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>
            {c.completionPercentage}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${c.completionPercentage}%`, background: "var(--brand-gradient)" }}
          />
        </div>
      </div>

      {/* Salary */}
      {(c.salaryExpectations?.minMonthlySAR || c.salaryExpectations?.maxMonthlySAR) && (
        <div className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg">
          SAR {c.salaryExpectations.minMonthlySAR?.toLocaleString() ?? "–"}
          {c.salaryExpectations.maxMonthlySAR
            ? `–${c.salaryExpectations.maxMonthlySAR.toLocaleString()}`
            : "+"}{" "}
          / month
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 relative">
        <button
          onClick={() => onViewProfile(c)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white rounded-xl transition-all hover:shadow-sm"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Eye size={12} />
          View Profile
        </button>
        <div className="relative">
          <button
            onClick={() => setShowShortlistDrop((v) => !v)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <BookmarkPlus size={12} />
          </button>
          {showShortlistDrop && (
            <ShortlistDropdown
              teacherId={c._id}
              shortlists={shortlists}
              onAdded={onShortlistAdded}
              onCreateNew={onCreateShortlist}
              onClose={() => setShowShortlistDrop(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Candidate History Tab (SRD 3.4.3) ────────────────────────────────────────

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const APPLICATION_STATUS_COLORS: Record<string, string> = {
  submitted:           "bg-slate-100 text-slate-700",
  reviewing:           "bg-blue-100 text-blue-700",
  shortlisted:         "bg-purple-100 text-purple-700",
  interview_scheduled: "bg-amber-100 text-amber-700",
  offer_extended:      "bg-emerald-100 text-emerald-700",
  hired:               "bg-green-100 text-green-700",
  rejected:            "bg-red-100 text-red-600",
  withdrawn:           "bg-gray-100 text-gray-500",
};
const INTERVIEW_STATUS_COLORS: Record<string, string> = {
  invited:     "bg-blue-100 text-blue-700",
  accepted:    "bg-emerald-100 text-emerald-700",
  rescheduled: "bg-amber-100 text-amber-700",
  declined:    "bg-red-100 text-red-600",
  completed:   "bg-green-100 text-green-700",
  cancelled:   "bg-gray-100 text-gray-500",
};
const OFFER_STATUS_COLORS: Record<string, string> = {
  sent:                 "bg-blue-100 text-blue-700",
  viewed:               "bg-purple-100 text-purple-700",
  accepted:             "bg-green-100 text-green-700",
  declined:             "bg-red-100 text-red-600",
  negotiation_requested:"bg-amber-100 text-amber-700",
  expired:              "bg-gray-100 text-gray-500",
};

function HistoryTabBody({
  loading, error, history,
}: {
  loading: boolean;
  error: string | null;
  history: CandidateHistory | null;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-gray-300" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <AlertCircle size={26} className="text-red-400" />
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }
  if (!history) return null;

  const hasAny =
    history.applications.length > 0 ||
    history.interviews.length > 0 ||
    history.offers.length > 0 ||
    history.notes.length > 0 ||
    history.shortlistMemberships.length > 0;

  if (!hasAny) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
          <History size={20} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">No prior interactions with this candidate yet.</p>
        <p className="text-xs text-gray-400">Once you shortlist them, schedule an interview, or extend an offer, it&apos;ll show up here.</p>
      </div>
    );
  }

  return (
    <>
      {/* Applications */}
      {history.applications.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <FileText size={12} />
            Applications ({history.applications.length})
          </h3>
          <div className="space-y-2">
            {history.applications.map((a) => (
              <div key={a._id} className="border border-gray-100 rounded-xl p-3 bg-white">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">{a.job?.title ?? "Job no longer available"}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${APPLICATION_STATUS_COLORS[a.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {a.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>Ref: {a.referenceNumber ?? "—"}</span>
                  {a.matchScore != null && <span>· Match: {a.matchScore}%</span>}
                  <span>· {formatDate(a.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interviews */}
      {history.interviews.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <CalendarIcon size={12} />
            Interviews ({history.interviews.length})
          </h3>
          <div className="space-y-2">
            {history.interviews.map((i) => (
              <div key={i._id} className="border border-gray-100 rounded-xl p-3 bg-white">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">{i.job?.title ?? "—"}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${INTERVIEW_STATUS_COLORS[i.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {i.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="capitalize">{i.type.replace(/_/g, " ")}</span>
                  <span>· {formatDateTime(i.scheduledAt)}</span>
                  {i.duration && <span>· {i.duration} min</span>}
                </div>
                {i.feedback && (i.feedback.rating != null || i.feedback.recommendation) && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600 flex items-center gap-2">
                    {i.feedback.rating != null && (
                      <span className="flex items-center gap-0.5">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        {i.feedback.rating}/5
                      </span>
                    )}
                    {i.feedback.recommendation && (
                      <span className="capitalize">· {i.feedback.recommendation}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Offers */}
      {history.offers.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <FileSignature size={12} />
            Offers ({history.offers.length})
          </h3>
          <div className="space-y-2">
            {history.offers.map((o) => (
              <div key={o._id} className="border border-gray-100 rounded-xl p-3 bg-white">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">{o.position ?? o.job?.title ?? "—"}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${OFFER_STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {o.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {o.salary?.amount != null && (
                    <span>{o.salary.amount.toLocaleString()} {o.salary.currency ?? "SAR"} / {o.salary.period ?? "month"}</span>
                  )}
                  {o.sentAt && <span>· Sent {formatDate(o.sentAt)}</span>}
                  {o.respondedAt && <span>· Responded {formatDate(o.respondedAt)}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shortlist memberships */}
      {history.shortlistMemberships.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <BookmarkPlus size={12} />
            On {history.shortlistMemberships.length} Shortlist{history.shortlistMemberships.length === 1 ? "" : "s"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.shortlistMemberships.map((m) => (
              <span
                key={m.shortlistId}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-white border border-gray-200"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color ?? "#3B82F6" }} />
                {m.shortlistName}
                <span className="text-gray-400">· {formatDate(m.addedAt)}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Notes */}
      {history.notes.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <MessageSquare size={12} />
            Internal Notes ({history.notes.length})
          </h3>
          <div className="space-y-2">
            {history.notes.map((n) => (
              <div key={n._id} className="border border-gray-100 rounded-xl p-3 bg-amber-50/30">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{n.content}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                  <span>{formatDateTime(n.createdAt)}</span>
                  {(n.tags ?? []).map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

// ─── Candidate Profile Modal ──────────────────────────────────────────────────

interface CandidateProfileModalProps {
  candidate: CandidateProfile;
  shortlists: Shortlist[];
  onClose: () => void;
  onShortlistAdded: () => void;
  onCreateShortlist: (teacherId: string) => void;
}

function CandidateProfileModal({
  candidate: c,
  shortlists,
  onClose,
  onShortlistAdded,
  onCreateShortlist,
}: CandidateProfileModalProps) {
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [showShortlistDrop, setShowShortlistDrop] = useState(false);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  // SRD 3.4.3 — Profile History tab
  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");
  const [history, setHistory] = useState<CandidateHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== "history" || history) return;
    let cancelled = false;
    setHistoryLoading(true);
    setHistoryError(null);
    getCandidateHistory(c._id)
      .then((h) => { if (!cancelled) setHistory(h); })
      .catch((e: unknown) => {
        if (!cancelled) setHistoryError(e instanceof Error ? e.message : "Failed to load history");
      })
      .finally(() => { if (!cancelled) setHistoryLoading(false); });
    return () => { cancelled = true; };
  }, [activeTab, history, c._id]);

  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await addCandidateNote(c._id, { content: noteText.trim() });
      setNoteText("");
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 3000);
    } catch {
      // silently fail
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            {c.personal?.photoUrl ? (
              <img
                src={c.personal.photoUrl}
                alt={candidateDisplayName(c)}
                className="w-12 h-12 rounded-xl object-cover"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                style={{ background: "var(--brand-gradient)" }}
              >
                {candidateInitials(c)}
              </div>
            )}
            <div>
              <h2 className="text-base font-bold text-gray-900">{candidateDisplayName(c)}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                {c.personal?.gender && (
                  <span className="text-xs text-gray-500 capitalize">{c.personal.gender}</span>
                )}
                {c.personal?.nationality && (
                  <span className="text-xs text-gray-400">· {c.personal.nationality}</span>
                )}
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    c.profileStatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {c.profileStatus}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* SRD 3.4.3 — tab strip */}
        <div className="flex items-center gap-1 px-6 border-b border-gray-100 shrink-0">
          {([
            { id: "profile", label: "Profile", icon: Eye },
            { id: "history", label: "History", icon: History },
          ] as const).map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-1.5 px-3 py-3 text-sm font-semibold transition-colors ${
                  active ? "" : "text-gray-500 hover:text-gray-800"
                }`}
                style={active ? { color: "var(--brand-primary)" } : {}}
              >
                <Icon size={14} />
                {label}
                {active && (
                  <span
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full"
                    style={{ background: "var(--brand-gradient)" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {activeTab === "history" && (
            <HistoryTabBody
              loading={historyLoading}
              error={historyError}
              history={history}
            />
          )}
          {activeTab === "profile" && (
            <>
          {/* Professional */}
          {c.professional && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Professional
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                {(c.professional.subjects?.length ?? 0) > 0 && (
                  <div className="flex items-start gap-2">
                    <BookmarkPlus size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <div className="flex flex-wrap gap-1.5">
                      {c.professional.subjects!.map((s) => (
                        <span key={s} className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {subjectLabel(s)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(c.professional.gradeLevels?.length ?? 0) > 0 && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <GraduationCap size={14} className="text-gray-400 shrink-0" />
                    <span>{gradeGroupLabel(c.professional.gradeLevels!)}</span>
                  </div>
                )}
                {c.professional.experienceRange && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase size={14} className="text-gray-400 shrink-0" />
                    <span>{c.professional.experienceRange} years of experience</span>
                  </div>
                )}
                {c.professional.employmentStatus && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Star size={14} className="text-gray-400 shrink-0" />
                    <span className="capitalize">
                      {c.professional.employmentStatus.replace("_", " ")}
                      {c.professional.employmentStatus === "employed"
                        && typeof c.professional.noticePeriodDays === "number"
                        && ` · ${c.professional.noticePeriodDays}-day notice`}
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Education */}
          {c.education && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Education
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-1">
                {c.education.degreeType && (
                  <p className="font-semibold capitalize">{c.education.degreeType}</p>
                )}
                {c.education.major && <p>{c.education.major}</p>}
                {c.education.university && (
                  <p className="text-gray-500">{c.education.university}{c.education.country ? `, ${c.education.country}` : ""}</p>
                )}
                {c.education.graduationYear && (
                  <p className="text-gray-400 text-xs">Class of {c.education.graduationYear}</p>
                )}
              </div>
            </section>
          )}

          {/* Languages */}
          {(c.languages?.length ?? 0) > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {c.languages!.map((l, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                    <Globe size={13} className="text-gray-400" />
                    {l.language}
                    <span className="text-xs text-gray-400">· {l.proficiency}</span>
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {(c.certifications?.length ?? 0) > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Certifications
              </h3>
              <div className="space-y-2">
                {c.certifications!.map((cert) => (
                  <div key={cert._id} className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3 text-sm">
                    <Award size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">{cert.name}</p>
                      <p className="text-xs text-gray-500">{cert.issuer}{cert.issueDate ? ` · ${cert.issueDate.slice(0, 7)}` : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Location preferences */}
          {(c.locationPreferences?.preferredCities?.length ?? 0) > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Location Preferences
              </h3>
              <div className="flex flex-wrap gap-2">
                {c.locationPreferences!.preferredCities!.map((city) => (
                  <span key={city} className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                    <MapPin size={12} className="text-gray-400" />
                    {cityLabel(city)}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Salary expectation */}
          {(c.salaryExpectations?.minMonthlySAR || c.salaryExpectations?.maxMonthlySAR) && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Salary Expectation
              </h3>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-700">
                SAR {c.salaryExpectations.minMonthlySAR?.toLocaleString() ?? "–"}
                {c.salaryExpectations.maxMonthlySAR
                  ? `–${c.salaryExpectations.maxMonthlySAR.toLocaleString()}`
                  : "+"}{" "}
                / month
              </div>
            </section>
          )}

          {/* Resume */}
          {c.resume?.fileUrl && (
            <section>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Resume
              </h3>
              <a
                href={c.resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors w-fit"
                style={{ color: "var(--brand-primary)" }}
              >
                <Download size={14} />
                {c.resume.originalName ?? "Download Resume"}
              </a>
            </section>
          )}

          {/* Add Note */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Add a Note
            </h3>
            <textarea
              ref={noteRef}
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Private note visible only to your team…"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleSaveNote}
                disabled={savingNote || !noteText.trim()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-xl transition-all disabled:opacity-60"
                style={{ background: "var(--brand-gradient)" }}
              >
                {savingNote ? <Loader2 size={12} className="animate-spin" /> : <StickyNote size={12} />}
                Save Note
              </button>
              {noteSaved && (
                <span className="text-xs text-green-600 font-medium">Note saved!</span>
              )}
            </div>
          </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <div className="relative flex-1">
            <button
              onClick={() => setShowShortlistDrop((v) => !v)}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors"
            >
              <BookmarkPlus size={15} />
              Add to Shortlist
            </button>
            {showShortlistDrop && (
              <div className="absolute bottom-full left-0 mb-1 w-full">
                <ShortlistDropdown
                  teacherId={c._id}
                  shortlists={shortlists}
                  onAdded={onShortlistAdded}
                  onCreateNew={onCreateShortlist}
                  onClose={() => setShowShortlistDrop(false)}
                />
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── New Shortlist Inline Modal ───────────────────────────────────────────────

interface NewShortlistModalProps {
  pendingTeacherId: string | null;
  onClose: () => void;
  onCreated: (sl: Shortlist, teacherId: string) => void;
}

const PRESET_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

function NewShortlistModal({ pendingTeacherId, onClose, onCreated }: NewShortlistModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const sl = await createShortlist({ name: name.trim(), description: description.trim() || undefined, color });
      if (pendingTeacherId) {
        await addToShortlist(sl._id, pendingTeacherId);
      }
      onCreated(sl, pendingTeacherId ?? "");
      onClose();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to create shortlist.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">New Shortlist</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl mb-4">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Math Teachers – Riyadh"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description…"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Color</label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
            disabled={saving || !name.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : "Create & Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

interface FilterPanelProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onSearch: () => void;
  onClear: () => void;
  loading: boolean;
}

function FilterPanel({ filters, onChange, onSearch, onClear, loading }: FilterPanelProps) {
  const set = <K extends keyof FilterState>(key: K, val: FilterState[K]) =>
    onChange({ ...filters, [key]: val });

  const toggleArr = (key: "subjects" | "gradeLevels" | "city", val: string) => {
    const arr = filters[key] as string[];
    set(key, arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Filter size={14} style={{ color: "var(--brand-primary)" }} />
            Filters
          </h2>
          <button
            onClick={onClear}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Subjects */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Subjects
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SUBJECT_OPTIONS.map(({ label, value }) => {
              const active = filters.subjects.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleArr("subjects", value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
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
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Grade Levels
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {GRADE_LEVEL_OPTIONS.map(({ label, value }) => {
              const active = filters.gradeLevels.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleArr("gradeLevels", value)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-xl border transition-all ${
                    active
                      ? "border-transparent text-white"
                      : "border-gray-200 text-gray-700 hover:border-gray-300 bg-white"
                  }`}
                  style={active ? { background: "var(--brand-gradient)" } : {}}
                >
                  {active ? <CheckSquare size={11} /> : <Square size={11} />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Experience
          </label>
          <div className="relative">
            <select
              value={filters.experienceRange}
              onChange={(e) => set("experienceRange", e.target.value)}
              className="w-full appearance-none px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-7"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            >
              {EXPERIENCE_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            City
          </label>
          <div className="space-y-1">
            {CITY_OPTIONS.map(({ label, value }) => {
              const active = filters.city.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleArr("city", value)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg transition-all text-left ${
                    active ? "font-semibold text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                  style={active ? { background: "var(--brand-gradient)" } : {}}
                >
                  {active ? <CheckSquare size={11} className="shrink-0" /> : <Square size={11} className="shrink-0" />}
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Gender
          </label>
          <div className="flex gap-1.5">
            {[
              { label: "Any",    value: ""       },
              { label: "Male",   value: "male"   },
              { label: "Female", value: "female" },
            ].map(({ label, value }) => {
              const active = filters.gender === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("gender", value)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                    active ? "border-transparent text-white" : "border-gray-200 text-gray-600 bg-white"
                  }`}
                  style={active ? { background: "var(--brand-gradient)" } : {}}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Degree */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Degree
          </label>
          <div className="relative">
            <select
              value={filters.degreeType}
              onChange={(e) => set("degreeType", e.target.value)}
              className="w-full appearance-none px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-7"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            >
              {DEGREE_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* SRD 3.3.2 — Certifications keyword */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Certifications
          </label>
          <input
            type="text"
            value={filters.certificationsKeyword}
            onChange={(e) => set("certificationsKeyword", e.target.value)}
            placeholder="e.g. TEFL, IB Educator…"
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
            style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
          />
          <p className="text-[10px] text-gray-400 mt-1">Matches any cert containing this text.</p>
        </div>

        {/* SRD 3.3.2 — Language + proficiency */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Language
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="relative">
              <select
                value={filters.language}
                onChange={(e) => set("language", e.target.value)}
                className="w-full appearance-none px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-7"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              >
                {LANGUAGE_OPTIONS.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={filters.languageProficiency}
                onChange={(e) => set("languageProficiency", e.target.value)}
                className="w-full appearance-none px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-7"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              >
                {PROFICIENCY_OPTIONS.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* SRD 3.3.2 — Availability (maps to employmentStatus) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Availability
          </label>
          <div className="relative">
            <select
              value={filters.employmentStatus}
              onChange={(e) => set("employmentStatus", e.target.value)}
              className="w-full appearance-none px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-7"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            >
              {AVAILABILITY_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* SRD 3.3.2 — Salary expectations (school's budget ceiling) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Max Budget (SAR/mo)
          </label>
          <input
            type="number"
            min={0}
            value={filters.salaryMaxAcceptable}
            onChange={(e) => set("salaryMaxAcceptable", e.target.value)}
            placeholder="e.g. 10000"
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
            style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
          />
          <p className="text-[10px] text-gray-400 mt-1">Shows teachers whose min expectation fits this budget.</p>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Sort By
          </label>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => set("sortBy", e.target.value)}
              className="w-full appearance-none px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-7"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            >
              {SORT_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Search button */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={onSearch}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60 hover:shadow-md"
          style={{ background: "var(--brand-gradient)" }}
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
          Search
        </button>
        <button
          onClick={onClear}
          className="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [filters, setFilters]       = useState<FilterState>(DEFAULT_FILTERS);
  const [nameSearch, setNameSearch] = useState("");

  const [shortlists, setShortlists]   = useState<Shortlist[]>([]);
  const [profileModal, setProfileModal] = useState<CandidateProfile | null>(null);
  const [newSlTeacherId, setNewSlTeacherId] = useState<string | null>(null);

  // SRD 3.3.5 — bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkShortlistOpen, setBulkShortlistOpen] = useState(false);
  const [bulkBusy, setBulkBusy] = useState<"shortlist" | "pdf" | null>(null);

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);
  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const handleBulkShortlist = useCallback(async (shortlistId: string) => {
    if (selectedIds.size === 0) return;
    setBulkBusy("shortlist");
    try {
      const r = await addToShortlistBulk(shortlistId, Array.from(selectedIds));
      // Refresh counts in the dropdown
      void loadShortlists();
      setBulkShortlistOpen(false);
      clearSelection();
      alert(`${r.added} added${r.skipped > 0 ? `, ${r.skipped} already on this shortlist` : ""}.`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to add to shortlist";
      alert(msg);
    } finally {
      setBulkBusy(null);
    }
  }, [selectedIds, clearSelection]);

  const handleExportPdf = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setBulkBusy("pdf");
    try {
      const blob = await exportCandidatesPdf(Array.from(selectedIds));
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `abjad-candidates-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to export PDF";
      alert(msg);
    } finally {
      setBulkBusy(null);
    }
  }, [selectedIds]);

  const loadShortlists = useCallback(async () => {
    try {
      const sl = await listShortlists();
      setShortlists(sl ?? []);
    } catch {
      // ignore
    }
  }, []);

  const doSearch = useCallback(async (pageNum: number, f: FilterState) => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchCandidates({
        subjects:              f.subjects.length > 0 ? f.subjects : undefined,
        gradeLevels:           f.gradeLevels.length > 0 ? f.gradeLevels : undefined,
        experienceRange:       f.experienceRange || undefined,
        city:                  f.city.length > 0 ? f.city : undefined,
        gender:                f.gender || undefined,
        degreeType:            f.degreeType || undefined,
        certificationsKeyword: f.certificationsKeyword.trim() || undefined,
        language:              f.language || undefined,
        languageProficiency:   f.languageProficiency || undefined,
        employmentStatus:      f.employmentStatus || undefined,
        salaryMaxAcceptable:   f.salaryMaxAcceptable ? Number(f.salaryMaxAcceptable) : undefined,
        sortBy:                f.sortBy || undefined,
        page:                  pageNum,
        limit:                 PAGE_SIZE,
      });
      setCandidates(res.teachers ?? []);
      setTotal(res.total ?? 0);
      setTotalPages(res.totalPages ?? 1);
      setPage(pageNum);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to search candidates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    doSearch(1, filters);
    loadShortlists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => doSearch(1, filters);
  const handleClear  = () => {
    setFilters(DEFAULT_FILTERS);
    setNameSearch("");
    doSearch(1, DEFAULT_FILTERS);
  };

  const handlePageChange = (p: number) => doSearch(p, filters);

  const displayedCandidates = nameSearch.trim()
    ? candidates.filter((c) =>
        candidateDisplayName(c).toLowerCase().includes(nameSearch.toLowerCase())
      )
    : candidates;

  const handleShortlistCreated = (sl: Shortlist) => {
    setShortlists((prev) => [sl, ...prev]);
  };

  return (
    <div className="flex h-[calc(100vh-7.5rem)] overflow-hidden">
      {/* Filter panel */}
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Top bar */}
        <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={18} style={{ color: "var(--brand-primary)" }} />
              Candidate Search
            </h1>
            {!loading && (
              <p className="text-xs text-gray-400 mt-0.5">
                {total.toLocaleString()} candidates found
              </p>
            )}
          </div>
          {/* Name search */}
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
            {nameSearch && (
              <button
                onClick={() => setNameSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={28} className="animate-spin text-gray-300" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <AlertCircle size={30} className="text-red-400" />
              <p className="text-sm text-gray-500">{error}</p>
              <button
                onClick={handleSearch}
                className="px-4 py-2 text-sm font-medium text-white rounded-xl"
                style={{ background: "var(--brand-gradient)" }}
              >
                Retry
              </button>
            </div>
          ) : displayedCandidates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Users size={28} className="text-gray-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">No candidates found</h3>
              <p className="text-sm text-gray-400">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <>
              {/* SRD 3.3.5 — selection toolbar */}
              {selectedIds.size > 0 && (
                <div className="sticky top-0 z-10 mb-4 bg-white rounded-xl shadow-md border border-gray-100 p-3 flex items-center gap-3"
                  style={{ borderLeftWidth: 3, borderLeftColor: "var(--brand-primary)" }}>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedIds.size} selected
                  </span>
                  <div className="h-5 w-px bg-gray-200" />

                  {/* Bulk add to shortlist */}
                  <div className="relative">
                    <button
                      onClick={() => setBulkShortlistOpen((v) => !v)}
                      disabled={bulkBusy !== null}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all hover:shadow-sm disabled:opacity-60"
                      style={{ background: "var(--brand-gradient)" }}
                    >
                      {bulkBusy === "shortlist" ? <Loader2 size={12} className="animate-spin" /> : <BookmarkPlus size={12} />}
                      Add to Shortlist
                    </button>
                    {bulkShortlistOpen && (
                      <div className="absolute left-0 top-full mt-1 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 py-1.5">
                          Choose Shortlist
                        </p>
                        {shortlists.filter((s) => !s.isArchived).length === 0 ? (
                          <p className="text-xs text-gray-500 px-3 py-2">No shortlists yet.</p>
                        ) : (
                          shortlists.filter((s) => !s.isArchived).map((sl) => (
                            <button
                              key={sl._id}
                              onClick={() => handleBulkShortlist(sl._id)}
                              disabled={bulkBusy !== null}
                              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sl.color ?? "#3B82F6" }} />
                                <span className="truncate">{sl.name}</span>
                              </span>
                              <span className="text-xs text-gray-400 shrink-0">{sl.teachers.length}</span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Export PDF */}
                  <button
                    onClick={handleExportPdf}
                    disabled={bulkBusy !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
                  >
                    {bulkBusy === "pdf" ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                    Export PDF
                  </button>

                  <div className="flex-1" />

                  <button
                    onClick={clearSelection}
                    disabled={bulkBusy !== null}
                    className="text-xs text-gray-400 hover:text-gray-700 px-2"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
                {displayedCandidates.map((c) => (
                  <CandidateCard
                    key={c._id}
                    candidate={c}
                    shortlists={shortlists}
                    onViewProfile={setProfileModal}
                    onShortlistAdded={loadShortlists}
                    onCreateShortlist={(tid) => setNewSlTeacherId(tid)}
                    selected={selectedIds.has(c._id)}
                    onToggleSelect={toggleSelected}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-8 h-8 text-xs font-semibold rounded-lg transition-all ${
                            page === p ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"
                          }`}
                          style={page === p ? { background: "var(--brand-gradient)" } : {}}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight size={15} />
                  </button>
                  <span className="text-xs text-gray-400 ml-2">
                    Page {page} of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Candidate profile modal */}
      {profileModal && (
        <CandidateProfileModal
          candidate={profileModal}
          shortlists={shortlists}
          onClose={() => setProfileModal(null)}
          onShortlistAdded={loadShortlists}
          onCreateShortlist={(tid) => { setNewSlTeacherId(tid); setProfileModal(null); }}
        />
      )}

      {/* New shortlist modal */}
      {newSlTeacherId !== null && (
        <NewShortlistModal
          pendingTeacherId={newSlTeacherId}
          onClose={() => setNewSlTeacherId(null)}
          onCreated={handleShortlistCreated}
        />
      )}
    </div>
  );
}
