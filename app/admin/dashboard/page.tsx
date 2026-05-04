"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, GraduationCap, Clock, CheckCircle, XCircle } from "lucide-react";
import { getAdminStats, type AdminStats } from "@/lib/api/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    getAdminStats().then(setStats).catch(() => {});
  }, []);

  const s = stats?.schools ?? {};
  const t = stats?.teachers ?? {};

  const cards = [
    {
      label: "Schools Pending",
      value: s.pending ?? 0,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
      href: "/admin/schools?status=pending",
    },
    {
      label: "Schools Verified",
      value: s.verified ?? 0,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
      href: "/admin/schools?status=verified",
    },
    {
      label: "Teachers Pending",
      value: t.pending ?? 0,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
      href: "/admin/teachers?status=pending",
    },
    {
      label: "Teachers Approved",
      value: t.approved ?? 0,
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
      href: "/admin/teachers?status=approved",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
      <p className="text-sm text-slate-500 mb-8">Review and verify school and teacher accounts</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/admin/schools?status=pending"
          className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Building2 size={22} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Review Schools</p>
            <p className="text-sm text-slate-500">
              {s.pending ?? 0} pending verification
            </p>
          </div>
        </Link>

        <Link
          href="/admin/teachers?status=pending"
          className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
            <GraduationCap size={22} className="text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-800">Review Teachers</p>
            <p className="text-sm text-slate-500">
              {t.pending ?? 0} pending approval
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
