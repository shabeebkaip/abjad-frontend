"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Briefcase, FileText, Users, BookMarked,
  Calendar, Gift, UserCog, Building2, MessageSquare,
  Bell, LogOut, ChevronDown, Settings, Loader2, CreditCard,
} from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { getSchoolNotificationUnreadCount } from "@/lib/api/school";

const navItems = [
  { href: "/school/dashboard",       icon: LayoutDashboard, label: "Dashboard"     },
  { href: "/school/jobs",            icon: Briefcase,        label: "Jobs"          },
  { href: "/school/applications",    icon: FileText,         label: "Applications"  },
  { href: "/school/candidates",      icon: Users,            label: "Candidates"    },
  { href: "/school/shortlists",      icon: BookMarked,       label: "Shortlists"    },
  { href: "/school/interviews",      icon: Calendar,         label: "Interviews"    },
  { href: "/school/offers",          icon: Gift,             label: "Offers"        },
  { href: "/school/team",            icon: UserCog,          label: "Team"          },
  { href: "/school/profile",         icon: Building2,        label: "School Profile"},
  { href: "/school/billing",         icon: CreditCard,       label: "Billing"       },
  { href: "/school/support",         icon: MessageSquare,    label: "Support"       },
];

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [profileOpen, setProfileOpen]     = useState(false);
  const [unreadCount, setUnreadCount]     = useState(0);

  // Poll unread notification count every 60 s while the school is active
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "school") return;
    let active = true;
    const fetch = async () => {
      try {
        const count = await getSchoolNotificationUnreadCount();
        if (active) setUnreadCount(count);
      } catch { /* silent */ }
    };
    fetch();
    const interval = setInterval(fetch, 60_000);
    return () => { active = false; clearInterval(interval); };
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (user?.role === "teacher") {
      router.replace("/dashboard");
    } else if (user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const schoolName = user?.schoolName ?? user?.email?.split("@")[0] ?? "School";
  const initial    = schoolName[0]?.toUpperCase() ?? "S";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Top header ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        {/* Logo + user row */}
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between h-14 px-4 lg:px-6">
          <Link href="/school/dashboard" className="flex items-center shrink-0">
            <img src="/ABJAD.png" alt="Abjad" className="h-8 w-auto" />
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/school/notifications"
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center text-white text-[9px] font-bold rounded-full px-1 leading-none"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
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
                  {initial}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block truncate max-w-32">{schoolName}</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                    <p className="px-4 py-2 text-xs text-slate-400 font-medium border-b border-slate-100 mb-1">{user?.email}</p>
                    <Link href="/school/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setProfileOpen(false)}>
                      <Building2 size={14} className="text-slate-400" /> School Profile
                    </Link>
                    <Link href="/school/team" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setProfileOpen(false)}>
                      <Settings size={14} className="text-slate-400" /> Team & Settings
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Horizontal nav tabs ───────────────────────────────────── */}
        <nav className="border-t border-slate-100">
          <div className="max-w-[1400px] mx-auto w-full px-4 lg:px-6 flex overflow-x-auto scrollbar-none">
            {navItems.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative flex items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors shrink-0"
                  style={{ color: active ? "var(--brand-primary)" : "" }}
                >
                  <span className={active ? "" : "text-slate-500 hover:text-slate-800"}>{label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ backgroundColor: "var(--brand-primary)" }} />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* ── Page content ──────────────────────────────────────────────── */}
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto w-full">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
            </div>
          ) : isAuthenticated && user?.role === "school" ? children : null}
        </div>
      </main>
    </div>
  );
}
