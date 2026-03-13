"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Video,
  Phone,
  Users,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Bell,
  ChevronRight,
  ExternalLink,
  BookOpen,
  RefreshCw,
  AlertCircle,
  Star,
  Download,
} from "lucide-react";

type InterviewType = "Video" | "In-Person" | "Phone";
type InterviewStatus = "Upcoming" | "Confirmed" | "Pending" | "Completed" | "Cancelled" | "Rescheduled";

interface Interview {
  id: number;
  jobTitle: string;
  school: string;
  subject: string;
  city: string;
  date: string;
  time: string;
  duration: string;
  type: InterviewType;
  status: InterviewStatus;
  platform?: string;
  meetingLink?: string;
  location?: string;
  interviewers?: string[];
  notes?: string;
  preparationTips?: string[];
  reminderSet: boolean;
}

const TYPE_ICONS: Record<InterviewType, React.ReactNode> = {
  Video: <Video className="w-4 h-4" />,
  "In-Person": <Users className="w-4 h-4" />,
  Phone: <Phone className="w-4 h-4" />,
};

const TYPE_STYLE: Record<InterviewType, string> = {
  Video: "bg-blue-50 text-blue-600 border-blue-200",
  "In-Person": "bg-purple-50 text-purple-600 border-purple-200",
  Phone: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const STATUS_STYLE: Record<InterviewStatus, string> = {
  Upcoming: "bg-amber-50 text-amber-600 border-amber-200",
  Confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Pending: "bg-slate-50 text-slate-500 border-slate-200",
  Completed: "bg-slate-100 text-slate-500 border-slate-200",
  Cancelled: "bg-red-50 text-red-500 border-red-200",
  Rescheduled: "bg-orange-50 text-orange-600 border-orange-200",
};

const MOCK_INTERVIEWS: Interview[] = [
  {
    id: 1,
    jobTitle: "Mathematics Teacher – High School",
    school: "Al-Noor International School",
    subject: "Mathematics",
    city: "Riyadh",
    date: "Wed, Jun 18, 2025",
    time: "10:00 AM",
    duration: "45 minutes",
    type: "Video",
    status: "Confirmed",
    platform: "Zoom",
    meetingLink: "https://zoom.us/j/123456789",
    interviewers: ["Mr. Ahmed Al-Rashidi (Principal)", "Ms. Sara Hassan (HR)"],
    notes: "Bring portfolio samples and teaching philosophy statement.",
    preparationTips: [
      "Review the school's curriculum and values",
      "Prepare 2–3 sample lesson plans for Grade 10–12",
      "Be ready to discuss differentiated instruction strategies",
      "Test your camera, microphone, and internet 30 mins early",
    ],
    reminderSet: true,
  },
  {
    id: 2,
    jobTitle: "Physics & Chemistry Teacher",
    school: "Manarat Schools",
    subject: "Physics",
    city: "Jeddah",
    date: "Mon, Jun 23, 2025",
    time: "2:00 PM",
    duration: "60 minutes",
    type: "In-Person",
    status: "Pending",
    location: "Manarat Schools HQ, Al-Hamra District, Jeddah",
    interviewers: ["Dr. Khalid Mansour (Director)"],
    preparationTips: [
      "Bring original degree certificates and transcripts",
      "Prepare for a 15-minute demo lesson",
      "Arrive 15 minutes early",
    ],
    reminderSet: false,
  },
  {
    id: 3,
    jobTitle: "English Language Teacher",
    school: "Dhahran British Grammar School",
    subject: "English Language",
    city: "Khobar",
    date: "Thu, Jun 12, 2025",
    time: "11:30 AM",
    duration: "30 minutes",
    type: "Phone",
    status: "Completed",
    interviewers: ["Ms. Rebecca Turner (Head of English)"],
    notes: "Went well — offer received afterwards.",
    reminderSet: false,
  },
  {
    id: 4,
    jobTitle: "Computer Science Teacher",
    school: "KFUPM Schools",
    subject: "Computer Science",
    city: "Dammam",
    date: "Fri, Jun 27, 2025",
    time: "9:00 AM",
    duration: "45 minutes",
    type: "Video",
    status: "Upcoming",
    platform: "Microsoft Teams",
    meetingLink: "https://teams.microsoft.com/l/meetup-join/abc123",
    preparationTips: [
      "Prepare to discuss coding curriculum and teaching methodology",
      "Demo a programming exercise you've taught before",
    ],
    reminderSet: false,
  },
  {
    id: 5,
    jobTitle: "Arabic Language & Literature",
    school: "Bayan Bilingual School",
    subject: "Arabic Language",
    city: "Riyadh",
    date: "Tue, Jun 10, 2025",
    time: "3:00 PM",
    duration: "45 minutes",
    type: "In-Person",
    status: "Cancelled",
    location: "Bayan School Campus, Riyadh",
    notes: "Cancelled — position filled internally.",
    reminderSet: false,
  },
];

const UPCOMING_STATUSES: InterviewStatus[] = ["Confirmed", "Upcoming", "Pending", "Rescheduled"];

type TabView = "upcoming" | "all" | "completed";

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<TabView>("upcoming");
  const [expandedId, setExpandedId] = useState<number | null>(1); // first one expanded by default
  const [reminders, setReminders] = useState<Set<number>>(
    new Set(MOCK_INTERVIEWS.filter((i) => i.reminderSet).map((i) => i.id))
  );

  const toggleReminder = (id: number) => {
    setReminders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = MOCK_INTERVIEWS.filter((i) => {
    if (activeTab === "upcoming") return UPCOMING_STATUSES.includes(i.status);
    if (activeTab === "completed") return i.status === "Completed" || i.status === "Cancelled";
    return true;
  });

  const upcomingCount = MOCK_INTERVIEWS.filter((i) => UPCOMING_STATUSES.includes(i.status)).length;
  const nextInterview = MOCK_INTERVIEWS.find((i) => UPCOMING_STATUSES.includes(i.status) && i.status === "Confirmed");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-800">Interviews</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your scheduled interviews and preparation</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Next Interview Banner */}
        {nextInterview && (
          <div className="bg-linear-to-r from-cyan-500 to-cyan-600 rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-cyan-100 text-xs font-medium uppercase tracking-wide mb-1">
                  Next Interview
                </p>
                <h2 className="text-xl font-bold">{nextInterview.jobTitle}</h2>
                <p className="text-cyan-100 mt-0.5">{nextInterview.school}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-cyan-50 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" /> {nextInterview.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {nextInterview.time} · {nextInterview.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    {TYPE_ICONS[nextInterview.type]} {nextInterview.type}
                    {nextInterview.platform && ` via ${nextInterview.platform}`}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {nextInterview.meetingLink && (
                  <a
                    href={nextInterview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white text-cyan-600 rounded-xl text-sm font-semibold hover:bg-cyan-50 transition-colors"
                  >
                    <Video className="w-4 h-4" /> Join Meeting
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => addToCalendar(nextInterview)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-cyan-400/30 text-white border border-white/20 rounded-xl text-sm font-medium hover:bg-cyan-400/50 transition-colors"
                >
                  <Download className="w-4 h-4" /> Add to Calendar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Upcoming",
              value: upcomingCount,
              icon: <Calendar className="w-5 h-5 text-amber-500" />,
              bg: "bg-amber-50",
            },
            {
              label: "Confirmed",
              value: MOCK_INTERVIEWS.filter((i) => i.status === "Confirmed").length,
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
              bg: "bg-emerald-50",
            },
            {
              label: "Completed",
              value: MOCK_INTERVIEWS.filter((i) => i.status === "Completed").length,
              icon: <Star className="w-5 h-5 text-blue-500" />,
              bg: "bg-blue-50",
            },
            {
              label: "Cancelled",
              value: MOCK_INTERVIEWS.filter((i) => i.status === "Cancelled").length,
              icon: <XCircle className="w-5 h-5 text-red-400" />,
              bg: "bg-red-50",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab + List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            {([
              { value: "upcoming", label: `Upcoming (${upcomingCount})` },
              { value: "all", label: `All (${MOCK_INTERVIEWS.length})` },
              { value: "completed", label: "Past" },
            ] as { value: TabView; label: string }[]).map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? "border-cyan-500 text-cyan-600 bg-cyan-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interview list */}
          <div className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-slate-500">No interviews here</p>
              </div>
            ) : (
              filtered.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  expanded={expandedId === interview.id}
                  reminderOn={reminders.has(interview.id)}
                  onToggle={() => setExpandedId(expandedId === interview.id ? null : interview.id)}
                  onToggleReminder={() => toggleReminder(interview.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Preparation Tips Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-500" />
            General Interview Preparation Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "Research the school's vision, curriculum, and student demographic before the interview.",
              "Prepare a 2–3 minute personal introduction covering your teaching philosophy.",
              "Have 2–3 example lesson plans ready to discuss or present.",
              "Be prepared to answer competency-based questions about classroom management.",
              "Dress professionally even for video interviews — first impressions matter.",
              "Follow up with a thank-you message within 24 hours of the interview.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <div className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Interview Card Component ──────────────────────────────────────────────────

function InterviewCard({
  interview,
  expanded,
  reminderOn,
  onToggle,
  onToggleReminder,
}: {
  interview: Interview;
  expanded: boolean;
  reminderOn: boolean;
  onToggle: () => void;
  onToggleReminder: () => void;
}) {
  const isActive = UPCOMING_STATUSES.includes(interview.status);

  return (
    <div className={`p-5 hover:bg-slate-50/50 transition-colors ${
      interview.status === "Cancelled" ? "opacity-60" : ""
    }`}>
      <div className="flex items-start gap-4">
        {/* Date block */}
        <div className="w-14 shrink-0 text-center">
          <div className="bg-slate-100 rounded-xl p-2">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">
              {interview.date.split(", ")[0]}
            </p>
            <p className="text-xl font-bold text-slate-800 leading-none mt-0.5">
              {interview.date.split(" ")[2]}
            </p>
            <p className="text-[10px] text-slate-500">
              {interview.date.split(" ")[1].replace(",", "")}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-800 leading-snug">{interview.jobTitle}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5" /> {interview.school}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${TYPE_STYLE[interview.type]}`}>
                {TYPE_ICONS[interview.type]} {interview.type}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${STATUS_STYLE[interview.status]}`}>
                {interview.status}
              </span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {interview.time} · {interview.duration}</span>
            {interview.platform && (
              <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> via {interview.platform}</span>
            )}
            {interview.location && (
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {interview.location}</span>
            )}
          </div>

          {/* Actions row */}
          {isActive && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {interview.meetingLink && (
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <Video className="w-3.5 h-3.5" /> Join {interview.platform}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {interview.status === "Pending" && (
                <>
                  <button className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100 text-xs font-medium rounded-lg transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> Reschedule
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 text-xs font-medium rounded-lg transition-colors">
                    <XCircle className="w-3.5 h-3.5" /> Decline
                  </button>
                </>
              )}
              <button
                onClick={onToggleReminder}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  reminderOn
                    ? "bg-amber-50 border-amber-300 text-amber-600"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                {reminderOn ? "Reminder On" : "Set Reminder"}
              </button>
              <button
                onClick={() => addToCalendar(interview)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Add to Calendar
              </button>
            </div>
          )}

          {/* Expand toggle */}
          <button
            onClick={onToggle}
            className="mt-2 flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 font-medium"
          >
            {expanded ? "Hide details" : "Show details"}
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>

          {/* Expanded details */}
          {expanded && (
            <div className="mt-4 space-y-4">
              {interview.interviewers && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Interviewers</p>
                  <div className="flex flex-wrap gap-2">
                    {interview.interviewers.map((name) => (
                      <span key={name} className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {interview.notes && (
                <div className="flex items-start gap-2 text-sm text-slate-600 bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p>{interview.notes}</p>
                </div>
              )}
              {interview.preparationTips && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Preparation Tips
                  </p>
                  <ul className="space-y-1.5">
                    {interview.preparationTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Calendar export helper ────────────────────────────────────────────────────

function addToCalendar(interview: Interview) {
  const title = encodeURIComponent(`Interview: ${interview.jobTitle} at ${interview.school}`);
  const details = encodeURIComponent(
    `Interview type: ${interview.type}${interview.platform ? ` via ${interview.platform}` : ""}${interview.meetingLink ? `\nLink: ${interview.meetingLink}` : ""}${interview.location ? `\nLocation: ${interview.location}` : ""}`
  );
  const url = `https://calendar.google.com/calendar/r/eventedit?text=${title}&details=${details}`;
  window.open(url, "_blank");
}
