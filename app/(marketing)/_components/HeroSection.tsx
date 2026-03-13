"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, GraduationCap, School, Sparkles, CheckCircle2 } from "lucide-react";

const teacherBullets = [
  "Browse hundreds of verified school listings",
  "Set your availability & preferred subjects",
  "Get matched with schools that suit you",
];

const schoolBullets = [
  "Post jobs and reach qualified teachers fast",
  "Filter by subject, experience & location",
  "Hire with confidence through verified profiles",
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<"teacher" | "school">("teacher");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1a9aa1 0%, #2bbdc5 45%, #0e7a81 100%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative blobs */}
      <div
        className="absolute top-20 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "#ffffff" }}
      />
      <div
        className="absolute bottom-10 -left-15 w-72 h-72 rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: "#0a5c62" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left – Copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold px-4 py-2 rounded-full mb-8">
              <Sparkles size={13} />
              The #1 Education Hiring Platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Where Great{" "}
              <span className="relative inline-block">
                Teachers
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6 C40 2, 100 2, 198 6"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {" "}Meet{" "}
              <span className="text-white/80">Great Schools</span>
            </h1>

            <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-lg">
              Abjad connects passionate educators with forward-thinking schools
              across the region — making every hire count.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-14">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold text-sm px-7 py-4 rounded-2xl hover:shadow-xl hover:shadow-black/20 transition-all hover:-translate-y-0.5"
                style={{ color: "#1a9aa1" }}
              >
                Get started free
                <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold text-sm px-7 py-4 rounded-2xl hover:bg-white/20 transition-all"
              >
                See how it works
              </a>
            </div>

            {/* Mini stats */}
            <div className="flex gap-8">
              {[
                { value: "2,000+", label: "Teachers" },
                { value: "500+", label: "Schools" },
                { value: "1,200+", label: "Successful hires" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-white text-2xl font-bold">{s.value}</p>
                  <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Interactive card */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-8 max-w-md ml-auto">
              {/* Tab switcher */}
              <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                <button
                  onClick={() => setActiveTab("teacher")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === "teacher"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  <GraduationCap size={15} />
                  I&apos;m a Teacher
                </button>
                <button
                  onClick={() => setActiveTab("school")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === "school"
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  <School size={15} />
                  I&apos;m a School
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#e0f7f8" }}
                >
                  {activeTab === "teacher" ? (
                    <GraduationCap size={24} style={{ color: "#2bbdc5" }} />
                  ) : (
                    <School size={24} style={{ color: "#2bbdc5" }} />
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {activeTab === "teacher"
                    ? "Find your perfect role"
                    : "Find your perfect teacher"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {activeTab === "teacher"
                    ? "Join thousands of teachers growing their careers"
                    : "Access a vetted pool of qualified educators"}
                </p>
              </div>

              <ul className="space-y-3 mb-7">
                {(activeTab === "teacher" ? teacherBullets : schoolBullets).map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} style={{ color: "#2bbdc5" }} className="mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600">{b}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="block text-center text-white text-sm font-semibold py-3.5 rounded-xl transition-all hover:opacity-90"
                style={{ backgroundColor: "#2bbdc5" }}
              >
                {activeTab === "teacher" ? "Start job hunting →" : "Post a job free →"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 inset-x-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 80V40C240 0 480 80 720 40C960 0 1200 80 1440 40V80H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
