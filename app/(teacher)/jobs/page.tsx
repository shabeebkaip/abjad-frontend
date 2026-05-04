"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search, MapPin, BookOpen, Clock, Bookmark, Zap, X,
  GraduationCap, Banknote, CalendarDays, CheckCircle2,
  Briefcase, Share2, ChevronDown, ChevronRight,
  Building2, SlidersHorizontal, Filter, Loader2,
} from "lucide-react";
import { listJobs, saveJob, unsaveJob, applyForJob } from "@/lib/api/teacher";
import type { Job } from "@/lib/api/teacher";

// ── Constants ─────────────────────────────────────────────────────────────────

const CITIES = ["riyadh", "jeddah", "khobar", "dammam", "mecca", "medina", "abha", "tabuk"];
const CITY_LABELS: Record<string, string> = {
  riyadh: "Riyadh", jeddah: "Jeddah", khobar: "Khobar", dammam: "Dammam",
  mecca: "Makkah", medina: "Madinah", abha: "Abha", tabuk: "Tabuk",
};

const SUBJECTS = [
  { value: "math",           label: "Mathematics" },
  { value: "physics",        label: "Physics" },
  { value: "chemistry",      label: "Chemistry" },
  { value: "biology",        label: "Biology" },
  { value: "english",        label: "English Language" },
  { value: "arabic",         label: "Arabic Language" },
  { value: "islamic_studies",label: "Islamic Studies" },
  { value: "computer_science",label: "Computer Science" },
  { value: "social_studies", label: "Social Studies" },
  { value: "pe",             label: "Physical Education" },
  { value: "art",            label: "Art" },
];

const GRADE_LEVELS = [
  { value: "kg",          label: "Kindergarten" },
  { value: "elementary",  label: "Elementary (1–6)" },
  { value: "middle",      label: "Middle School (7–9)" },
  { value: "high",        label: "High School (10–12)" },
];

const CONTRACT_TYPES = [
  { value: "full_time",  label: "Full-time" },
  { value: "part_time",  label: "Part-time" },
  { value: "substitute", label: "Substitute" },
  { value: "contract",   label: "Contract" },
];

const SORT_OPTIONS = [
  { value: "newest",       label: "Newest" },
  { value: "deadline",     label: "Closing Soon" },
  { value: "salary_asc",   label: "Salary ↑" },
  { value: "salary_desc",  label: "Salary ↓" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function salaryText(job: Job): string {
  if (job.salary.display === "negotiable") return "Negotiable";
  if (job.salary.display === "hide")       return "Undisclosed";
  if (job.salary.min && job.salary.max) {
    return `SAR ${job.salary.min.toLocaleString()}–${job.salary.max.toLocaleString()}/mo`;
  }
  return "Salary on request";
}

function daysUntil(isoStr: string): number {
  return Math.ceil((new Date(isoStr).getTime() - Date.now()) / 86_400_000);
}

function daysAgo(isoStr: string): number {
  return Math.floor((Date.now() - new Date(isoStr).getTime()) / 86_400_000);
}

function postedLabel(isoStr: string): string {
  const d = daysAgo(isoStr);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d}d ago`;
}

function deadlinePill(isoStr?: string): { label: string; cls: string } {
  if (!isoStr) return { label: "", cls: "" };
  const d = daysUntil(isoStr);
  if (d <= 0) return { label: "Closes today", cls: "bg-red-50 text-red-600" };
  if (d <= 3)  return { label: `${d}d left`,   cls: "bg-red-50 text-red-600" };
  if (d <= 7)  return { label: `${d}d left`,   cls: "bg-amber-50 text-amber-600" };
  return           { label: `${d}d left`,   cls: "bg-slate-100 text-slate-500" };
}

function schoolId(job: Job): string {
  return typeof job.schoolId === "object" ? (job.schoolId._id ?? "") : job.schoolId;
}

function schoolName(job: Job): string {
  if (job.school?.name) return job.school.name;
  if (typeof job.schoolId === "object" && job.schoolId.name) return job.schoolId.name;
  return "";
}

function schoolInitial(job: Job): string {
  const name = schoolName(job);
  return name ? name[0].toUpperCase() : job.title[0].toUpperCase();
}

function toggleFilter<T>(value: T, list: T[], setter: (v: T[]) => void) {
  setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const [jobs, setJobs]                     = useState<Job[]>([]);
  const [total, setTotal]                   = useState(0);
  const [loading, setLoading]               = useState(true);
  const [searchQuery, setSearchQuery]       = useState("");
  const [sortBy, setSortBy]                 = useState("newest");
  const [selectedJobId, setSelectedJobId]   = useState<string | null>(null);
  const [showFilters, setShowFilters]       = useState(true);
  const [savedJobs, setSavedJobs]           = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs]       = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId]         = useState<string | null>(null);
  const [selectedCities,    setSelectedCities]    = useState<string[]>([]);
  const [selectedSubjects,  setSelectedSubjects]  = useState<string[]>([]);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState({ city: true, subject: true, grade: false, contract: false });
  const loadJobs = useCallback(async (overrides?: { cities?: string[]; subjects?: string[]; contracts?: string[]; sort?: string }) => {
    setLoading(true);
    try {
      const params = {
        city:          overrides?.cities    ?? selectedCities,
        subjects:      overrides?.subjects  ?? selectedSubjects,
        employmentType:(overrides?.contracts ?? selectedContracts)[0],
        sortBy:        (overrides?.sort ?? sortBy) as "newest" | "deadline" | "salary_asc" | "salary_desc",
        limit:         50,
      };
      const res = await listJobs(params);
      setJobs(res.jobs);
      setTotal(res.total);
      // Restore saved/applied state from API isSaved flag
      const savedSet = new Set<string>();
      res.jobs.forEach((j) => { if (j.isSaved) savedSet.add(j._id); });
      setSavedJobs((prev) => new Set([...prev, ...savedSet]));
      if (res.jobs.length > 0 && !selectedJobId) setSelectedJobId(res.jobs[0]._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCities, selectedSubjects, selectedContracts, sortBy, selectedJobId]);

  useEffect(() => { loadJobs(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search — client-side filter only for now (API doesn't support text search)
  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.subjects?.some((s) => s.includes(q)) ||
      job.city?.toLowerCase().includes(q)
    );
  });

  const selectedJob = filteredJobs.find((j) => j._id === selectedJobId) ?? filteredJobs[0] ?? null;

  const toggleSection = (key: keyof typeof openSections) =>
    setOpenSections((p) => ({ ...p, [key]: !p[key] }));

  const handleToggleSave = async (id: string) => {
    const wasSaved = savedJobs.has(id);
    setSavedJobs((prev) => {
      const next = new Set(prev);
      wasSaved ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      wasSaved ? await unsaveJob(id) : await saveJob(id);
    } catch {
      // Revert on error
      setSavedJobs((prev) => {
        const next = new Set(prev);
        wasSaved ? next.add(id) : next.delete(id);
        return next;
      });
    }
  };

  const handleApply = async (id: string) => {
    setApplyingId(id);
    try {
      await applyForJob(id);
      setAppliedJobs((prev) => new Set([...prev, id]));
    } catch (err) {
      console.error(err);
    } finally {
      setApplyingId(null);
    }
  };

  const handleFilterChange = (type: "cities" | "subjects" | "contracts", value: string) => {
    const setters = { cities: setSelectedCities, subjects: setSelectedSubjects, contracts: setSelectedContracts };
    const lists   = { cities: selectedCities,    subjects: selectedSubjects,    contracts: selectedContracts };
    const updated = lists[type].includes(value)
      ? lists[type].filter((v) => v !== value)
      : [...lists[type], value];
    setters[type](updated);
    loadJobs({ [type]: updated });
  };

  const handleSortChange = (val: string) => {
    setSortBy(val);
    loadJobs({ sort: val });
  };

  const clearFilters = () => {
    setSelectedCities([]);
    setSelectedSubjects([]);
    setSelectedContracts([]);
    loadJobs({ cities: [], subjects: [], contracts: [] });
  };

  const activeFilterCount = selectedCities.length + selectedSubjects.length + selectedContracts.length;

  return (
    <div className="h-[calc(100vh-6.25rem)] flex flex-col overflow-hidden bg-slate-50">

      {/* ── Search + sort bar ────────────────────────────────── */}
      <div className="shrink-0 bg-white border-b border-slate-200 px-4 lg:px-5 py-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-colors"
            style={{
              color:           showFilters ? "var(--brand-primary)"       : "",
              backgroundColor: showFilters ? "var(--brand-primary-light)" : "",
              borderColor:     showFilters ? "var(--brand-primary)"       : "rgb(226 232 240)",
            }}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span
                className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center ml-0.5"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, subject, or city…"
              className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none transition-all"
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--brand-primary-light)"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = ""; e.currentTarget.style.boxShadow = ""; }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white cursor-pointer text-slate-600 focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── 3-panel body ─────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* LEFT: Filters */}
        {showFilters && (
          <aside className="hidden lg:flex w-52 xl:w-56 shrink-0 flex-col bg-white border-r border-slate-200 overflow-y-auto">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <Filter size={12} className="text-slate-400" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Filters</span>
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>
                  Clear all
                </button>
              )}
            </div>

            <div className="flex-1 px-3 py-2 overflow-y-auto">
              <FilterSection label="City" isOpen={openSections.city} onToggle={() => toggleSection("city")}>
                {CITIES.map((c) => (
                  <FilterCheckbox
                    key={c} label={CITY_LABELS[c] ?? c}
                    checked={selectedCities.includes(c)}
                    onChange={() => handleFilterChange("cities", c)}
                  />
                ))}
              </FilterSection>

              <FilterSection label="Subject" isOpen={openSections.subject} onToggle={() => toggleSection("subject")}>
                {SUBJECTS.slice(0, 8).map((s) => (
                  <FilterCheckbox
                    key={s.value} label={s.label}
                    checked={selectedSubjects.includes(s.value)}
                    onChange={() => handleFilterChange("subjects", s.value)}
                  />
                ))}
              </FilterSection>

              <FilterSection label="Contract Type" isOpen={openSections.contract} onToggle={() => toggleSection("contract")}>
                {CONTRACT_TYPES.map((ct) => (
                  <FilterCheckbox
                    key={ct.value} label={ct.label}
                    checked={selectedContracts.includes(ct.value)}
                    onChange={() => handleFilterChange("contracts", ct.value)}
                  />
                ))}
              </FilterSection>
            </div>
          </aside>
        )}

        {/* CENTER: Job list */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="shrink-0 bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{filteredJobs.length}</span> of {total} jobs
            </span>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs font-medium flex items-center gap-1 ml-1" style={{ color: "var(--brand-primary)" }}>
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-slate-400" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Search size={20} className="text-slate-400" />
                </div>
                <p className="font-semibold text-slate-600 text-sm mb-1">No jobs match your filters</p>
                <p className="text-xs text-slate-400 mb-4">Try broadening your search or clearing filters</p>
                <button onClick={clearFilters} className="text-xs font-semibold" style={{ color: "var(--brand-primary)" }}>
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobListCard
                  key={job._id}
                  job={job}
                  isSelected={selectedJobId === job._id}
                  isSaved={savedJobs.has(job._id)}
                  isApplied={appliedJobs.has(job._id)}
                  onSelect={() => setSelectedJobId(job._id)}
                  onToggleSave={handleToggleSave}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Detail panel */}
        <div className="hidden lg:flex w-[440px] xl:w-[480px] shrink-0 flex-col bg-white border-l border-slate-200 overflow-hidden">
          {selectedJob ? (
            <JobDetailPanel
              job={selectedJob}
              isSaved={savedJobs.has(selectedJob._id)}
              isApplied={appliedJobs.has(selectedJob._id)}
              isApplying={applyingId === selectedJob._id}
              onToggleSave={handleToggleSave}
              onApply={handleApply}
            />
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center p-10">
              <Briefcase size={30} className="text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-400">Select a job to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FilterSection({ label, isOpen, onToggle, children }: { label: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-2 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors">
        {label}
        <ChevronDown size={11} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && <div className="pb-1.5">{children}</div>}
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-md">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-3.5 h-3.5 rounded shrink-0" style={{ accentColor: "var(--brand-primary)" }} />
      <span className="text-xs text-slate-600 leading-none truncate">{label}</span>
    </label>
  );
}

function JobListCard({ job, isSelected, isSaved, isApplied, onSelect, onToggleSave }: {
  job: Job; isSelected: boolean; isSaved: boolean; isApplied: boolean;
  onSelect: () => void; onToggleSave: (id: string) => void;
}) {
  const deadline = deadlinePill(job.deadline);
  return (
    <div
      onClick={onSelect}
      className="relative px-4 py-4 cursor-pointer transition-colors group bg-white border-l-2 hover:bg-slate-50"
      style={{ borderLeftColor: isSelected ? "var(--brand-primary)" : "transparent" }}
    >
      <div className="flex items-start gap-3">
        {job.school?.logoUrl ? (
          <img src={job.school.logoUrl} alt="" className="w-10 h-10 rounded-xl shrink-0 object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--brand-gradient)" }}>
            {schoolInitial(job)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold leading-snug transition-colors" style={{ color: isSelected ? "var(--brand-primary)" : "" }}>
              {job.title}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave(job._id); }}
              className="shrink-0 p-1 rounded transition-colors mt-0.5"
              style={{ color: isSaved ? "var(--brand-primary)" : "rgb(203 213 225)" }}
            >
              <Bookmark size={13} className={isSaved ? "fill-current" : ""} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><MapPin size={10} />{CITY_LABELS[job.city] ?? job.city}</span>
            {job.subjects?.[0] && <span className="flex items-center gap-1"><BookOpen size={10} />{job.subjects[0]}</span>}
            <span className="flex items-center gap-1"><Clock size={10} />{job.employmentType?.replace("_", "-")}</span>
          </div>
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-700">{salaryText(job)}</span>
            {deadline.label && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${deadline.cls}`}>{deadline.label}</span>
            )}
            {isApplied && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={9} />Applied
              </span>
            )}
            <span className="text-[10px] text-slate-300 ml-auto">{postedLabel(job.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobDetailPanel({ job, isSaved, isApplied, isApplying, onToggleSave, onApply }: {
  job: Job; isSaved: boolean; isApplied: boolean; isApplying: boolean;
  onToggleSave: (id: string) => void; onApply: (id: string) => void;
}) {
  const deadline = deadlinePill(job.deadline);
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-5 border-b border-slate-100" style={{ borderTop: "3px solid var(--brand-primary)" }}>
        <div className="flex items-start gap-3 mb-4">
          {job.school?.logoUrl ? (
            <img src={job.school.logoUrl} alt="" className="w-11 h-11 rounded-xl shrink-0 object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0" style={{ background: "var(--brand-gradient)" }}>
              {schoolInitial(job)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {schoolName(job) || "School"}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap mt-0.5">
              <MapPin size={10} className="shrink-0" />{CITY_LABELS[job.city] ?? job.city}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleSave(job._id)}
              className="p-2 rounded-lg border transition-colors"
              style={isSaved
                ? { borderColor: "var(--brand-primary)", backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }
                : { borderColor: "rgb(226 232 240)", color: "rgb(148 163 184)" }
              }
            >
              <Bookmark size={13} className={isSaved ? "fill-current" : ""} />
            </button>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:border-slate-300 transition-colors">
              <Share2 size={13} />
            </button>
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-900 leading-snug mb-3">{job.title}</h2>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
            <Clock size={10} />{job.employmentType?.replace("_", "-")}
          </span>
          {job.gradeLevels?.[0] && (
            <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <GraduationCap size={10} />{job.gradeLevels[0].replace(/_/g, " ")}
            </span>
          )}
          {job.deadline && (
            <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <CalendarDays size={10} />Closes {new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Banknote size={14} className="text-slate-400 shrink-0" />
            {salaryText(job)}
          </span>
          {deadline.label && (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${deadline.cls}`}>{deadline.label}</span>
          )}
          <span className="text-[11px] text-slate-400 ml-auto">{postedLabel(job.createdAt)}</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Overview */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Job Overview</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Clock,         label: "Employment", value: job.employmentType?.replace("_", "-") },
              { icon: MapPin,        label: "City",       value: CITY_LABELS[job.city] ?? job.city },
              { icon: BookOpen,      label: "Subjects",   value: job.subjects?.join(", ") },
              { icon: GraduationCap, label: "Grades",     value: job.gradeLevels?.join(", ") },
              { icon: Banknote,      label: "Salary",     value: salaryText(job) },
            ].filter((r) => r.value).map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon size={12} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-none mb-0.5">{label}</p>
                  <p className="text-xs font-semibold text-slate-700">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">About the Role</p>
            <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
          </div>
        )}

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Responsibilities</p>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <ChevronRight size={13} className="shrink-0 mt-0.5" style={{ color: "var(--brand-primary)" }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Requirements</p>
            <ul className="space-y-2">
              {job.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={12} className="shrink-0 mt-0.5 text-emerald-500" />{r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.languageRequirement && (
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
            <span className="font-semibold text-slate-600">Language of instruction:</span>
            <span className="capitalize">{job.languageRequirement}</span>
          </div>
        )}
      </div>

      {/* Apply footer */}
      <div className="shrink-0 px-6 py-4 bg-white border-t border-slate-100">
        {isApplied ? (
          <div className="flex items-center gap-2 justify-center py-3 bg-emerald-50 rounded-xl text-emerald-600 font-semibold text-sm">
            <CheckCircle2 size={15} />Application Submitted
          </div>
        ) : (
          <button
            onClick={() => onApply(job._id)}
            disabled={isApplying}
            className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[.99] disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            {isApplying
              ? <><Loader2 size={14} className="animate-spin" />Applying…</>
              : <><Zap size={14} />Apply Now</>
            }
          </button>
        )}
        <p className="text-center text-[10px] text-slate-300 mt-2">
          Posted via Abjad · {postedLabel(job.createdAt)}
        </p>
      </div>
    </div>
  );
}

