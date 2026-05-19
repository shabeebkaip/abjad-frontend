"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell, FileText, Calendar, Award, MessageSquare,
  Building2, Info, Trash2, Check, Filter, Loader2,
  CheckCircle2, ChevronRight, RefreshCw,
} from "lucide-react";
import {
  listSchoolNotifications,
  markSchoolNotificationRead,
  markAllSchoolNotificationsRead,
  deleteSchoolNotification,
} from "@/lib/api/school";
import type { SchoolNotification } from "@/lib/api/school";

// ─── Type mapping ──────────────────────────────────────────────────────────────

type UIType = "applications" | "interviews" | "offers" | "messages" | "account" | "system";

function uiType(apiType: SchoolNotification["type"]): UIType {
  const map: Record<SchoolNotification["type"], UIType> = {
    application_status:   "applications",
    interview_invitation: "interviews",
    interview_reminder:   "interviews",
    offer_received:       "offers",
    message:              "messages",
    profile_status:       "account",
    system:               "system",
  };
  return map[apiType] ?? "system";
}

const TYPE_CONFIG: Record<UIType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  applications: {
    label: "Applications",
    icon: <FileText className="w-4 h-4" />,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  interviews: {
    label: "Interviews",
    icon: <Calendar className="w-4 h-4" />,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  offers: {
    label: "Offers",
    icon: <Award className="w-4 h-4" />,
    color: "text-teal-600",
    bg: "bg-teal-100",
  },
  messages: {
    label: "Messages",
    icon: <MessageSquare className="w-4 h-4" />,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  account: {
    label: "Account",
    icon: <Building2 className="w-4 h-4" />,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  system: {
    label: "System",
    icon: <Info className="w-4 h-4" />,
    color: "text-slate-600",
    bg: "bg-slate-100",
  },
};

const FILTER_OPTIONS: { value: UIType | "all"; label: string }[] = [
  { value: "all",          label: "All"          },
  { value: "applications", label: "Applications" },
  { value: "interviews",   label: "Interviews"   },
  { value: "offers",       label: "Offers"       },
  { value: "messages",     label: "Messages"     },
  { value: "account",      label: "Account"      },
  { value: "system",       label: "System"       },
];

function timeAgo(isoStr: string): string {
  const secs = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (secs < 60)     return "Just now";
  if (secs < 3600)   return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400)  return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 172800) return "Yesterday";
  return new Date(isoStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SchoolNotificationsPage() {
  const [notifications, setNotifications] = useState<SchoolNotification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState<UIType | "all">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listSchoolNotifications({ limit: 50 });
      setNotifications(res.notifications ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await markAllSchoolNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) { console.error(err); }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markSchoolNotificationRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) { console.error(err); }
  };

  const handleDismiss = async (id: string) => {
    try {
      await deleteSchoolNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) { console.error(err); }
  };

  const filtered = notifications.filter((n) => {
    if (showUnreadOnly && n.isRead) return false;
    if (filter !== "all" && uiType(n.type) !== filter) return false;
    return true;
  });

  const countByUIType = (t: UIType) => notifications.filter((n) => uiType(n.type) === t).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
              {unreadCount > 0 && (
                <span
                  className="text-white text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Stay updated on applications, interviews, and hiring activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-colors"
                style={{ color: "var(--brand-primary)" }}
              >
                <Check className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-slate-500 shrink-0">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {FILTER_OPTIONS.map((opt) => {
                const count = opt.value === "all"
                  ? notifications.length
                  : countByUIType(opt.value);
                const active = filter === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border transition-colors ${
                      active ? "text-white border-transparent" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    style={active ? { backgroundColor: "var(--brand-primary)" } : {}}
                  >
                    {opt.label}
                    <span className={`text-[10px] font-semibold ${active ? "text-white/70" : "text-slate-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: "var(--brand-primary)" }}
              />
              Unread only
            </label>
          </div>
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-7 h-7 text-slate-300" />
              </div>
              <p className="font-semibold text-slate-500">
                {showUnreadOnly ? "All caught up!" : "No notifications yet"}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {showUnreadOnly
                  ? "No unread notifications at the moment."
                  : "Notifications about applications, interviews, and offers will appear here."}
              </p>
              {showUnreadOnly && (
                <button
                  onClick={() => setShowUnreadOnly(false)}
                  className="mt-3 text-sm font-medium"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Show all notifications
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((notif) => (
                <NotificationItem
                  key={notif._id}
                  notification={notif}
                  onRead={handleMarkRead}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}
        </div>

        {/* Settings teaser */}
        <div className="rounded-2xl p-5 flex items-center justify-between gap-4" style={{ background: "var(--brand-gradient)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Notification Preferences</p>
              <p className="text-white/60 text-xs mt-0.5">
                Control which updates you receive via email and WhatsApp
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-xl transition-colors shrink-0">
            Manage <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Notification Item ─────────────────────────────────────────────────────────

function NotificationItem({
  notification: n,
  onRead,
  onDismiss,
}: {
  notification: SchoolNotification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const cfg = TYPE_CONFIG[uiType(n.type)];

  return (
    <div
      className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors cursor-pointer group relative ${
        !n.isRead ? "bg-blue-50/20" : ""
      }`}
      onClick={() => !n.isRead && onRead(n._id)}
    >
      {/* Unread indicator */}
      {!n.isRead && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full"
          style={{ backgroundColor: "var(--brand-primary)" }}
        />
      )}

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg} ${cfg.color}`}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`text-sm font-semibold ${n.isRead ? "text-slate-700" : "text-slate-900"}`}>
                {n.title}
              </p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${cfg.bg} ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(n.createdAt)}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss(n._id); }}
              className="p-1 text-slate-300 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all ml-1"
              title="Dismiss"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {!n.isRead && (
          <button
            onClick={(e) => { e.stopPropagation(); onRead(n._id); }}
            className="mt-1.5 text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" /> Mark as read
          </button>
        )}
      </div>
    </div>
  );
}
