"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, MapPin, BookOpen, Clock, Bookmark, Zap, X,
  GraduationCap, Banknote, CalendarDays, CheckCircle2, Shield,
  ArrowRight, Briefcase, Share2, ChevronDown, ChevronRight,
  Building2, SlidersHorizontal, Filter,
} from "lucide-react";

const SUBJECTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English Language", "Arabic Language", "Islamic Studies",
  "History", "Geography", "Computer Science", "Physical Education",
  "Art", "Music",
];
const GRADE_LEVELS = [
  "Kindergarten", "Elementary (1–3)", "Elementary (4–6)",
  "Middle School (7–9)", "High School (10–12)",
];
const CITIES = ["Riyadh", "Jeddah", "Dammam", "Khobar", "Makkah", "Madinah", "Abha", "Tabuk"];
const CONTRACT_TYPES = ["Full-time", "Part-time", "Substitute", "Contract"];
const SORT_OPTIONS = [
  { value: "recommended", label: "Best Match" },
  { value: "newest",      label: "Newest" },
  { value: "closing",     label: "Closing Soon" },
  { value: "salary_high", label: "Salary ↑" },
];

interface Job {
  id: number; title: string; school: string;
  schoolType: "Private" | "International" | "Government";
  subject: string; gradeLevel: string; city: string;
  salaryMin: number; salaryMax: number; salaryDisplay: "show" | "negotiable" | "hidden";
  contractType: string; schedule: string; startDate: string; duration?: string;
  language: string; postedDays: number; deadlineDays: number; matchScore: number;
  isSaved: boolean; isApplied: boolean; isShielded: boolean;
  requirements: string[]; responsibilities: string[]; description: string;
  accentColor: string;
}

const MOCK_JOBS: Job[] = [
  {
    id: 1, title: "Mathematics Teacher – High School",
    school: "Al-Noor International School", schoolType: "International",
    subject: "Mathematics", gradeLevel: "High School (10–12)",
    city: "Riyadh", salaryMin: 8000, salaryMax: 12000, salaryDisplay: "show",
    contractType: "Full-time", schedule: "Morning shift · Sun–Thu",
    startDate: "September 2026", language: "English",
    postedDays: 2, deadlineDays: 12, matchScore: 92,
    isSaved: false, isApplied: false, isShielded: true, accentColor: "#0D2542",
    requirements: ["B.Ed Mathematics or equivalent", "3+ years teaching experience", "English medium instruction", "Bachelor’s degree minimum"],
    responsibilities: [
      "Plan and deliver Mathematics lessons aligned to the IGCSE curriculum",
      "Track student progress and submit reports each quarter",
      "Collaborate with the academic team on curriculum improvements",
      "Provide constructive feedback and support during office hours",
      "Participate in parent-teacher meetings and school events",
    ],
    description: "Al-Noor International School is seeking an experienced Mathematics Teacher for Grades 10–12. The ideal candidate has a strong academic background in mathematics, proven classroom management skills, and a commitment to student achievement. Our school follows the IGCSE and A-Level curriculum.",
  },
  {
    id: 2, title: "Physics & Chemistry Teacher",
    school: "Manarat Schools", schoolType: "Private",
    subject: "Physics", gradeLevel: "Middle School (7–9)",
    city: "Jeddah", salaryMin: 6500, salaryMax: 9000, salaryDisplay: "show",
    contractType: "Full-time", schedule: "Full day · Sun–Thu",
    startDate: "Immediately", language: "Arabic",
    postedDays: 5, deadlineDays: 8, matchScore: 85,
    isSaved: true, isApplied: false, isShielded: true, accentColor: "#7c3aed",
    requirements: ["B.Sc Physics or Chemistry", "2+ years teaching experience", "Bilingual (Arabic & English)", "Saudi national or eligible resident"],
    responsibilities: [
      "Deliver integrated Physics and Chemistry lessons for Grades 7–9",
      "Design and supervise lab practicals in line with safety regulations",
      "Prepare students for end-of-year national assessments",
      "Maintain grade books and communicate with parents regularly",
    ],
    description: "Manarat Schools is seeking a dynamic Physics & Chemistry Teacher who can inspire curiosity and critical thinking in middle school students. The candidate will be bilingual, student-focused, and committed to delivering exceptional science education.",
  },
  {
    id: 3, title: "English Language Teacher",
    school: "Dhahran British Grammar School", schoolType: "International",
    subject: "English Language", gradeLevel: "Elementary (4–6)",
    city: "Khobar", salaryMin: 0, salaryMax: 0, salaryDisplay: "negotiable",
    contractType: "Full-time", schedule: "Morning shift · Sun–Thu",
    startDate: "April 2026", language: "English",
    postedDays: 1, deadlineDays: 20, matchScore: 78,
    isSaved: false, isApplied: true, isShielded: true, accentColor: "#0083a8",
    requirements: ["Native speaker preferred", "CELTA or TEFL certification required", "4+ years classroom experience", "Experience with young learners"],
    responsibilities: [
      "Teach English Language to Grades 4–6 (British National Curriculum)",
      "Develop reading, writing, speaking, and listening skills",
      "Use creative and project-based learning techniques",
      "Report student progress to parents each term",
    ],
    description: "Dhahran British Grammar School offers an outstanding British education from Foundation Stage to A-Level. We need an enthusiastic English Language Teacher with a proven record of raising attainment in upper-elementary students.",
  },
  {
    id: 4, title: "Islamic Studies Teacher",
    school: "Al-Rajhi Model Schools", schoolType: "Private",
    subject: "Islamic Studies", gradeLevel: "Elementary (1–3)",
    city: "Riyadh", salaryMin: 5500, salaryMax: 7500, salaryDisplay: "show",
    contractType: "Full-time", schedule: "Morning shift · Sun–Thu",
    startDate: "September 2026", language: "Arabic",
    postedDays: 7, deadlineDays: 5, matchScore: 71,
    isSaved: false, isApplied: false, isShielded: false, accentColor: "#065f46",
    requirements: ["Shariah or Islamic Studies degree", "Arabic native speaker", "Female section only", "1+ year experience"],
    responsibilities: [
      "Teach Islamic Studies curriculum for elementary school girls",
      "Instil Islamic values and foster character development",
      "Collaborate with parents on religious education goals",
    ],
    description: "Al-Rajhi Model Schools seeks a knowledgeable Islamic Studies Teacher for the elementary female section. The role requires a strong understanding of Islamic jurisprudence and the ability to teach young students in an engaging, age-appropriate way.",
  },
  {
    id: 5, title: "Computer Science Teacher",
    school: "KFUPM Schools", schoolType: "Government",
    subject: "Computer Science", gradeLevel: "High School (10–12)",
    city: "Dammam", salaryMin: 0, salaryMax: 0, salaryDisplay: "hidden",
    contractType: "Contract", schedule: "Full day · Sun–Thu",
    startDate: "Immediately", language: "English",
    postedDays: 3, deadlineDays: 15, matchScore: 68,
    isSaved: false, isApplied: false, isShielded: true, accentColor: "#1e40af",
    requirements: ["CS or IT degree required", "Python and Java proficiency", "2+ years teaching experience", "English medium instruction"],
    responsibilities: [
      "Teach programming with Python, Java, and web development fundamentals",
      "Design coding projects and practical assessments",
      "Prepare talented students for Olympiad and competition tracks",
    ],
    description: "KFUPM Schools is an elite institution affiliated with King Fahd University. We need a talented Computer Science Teacher who can inspire the next generation of Saudi tech leaders.",
  },
  {
    id: 6, title: "Substitute Biology Teacher",
    school: "Al-Bayan International School", schoolType: "International",
    subject: "Biology", gradeLevel: "High School (10–12)",
    city: "Jeddah", salaryMin: 400, salaryMax: 600, salaryDisplay: "show",
    contractType: "Substitute", schedule: "Flexible · As needed",
    startDate: "Immediately", duration: "1–4 weeks", language: "English",
    postedDays: 0, deadlineDays: 2, matchScore: 55,
    isSaved: false, isApplied: false, isShielded: true, accentColor: "#059669",
    requirements: ["Biology degree or equivalent", "Flexible schedule availability", "Immediate start required", "Substitute experience preferred"],
    responsibilities: [
      "Cover Biology lessons for Grades 10–12 during staff absence",
      "Follow provided lesson plans and maintain classroom discipline",
      "Report classroom progress to the head of department",
    ],
    description: "Al-Bayan International School requires a reliable substitute Biology teacher for short-term coverage. Excellent per-day rate, full flexibility, and immediate opportunities.",
  },
  {
    id: 7, title: "Arabic Language & Literature Teacher",
    school: "Bayan Bilingual School", schoolType: "Private",
    subject: "Arabic Language", gradeLevel: "Middle School (7–9)",
    city: "Riyadh", salaryMin: 7000, salaryMax: 9500, salaryDisplay: "show",
    contractType: "Full-time", schedule: "Morning shift · Sun–Thu",
    startDate: "August 2026", language: "Arabic",
    postedDays: 10, deadlineDays: 3, matchScore: 60,
    isSaved: false, isApplied: false, isShielded: false, accentColor: "#b45309",
    requirements: ["Arabic Literature degree", "5+ years experience", "Male section", "Senior educator preferred"],
    responsibilities: [
      "Teach Arabic Language and Literature for Grades 7–9",
      "Develop rich literary reading programs and extended writing tasks",
      "Mentor students preparing for national language competitions",
    ],
    description: "Bayan Bilingual School is seeking an experienced Arabic Language & Literature Teacher for the male section. Deep knowledge of classical and modern Arabic literature required.",
  },
];

function salaryText(job: Job): string {
  if (job.salaryDisplay === "negotiable") return "Negotiable";
  if (job.salaryDisplay === "hidden") return "Undisclosed";
  if (job.contractType === "Substitute") return `SAR ${job.salaryMin}–${job.salaryMax}/day`;
  return `SAR ${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()}/mo`;
}
function schoolTypeBadge(type: Job["schoolType"]): string {
  const map: Record<string, string> = {
    International: "bg-blue-50 text-blue-600",
    Private: "bg-violet-50 text-violet-600",
    Government: "bg-emerald-50 text-emerald-700",
  };
  return map[type] ?? "bg-slate-100 text-slate-600";
}
function postedLabel(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}
function deadlinePill(days: number): { label: string; cls: string } {
  if (days <= 0) return { label: "Closes today", cls: "bg-red-50 text-red-600" };
  if (days <= 3)  return { label: `${days}d left`, cls: "bg-red-50 text-red-600" };
  if (days <= 7)  return { label: `${days}d left`, cls: "bg-amber-50 text-amber-600" };
  return            { label: `${days}d left`, cls: "bg-slate-100 text-slate-500" };
}
function toggleFilter<T>(value: T, list: T[], setter: (v: T[]) => void) {
  setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
}

export default function JobsPage() {
  const isLoggedIn = true;
  const [searchQuery,   setSearchQuery]   = useState("");
  const [sortBy,        setSortBy]        = useState("recommended");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(MOCK_JOBS[0].id);
  const [showFilters,   setShowFilters]   = useState(true);
  const [shieldedOnly,  setShieldedOnly]  = useState(false);
  const [savedJobs, setSavedJobs] = useState<Set<number>>(
    new Set(MOCK_JOBS.filter((j) => j.isSaved).map((j) => j.id))
  );
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(
    new Set(MOCK_JOBS.filter((j) => j.isApplied).map((j) => j.id))
  );
  const [selectedCities,    setSelectedCities]    = useState<string[]>([]);
  const [selectedSubjects,  setSelectedSubjects]  = useState<string[]>([]);
  const [selectedGrades,    setSelectedGrades]    = useState<string[]>([]);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState({
    city: true, subject: true, grade: false, contract: false,
  });
  const toggleSection = (key: keyof typeof openSections) =>
    setOpenSections((p) => ({ ...p, [key]: !p[key] }));
  const toggleSave = (id: number) =>
    setSavedJobs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const handleApply = (id: number) => {
    if (!isLoggedIn) return;
    setAppliedJobs((prev) => new Set([...prev, id]));
  };
  const activeFilterCount =
    selectedCities.length + selectedSubjects.length +
    selectedGrades.length + selectedContracts.length + (shieldedOnly ? 1 : 0);
  const clearFilters = () => {
    setSelectedCities([]);
    setSelectedSubjects([]);
    setSelectedGrades([]);
    setSelectedContracts([]);
    setShieldedOnly(false);
  };
  const filteredJobs = MOCK_JOBS.filter((job) => {
    const q = searchQuery.toLowerCase();
    if (
      q &&
      !job.title.toLowerCase().includes(q) &&
      !job.school.toLowerCase().includes(q) &&
      !job.subject.toLowerCase().includes(q)
    ) return false;
    if (selectedCities.length    && !selectedCities.includes(job.city))           return false;
    if (selectedSubjects.length  && !selectedSubjects.includes(job.subject))       return false;
    if (selectedGrades.length    && !selectedGrades.includes(job.gradeLevel))      return false;
    if (selectedContracts.length && !selectedContracts.includes(job.contractType)) return false;
    if (shieldedOnly && !job.isShielded) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "newest")      return a.postedDays - b.postedDays;
    if (sortBy === "closing")     return a.deadlineDays - b.deadlineDays;
    if (sortBy === "salary_high") return b.salaryMax - a.salaryMax;
    return b.matchScore - a.matchScore;
  });
  const selectedJob =
    filteredJobs.find((j) => j.id === selectedJobId) ?? filteredJobs[0] ?? null;

  return (
    <div className="h-[calc(100vh-6.25rem)] flex flex-col overflow-hidden bg-slate-50">

      {/* ── Search + sort bar ─────────────────────────────── */}
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
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, school, or subject…"
              className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none transition-all"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--brand-primary)";
                e.currentTarget.style.boxShadow   = "0 0 0 3px var(--brand-primary-light)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow   = "";
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white cursor-pointer text-slate-600 focus:outline-none"
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--brand-primary)"; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = ""; }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ── 3-panel body ──────────────────────────────────── */}
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
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex-1 px-3 py-2 overflow-y-auto">
              {/* Shield verified toggle */}
              <div className="flex items-center justify-between px-2 py-3 border-b border-slate-100 mb-1">
                <div className="flex items-center gap-2">
                  <Shield size={12} style={{ color: "var(--brand-accent)" }} />
                  <span className="text-xs font-medium text-slate-700">Shield Verified</span>
                </div>
                <button
                  onClick={() => setShieldedOnly((v) => !v)}
                  className="w-9 h-5 rounded-full relative transition-colors shrink-0"
                  style={{ backgroundColor: shieldedOnly ? "var(--brand-primary)" : "rgb(226 232 240)" }}
                >
                  <span
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                    style={{ left: shieldedOnly ? "18px" : "2px" }}
                  />
                </button>
              </div>

              <FilterSection
                label="City"
                isOpen={openSections.city}
                onToggle={() => toggleSection("city")}
              >
                {CITIES.slice(0, 6).map((c) => (
                  <FilterCheckbox
                    key={c} label={c}
                    checked={selectedCities.includes(c)}
                    onChange={() => toggleFilter(c, selectedCities, setSelectedCities)}
                  />
                ))}
              </FilterSection>

              <FilterSection
                label="Subject"
                isOpen={openSections.subject}
                onToggle={() => toggleSection("subject")}
              >
                {SUBJECTS.slice(0, 8).map((s) => (
                  <FilterCheckbox
                    key={s} label={s}
                    checked={selectedSubjects.includes(s)}
                    onChange={() => toggleFilter(s, selectedSubjects, setSelectedSubjects)}
                  />
                ))}
              </FilterSection>

              <FilterSection
                label="Grade Level"
                isOpen={openSections.grade}
                onToggle={() => toggleSection("grade")}
              >
                {GRADE_LEVELS.map((g) => (
                  <FilterCheckbox
                    key={g} label={g}
                    checked={selectedGrades.includes(g)}
                    onChange={() => toggleFilter(g, selectedGrades, setSelectedGrades)}
                  />
                ))}
              </FilterSection>

              <FilterSection
                label="Contract Type"
                isOpen={openSections.contract}
                onToggle={() => toggleSection("contract")}
              >
                {CONTRACT_TYPES.map((ct) => (
                  <FilterCheckbox
                    key={ct} label={ct}
                    checked={selectedContracts.includes(ct)}
                    onChange={() => toggleFilter(ct, selectedContracts, setSelectedContracts)}
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
              <span className="font-semibold text-slate-700">{filteredJobs.length}</span> jobs found
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium flex items-center gap-1 ml-1"
                style={{ color: "var(--brand-primary)" }}
              >
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Search size={20} className="text-slate-400" />
                </div>
                <p className="font-semibold text-slate-600 text-sm mb-1">No jobs match your filters</p>
                <p className="text-xs text-slate-400 mb-4">Try broadening your search or clearing filters</p>
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <JobListCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJobId === job.id}
                  isSaved={savedJobs.has(job.id)}
                  isApplied={appliedJobs.has(job.id)}
                  onSelect={() => setSelectedJobId(job.id)}
                  onToggleSave={toggleSave}
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
              isSaved={savedJobs.has(selectedJob.id)}
              isApplied={appliedJobs.has(selectedJob.id)}
              isLoggedIn={isLoggedIn}
              onToggleSave={toggleSave}
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

// ── Sub-components ─────────────────────────────────────────────────

function FilterSection({
  label, isOpen, onToggle, children,
}: {
  label: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors"
      >
        {label}
        <ChevronDown
          size={11}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="pb-1.5">{children}</div>}
    </div>
  );
}

function FilterCheckbox({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-md">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-3.5 h-3.5 rounded shrink-0"
        style={{ accentColor: "var(--brand-primary)" }}
      />
      <span className="text-xs text-slate-600 leading-none truncate">{label}</span>
    </label>
  );
}

function JobListCard({
  job, isSelected, isSaved, isApplied, onSelect, onToggleSave,
}: {
  job: Job; isSelected: boolean; isSaved: boolean; isApplied: boolean;
  onSelect: () => void; onToggleSave: (id: number) => void;
}) {
  const deadline = deadlinePill(job.deadlineDays);
  return (
    <div
      onClick={onSelect}
      className="relative px-4 py-4 cursor-pointer transition-colors group bg-white border-l-2 hover:bg-slate-50"
      style={{ borderLeftColor: isSelected ? "var(--brand-primary)" : "transparent" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: job.accentColor }}
        >
          {job.school[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-sm font-semibold leading-snug transition-colors"
              style={{ color: isSelected ? "var(--brand-primary)" : "" }}
            >
              {job.title}
            </h3>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave(job.id); }}
              className="shrink-0 p-1 rounded transition-colors mt-0.5"
              style={{ color: isSaved ? "var(--brand-primary)" : "rgb(203 213 225)" }}
            >
              <Bookmark size={13} className={isSaved ? "fill-current" : ""} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
            <Building2 size={10} className="shrink-0" />
            <span className="truncate">{job.school}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${schoolTypeBadge(job.schoolType)}`}>
              {job.schoolType}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><MapPin size={10} />{job.city}</span>
            <span className="flex items-center gap-1"><BookOpen size={10} />{job.subject}</span>
            <span className="flex items-center gap-1"><Clock size={10} />{job.contractType}</span>
          </div>
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-700">{salaryText(job)}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${deadline.cls}`}>
              {deadline.label}
            </span>
            {job.isShielded && (
              <span
                className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: "rgba(0,172,211,0.08)", color: "var(--brand-accent)" }}
              >
                <Shield size={9} />Verified
              </span>
            )}
            {isApplied && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={9} />Applied
              </span>
            )}
            <span className="text-[10px] text-slate-300 ml-auto">{postedLabel(job.postedDays)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobDetailPanel({
  job, isSaved, isApplied, isLoggedIn, onToggleSave, onApply,
}: {
  job: Job; isSaved: boolean; isApplied: boolean; isLoggedIn: boolean;
  onToggleSave: (id: number) => void; onApply: (id: number) => void;
}) {
  const deadline = deadlinePill(job.deadlineDays);
  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div
        className="shrink-0 px-6 pt-6 pb-5 border-b border-slate-100"
        style={{ borderTop: `3px solid ${job.accentColor}` }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
            style={{ backgroundColor: job.accentColor }}
          >
            {job.school[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{job.school}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap mt-0.5">
              <MapPin size={10} className="shrink-0" />{job.city}
              <span className="opacity-40">·</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${schoolTypeBadge(job.schoolType)}`}>
                {job.schoolType}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleSave(job.id)}
              className="p-2 rounded-lg border transition-colors"
              style={
                isSaved
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
            <Clock size={10} />{job.contractType}
          </span>
          <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
            <GraduationCap size={10} />{job.gradeLevel}
          </span>
          <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
            <CalendarDays size={10} />Starts {job.startDate}
          </span>
          {job.isShielded && (
            <span
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: "rgba(0,172,211,0.10)", color: "var(--brand-accent)" }}
            >
              <Shield size={10} />Authorization Shield
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Banknote size={14} className="text-slate-400 shrink-0" />
            {salaryText(job)}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${deadline.cls}`}>
            {deadline.label}
          </span>
          <span className="text-[11px] text-slate-400 ml-auto">{postedLabel(job.postedDays)}</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* Shield notice */}
        {job.isShielded && (
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ background: "rgba(0,172,211,0.04)", border: "1px solid rgba(0,172,211,0.14)" }}
          >
            <Shield size={15} style={{ color: "var(--brand-accent)" }} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold mb-0.5" style={{ color: "var(--brand-primary)" }}>
                Abjad Authorization Shield
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                This role is protected by Abjad’s Authorization Shield. The school and listing
                have been manually verified for authenticity, compliance, and legitimacy.
              </p>
            </div>
          </div>
        )}

        {/* Overview grid */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Job Overview</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Clock,         label: "Employment", value: job.contractType },
              { icon: CalendarDays,  label: "Start Date",  value: job.startDate },
              { icon: GraduationCap, label: "Grades",      value: job.gradeLevel },
              { icon: BookOpen,      label: "Subject",     value: job.subject },
              { icon: MapPin,        label: "City",        value: job.city },
              { icon: Banknote,      label: "Salary",      value: salaryText(job) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon size={12} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide leading-none mb-0.5">
                    {label}
                  </p>
                  <p className="text-xs font-semibold text-slate-700">{value}</p>
                </div>
              </div>
            ))}
          </div>
          {job.schedule && (
            <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
              <CalendarDays size={11} className="shrink-0" />{job.schedule}
            </p>
          )}
          {job.duration && (
            <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
              <Clock size={11} className="shrink-0" />Duration: {job.duration}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">About the Role</p>
          <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
        </div>

        {/* Responsibilities */}
        {job.responsibilities.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Responsibilities</p>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <ChevronRight
                    size={13}
                    className="shrink-0 mt-0.5"
                    style={{ color: "var(--brand-primary)" }}
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {job.requirements.length > 0 && (
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

        <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
          <span className="font-semibold text-slate-600">Language of instruction:</span>
          <span>{job.language}</span>
        </div>
      </div>

      {/* Apply footer */}
      <div className="shrink-0 px-6 py-4 bg-white border-t border-slate-100">
        {isApplied ? (
          <div className="flex items-center gap-2 justify-center py-3 bg-emerald-50 rounded-xl text-emerald-600 font-semibold text-sm">
            <CheckCircle2 size={15} />Application Submitted
          </div>
        ) : isLoggedIn ? (
          <button
            onClick={() => onApply(job.id)}
            className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[.99]"
            style={{ background: "var(--brand-gradient)" }}
          >
            <Zap size={14} />Apply Now
          </button>
        ) : (
          <Link
            href="/register?role=teacher"
            className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ background: "var(--brand-gradient)" }}
          >
            <ArrowRight size={14} />Sign Up to Apply
          </Link>
        )}
        <p className="text-center text-[10px] text-slate-300 mt-2">
          Posted via Abjad · {postedLabel(job.postedDays)}
        </p>
      </div>
    </div>
  );
}
