"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Building2,
  BookOpen,
  Clock,
  ChevronDown,
  Heart,
  Zap,
  LayoutGrid,
  List,
  Filter,
  X,
  Star,
  SlidersHorizontal,
  GraduationCap,
  Banknote,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English Language",
  "Arabic Language",
  "Islamic Studies",
  "History",
  "Geography",
  "Computer Science",
  "Physical Education",
  "Art",
  "Music",
];

const GRADE_LEVELS = [
  "Kindergarten",
  "Elementary (1–3)",
  "Elementary (4–6)",
  "Middle School (7–9)",
  "High School (10–12)",
];

const CITIES = [
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Khobar",
  "Makkah",
  "Madinah",
  "Abha",
  "Taif",
  "Tabuk",
  "Najran",
];

const CONTRACT_TYPES = [
  "Full-time",
  "Part-time",
  "Substitute",
  "Contract",
];

interface Job {
  id: number;
  title: string;
  school: string;
  schoolType: "Private" | "International" | "Government";
  subject: string;
  gradeLevel: string;
  city: string;
  salaryMin: number;
  salaryMax: number;
  salaryDisplay: "show" | "negotiable" | "hidden";
  contractType: string;
  postedDays: number;
  deadlineDays: number;
  matchScore: number;
  isSaved: boolean;
  isApplied: boolean;
  requirements: string[];
  logo?: string;
  language: string;
}

const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: "Mathematics Teacher – High School",
    school: "Al-Noor International School",
    schoolType: "International",
    subject: "Mathematics",
    gradeLevel: "High School (10–12)",
    city: "Riyadh",
    salaryMin: 8000,
    salaryMax: 12000,
    salaryDisplay: "show",
    contractType: "Full-time",
    postedDays: 2,
    deadlineDays: 12,
    matchScore: 92,
    isSaved: false,
    isApplied: false,
    requirements: ["B.Ed Mathematics", "3+ years", "English medium"],
    language: "English",
  },
  {
    id: 2,
    title: "Physics & Chemistry Teacher",
    school: "Manarat Schools",
    schoolType: "Private",
    subject: "Physics",
    gradeLevel: "Middle School (7–9)",
    city: "Jeddah",
    salaryMin: 6500,
    salaryMax: 9000,
    salaryDisplay: "show",
    contractType: "Full-time",
    postedDays: 5,
    deadlineDays: 8,
    matchScore: 85,
    isSaved: true,
    isApplied: false,
    requirements: ["B.Sc Physics", "2+ years", "Bilingual"],
    language: "Arabic",
  },
  {
    id: 3,
    title: "English Language Teacher",
    school: "Dhahran British Grammar School",
    schoolType: "International",
    subject: "English Language",
    gradeLevel: "Elementary (4–6)",
    city: "Khobar",
    salaryMin: 0,
    salaryMax: 0,
    salaryDisplay: "negotiable",
    contractType: "Full-time",
    postedDays: 1,
    deadlineDays: 20,
    matchScore: 78,
    isSaved: false,
    isApplied: true,
    requirements: ["Native speaker preferred", "CELTA/TEFL", "4+ years"],
    language: "English",
  },
  {
    id: 4,
    title: "Islamic Studies Teacher",
    school: "Al-Rajhi Model Schools",
    schoolType: "Private",
    subject: "Islamic Studies",
    gradeLevel: "Elementary (1–3)",
    city: "Riyadh",
    salaryMin: 5500,
    salaryMax: 7500,
    salaryDisplay: "show",
    contractType: "Full-time",
    postedDays: 7,
    deadlineDays: 5,
    matchScore: 71,
    isSaved: false,
    isApplied: false,
    requirements: ["Shariah degree", "Arabic native", "Female section"],
    language: "Arabic",
  },
  {
    id: 5,
    title: "Computer Science Teacher",
    school: "KFUPM Schools",
    schoolType: "Government",
    subject: "Computer Science",
    gradeLevel: "High School (10–12)",
    city: "Dammam",
    salaryMin: 0,
    salaryMax: 0,
    salaryDisplay: "hidden",
    contractType: "Contract",
    postedDays: 3,
    deadlineDays: 15,
    matchScore: 68,
    isSaved: false,
    isApplied: false,
    requirements: ["CS/IT degree", "Python/Java", "2+ years"],
    language: "English",
  },
  {
    id: 6,
    title: "Arabic Language & Literature",
    school: "Bayan Bilingual School",
    schoolType: "Private",
    subject: "Arabic Language",
    gradeLevel: "Middle School (7–9)",
    city: "Riyadh",
    salaryMin: 7000,
    salaryMax: 9500,
    salaryDisplay: "show",
    contractType: "Full-time",
    postedDays: 10,
    deadlineDays: 3,
    matchScore: 60,
    isSaved: false,
    isApplied: false,
    requirements: ["Arabic Literature degree", "5+ years", "Male section"],
    language: "Arabic",
  },
  {
    id: 7,
    title: "Substitute Biology Teacher",
    school: "Al-Bayan International School",
    schoolType: "International",
    subject: "Biology",
    gradeLevel: "High School (10–12)",
    city: "Jeddah",
    salaryMin: 400,
    salaryMax: 600,
    salaryDisplay: "show",
    contractType: "Substitute",
    postedDays: 0,
    deadlineDays: 2,
    matchScore: 55,
    isSaved: false,
    isApplied: false,
    requirements: ["Biology degree", "Flexible schedule"],
    language: "English",
  },
  {
    id: 8,
    title: "Part-time Geography Teacher",
    school: "Future International Schools",
    schoolType: "Private",
    subject: "Geography",
    gradeLevel: "Elementary (4–6)",
    city: "Makkah",
    salaryMin: 3000,
    salaryMax: 4500,
    salaryDisplay: "show",
    contractType: "Part-time",
    postedDays: 6,
    deadlineDays: 10,
    matchScore: 48,
    isSaved: false,
    isApplied: false,
    requirements: ["Geography degree", "Morning availability"],
    language: "Arabic",
  },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest First" },
  { value: "closing", label: "Closing Soon" },
  { value: "salary_high", label: "Salary: High to Low" },
  { value: "salary_low", label: "Salary: Low to High" },
];

function matchScoreColor(score: number) {
  if (score >= 80) return "text-emerald-600 bg-emerald-50";
  if (score >= 60) return "text-amber-600 bg-amber-50";
  return "text-slate-500 bg-slate-100";
}

function deadlineUrgency(days: number) {
  if (days <= 3) return "text-red-600 bg-red-50";
  if (days <= 7) return "text-amber-600 bg-amber-50";
  return "text-slate-500 bg-slate-50";
}

function salaryText(job: Job) {
  if (job.salaryDisplay === "negotiable") return "Negotiable";
  if (job.salaryDisplay === "hidden") return "Salary hidden";
  if (job.contractType === "Substitute") return `SAR ${job.salaryMin}–${job.salaryMax}/day`;
  return `SAR ${job.salaryMin.toLocaleString()}–${job.salaryMax.toLocaleString()}/mo`;
}

function schoolTypeBadge(type: Job["schoolType"]) {
  const styles: Record<string, string> = {
    International: "bg-blue-100 text-blue-700",
    Private: "bg-purple-100 text-purple-700",
    Government: "bg-green-100 text-green-700",
  };
  return styles[type] ?? "bg-slate-100 text-slate-600";
}

export default function JobsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Set<number>>(
    new Set(MOCK_JOBS.filter((j) => j.isSaved).map((j) => j.id))
  );
  const [appliedJobs] = useState<Set<number>>(
    new Set(MOCK_JOBS.filter((j) => j.isApplied).map((j) => j.id))
  );

  // Filters
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState(0);
  const [postedWithin, setPostedWithin] = useState(30);

  const toggleSave = (id: number) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFilter = <T,>(
    value: T,
    list: T[],
    setter: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const clearFilters = () => {
    setSelectedCities([]);
    setSelectedSubjects([]);
    setSelectedGrades([]);
    setSelectedContracts([]);
    setSalaryMin(0);
    setPostedWithin(30);
    setSearchQuery("");
  };

  const activeFilterCount =
    selectedCities.length +
    selectedSubjects.length +
    selectedGrades.length +
    selectedContracts.length +
    (salaryMin > 0 ? 1 : 0) +
    (postedWithin < 30 ? 1 : 0);

  const filteredJobs = MOCK_JOBS.filter((job) => {
    if (
      searchQuery &&
      !job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.school.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !job.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (selectedCities.length && !selectedCities.includes(job.city)) return false;
    if (selectedSubjects.length && !selectedSubjects.includes(job.subject)) return false;
    if (selectedGrades.length && !selectedGrades.includes(job.gradeLevel)) return false;
    if (selectedContracts.length && !selectedContracts.includes(job.contractType)) return false;
    if (salaryMin > 0 && job.salaryDisplay === "show" && job.salaryMax < salaryMin) return false;
    if (job.postedDays > postedWithin) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "newest") return a.postedDays - b.postedDays;
    if (sortBy === "closing") return a.deadlineDays - b.deadlineDays;
    if (sortBy === "salary_high") return b.salaryMax - a.salaryMax;
    if (sortBy === "salary_low") return a.salaryMin - b.salaryMin;
    return b.matchScore - a.matchScore; // recommended
  });

  const recommendedJobs = filteredJobs.filter((j) => j.matchScore >= 75);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Browse Jobs</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {filteredJobs.length} positions available across Saudi Arabia
            </p>
          </div>
          <div className="flex-1 md:max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, schools, subjects…"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm rounded-xl border transition-colors ${
                showFilters
                  ? "bg-cyan-50 border-cyan-300 text-cyan-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-cyan-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {/* View toggle */}
            <div className="flex border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${
                  viewMode === "grid" ? "bg-cyan-500 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors ${
                  viewMode === "list" ? "bg-cyan-500 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Filters */}
        {showFilters && (
          <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-130px)] p-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-700 text-sm">Filters</span>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* City */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">City</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {CITIES.map((city) => (
                  <label key={city} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCities.includes(city)}
                      onChange={() => toggleFilter(city, selectedCities, setSelectedCities)}
                      className="w-3.5 h-3.5 rounded accent-cyan-500"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{city}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Subject</p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {SUBJECTS.map((sub) => (
                  <label key={sub} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(sub)}
                      onChange={() => toggleFilter(sub, selectedSubjects, setSelectedSubjects)}
                      className="w-3.5 h-3.5 rounded accent-cyan-500"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{sub}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Grade Level */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Grade Level</p>
              <div className="space-y-1.5">
                {GRADE_LEVELS.map((grade) => (
                  <label key={grade} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedGrades.includes(grade)}
                      onChange={() => toggleFilter(grade, selectedGrades, setSelectedGrades)}
                      className="w-3.5 h-3.5 rounded accent-cyan-500"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{grade}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contract Type */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Contract Type</p>
              <div className="space-y-1.5">
                {CONTRACT_TYPES.map((ct) => (
                  <label key={ct} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedContracts.includes(ct)}
                      onChange={() => toggleFilter(ct, selectedContracts, setSelectedContracts)}
                      className="w-3.5 h-3.5 rounded accent-cyan-500"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{ct}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Min Salary (SAR/mo)
              </p>
              <input
                type="range"
                min={0}
                max={15000}
                step={500}
                value={salaryMin}
                onChange={(e) => setSalaryMin(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>SAR 0</span>
                <span className="font-medium text-slate-700">
                  {salaryMin > 0 ? `SAR ${salaryMin.toLocaleString()}+` : "Any"}
                </span>
              </div>
            </div>

            {/* Posted Within */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Posted Within</p>
              <div className="flex flex-wrap gap-1.5">
                {[1, 3, 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setPostedWithin(days)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      postedWithin === days
                        ? "bg-cyan-500 text-white border-cyan-500"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {days === 1 ? "Today" : days === 30 ? "All" : `${days}d`}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-8 min-w-0">
          {/* Recommended for You */}
          {recommendedJobs.length > 0 && sortBy === "recommended" && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-amber-500" />
                <h2 className="font-semibold text-slate-700">Recommended for You</h2>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {recommendedJobs.length} matches
                </span>
              </div>
              <div className={`grid gap-4 ${showFilters ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                {recommendedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobs.has(job.id)}
                    isApplied={appliedJobs.has(job.id)}
                    onToggleSave={toggleSave}
                    viewMode={viewMode}
                    highlighted
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Jobs */}
          <section>
            {sortBy === "recommended" && recommendedJobs.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-slate-500" />
                <h2 className="font-semibold text-slate-700">All Positions</h2>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {filteredJobs.length} jobs
                </span>
              </div>
            )}

            {filteredJobs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-600 mb-1">No jobs found</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className={`grid gap-4 ${showFilters ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobs.has(job.id)}
                    isApplied={appliedJobs.has(job.id)}
                    onToggleSave={toggleSave}
                    viewMode="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobs.has(job.id)}
                    isApplied={appliedJobs.has(job.id)}
                    onToggleSave={toggleSave}
                    viewMode="list"
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredJobs.length > 0 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-medium text-slate-700">1–{filteredJobs.length}</span> of{" "}
                  <span className="font-medium text-slate-700">{filteredJobs.length}</span> jobs
                </p>
                <div className="flex gap-1">
                  <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-cyan-500 text-white rounded-lg font-medium">
                    1
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

// ── Job Card Component ─────────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  isApplied: boolean;
  onToggleSave: (id: number) => void;
  viewMode: "grid" | "list";
  highlighted?: boolean;
}

function JobCard({ job, isSaved, isApplied, onToggleSave, viewMode, highlighted }: JobCardProps) {
  if (viewMode === "list") {
    return (
      <div className={`bg-white rounded-2xl border p-4 hover:shadow-md transition-all ${highlighted ? "border-amber-200 bg-amber-50/30" : "border-slate-200"}`}>
        <div className="flex items-start gap-4">
          {/* Logo placeholder */}
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {job.school[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800 hover:text-cyan-600 cursor-pointer">
                    {job.title}
                  </h3>
                  {highlighted && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${matchScoreColor(job.matchScore)}`}>
                      {job.matchScore}% match
                    </span>
                  )}
                  {isApplied && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Applied
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> {job.school}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${schoolTypeBadge(job.schoolType)}`}>
                    {job.schoolType}
                  </span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-slate-800 text-sm">
                  {salaryText(job)}
                </p>
                <p className={`text-xs mt-0.5 px-2 py-0.5 rounded-full inline-block ${deadlineUrgency(job.deadlineDays)}`}>
                  {job.deadlineDays <= 0 ? "Closes today" : `${job.deadlineDays}d left`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.city}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {job.subject}</span>
              <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {job.gradeLevel}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />
                {job.contractType}
              </span>
              <span className="flex items-center gap-1">
                {job.postedDays === 0 ? "Posted today" : `Posted ${job.postedDays}d ago`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleSave(job.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isSaved ? "bg-red-50 border-red-200 text-red-500" : "border-slate-200 text-slate-400 hover:text-red-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
            </button>
            {isApplied ? (
              <button className="px-4 py-2 text-sm bg-slate-100 text-slate-500 rounded-xl cursor-default">
                Applied
              </button>
            ) : (
              <button className="px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium flex items-center gap-1.5 transition-colors">
                <Zap className="w-3.5 h-3.5" /> Quick Apply
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className={`bg-white rounded-2xl border p-5 hover:shadow-md transition-all flex flex-col ${highlighted ? "border-amber-200 ring-1 ring-amber-100" : "border-slate-200"}`}>
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {job.school[0]}
          </div>
          <div>
            <span className={`text-xs px-1.5 py-0.5 rounded ${schoolTypeBadge(job.schoolType)}`}>
              {job.schoolType}
            </span>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-35">{job.school}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {highlighted && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${matchScoreColor(job.matchScore)}`}>
              {job.matchScore}%
            </span>
          )}
          <button
            onClick={() => onToggleSave(job.id)}
            className={`p-1.5 rounded-lg transition-colors ${isSaved ? "text-red-500" : "text-slate-300 hover:text-red-400"}`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-800 hover:text-cyan-600 cursor-pointer mb-1 leading-snug">
        {job.title}
      </h3>

      {/* Meta pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
          <MapPin className="w-3 h-3" /> {job.city}
        </span>
        <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
          <BookOpen className="w-3 h-3" /> {job.subject}
        </span>
        <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
          <GraduationCap className="w-3 h-3" /> {job.gradeLevel}
        </span>
      </div>

      {/* Requirements */}
      <div className="flex flex-wrap gap-1 mb-4">
        {job.requirements.slice(0, 2).map((req) => (
          <span key={req} className="text-xs border border-slate-200 text-slate-500 px-2 py-0.5 rounded">
            {req}
          </span>
        ))}
      </div>

      <div className="mt-auto">
        {/* Salary & deadline */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
            <Banknote className="w-4 h-4 text-slate-400" />
            {salaryText(job)}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${deadlineUrgency(job.deadlineDays)}`}>
            {job.deadlineDays <= 0 ? "Closes today" : `${job.deadlineDays}d left`}
          </span>
        </div>

        {/* Posted date & contract */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            {job.postedDays === 0 ? "Today" : `${job.postedDays}d ago`}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {job.contractType}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isApplied ? (
            <button className="flex-1 py-2 text-sm bg-slate-100 text-slate-500 rounded-xl cursor-default flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Applied
            </button>
          ) : (
            <button className="flex-1 py-2 text-sm bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium flex items-center justify-center gap-1.5 transition-colors">
              <Zap className="w-3.5 h-3.5" /> Quick Apply
            </button>
          )}
          <button className="px-3 py-2 text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
}

// Fix missing import
import { Briefcase } from "lucide-react";
