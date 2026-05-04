"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap, CheckCircle, XCircle, Eye,
  ChevronLeft, ChevronRight, Loader2, FileText,
} from "lucide-react";
import {
  listTeachers, approveTeacher, rejectTeacher,
  type TeacherProfile,
} from "@/lib/api/admin";

const STATUS_TABS = [
  { label: "All",      value: ""         },
  { label: "Pending",  value: "pending"  },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_BADGE: Record<string, string> = {
  draft:    "bg-slate-100 text-slate-600",
  pending:  "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  suspended:"bg-orange-100 text-orange-700",
};

function TeachersContent() {
  const searchParams = useSearchParams();
  const [tab, setTab]           = useState(searchParams.get("status") ?? "pending");
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);

  const [selected, setSelected]       = useState<TeacherProfile | null>(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [reason, setReason]           = useState("");
  const [notes, setNotes]             = useState("");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await listTeachers(tab || undefined, page);
      setTeachers(data.teachers);
      setTotal(data.total);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [tab, page]);

  const handleApprove = async (t: TeacherProfile) => {
    setSaving(true); setError("");
    try {
      await approveTeacher(t._id, notes);
      setSelected(null); setNotes("");
      load();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  };

  const handleReject = async () => {
    if (!reason.trim()) { setError("Rejection reason is required"); return; }
    if (!selected) return;
    setSaving(true); setError("");
    try {
      await rejectTeacher(selected._id, reason, notes);
      setSelected(null); setRejectModal(false); setReason(""); setNotes("");
      load();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Teacher Approval</h1>
      <p className="text-sm text-slate-500 mb-6">Review and approve teacher profiles</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        {STATUS_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => { setTab(value); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === value ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No teachers found</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Teacher</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Subject</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Completion</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Submitted</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {teachers.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {t.photoUrl ? (
                        <img src={t.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                          <GraduationCap size={14} className="text-purple-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-800">{t.personal?.fullName ?? "—"}</p>
                        <p className="text-xs text-slate-400">{t.personal?.city ?? ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">
                    {t.professional?.subjects?.slice(0, 2).join(", ") ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500"
                          style={{ width: `${t.completionPercentage}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">{t.completionPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[t.profileStatus] ?? ""}`}>
                      {t.profileStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">
                    {t.submittedAt ? new Date(t.submittedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => { setSelected(t); setNotes(t.adminNotes ?? ""); setError(""); }}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Eye size={13} /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
              <p className="text-xs text-slate-400">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
                  <ChevronLeft size={14} />
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review drawer */}
      {selected && !rejectModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="font-bold text-lg text-slate-900">Teacher Review</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>

            <div className="flex-1 p-6 space-y-5">
              <div className="flex items-center gap-4">
                {selected.photoUrl ? (
                  <img src={selected.photoUrl} alt="" className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
                    <GraduationCap size={24} className="text-purple-500" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900">{selected.personal?.fullName ?? "—"}</p>
                  <p className="text-sm text-slate-500">{selected.personal?.city ?? ""}</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[selected.profileStatus]}`}>
                    {selected.profileStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Subjects", selected.professional?.subjects?.join(", ")],
                  ["Grade Levels", selected.professional?.gradeLevels?.join(", ")],
                  ["Experience", selected.professional?.experienceYears != null ? `${selected.professional.experienceYears} yrs` : null],
                  ["Phone", selected.personal?.phone],
                  ["Completion", `${selected.completionPercentage}%`],
                  ["Submitted", selected.submittedAt ? new Date(selected.submittedAt).toLocaleDateString() : null],
                ].map(([label, value]) => value && (
                  <div key={label as string} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="font-medium text-slate-800 text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Resume */}
              {selected.resumeUrl && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-green-200 bg-green-50">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-green-600" />
                    <span className="text-sm font-medium text-slate-700">Resume / CV</span>
                  </div>
                  <a href={selected.resumeUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-600 font-medium hover:underline">
                    View
                  </a>
                </div>
              )}

              {selected.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-red-700 mb-1">Previous Rejection Reason</p>
                  <p className="text-sm text-red-600">{selected.rejectionReason}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Admin Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Internal notes..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            {selected.profileStatus !== "approved" && (
              <div className="p-6 border-t border-slate-100 flex gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => { setRejectModal(true); setError(""); }}
                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  <XCircle size={16} /> Reject
                </button>
                <button
                  onClick={() => handleApprove(selected)}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-white text-sm font-semibold disabled:opacity-50"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Approve Teacher
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Reject modal */}
      {rejectModal && selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="font-bold text-slate-900 mb-4">Reject Teacher</h3>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={4}
                placeholder="Explain why the teacher profile is being rejected..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-none mb-3"
              />
              {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setRejectModal(false)}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={saving}
                  className="flex-1 h-10 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminTeachersPage() {
  return <Suspense><TeachersContent /></Suspense>;
}
