"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2, CheckCircle, XCircle, Clock, Eye,
  FileText, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import {
  listSchools, approveSchool, rejectSchool,
  type SchoolProfile,
} from "@/lib/api/admin";

const STATUS_TABS = [
  { label: "All",      value: ""         },
  { label: "Pending",  value: "pending"  },
  { label: "Verified", value: "verified" },
  { label: "Rejected", value: "rejected" },
];

const STATUS_BADGE: Record<string, string> = {
  draft:    "bg-slate-100 text-slate-600",
  pending:  "bg-amber-100 text-amber-700",
  verified: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  suspended:"bg-orange-100 text-orange-700",
};

function SchoolsContent() {
  const searchParams = useSearchParams();
  const [tab, setTab]         = useState(searchParams.get("status") ?? "pending");
  const [schools, setSchools] = useState<SchoolProfile[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);

  // Detail / action modal
  const [selected, setSelected]       = useState<SchoolProfile | null>(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [reason, setReason]           = useState("");
  const [notes, setNotes]             = useState("");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await listSchools(tab || undefined, page);
      setSchools(data.schools);
      setTotal(data.total);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [tab, page]);

  const handleApprove = async (s: SchoolProfile) => {
    setSaving(true); setError("");
    try {
      await approveSchool(s._id, notes);
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
      await rejectSchool(selected._id, reason, notes);
      setSelected(null); setRejectModal(false); setReason(""); setNotes("");
      load();
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">School Verification</h1>
      <p className="text-sm text-slate-500 mb-6">Review and verify school profiles</p>

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

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : schools.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No schools found</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">School</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">City</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Completion</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Submitted</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {schools.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {s.logoUrl ? (
                        <img src={s.logoUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Building2 size={14} className="text-blue-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-800">{s.nameEn ?? s.nameAr ?? "—"}</p>
                        <p className="text-xs text-slate-400">{s.type ?? ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{s.city ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${s.completionPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{s.completionPercentage}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[s.profileStatus] ?? ""}`}>
                      {s.profileStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">
                    {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => { setSelected(s); setNotes(s.adminNotes ?? ""); setError(""); }}
                      className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Eye size={13} /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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

      {/* Review modal */}
      {selected && !rejectModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="font-bold text-lg text-slate-900">School Review</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>

            <div className="flex-1 p-6 space-y-5">
              {/* Header info */}
              <div className="flex items-center gap-4">
                {selected.logoUrl ? (
                  <img src={selected.logoUrl} alt="" className="w-14 h-14 rounded-xl object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Building2 size={24} className="text-blue-500" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900">{selected.nameEn ?? selected.nameAr ?? "Unnamed"}</p>
                  <p className="text-sm text-slate-500">{selected.nameAr ?? ""}</p>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[selected.profileStatus]}`}>
                    {selected.profileStatus}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Type", selected.type],
                  ["City", selected.city],
                  ["Completion", `${selected.completionPercentage}%`],
                  ["Submitted", selected.submittedAt ? new Date(selected.submittedAt).toLocaleDateString() : "—"],
                  ["Admin Contact", selected.adminContact?.name],
                  ["Contact Phone", selected.adminContact?.phone],
                ].map(([label, value]) => value && (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="font-medium text-slate-800">{value}</p>
                  </div>
                ))}
              </div>

              {/* Documents */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Verification Documents</p>
                <div className="space-y-2">
                  {[
                    ["Commercial Registration", selected.documents?.commercialRegistration],
                    ["Ministry License", selected.documents?.ministryLicense],
                  ].map(([label, doc]: any) => (
                    <div key={label} className={`flex items-center justify-between p-3 rounded-xl border ${doc?.url ? "border-green-200 bg-green-50" : "border-slate-200 bg-slate-50"}`}>
                      <div className="flex items-center gap-2">
                        <FileText size={14} className={doc?.url ? "text-green-600" : "text-slate-400"} />
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                      </div>
                      {doc?.url ? (
                        <a href={doc.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-600 font-medium hover:underline">
                          View PDF
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">Not uploaded</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection reason if exists */}
              {selected.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-red-700 mb-1">Previous Rejection Reason</p>
                  <p className="text-sm text-red-600">{selected.rejectionReason}</p>
                </div>
              )}

              {/* Admin notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Admin Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Internal notes visible only to admin team..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            {/* Actions */}
            {selected.profileStatus !== "verified" && (
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
                  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  Verify School
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Reject reason modal */}
      {rejectModal && selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="font-bold text-slate-900 mb-4">Reject School</h3>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={4}
                placeholder="Explain why the school profile is being rejected..."
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

export default function AdminSchoolsPage() {
  return <Suspense><SchoolsContent /></Suspense>;
}
