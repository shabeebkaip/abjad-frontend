"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, Plus, Loader2, AlertCircle, X, Trash2,
  ChevronDown, Shield, Eye, Briefcase, Mic2,
  CheckCircle2,
} from "lucide-react";
import {
  listTeam,
  addTeamMember,
  updateTeamRole,
  removeTeamMember,
} from "@/lib/api/school";
import type { TeamMember } from "@/lib/api/school";

// ─── Constants ────────────────────────────────────────────────────────────────

type Role = "admin" | "recruiter" | "interviewer" | "viewer";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "admin",       label: "Admin"       },
  { value: "recruiter",   label: "Recruiter"   },
  { value: "interviewer", label: "Interviewer" },
  { value: "viewer",      label: "Viewer"      },
];

const ROLE_INFO: Record<Role, { label: string; description: string; badgeCls: string; Icon: React.ElementType }> = {
  admin: {
    label:       "Admin",
    description: "Full access — manage team, all features including billing and settings.",
    badgeCls:    "bg-slate-800 text-white",
    Icon:        Shield,
  },
  recruiter: {
    label:       "Recruiter",
    description: "Post jobs, manage applications, schedule interviews, extend offers.",
    badgeCls:    "bg-blue-100 text-blue-700",
    Icon:        Briefcase,
  },
  interviewer: {
    label:       "Interviewer",
    description: "View candidate profiles, complete interview feedback forms.",
    badgeCls:    "bg-purple-100 text-purple-700",
    Icon:        Mic2,
  },
  viewer: {
    label:       "Viewer",
    description: "Read-only access to all platform data. Cannot take any actions.",
    badgeCls:    "bg-slate-100 text-slate-600",
    Icon:        Eye,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Role }) {
  const info = ROLE_INFO[role];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${info.badgeCls}`}>
      <info.Icon size={10} />
      {info.label}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TeamMember["status"] }) {
  return status === "active" ? (
    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Active</span>
  ) : (
    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Inactive</span>
  );
}

// ─── Add Member Modal ─────────────────────────────────────────────────────────

interface AddMemberModalProps {
  onClose: () => void;
  onAdded: (member: TeamMember) => void;
}

function AddMemberModal({ onClose, onAdded }: AddMemberModalProps) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole]   = useState<Role>("recruiter");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim())  { setError("Name is required."); return; }
    if (!email.trim()) { setError("Email is required."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { setError("Please enter a valid email address."); return; }
    setSaving(true);
    setError(null);
    try {
      const member = await addTeamMember({ name: name.trim(), email: email.trim(), role });
      onAdded(member);
      onClose();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to add team member.");
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
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--brand-gradient)" }}
            >
              <Plus size={18} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Add Team Member</h3>
          </div>
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
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sara Al-Rashidi"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sara@school.edu.sa"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Role</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full appearance-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-9"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              >
                {ROLE_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {/* Role description */}
            <p className="text-xs text-gray-400 mt-1.5">{ROLE_INFO[role].description}</p>
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
            disabled={saving || !name.trim() || !email.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Remove Confirm Modal ─────────────────────────────────────────────────────

interface RemoveConfirmProps {
  memberName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function RemoveConfirmModal({ memberName, onClose, onConfirm }: RemoveConfirmProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(); } finally { setLoading(false); }
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
            <h3 className="text-base font-bold text-gray-900">Remove Member</h3>
            <p className="text-xs text-gray-500">This will revoke platform access.</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to remove{" "}
          <span className="font-semibold text-gray-900">{memberName}</span> from the team?
          They will lose access immediately.
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
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Role Select Inline ───────────────────────────────────────────────────────

function RoleSelect({ memberId, currentRole, onUpdated }: {
  memberId: string;
  currentRole: Role;
  onUpdated: (id: string, role: Role) => void;
}) {
  const [updating, setUpdating] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    setUpdating(true);
    try {
      await updateTeamRole(memberId, newRole);
      onUpdated(memberId, newRole);
    } catch {
      // silently fail
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative">
      <select
        value={currentRole}
        onChange={handleChange}
        disabled={updating}
        className="appearance-none text-xs font-medium border border-gray-200 rounded-lg px-2.5 py-1.5 pr-6 bg-white focus:outline-none focus:ring-2 focus:border-transparent transition disabled:opacity-60 cursor-pointer"
        style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
      >
        {ROLE_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      {updating ? (
        <Loader2 size={11} className="animate-spin absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      ) : (
        <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      )}
    </div>
  );
}

// ─── Role Permissions Info ────────────────────────────────────────────────────

function RolePermissionsSection() {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-bold text-gray-800 mb-3">Role Permissions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {(Object.entries(ROLE_INFO) as [Role, typeof ROLE_INFO[Role]][]).map(([role, info]) => (
          <div key={role} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  role === "admin" ? "" : "bg-gray-100"
                }`}
                style={role === "admin" ? { background: "var(--brand-gradient)" } : {}}
              >
                <info.Icon size={15} className={role === "admin" ? "text-white" : "text-gray-500"} />
              </div>
              <RoleBadge role={role} />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{info.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [members, setMembers]       = useState<TeamMember[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [removeTarget, setRemoveTarget]   = useState<TeamMember | null>(null);

  const loadTeam = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listTeam();
      setMembers(res ?? []);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to load team members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTeam(); }, [loadTeam]);

  const handleAdded = (member: TeamMember) => {
    setMembers((prev) => [...prev, member]);
  };

  const handleRoleUpdated = (id: string, role: Role) => {
    setMembers((prev) =>
      prev.map((m) => (m._id === id ? { ...m, role } : m))
    );
  };

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;
    await removeTeamMember(removeTarget._id);
    setMembers((prev) => prev.filter((m) => m._id !== removeTarget._id));
    setRemoveTarget(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={20} style={{ color: "var(--brand-primary)" }} />
            Team Members
            {!loading && (
              <span
                className="text-sm font-semibold px-2.5 py-0.5 rounded-full text-white"
                style={{ background: "var(--brand-gradient)" }}
              >
                {members.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage who has access to your school's hiring platform</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg shrink-0"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Plus size={16} />
          Add Member
        </button>
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
            onClick={loadTeam}
            className="px-4 py-2 text-sm font-medium text-white rounded-xl"
            style={{ background: "var(--brand-gradient)" }}
          >
            Retry
          </button>
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md"
            style={{ background: "var(--brand-gradient)" }}
          >
            <Users size={28} className="text-white" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No team members yet</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-4">
            Invite colleagues to collaborate on hiring.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl hover:shadow-md transition-all"
            style={{ background: "var(--brand-gradient)" }}
          >
            <Plus size={15} />
            Add First Member
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">Member</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Joined</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, idx) => (
                  <tr
                    key={m._id}
                    className={`hover:bg-gray-50/50 transition-colors ${
                      idx < members.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    {/* Member */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ background: "var(--brand-gradient)" }}
                        >
                          {m.name[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                          <p className="text-xs text-gray-400">{m.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">
                      <RoleSelect
                        memberId={m._id}
                        currentRole={m.role}
                        onUpdated={handleRoleUpdated}
                      />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={m.status} />
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-gray-400">{formatDate(m.joinedAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setRemoveTarget(m)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {members.map((m) => (
              <div key={m._id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                      style={{ background: "var(--brand-gradient)" }}
                    >
                      {m.name[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setRemoveTarget(m)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <RoleSelect
                    memberId={m._id}
                    currentRole={m.role}
                    onUpdated={handleRoleUpdated}
                  />
                  <StatusBadge status={m.status} />
                  <span className="text-xs text-gray-400">Joined {formatDate(m.joinedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Role permissions info */}
      {!loading && !error && <RolePermissionsSection />}

      {/* Add member modal */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleAdded}
        />
      )}

      {/* Remove confirm modal */}
      {removeTarget && (
        <RemoveConfirmModal
          memberName={removeTarget.name}
          onClose={() => setRemoveTarget(null)}
          onConfirm={handleRemoveConfirm}
        />
      )}
    </div>
  );
}
