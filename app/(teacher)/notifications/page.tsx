"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  BriefcaseIcon,
  Calendar,
  Award,
  CheckCircle2,
  Star,
  Info,
  Megaphone,
  Trash2,
  Check,
  ChevronRight,
  Filter,
  Loader2,
} from "lucide-react";
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/lib/api/teacher";
import type { Notification } from "@/lib/api/teacher";

// Map API notification types to UI display config
type UIType = "job_match" | "application_update" | "interview" | "offer" | "system" | "announcement";

function uiType(apiType: Notification["type"]): UIType {
  const map: Record<Notification["type"], UIType> = {
    job_match:            "job_match",
    application_status:   "application_update",
    interview_invitation: "interview",
    interview_reminder:   "interview",
    offer_received:       "offer",
    message:              "system",
    profile_status:       "system",
    system:               "system",
  };
  return map[apiType] ?? "system";
}

const TYPE_CONFIG: Record<UIType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  job_match: {
    label: "Job Match",
    icon: <Star className="w-4 h-4" />,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  application_update: {
    label: "Application",
    icon: <BriefcaseIcon className="w-4 h-4" />,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  interview: {
    label: "Interview",
    icon: <Calendar className="w-4 h-4" />,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  offer: {
    label: "Offer",
    icon: <Award className="w-4 h-4" />,
    color: "text-[#0D2542]",
    bg: "bg-[rgba(13,37,66,0.08)]",
  },
  system: {
    label: "System",
    icon: <Info className="w-4 h-4" />,
    color: "text-slate-600",
    bg: "bg-slate-100",
  },
  announcement: {
    label: "News",
    icon: <Megaphone className="w-4 h-4" />,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
};

const FILTER_OPTIONS: { value: UIType | "all"; label: string }[] = [
  { value: "all",                label: "All" },
  { value: "job_match",          label: "Job Matches" },
  { value: "application_update", label: "Applications" },
  { value: "interview",          label: "Interviews" },
  { value: "offer",              label: "Offers" },
  { value: "system",             label: "System" },
];

function timeAgo(isoStr: string): string {
  const secs = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (secs < 3600)   return `${Math.floor(secs / 60)} min ago`;
  if (secs < 86400)  return `${Math.floor(secs / 3600)} hours ago`;
  if (secs < 172800) return "Yesterday";
  return new Date(isoStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<UIType | "all">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await listNotifications({ limit: 50 });
      setNotifications(res.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotifications(); }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
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
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
              {unreadCount > 0 && (
                <span className="text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--brand-primary)" }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Stay updated on your applications and job matches</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-colors hover:bg-brand-primary-light"
              style={{ color: "var(--brand-primary)" }}
            >
              <Check className="w-4 h-4" /> Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {FILTER_OPTIONS.map((opt) => {
                const count = opt.value === "all" ? notifications.length : countByUIType(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border transition-colors ${
                      filter === opt.value
                        ? "text-white border-transparent"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    style={filter === opt.value ? { backgroundColor: "var(--brand-primary)" } : {}}
                  >
                    {opt.label}
                    <span className={`text-xs ${filter === opt.value ? "text-white/70" : "text-slate-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="ml-auto">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
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
              <p className="font-medium text-slate-500">No notifications</p>
              <p className="text-sm text-slate-400 mt-1">
                {showUnreadOnly ? "All caught up! No unread notifications." : "Nothing here yet."}
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

        {/* Notification Settings Teaser */}
        <div className="bg-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Notification Preferences</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Control which notifications you receive via email and WhatsApp
              </p>
            </div>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-xl transition-colors hover:opacity-90 shrink-0"
            style={{ background: "var(--brand-gradient)" }}
          >
            Manage
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Notification Item ─────────────────────────────────────────────────────────

function NotificationItem({
  notification: n,
  onRead,
  onDismiss,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const cfg = TYPE_CONFIG[uiType(n.type)];

  return (
    <div
      className={`flex items-start gap-4 p-4 hover:bg-slate-50/50 transition-colors cursor-pointer group relative ${
        !n.isRead ? "bg-blue-50/20" : ""
      }`}
      onClick={() => !n.isRead && onRead(n._id)}
    >
      {/* Unread bar */}
      {!n.isRead && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
          style={{ backgroundColor: "var(--brand-primary)" }}
        />
      )}

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0 mt-0.5`}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-semibold ${n.isRead ? "text-slate-700" : "text-slate-900"}`}>
                {n.title}
              </p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.color} font-medium`}>
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
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {!n.isRead && (
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={(e) => { e.stopPropagation(); onRead(n._id); }}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" /> Mark read
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
