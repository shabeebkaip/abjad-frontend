"use client";

import { useState } from "react";
import {
  LifeBuoy,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  BookOpen,
  Search,
  HelpCircle,
  Phone,
  Mail,
  ExternalLink,
  FileText,
} from "lucide-react";

type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";
type TicketCategory =
  | "Account & Profile"
  | "Job Applications"
  | "Technical Issue"
  | "Payment & Billing"
  | "Interviews"
  | "Other";

interface Ticket {
  id: string;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  from: "user" | "support";
  name: string;
  message: string;
  time: string;
}

const STATUS_CONFIG: Record<TicketStatus, { color: string; bg: string; icon: React.ReactNode }> = {
  Open: {
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  "In Progress": {
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  Resolved: {
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  Closed: {
    color: "text-slate-500",
    bg: "bg-slate-100 border-slate-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const CATEGORIES: TicketCategory[] = [
  "Account & Profile",
  "Job Applications",
  "Technical Issue",
  "Payment & Billing",
  "Interviews",
  "Other",
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: "TKT-1042",
    category: "Job Applications",
    subject: "Application not showing in tracker",
    description: "I applied for Mathematics Teacher at Al-Noor School 3 days ago but it's not appearing in my applications tab.",
    status: "In Progress",
    createdAt: "Jun 12, 2025",
    updatedAt: "Jun 14, 2025",
    responses: [
      {
        from: "user",
        name: "You",
        message: "I applied for Mathematics Teacher at Al-Noor School 3 days ago but it's not appearing in my applications tab.",
        time: "Jun 12 at 10:20 AM",
      },
      {
        from: "support",
        name: "Abjad Support",
        message: "Thank you for reaching out! We've located your application and are investigating the display issue. This should be resolved within 24 hours. Your application was received successfully.",
        time: "Jun 13 at 9:00 AM",
      },
    ],
  },
  {
    id: "TKT-1035",
    category: "Account & Profile",
    subject: "Unable to upload certificate PDF",
    description: "Getting an error when trying to upload my teaching certificate. The file is under 10MB.",
    status: "Resolved",
    createdAt: "Jun 5, 2025",
    updatedAt: "Jun 7, 2025",
    responses: [
      {
        from: "user",
        name: "You",
        message: "Getting an error when trying to upload my teaching certificate. The file is under 10MB.",
        time: "Jun 5 at 2:00 PM",
      },
      {
        from: "support",
        name: "Abjad Support",
        message: "We identified a temporary issue with our PDF upload service. This has been fixed — please try uploading again. The accepted formats are PDF and DOC/DOCX.",
        time: "Jun 6 at 11:00 AM",
      },
      {
        from: "user",
        name: "You",
        message: "Works now, thank you!",
        time: "Jun 7 at 8:30 AM",
      },
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "How is my profile match score calculated?",
    a: "Your match score is calculated based on: Subject expertise (30%), Grade level alignment (20%), Years of experience (20%), Location preference (15%), Language proficiency (10%), and Qualifications (5%). Complete all profile sections to maximize your score.",
  },
  {
    q: "How long does profile verification take?",
    a: "Profile verification typically takes 1–3 business days. You'll receive a notification once your profile is approved or if additional documents are needed.",
  },
  {
    q: "Can I apply to multiple jobs at once?",
    a: "Yes, you can apply to as many jobs as you like. There's no limit on the number of applications. We recommend tailoring your application message for each school.",
  },
  {
    q: "How do I withdraw a job application?",
    a: "Go to My Applications, find the application you wish to withdraw, click the three-dot menu, and select 'Withdraw Application'. Note that withdrawn applications cannot be resubmitted.",
  },
  {
    q: "What should I do if a school contacts me outside the platform?",
    a: "All communication and offers should be conducted through Abjad to ensure your protection. If a school asks you to communicate outside the platform, please report it using the Support form.",
  },
  {
    q: "How do I update my availability for substitution work?",
    a: "In your Profile, go to the Preferences tab and update your 'Availability for Substitute Work' setting. Schools will only see you in substitute searches if this is enabled.",
  },
  {
    q: "Is my personal information visible to schools?",
    a: "Schools can see your professional information (qualifications, experience, subjects, grades). Your National ID, Iqama number, and personal contact details are hidden from schools until you accept an offer.",
  },
];

export default function SupportPage() {
  const [activeView, setActiveView] = useState<"tickets" | "new" | "faq">("tickets");
  const [expandedTicket, setExpandedTicket] = useState<string | null>("TKT-1042");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");

  // New ticket form
  const [form, setForm] = useState({
    category: "" as TicketCategory | "",
    subject: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.subject || !form.description) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ category: "", subject: "", description: "" });
      setActiveView("tickets");
    }, 2500);
  };

  const filteredFaq = FAQ_ITEMS.filter(
    (item) =>
      faqSearch === "" ||
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-800">Support & Help</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Get help with your account, applications, and platform usage
        </p>
      </div>

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Quick contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Live Chat</p>
              <p className="text-xs text-emerald-600 font-medium">● Online — Avg 5 min reply</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Email Support</p>
              <p className="text-xs text-slate-400">support@abjad.sa</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">Phone</p>
              <p className="text-xs text-slate-400">+966 11 000 0000</p>
              <p className="text-xs text-slate-400">Sun–Thu 8am–6pm</p>
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            {([
              { value: "tickets", label: "My Tickets", icon: <FileText className="w-4 h-4" /> },
              { value: "new", label: "New Ticket", icon: <Send className="w-4 h-4" /> },
              { value: "faq", label: "FAQ", icon: <HelpCircle className="w-4 h-4" /> },
            ] as { value: typeof activeView; label: string; icon: React.ReactNode }[]).map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveView(tab.value)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                  activeView === tab.value
                    ? "border-cyan-500 text-cyan-600 bg-cyan-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.icon} {tab.label}
                {tab.value === "tickets" && MOCK_TICKETS.filter((t) => t.status === "Open" || t.status === "In Progress").length > 0 && (
                  <span className="bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {MOCK_TICKETS.filter((t) => t.status === "Open" || t.status === "In Progress").length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── My Tickets ─────────────────────────────────────── */}
          {activeView === "tickets" && (
            <div className="divide-y divide-slate-100">
              {MOCK_TICKETS.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <LifeBuoy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-slate-500">No tickets yet</p>
                  <button
                    onClick={() => setActiveView("new")}
                    className="mt-3 text-sm text-cyan-600 font-medium hover:text-cyan-700"
                  >
                    Create your first ticket
                  </button>
                </div>
              ) : (
                MOCK_TICKETS.map((ticket) => {
                  const cfg = STATUS_CONFIG[ticket.status];
                  const isExpanded = expandedTicket === ticket.id;
                  return (
                    <div key={ticket.id}>
                      <button
                        className="w-full flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors text-left"
                        onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                          <LifeBuoy className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
                                <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                  {ticket.category}
                                </span>
                              </div>
                              <p className="font-semibold text-slate-800 mt-0.5">{ticket.subject}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                Created {ticket.createdAt} · Updated {ticket.updatedAt}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${cfg.color} ${cfg.bg}`}>
                                {cfg.icon} {ticket.status}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Conversation thread */}
                      {isExpanded && (
                        <div className="px-5 pb-5 space-y-3 border-t border-slate-100 pt-4">
                          {ticket.responses.map((resp, idx) => (
                            <div
                              key={idx}
                              className={`flex gap-3 ${resp.from === "user" ? "flex-row-reverse" : ""}`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                resp.from === "user"
                                  ? "bg-cyan-500 text-white"
                                  : "bg-slate-200 text-slate-600"
                              }`}>
                                {resp.from === "user" ? "Me" : "A"}
                              </div>
                              <div className={`flex-1 max-w-lg ${resp.from === "user" ? "items-end" : ""}`}>
                                <div className={`rounded-2xl p-3.5 text-sm ${
                                  resp.from === "user"
                                    ? "bg-cyan-500 text-white rounded-tr-sm"
                                    : "bg-slate-100 text-slate-700 rounded-tl-sm"
                                }`}>
                                  {resp.message}
                                </div>
                                <p className="text-xs text-slate-400 mt-1 px-1">{resp.time}</p>
                              </div>
                            </div>
                          ))}
                          {(ticket.status === "Open" || ticket.status === "In Progress") && (
                            <div className="flex gap-2 mt-3">
                              <input
                                type="text"
                                placeholder="Type your reply…"
                                className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                              />
                              <button className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5">
                                <Send className="w-3.5 h-3.5" /> Send
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── New Ticket ──────────────────────────────────────── */}
          {activeView === "new" && (
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-lg">Ticket Submitted!</h3>
                  <p className="text-slate-500 mt-1 text-sm">
                    We&apos;ll get back to you within 24 hours. Redirecting to your tickets…
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as TicketCategory })}
                      required
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
                    >
                      <option value="">Select a category…</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Brief summary of your issue"
                      required
                      maxLength={100}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe your issue in detail. Include any error messages, steps to reproduce, etc."
                      required
                      rows={5}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Attachments (optional)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-cyan-300 hover:bg-cyan-50/30 transition-colors cursor-pointer">
                      <Paperclip className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <p className="text-sm text-slate-500">
                        Click to attach screenshots or files
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, PDF up to 5MB</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors"
                    >
                      <Send className="w-4 h-4" /> Submit Ticket
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView("tickets")}
                      className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── FAQ ─────────────────────────────────────────────── */}
          {activeView === "faq" && (
            <div className="p-6 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search frequently asked questions…"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
                />
              </div>

              {filteredFaq.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No results for &quot;{faqSearch}&quot;</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFaq.map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <p className="font-medium text-slate-800 text-sm">{item.q}</p>
                        {expandedFaq === idx ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                      {expandedFaq === idx && (
                        <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between gap-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Can&apos;t find what you need?</p>
                    <p className="text-xs text-slate-400">Browse the full help documentation</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-sm text-cyan-600 font-medium hover:text-cyan-700">
                  Help Center <ExternalLink className="w-3.5 h-3.5" />
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
