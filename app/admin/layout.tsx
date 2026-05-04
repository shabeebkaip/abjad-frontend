"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, GraduationCap, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/schools",   icon: Building2,       label: "Schools"   },
  { href: "/admin/teachers",  icon: GraduationCap,   label: "Teachers"  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (user?.role !== "admin") {
      router.replace(user?.role === "school" ? "/school/dashboard" : "/dashboard");
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-slate-100">
          <img src="/ABJAD.png" alt="Abjad" className="h-7 w-auto" />
          <span className="ml-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">Admin</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                style={active ? { background: "var(--brand-gradient)" } : {}}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs font-medium text-slate-700 truncate">{user?.email}</p>
            <p className="text-[10px] text-slate-400">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
          </div>
        ) : isAuthenticated && user?.role === "admin" ? (
          children
        ) : null}
      </main>
    </div>
  );
}
