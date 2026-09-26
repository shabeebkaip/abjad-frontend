"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
  ChevronLeft,
  Filter,
  Loader2,
  Settings,
  Search,
  X,
  RotateCcw,
} from "lucide-react";
import {
  listNotifications,
  markNotificationRead,
  markNotificationUnread,
  markAllNotificationsRead,
  deleteNotification,
} from "@/lib/api/teacher";
import type { Notification } from "@/lib/api/teacher";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatDate } from "@/lib/i18n/format";

// Map API notification types to UI display config (canonical keys — display
// text comes from tt.typeLabels / tt.filterLabels)
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

const TYPE_STYLE: Record<UIType, { icon: React.ReactNode; color: string; bg: string }> = {
  job_match:           { icon: <Star className="w-4 h-4" />,          color: "text-amber-600",       bg: "bg-amber-100" },
  application_update:  { icon: <BriefcaseIcon className="w-4 h-4" />, color: "text-blue-600",        bg: "bg-blue-100" },
  interview:           { icon: <Calendar className="w-4 h-4" />,      color: "text-purple-600",      bg: "bg-purple-100" },
  offer:               { icon: <Award className="w-4 h-4" />,         color: "text-[#0D2542]",       bg: "bg-[rgba(13,37,66,0.08)]" },
  system:              { icon: <Info className="w-4 h-4" />,          color: "text-slate-600",       bg: "bg-slate-100" },
  announcement:        { icon: <Megaphone className="w-4 h-4" />,     color: "text-emerald-600",     bg: "bg-emerald-100" },
};

const FILTER_VALUES: (UIType | "all")[] = ["all", "job_match", "application_update", "interview", "offer", "system"];

type TT = ReturnType<typeof useTranslation>["t"]["teacher"]["notifications"];

function timeAgo(isoStr: string, tt: TT, lang: "en" | "ar"): string {
  const secs = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (secs < 3600)   return tt.minAgo.replace("{n}", String(Math.floor(secs / 60)));
  if (secs < 86400)  return tt.hoursAgo.replace("{n}", String(Math.floor(secs / 3600)));
  if (secs < 172800) return tt.yesterday;
  return formatDate(isoStr, lang, { month: "short", day: "numeric", year: "numeric" });
}

export default function NotificationsPage() {
  const { t, lang, isRTL } = useTranslation();
  const tt = t.teacher.notifications;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<UIType | "all">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  // SRD 2.8.3 — case-insensitive search across title + body
  const [search, setSearch] = useState("");

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

  // SRD 2.8.3 — flip a notification back to unread
  const handleMarkUnread = async (id: string) => {
    try {
      await markNotificationUnread(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, isRead: false } : n));
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
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      if (!n.title.toLowerCase().includes(q) && !n.body.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const countByUIType = (t2: UIType) => notifications.filter((n) => uiType(n.type) === t2).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">{tt.title}</h1>
              {unreadCount > 0 && (
                <span className="text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--brand-primary)" }}>
                  {tt.newBadge.replace("{n}", String(unreadCount))}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{tt.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl transition-colors hover:bg-brand-primary-light"
                style={{ color: "var(--brand-primary)" }}
              >
                <Check className="w-4 h-4" /> {tt.markAllAsRead}
              </button>
            )}
            {/* SRD 2.8.2 — preferences link */}
            <Link
              href="/notifications/preferences"
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4" /> {tt.preferences}
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          {/* SRD 2.8.3 — title/body search */}
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tt.searchPlaceholder}
              className="w-full ps-9 pe-9 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-brand-primary transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-600"
                aria-label={tt.clearSearch}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Filter className="w-4 h-4" />
              <span className="font-medium">{tt.filterLabel}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {FILTER_VALUES.map((val) => {
                const count = val === "all" ? notifications.length : countByUIType(val);
                return (
                  <button
                    key={val}
                    onClick={() => setFilter(val)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border transition-colors ${
                      filter === val
                        ? "text-white border-transparent"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    style={filter === val ? { backgroundColor: "var(--brand-primary)" } : {}}
                  >
                    {tt.filterLabels[val]}
                    <span className={`text-xs ${filter === val ? "text-white/70" : "text-slate-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="ms-auto">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--brand-primary)" }}
                />
                {tt.unreadOnly}
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
              <p className="font-medium text-slate-500">{tt.emptyTitle}</p>
              <p className="text-sm text-slate-400 mt-1">
                {showUnreadOnly ? tt.emptyAllCaughtUp : tt.emptyNothingHere}
              </p>
              {showUnreadOnly && (
                <button
                  onClick={() => setShowUnreadOnly(false)}
                  className="mt-3 text-sm font-medium"
                  style={{ color: "var(--brand-primary)" }}
                >
                  {tt.showAllNotifications}
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
                  onUnread={handleMarkUnread}
                  onDismiss={handleDismiss}
                  tt={tt}
                  lang={lang}
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
              <p className="font-semibold text-white text-sm">{tt.teaserTitle}</p>
              <p className="text-slate-400 text-xs mt-0.5">{tt.teaserBody}</p>
            </div>
          </div>
          <Link
            href="/notifications/preferences"
            className="flex items-center gap-1.5 px-4 py-2 text-white text-sm font-medium rounded-xl transition-colors hover:opacity-90 shrink-0"
            style={{ background: "var(--brand-gradient)" }}
          >
            {tt.manage}
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Notification Item ─────────────────────────────────────────────────────────

function NotificationItem({
  notification: n,
  onRead,
  onUnread,
  onDismiss,
  tt,
  lang,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onUnread: (id: string) => void;
  onDismiss: (id: string) => void;
  tt: TT;
  lang: "en" | "ar";
}) {
  const type = uiType(n.type);
  const style = TYPE_STYLE[type];

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
          className="absolute start-0 top-0 bottom-0 w-1 rounded-e-full"
          style={{ backgroundColor: "var(--brand-primary)" }}
        />
      )}

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.color} flex items-center justify-center shrink-0 mt-0.5`}>
        {style.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-semibold ${n.isRead ? "text-slate-700" : "text-slate-900"}`}>
                {n.title}
              </p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${style.bg} ${style.color} font-medium`}>
                {tt.typeLabels[type]}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(n.createdAt, tt, lang)}</span>
            {/* SRD 2.8.3 — mark a read notification as unread */}
            {n.isRead && (
              <button
                onClick={(e) => { e.stopPropagation(); onUnread(n._id); }}
                className="p-1 text-slate-300 hover:text-slate-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all ms-1"
                title={tt.markUnread}
                aria-label={tt.markUnread}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss(n._id); }}
              className="p-1 text-slate-300 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all ms-1"
              title={tt.deleteLabel}
              aria-label={tt.deleteLabel}
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
              <CheckCircle2 className="w-3 h-3" /> {tt.markReadLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
