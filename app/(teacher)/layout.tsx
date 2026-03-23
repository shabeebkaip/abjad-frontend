"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  FileText,
  User,
  Bell,
  LogOut,
  ChevronDown,
  Settings,
  MessageSquare,
  Calendar,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { href: "/jobs",          icon: Search,          label: "Find Jobs" },
  { href: "/applications",  icon: FileText,        label: "My Applications" },
  { href: "/interviews",    icon: Calendar,        label: "Interviews" },
  { href: "/profile",       icon: User,            label: "My Profile" },
  { href: "/notifications", icon: Bell,            label: "Notifications" },
  { href: "/support",       icon: MessageSquare,   label: "Support" },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationCount = 3;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Top header ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">

        {/* Logo + user row */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-14 px-4 lg:px-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center shrink-0">
            <img src="/ABJAD.png" alt="Abjad" className="h-8 w-auto" />
          </Link>

          {/* Right: bell + profile */}
          <div className="flex items-center gap-1">
            <Link
              href="/notifications"
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </Link>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors ml-1"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  AH
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">Shabeeb K</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                    <p className="px-4 py-2 text-xs text-slate-400 font-medium border-b border-slate-100 mb-1">
                      shabeeb@email.com
                    </p>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User size={14} className="text-slate-400" /> My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={14} className="text-slate-400" /> Settings
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Horizontal nav tabs ───────────────────────────────── */}
        <nav className="border-t border-slate-100">
          <div className="max-w-7xl mx-auto w-full px-4 lg:px-6 flex overflow-x-auto scrollbar-none">
          {navItems.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors shrink-0"
                style={{ color: active ? "var(--brand-primary)" : "" }}
              >
                <span className={active ? "" : "text-slate-500 hover:text-slate-800"}>
                  {label}
                </span>
                {label === "Notifications" && notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {notificationCount}
                  </span>
                )}
                {active && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  />
                )}
              </Link>
            );
          })}
          </div>
        </nav>
      </header>

      {/* ── Page content ─────────────────────────────────────────── */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
