"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Loader2, AlertCircle, X, Trash2, Archive,
  ArchiveRestore, Users, Briefcase, ChevronDown,
  Eye, BookmarkCheck, Folder, FolderOpen, StickyNote,
  GraduationCap,
} from "lucide-react";
import {
  listShortlists,
  createShortlist,
  updateShortlist,
  deleteShortlist,
  removeFromShortlist,
  listSchoolJobs,
  getCandidate,
} from "@/lib/api/school";
import type { Shortlist, SchoolJob, CandidateProfile } from "@/lib/api/school";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESET_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const SUBJECT_LABELS: Record<string, string> = {
  islamic_studies: "Islamic Studies",
  arabic:          "Arabic",
  english:         "English",
  math:            "Math",
  science:         "Science",
  physics:         "Physics",
  chemistry:       "Chemistry",
  biology:         "Biology",
  computer_science:"Computer Science",
  social_studies:  "Social Studies",
  pe:              "PE",
  art:             "Art",
  other:           "Other",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(isoStr: string): string {
  const secs = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (secs < 60)    return "just now";
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function jobTitle(jobId: Shortlist["jobId"]): string | null {
  if (!jobId) return null;
  if (typeof jobId === "object") return jobId.title;
  return null;
}

function teacherIdStr(entry: Shortlist["teachers"][number]): string {
  if (typeof entry.teacherId === "object") return (entry.teacherId as { _id: string })._id;
  return entry.teacherId;
}

function subjectLabel(v: string): string {
  return SUBJECT_LABELS[v] ?? v;
}

function candidateDisplayName(c: CandidateProfile): string {
  return c.personal?.fullNameEn ?? c.personal?.fullNameAr ?? "Unnamed";
}

function candidateInitials(c: CandidateProfile): string {
  const name = candidateDisplayName(c);
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ─── New Shortlist Modal ──────────────────────────────────────────────────────

interface NewShortlistModalProps {
  jobs: SchoolJob[];
  onClose: () => void;
  onCreated: (sl: Shortlist) => void;
}

function NewShortlistModal({ jobs, onClose, onCreated }: NewShortlistModalProps) {
  const [name, setName]         = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor]       = useState(PRESET_COLORS[0]);
  const [linkedJobId, setLinkedJobId] = useState("");
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const activeJobs = jobs.filter((j) => j.status === "active");

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const sl = await createShortlist({
        name:        name.trim(),
        description: description.trim() || undefined,
        color,
        jobId:       linkedJobId || undefined,
      });
      onCreated(sl);
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
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--brand-gradient)" }}
            >
              <BookmarkCheck size={16} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900">New Shortlist</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl mb-4">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Top Math Candidates"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes about this shortlist…"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Color</label>
            <div className="flex items-center gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Link to job */}
          {activeJobs.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1.5">Link to Job (optional)</label>
              <div className="relative">
                <select
                  value={linkedJobId}
                  onChange={(e) => setLinkedJobId(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-9"
                  style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
                >
                  <option value="">No linked job</option>
                  {activeJobs.map((j) => (
                    <option key={j._id} value={j._id}>{j.title}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}
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
            {saving ? <Loader2 size={14} className="animate-spin" /> : "Create Shortlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

interface DeleteConfirmProps {
  shortlistName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteConfirmModal({ shortlistName, onClose, onConfirm }: DeleteConfirmProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Delete Shortlist</h3>
            <p className="text-xs text-gray-500">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-900">{shortlistName}</span>?
          All teachers in this shortlist will be removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Teacher Mini Card ────────────────────────────────────────────────────────

interface TeacherMiniCardProps {
  teacherId: string;
  notes?: string;
  addedAt: string;
  shortlistId: string;
  onRemoved: (shortlistId: string, teacherId: string) => void;
  onViewProfile: (c: CandidateProfile) => void;
}

function TeacherMiniCard({ teacherId, notes, addedAt, shortlistId, onRemoved, onViewProfile }: TeacherMiniCardProps) {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingProfile(true);
    getCandidate(teacherId)
      .then((c) => { if (!cancelled) setCandidate(c); })
      .catch(() => { /* ignore */ })
      .finally(() => { if (!cancelled) setLoadingProfile(false); });
    return () => { cancelled = true; };
  }, [teacherId]);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeFromShortlist(shortlistId, teacherId);
      onRemoved(shortlistId, teacherId);
    } catch {
      // silently fail
    } finally {
      setRemoving(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) return null;

  const displaySubjects = (candidate.professional?.subjects ?? []).slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:border-gray-200 transition-all">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {candidate.personal?.photoUrl ? (
          <img
            src={candidate.personal.photoUrl}
            alt={candidateDisplayName(candidate)}
            className="w-9 h-9 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
            style={{ background: "var(--brand-gradient)" }}
          >
            {candidateInitials(candidate)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {candidateDisplayName(candidate)}
          </p>
          <div className="flex items-center flex-wrap gap-1 mt-0.5">
            {displaySubjects.map((s) => (
              <span key={s} className="text-xs text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                {subjectLabel(s)}
              </span>
            ))}
            {candidate.professional?.experienceRange && (
              <span className="text-xs text-gray-400">
                {candidate.professional.experienceRange}y exp
              </span>
            )}
          </div>
          {notes && (
            <div className="mt-1.5 flex items-start gap-1 text-xs text-gray-500">
              <StickyNote size={11} className="text-gray-400 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{notes}</span>
            </div>
          )}
          <p className="text-xs text-gray-300 mt-1">Added {timeAgo(addedAt)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onViewProfile(candidate)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="View Profile"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={handleRemove}
            disabled={removing}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Remove from shortlist"
          >
            {removing ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shortlist Folder Card ────────────────────────────────────────────────────

interface ShortlistCardProps {
  shortlist: Shortlist;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onArchive: (id: string, archive: boolean) => Promise<void>;
  onDelete: (sl: Shortlist) => void;
  onTeacherRemoved: (shortlistId: string, teacherId: string) => void;
  onViewProfile: (c: CandidateProfile) => void;
}

function ShortlistCard({
  shortlist: sl,
  isExpanded,
  onToggleExpand,
  onArchive,
  onDelete,
  onTeacherRemoved,
  onViewProfile,
}: ShortlistCardProps) {
  const [archiving, setArchiving] = useState(false);
  const linkedJob = jobTitle(sl.jobId);

  const handleArchive = async () => {
    setArchiving(true);
    try {
      await onArchive(sl._id, !sl.isArchived);
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all ${
      sl.isArchived ? "border-gray-100 opacity-70" : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
    }`}>
      {/* Color stripe */}
      <div
        className="h-1.5 rounded-t-2xl"
        style={{ backgroundColor: sl.color ?? "#3B82F6" }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <button
            onClick={onToggleExpand}
            className="flex items-start gap-3 flex-1 text-left min-w-0"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${sl.color ?? "#3B82F6"}20` }}
            >
              {isExpanded ? (
                <FolderOpen size={16} style={{ color: sl.color ?? "#3B82F6" }} />
              ) : (
                <Folder size={16} style={{ color: sl.color ?? "#3B82F6" }} />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">{sl.name}</h3>
              {sl.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{sl.description}</p>
              )}
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleArchive}
              disabled={archiving}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title={sl.isArchived ? "Unarchive" : "Archive"}
            >
              {archiving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : sl.isArchived ? (
                <ArchiveRestore size={14} />
              ) : (
                <Archive size={14} />
              )}
            </button>
            <button
              onClick={() => onDelete(sl)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete shortlist"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
            <Users size={11} className="text-gray-400" />
            {sl.teachers.length} teacher{sl.teachers.length !== 1 ? "s" : ""}
          </span>
          {linkedJob && (
            <span className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
              <Briefcase size={11} />
              {linkedJob}
            </span>
          )}
          {sl.isArchived && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              Archived
            </span>
          )}
        </div>

        {/* Expand toggle */}
        {sl.teachers.length > 0 && (
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1.5 mt-3 text-xs font-medium transition-colors"
            style={{ color: "var(--brand-primary)" }}
          >
            {isExpanded ? "Hide teachers" : "View teachers"}
            <ChevronDown
              size={12}
              className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {/* Expanded teachers grid */}
        {isExpanded && sl.teachers.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 border-t border-gray-50">
            {sl.teachers.map((entry) => {
              const tid = teacherIdStr(entry);
              return (
                <TeacherMiniCard
                  key={tid}
                  teacherId={tid}
                  notes={entry.notes}
                  addedAt={entry.addedAt}
                  shortlistId={sl._id}
                  onRemoved={onTeacherRemoved}
                  onViewProfile={onViewProfile}
                />
              );
            })}
          </div>
        )}

        {isExpanded && sl.teachers.length === 0 && (
          <div className="mt-4 pt-4 border-t border-gray-50 text-center py-6">
            <GraduationCap size={24} className="text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No teachers added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Inline Profile Modal (minimal) ──────────────────────────────────────────

interface ProfileViewModalProps {
  candidate: CandidateProfile;
  onClose: () => void;
}

function ProfileViewModal({ candidate: c, onClose }: ProfileViewModalProps) {
  function initials() {
    const name = candidateDisplayName(c);
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {c.personal?.photoUrl ? (
              <img src={c.personal.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: "var(--brand-gradient)" }}
              >
                {initials()}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-gray-900">{candidateDisplayName(c)}</h3>
              <p className="text-xs text-gray-500 capitalize">
                {c.personal?.gender}{c.personal?.nationality ? ` · ${c.personal.nationality}` : ""}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          {c.professional?.subjects && c.professional.subjects.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Subjects</p>
              <div className="flex flex-wrap gap-1.5">
                {c.professional.subjects.map((s) => (
                  <span key={s} className="text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {subjectLabel(s)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {c.professional?.experienceRange && (
            <div className="flex items-center gap-2">
              <Briefcase size={13} className="text-gray-400" />
              <span>{c.professional.experienceRange} years experience</span>
            </div>
          )}
          {c.education && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Education</p>
              <p className="capitalize">{c.education.degreeType ?? "–"}{c.education.major ? ` in ${c.education.major}` : ""}</p>
              {c.education.university && <p className="text-xs text-gray-400">{c.education.university}</p>}
            </div>
          )}
          {(c.salaryExpectations?.minMonthlySAR || c.salaryExpectations?.maxMonthlySAR) && (
            <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
              SAR {c.salaryExpectations.minMonthlySAR?.toLocaleString() ?? "–"}
              {c.salaryExpectations.maxMonthlySAR ? `–${c.salaryExpectations.maxMonthlySAR.toLocaleString()}` : "+"} / month
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ViewFilter = "active" | "archived";

export default function ShortlistsPage() {
  const [shortlists, setShortlists] = useState<Shortlist[]>([]);
  const [jobs, setJobs]             = useState<SchoolJob[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [viewFilter, setViewFilter] = useState<ViewFilter>("active");
  const [showNewModal, setShowNewModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Shortlist | null>(null);
  const [expandedIds, setExpandedIds]   = useState<Set<string>>(new Set());
  const [profileView, setProfileView]   = useState<CandidateProfile | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [slRes, jobRes] = await Promise.all([
        listShortlists(),
        listSchoolJobs({ status: "active", limit: 100 }),
      ]);
      setShortlists(slRes ?? []);
      setJobs(jobRes.jobs ?? []);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to load shortlists.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const filteredShortlists = shortlists.filter((sl) =>
    viewFilter === "active" ? !sl.isArchived : sl.isArchived
  );

  const handleCreated = (sl: Shortlist) => {
    setShortlists((prev) => [sl, ...prev]);
  };

  const handleArchive = async (id: string, archive: boolean) => {
    const updated = await updateShortlist(id, { isArchived: archive });
    setShortlists((prev) => prev.map((s) => (s._id === id ? updated : s)));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteShortlist(deleteTarget._id);
    setShortlists((prev) => prev.filter((s) => s._id !== deleteTarget._id));
    setDeleteTarget(null);
  };

  const handleTeacherRemoved = (shortlistId: string, teacherId: string) => {
    setShortlists((prev) =>
      prev.map((sl) =>
        sl._id === shortlistId
          ? {
              ...sl,
              teachers: sl.teachers.filter((t) => teacherIdStr(t) !== teacherId),
            }
          : sl
      )
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeCount   = shortlists.filter((sl) => !sl.isArchived).length;
  const archivedCount = shortlists.filter((sl) => sl.isArchived).length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookmarkCheck size={20} style={{ color: "var(--brand-primary)" }} />
            Shortlists
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeCount} active · {archivedCount} archived
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg shrink-0"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Plus size={16} />
          New Shortlist
        </button>
      </div>

      {/* Filter toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {([
          { value: "active",   label: `Active (${activeCount})`     },
          { value: "archived", label: `Archived (${archivedCount})` },
        ] as { value: ViewFilter; label: string }[]).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setViewFilter(value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              viewFilter === value
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={viewFilter === value ? { color: "var(--brand-primary)" } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-gray-300" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle size={30} className="text-red-400" />
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={loadAll}
            className="px-4 py-2 text-sm font-medium text-white rounded-xl"
            style={{ background: "var(--brand-gradient)" }}
          >
            Retry
          </button>
        </div>
      ) : filteredShortlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md"
            style={{ background: "var(--brand-gradient)" }}
          >
            <BookmarkCheck size={28} className="text-white" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {viewFilter === "active" ? "No shortlists yet" : "No archived shortlists"}
          </h3>
          <p className="text-sm text-gray-400 max-w-xs mb-4">
            {viewFilter === "active"
              ? "Create shortlists to organise promising candidates for your open positions."
              : "Archived shortlists will appear here."}
          </p>
          {viewFilter === "active" && (
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl hover:shadow-md transition-all"
              style={{ background: "var(--brand-gradient)" }}
            >
              <Plus size={15} />
              Create First Shortlist
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredShortlists.map((sl) => (
            <ShortlistCard
              key={sl._id}
              shortlist={sl}
              isExpanded={expandedIds.has(sl._id)}
              onToggleExpand={() => toggleExpand(sl._id)}
              onArchive={handleArchive}
              onDelete={setDeleteTarget}
              onTeacherRemoved={handleTeacherRemoved}
              onViewProfile={setProfileView}
            />
          ))}
        </div>
      )}

      {/* New shortlist modal */}
      {showNewModal && (
        <NewShortlistModal
          jobs={jobs}
          onClose={() => setShowNewModal(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          shortlistName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Profile view modal */}
      {profileView && (
        <ProfileViewModal
          candidate={profileView}
          onClose={() => setProfileView(null)}
        />
      )}
    </div>
  );
}
