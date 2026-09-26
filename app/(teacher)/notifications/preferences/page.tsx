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
import { useTranslation } from "@/lib/i18n/useTranslation";

const TYPE_ICONS: Record<NotificationTypeKey, React.ReactNode> = {
  job_match:            <Briefcase size={16} />,
  application_status:   <FileText size={16} />,
  interview_invitation: <Calendar size={16} />,
  interview_reminder:   <Clock size={16} />,
  offer_received:       <Award size={16} />,
  message:              <MessageSquare size={16} />,
  profile_status:       <User size={16} />,
  system:               <AlertCircle size={16} />,
};

const TYPE_ORDER: NotificationTypeKey[] = [
  "job_match", "application_status", "interview_invitation", "interview_reminder",
  "offer_received", "message", "profile_status", "system",
];

export default function NotificationPreferencesPage() {
  const { t } = useTranslation();
  const tt = t.teacher.notificationPrefs;

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
      setError(err instanceof Error ? err.message : tt.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [tt.loadFailed]);

  useEffect(() => { load(); }, [load]);

  // Auto-dismiss the "Saved" indicator after a few seconds
  useEffect(() => {
    if (!savedAt) return;
    const timer = setTimeout(() => setSavedAt(null), 2500);
    return () => clearTimeout(timer);
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
      setError(err instanceof Error ? err.message : tt.saveFailed);
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
          <ArrowLeft size={12} className="rtl:rotate-180" /> {tt.backToNotifications}
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">{tt.title}</h1>
        <p className="text-sm text-slate-500 mt-1">{tt.subtitle}</p>
      </div>

      {loading || !draft ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Channels */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">{tt.channelsTitle}</h2>
            <p className="text-xs text-slate-500 mb-5">{tt.channelsSubtitle}</p>

            <div className="space-y-3">
              <ToggleRow
                icon={<Mail size={16} className="text-blue-500" />}
                title={tt.emailTitle}
                description={tt.emailDescription}
                checked={draft.emailNotificationsEnabled}
                onChange={(v) => setChannel("emailNotificationsEnabled", v)}
              />
              <ToggleRow
                icon={<BellRing size={16} className="text-violet-500" />}
                title={tt.pushTitle}
                description={tt.pushDescription}
                checked={draft.pushNotificationsEnabled}
                onChange={(v) => setChannel("pushNotificationsEnabled", v)}
              />
              <ToggleRow
                icon={<Volume2 size={16} className="text-emerald-500" />}
                title={tt.soundTitle}
                description={tt.soundDescription}
                checked={draft.soundEnabled}
                onChange={(v) => setChannel("soundEnabled", v)}
              />
            </div>
          </section>

          {/* Per-type */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">{tt.typesTitle}</h2>
            <p className="text-xs text-slate-500 mb-5">{tt.typesSubtitle}</p>

            <div className="divide-y divide-slate-100">
              {TYPE_ORDER.map((key) => (
                <ToggleRow
                  key={key}
                  icon={<span className="text-slate-400">{TYPE_ICONS[key]}</span>}
                  title={tt.typeLabels[key].label}
                  description={tt.typeLabels[key].description}
                  checked={draft.notificationPreferences[key]}
                  onChange={(v) => setType(key, v)}
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
                  <CheckCircle2 size={13} /> {tt.saved}
                </span>
              ) : isDirty ? (
                <span>{tt.unsavedChanges}</span>
              ) : (
                <span>{tt.allSaved}</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                disabled={!isDirty || saving}
                className="px-3 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {tt.reset}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty || saving}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                style={{ background: "var(--brand-gradient)" }}
              >
                {saving ? <Loader2 size={12} className="animate-spin" /> : null}
                {tt.saveChanges}
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
          checked ? "translate-x-6 rtl:-translate-x-6" : "translate-x-1 rtl:-translate-x-1"
        }`}
      />
    </button>
  );
}
