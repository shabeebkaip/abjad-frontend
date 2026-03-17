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
  Menu,
  X,
  Bookmark,
  ChevronDown,
  Settings,
  MessageSquare,
  Calendar,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/jobs", icon: Search, label: "Find Jobs" },
  { href: "/applications", icon: FileText, label: "My Applications" },
  { href: "/interviews", icon: Calendar, label: "Interviews" },
  { href: "/saved-jobs", icon: Bookmark, label: "Saved Jobs" },
  { href: "/profile", icon: User, label: "My Profile" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/support", icon: MessageSquare, label: "Support" },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationCount = 3; // mock

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ background: "var(--brand-gradient)" }}>
              أ
            </div>
            <span className="font-semibold text-gray-900 text-lg tracking-tight">Abjad</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-6 py-3 border-b border-gray-100">
          <span className="text-xs font-medium text-brand-primary bg-brand-primary-light px-2.5 py-1 rounded-full">
            Teacher Account
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors relative
                  ${active
                    ? "bg-brand-primary-light text-brand-primary-dark"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Icon size={18} className={active ? "text-brand-primary" : "text-gray-400"} />
                {label}
                {label === "Notifications" && notificationCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom user section */}
        <div className="border-t border-gray-100 p-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center text-white text-sm font-semibold shrink-0">
              AH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Ahmed Hassan</p>
              <p className="text-xs text-gray-500 truncate">Math Teacher</p>
            </div>
            <Link href="/settings" className="text-gray-400 hover:text-gray-600">
              <Settings size={16} />
            </Link>
          </div>
          <button className="mt-3 w-full flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors px-1">
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb page title */}
            <span className="text-sm font-semibold text-gray-900 hidden sm:block capitalize">
              {navItems.find(n => pathname === n.href || pathname.startsWith(n.href + "/"))?.label ?? "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <Link href="/notifications" className="relative p-2 text-gray-500 hover:text-brand-primary hover:bg-brand-primary-light rounded-lg transition-colors">
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </Link>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center text-white text-xs font-semibold">
                  AH
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">Ahmed Hassan</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                  <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                    <User size={15} className="text-gray-400" /> My Profile
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                    <Settings size={15} className="text-gray-400" /> Settings
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
