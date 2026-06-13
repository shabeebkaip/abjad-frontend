"use client";

// SRD 2.8.2 — Notification Preferences page.
// - Channel toggles: email, browser push, sound
// - Per-type opt-out for all 8 notification types
// Saves are debounced via a single Save button so users can preview their
// changes before committing.

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Loader2, Mail, BellRing, Volume2,
  Briefcase, FileText, Calendar, Clock, Award, MessageSquare, User, AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
  type NotificationTypeKey,
} from "@/lib/api/teacher";

const TYPE_META: Array<{ key: NotificationTypeKey; label: string; description: string; icon: React.ReactNode }> = [
  { key: "job_match",            label: "Job Matches",          description: "New roles that match your profile",                       icon: <Briefcase size={16} /> },
  { key: "application_status",   label: "Application Updates",  description: "When the status of one of your applications changes",     icon: <FileText size={16} /> },
  { key: "interview_invitation", label: "Interview Invitations", description: "When a school invites you to an interview",              icon: <Calendar size={16} /> },
  { key: "interview_reminder",   label: "Interview Reminders",  description: "24-hour and 1-hour reminders before scheduled interviews", icon: <Clock size={16} /> },
  { key: "offer_received",       label: "Offers",               description: "When a school extends or updates an offer",                icon: <Award size={16} /> },
  { key: "message",              label: "Messages",             description: "Direct messages from schools or Abjad",                    icon: <MessageSquare size={16} /> },
  { key: "profile_status",       label: "Profile Status",       description: "Approval, rejection, or verification updates on your profile", icon: <User size={16} /> },
  { key: "system",               label: "System Announcements", description: "Important platform updates and policy changes",           icon: <AlertCircle size={16} /> },
];

export default function NotificationPreferencesPage() {
  const [prefs, setPrefs]     = useState<NotificationPreferences | null>(null);
  const [draft, setDraft]     = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotificationPreferences();
      setPrefs(data);
      setDraft(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load preferences");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-dismiss the "Saved" indicator after a few seconds
  useEffect(() => {
    if (!savedAt) return;
    const t = setTimeout(() => setSavedAt(null), 2500);
    return () => clearTimeout(t);
  }, [savedAt]);

  const isDirty = useMemo(() => {
    if (!prefs || !draft) return false;
    return JSON.stringify(prefs) !== JSON.stringify(draft);
  }, [prefs, draft]);

  const setChannel = (key: "emailNotificationsEnabled" | "pushNotificationsEnabled" | "soundEnabled", value: boolean) => {
    setDraft((d) => d ? { ...d, [key]: value } : d);
  };

  const setType = (key: NotificationTypeKey, value: boolean) => {
    setDraft((d) => d ? {
      ...d,
      notificationPreferences: { ...d.notificationPreferences, [key]: value },
    } : d);
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateNotificationPreferences(draft);
      setPrefs(updated);
      setDraft(updated);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (prefs) setDraft(prefs);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/notifications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors mb-3"
        >
          <ArrowLeft size={12} /> Back to Notifications
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Notification Preferences</h1>
        <p className="text-sm text-slate-500 mt-1">
          Choose which notifications you receive and how you receive them.
        </p>
      </div>

      {loading || !draft ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Channels */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Delivery channels</h2>
            <p className="text-xs text-slate-500 mb-5">How should we deliver enabled notifications to you?</p>

            <div className="space-y-3">
              <ToggleRow
                icon={<Mail size={16} className="text-blue-500" />}
                title="Email"
                description="Send a copy of important notifications to your email."
                checked={draft.emailNotificationsEnabled}
                onChange={(v) => setChannel("emailNotificationsEnabled", v)}
              />
              <ToggleRow
                icon={<BellRing size={16} className="text-violet-500" />}
                title="Browser Push"
                description="Show notifications in this browser even when the tab is closed (requires permission)."
                checked={draft.pushNotificationsEnabled}
                onChange={(v) => setChannel("pushNotificationsEnabled", v)}
              />
              <ToggleRow
                icon={<Volume2 size={16} className="text-emerald-500" />}
                title="Sound"
                description="Play a soft chime when new notifications arrive."
                checked={draft.soundEnabled}
                onChange={(v) => setChannel("soundEnabled", v)}
              />
            </div>
          </section>

          {/* Per-type */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">Notification types</h2>
            <p className="text-xs text-slate-500 mb-5">Turn off categories you don't want to see at all.</p>

            <div className="divide-y divide-slate-100">
              {TYPE_META.map((t) => (
                <ToggleRow
                  key={t.key}
                  icon={<span className="text-slate-400">{t.icon}</span>}
                  title={t.label}
                  description={t.description}
                  checked={draft.notificationPreferences[t.key]}
                  onChange={(v) => setType(t.key, v)}
                  borderless
                />
              ))}
            </div>
          </section>

          {/* Save bar */}
          <div className="sticky bottom-4 z-10 bg-white rounded-2xl border border-slate-200 shadow-md p-4 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              {error ? (
                <span className="text-red-600 flex items-center gap-1.5">
                  <AlertCircle size={13} /> {error}
                </span>
              ) : savedAt ? (
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Saved
                </span>
              ) : isDirty ? (
                <span>You have unsaved changes.</span>
              ) : (
                <span>All changes saved.</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                disabled={!isDirty || saving}
                className="px-3 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                style={{ background: "var(--brand-gradient)" }}
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : null}
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({ icon, title, description, checked, onChange, borderless }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  borderless?: boolean;
}) {
  return (
    <label className={`flex items-start justify-between gap-3 cursor-pointer ${borderless ? "py-3" : "p-3 rounded-xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50"}`}>
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </label>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`shrink-0 relative inline-flex h-6 w-11 items-center rounded-full transition-colors mt-0.5 ${
        checked ? "" : "bg-slate-200"
      }`}
      style={checked ? { background: "var(--brand-gradient)" } : undefined}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
