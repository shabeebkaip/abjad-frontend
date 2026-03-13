"use client";

import { useState } from "react";
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
} from "lucide-react";

type NotificationType =
  | "job_match"
  | "application_update"
  | "interview"
  | "offer"
  | "system"
  | "announcement";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  actionLabel?: string;
  actionHref?: string;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
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
    color: "text-cyan-600",
    bg: "bg-cyan-100",
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

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "offer",
    title: "Offer Letter Received 🎉",
    body: "Dhahran British Grammar School has sent you a formal offer for English Language Teacher position. Review and respond within 5 days.",
    time: "2 hours ago",
    read: false,
    actionLabel: "View Offer",
    actionHref: "/teacher/applications",
  },
  {
    id: 2,
    type: "interview",
    title: "Interview Confirmed",
    body: "Your video interview with Al-Noor International School for Mathematics Teacher is confirmed for Wed, Jun 18 at 10:00 AM via Zoom.",
    time: "5 hours ago",
    read: false,
    actionLabel: "View Details",
    actionHref: "/teacher/interviews",
  },
  {
    id: 3,
    type: "job_match",
    title: "3 New Job Matches",
    body: "We found 3 new teaching positions that match your profile — Physics in Riyadh, Mathematics in Jeddah, and CS in Dammam.",
    time: "Yesterday at 8:00 AM",
    read: false,
    actionLabel: "Browse Jobs",
    actionHref: "/teacher/jobs",
  },
  {
    id: 4,
    type: "application_update",
    title: "You've Been Shortlisted!",
    body: "Manarat Schools has shortlisted your application for Physics & Chemistry Teacher. They'll be in touch soon regarding next steps.",
    time: "Yesterday at 3:45 PM",
    read: false,
    actionLabel: "Track Application",
    actionHref: "/teacher/applications",
  },
  {
    id: 5,
    type: "application_update",
    title: "Application Rejected",
    body: "Al-Rajhi Model Schools has updated your application status for Islamic Studies Teacher to Rejected. The position was filled internally.",
    time: "Jun 5, 2025",
    read: true,
  },
  {
    id: 6,
    type: "system",
    title: "Profile Completion Reminder",
    body: "Your profile is 72% complete. Add your certifications and preferred cities to increase your match score and get better job recommendations.",
    time: "Jun 4, 2025",
    read: true,
    actionLabel: "Complete Profile",
    actionHref: "/teacher/profile",
  },
  {
    id: 7,
    type: "job_match",
    title: "High-Match Job Alert",
    body: "A new Mathematics Teacher position at King Faisal Schools in Riyadh is a 94% match for your profile. Apply before it closes in 3 days.",
    time: "Jun 3, 2025",
    read: true,
    actionLabel: "View Job",
    actionHref: "/teacher/jobs",
  },
  {
    id: 8,
    type: "announcement",
    title: "Platform Update: New Features",
    body: "Abjad now supports video interview scheduling directly within the platform. Schools can request video interviews which you'll see in your Interviews tab.",
    time: "Jun 1, 2025",
    read: true,
  },
  {
    id: 9,
    type: "application_update",
    title: "Application Submitted Successfully",
    body: "Your application for Computer Science Teacher at KFUPM Schools has been submitted. You'll be notified of any updates.",
    time: "May 31, 2025",
    read: true,
  },
  {
    id: 10,
    type: "system",
    title: "Account Verified",
    body: "Your identity has been verified successfully. Your profile is now visible to schools on the Abjad platform.",
    time: "May 28, 2025",
    read: true,
  },
];

const FILTER_OPTIONS: { value: NotificationType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "job_match", label: "Job Matches" },
  { value: "application_update", label: "Applications" },
  { value: "interview", label: "Interviews" },
  { value: "offer", label: "Offers" },
  { value: "system", label: "System" },
  { value: "announcement", label: "Announcements" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (showUnreadOnly && n.read) return false;
    if (filter !== "all" && n.type !== filter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">Stay updated on your applications and job matches</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm text-cyan-600 hover:text-cyan-700 font-medium px-3 py-1.5 rounded-xl hover:bg-cyan-50 transition-colors"
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
                const count =
                  opt.value === "all"
                    ? notifications.length
                    : notifications.filter((n) => n.type === opt.value).length;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border transition-colors ${
                      filter === opt.value
                        ? "bg-cyan-500 text-white border-cyan-500"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                    <span className={`text-xs ${filter === opt.value ? "text-cyan-100" : "text-slate-400"}`}>
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
                  className="accent-cyan-500 w-4 h-4 rounded"
                />
                Unread only
              </label>
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {filtered.length === 0 ? (
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
                  className="mt-3 text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Show all notifications
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onRead={markRead}
                  onDismiss={dismiss}
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
          <button className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-xl transition-colors shrink-0">
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
  onRead: (id: number) => void;
  onDismiss: (id: number) => void;
}) {
  const cfg = TYPE_CONFIG[n.type];

  return (
    <div
      className={`flex items-start gap-4 p-4 hover:bg-slate-50/50 transition-colors cursor-pointer group relative ${
        !n.read ? "bg-cyan-50/20" : ""
      }`}
      onClick={() => onRead(n.id)}
    >
      {/* Unread dot */}
      {!n.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-full" />
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
              <p className={`text-sm font-semibold ${n.read ? "text-slate-700" : "text-slate-900"}`}>
                {n.title}
              </p>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.color} font-medium`}>
                {cfg.label}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-slate-400 whitespace-nowrap">{n.time}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(n.id);
              }}
              className="p-1 text-slate-300 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          {n.actionLabel && (
            <button
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
            >
              {n.actionLabel} <ChevronRight className="w-3 h-3" />
            </button>
          )}
          {!n.read && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRead(n.id);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" /> Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
