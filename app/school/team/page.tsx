"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, Plus, Loader2, AlertCircle, X, Trash2,
  ChevronDown, Shield, Eye, Briefcase, Mic2,
} from "lucide-react";
import {
  listTeam,
  addTeamMember,
  updateTeamRole,
  removeTeamMember,
} from "@/lib/api/school";
import type { TeamMember } from "@/lib/api/school";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatDate as formatDateIntl, type Locale } from "@/lib/i18n/format";

// ─── Constants ────────────────────────────────────────────────────────────────

type Role = "admin" | "recruiter" | "interviewer" | "viewer";

const ROLE_ORDER: Role[] = ["admin", "recruiter", "interviewer", "viewer"];

const ROLE_ICONS: Record<Role, React.ElementType> = {
  admin: Shield,
  recruiter: Briefcase,
  interviewer: Mic2,
  viewer: Eye,
};

const ROLE_BADGE_CLS: Record<Role, string> = {
  admin: "bg-slate-800 text-white",
  recruiter: "bg-blue-100 text-blue-700",
  interviewer: "bg-purple-100 text-purple-700",
  viewer: "bg-slate-100 text-slate-600",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatJoinedDate(isoStr: string, locale: Locale): string {
  return formatDateIntl(isoStr, locale, { month: "short", day: "numeric", year: "numeric" });
}

// ─── Role Badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: Role }) {
  const { t } = useTranslation();
  const Icon = ROLE_ICONS[role];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${ROLE_BADGE_CLS[role]}`}>
      <Icon size={10} />
      {t.school.team.roleOptions[role]}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TeamMember["status"] }) {
  const { t } = useTranslation();
  return status === "active" ? (
    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{t.school.team.statusActive}</span>
  ) : (
    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{t.school.team.statusInactive}</span>
  );
}

// ─── Add Member Modal ─────────────────────────────────────────────────────────

interface AddMemberModalProps {
  onClose: () => void;
  onAdded: (member: TeamMember) => void;
}

function AddMemberModal({ onClose, onAdded }: AddMemberModalProps) {
  const { t } = useTranslation();
  const tt = t.school.team;
  const common = t.school.common;
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole]   = useState<Role>("recruiter");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim())  { setError(tt.nameRequiredError); return; }
    if (!email.trim()) { setError(tt.emailRequiredError); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { setError(tt.emailInvalidError); return; }
    setSaving(true);
    setError(null);
    try {
      const member = await addTeamMember({ name: name.trim(), email: email.trim(), role });
      onAdded(member);
      onClose();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? tt.createFailedFallback);
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
            <h3 className="text-base font-bold text-gray-900">{tt.addModalTitle}</h3>
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
              {tt.fullNameLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tt.fullNamePlaceholder}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              {tt.emailLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tt.emailPlaceholder}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.roleLabel}</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full appearance-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pe-9"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              >
                {ROLE_ORDER.map((r) => (
                  <option key={r} value={r}>{tt.roleOptions[r]}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {/* Role description */}
            <p className="text-xs text-gray-400 mt-1.5">{tt.roleDescriptions[role]}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {common.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !name.trim() || !email.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : tt.addButton}
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
  const { t } = useTranslation();
  const tt = t.school.team;
  const common = t.school.common;
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(); } finally { setLoading(false); }
  };

  const [before, after] = tt.removeConfirmBodyTemplate.split("{name}");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{tt.removeModalTitle}</h3>
            <p className="text-xs text-gray-500">{tt.removeModalSubtitle}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          {before}
          <span className="font-semibold text-gray-900">{memberName}</span>
          {after}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {common.cancel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : tt.removeButton}
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
  const { t } = useTranslation();
  const tt = t.school.team;
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
        className="appearance-none text-xs font-medium border border-gray-200 rounded-lg px-2.5 py-1.5 pe-6 bg-white focus:outline-none focus:ring-2 focus:border-transparent transition disabled:opacity-60 cursor-pointer"
        style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
      >
        {ROLE_ORDER.map((r) => (
          <option key={r} value={r}>{tt.roleOptions[r]}</option>
        ))}
      </select>
      {updating ? (
        <Loader2 size={11} className="animate-spin absolute end-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      ) : (
        <ChevronDown size={11} className="absolute end-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      )}
    </div>
  );
}

// ─── Role Permissions Info ────────────────────────────────────────────────────

function RolePermissionsSection() {
  const { t } = useTranslation();
  const tt = t.school.team;
  return (
    <div className="mt-8">
      <h2 className="text-sm font-bold text-gray-800 mb-3">{tt.rolePermissionsTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {ROLE_ORDER.map((role) => {
          const Icon = ROLE_ICONS[role];
          return (
            <div key={role} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    role === "admin" ? "" : "bg-gray-100"
                  }`}
                  style={role === "admin" ? { background: "var(--brand-gradient)" } : {}}
                >
                  <Icon size={15} className={role === "admin" ? "text-white" : "text-gray-500"} />
                </div>
                <RoleBadge role={role} />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{tt.roleDescriptions[role]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const { t, lang } = useTranslation();
  const tt = t.school.team;
  const common = t.school.common;
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
      setError((e as Error)?.message ?? tt.loadFailedFallback);
    } finally {
      setLoading(false);
    }
  }, [tt.loadFailedFallback]);

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
            {t.school.layout.navTeam}
            {!loading && (
              <span
                className="text-sm font-semibold px-2.5 py-0.5 rounded-full text-white"
                style={{ background: "var(--brand-gradient)" }}
              >
                {members.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{tt.pageSubtitle}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg shrink-0"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Plus size={16} />
          {tt.addMemberButton}
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
            {common.retry}
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
          <h3 className="text-base font-bold text-gray-900 mb-1">{tt.emptyTitle}</h3>
          <p className="text-sm text-gray-400 max-w-xs mb-4">
            {tt.emptyBody}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl hover:shadow-md transition-all"
            style={{ background: "var(--brand-gradient)" }}
          >
            <Plus size={15} />
            {tt.addFirstButton}
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-start text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{tt.tableMemberHeader}</th>
                  <th className="text-start text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">{tt.tableRoleHeader}</th>
                  <th className="text-start text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">{tt.tableStatusHeader}</th>
                  <th className="text-start text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">{tt.tableJoinedHeader}</th>
                  <th className="text-start text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3.5">{tt.tableActionsHeader}</th>
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
                      <span className="text-xs text-gray-400">{formatJoinedDate(m.joinedAt, lang)}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setRemoveTarget(m)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title={tt.removeMemberTitle}
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
                  <span className="text-xs text-gray-400">{tt.joinedPrefixTemplate.replace("{date}", formatJoinedDate(m.joinedAt, lang))}</span>
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
