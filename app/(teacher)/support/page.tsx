"use client";

import { useState, useEffect, useCallback } from "react";
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
  ChevronLeft,
  BookOpen,
  Search,
  HelpCircle,
  Phone,
  Mail,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";
import { listTickets, createTicket, replyToTicket, getTicket } from "@/lib/api/teacher";
import type { SupportTicket } from "@/lib/api/teacher";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatDate } from "@/lib/i18n/format";

// ── Status mapping (canonical keys — display text via tt.statusLabels) ──────

type UIStatus = "Open" | "In Progress" | "Resolved" | "Closed";

function toUIStatus(apiStatus: SupportTicket["status"]): UIStatus {
  const map: Record<SupportTicket["status"], UIStatus> = {
    open:        "Open",
    in_progress: "In Progress",
    resolved:    "Resolved",
    closed:      "Closed",
  };
  return map[apiStatus] ?? "Open";
}

const STATUS_STYLE: Record<UIStatus, { color: string; bg: string; icon: React.ReactNode }> = {
  "Open":        { color: "text-blue-600",    bg: "bg-blue-50 border-blue-200",    icon: <AlertCircle className="w-3.5 h-3.5" /> },
  "In Progress": { color: "text-amber-600",   bg: "bg-amber-50 border-amber-200",  icon: <Clock className="w-3.5 h-3.5" /> },
  "Resolved":    { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  "Closed":      { color: "text-slate-500",   bg: "bg-slate-100 border-slate-200", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const API_CATEGORIES = ["technical", "profile_application", "payment", "report", "general", "other"] as const;

type TT = ReturnType<typeof useTranslation>["t"]["teacher"]["support"];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const { t, lang, isRTL } = useTranslation();
  const tt = t.teacher.support;

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"tickets" | "new" | "faq">("tickets");
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearch, setFaqSearch] = useState("");

  // Reply state per ticket
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sendingReply, setSendingReply] = useState<string | null>(null);

  // New ticket form
  const [form, setForm] = useState({ category: "", subject: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await listTickets({ limit: 50 });
      setTickets(res.tickets);
      if (res.tickets.length > 0) setExpandedTicket(res.tickets[0]._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.subject || !form.description) return;
    setSubmitting(true);
    try {
      const newTicket = await createTicket({
        category: form.category,
        subject: form.subject,
        description: form.description,
      });
      setTickets((prev) => [newTicket, ...prev]);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ category: "", subject: "", description: "" });
        setActiveView("tickets");
        setExpandedTicket(newTicket._id);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (ticketId: string) => {
    const content = replyText[ticketId]?.trim();
    if (!content) return;
    setSendingReply(ticketId);
    try {
      const updated = await replyToTicket(ticketId, content);
      setTickets((prev) => prev.map((t2) => t2._id === ticketId ? updated : t2));
      setReplyText((prev) => ({ ...prev, [ticketId]: "" }));
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(null);
    }
  };

  const activeTicketCount = tickets.filter((t2) => t2.status === "open" || t2.status === "in_progress").length;
  const filteredFaq = tt.faqItems.filter(
    (item) =>
      faqSearch === "" ||
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-800">{tt.title}</h1>
        <p className="text-sm text-slate-500 mt-0.5">{tt.subtitle}</p>
      </div>

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Quick contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{tt.liveChatTitle}</p>
              <p className="text-xs text-emerald-600 font-medium">{tt.liveChatStatus}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{tt.emailSupportTitle}</p>
              <p className="text-xs text-slate-400" dir="ltr">support@abjad.sa</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{tt.phoneTitle}</p>
              <p className="text-xs text-slate-400" dir="ltr">+966 11 000 0000</p>
              <p className="text-xs text-slate-400">{tt.phoneHours}</p>
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            {([
              { value: "tickets", label: tt.tabMyTickets, icon: <FileText className="w-4 h-4" /> },
              { value: "new",     label: tt.tabNewTicket, icon: <Send className="w-4 h-4" /> },
              { value: "faq",     label: tt.tabFaq,        icon: <HelpCircle className="w-4 h-4" /> },
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
                {tab.value === "tickets" && activeTicketCount > 0 && (
                  <span className="bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {activeTicketCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── My Tickets ─────────────────────────────────────────── */}
          {activeView === "tickets" && (
            loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <LifeBuoy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-slate-500">{tt.noTicketsTitle}</p>
                <button
                  onClick={() => setActiveView("new")}
                  className="mt-3 text-sm text-cyan-600 font-medium hover:text-cyan-700"
                >
                  {tt.createFirstTicket}
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {tickets.map((ticket) => {
                  const uiStatus = toUIStatus(ticket.status);
                  const cfg = STATUS_STYLE[uiStatus];
                  const isExpanded = expandedTicket === ticket._id;
                  const isActive = ticket.status === "open" || ticket.status === "in_progress";
                  return (
                    <div key={ticket._id}>
                      <button
                        className="w-full flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors text-start"
                        onClick={() => setExpandedTicket(isExpanded ? null : ticket._id)}
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                          <LifeBuoy className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-mono text-slate-400" dir="ltr">{ticket.ticketNumber}</span>
                                <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                  {tt.categoryLabels[ticket.category] ?? ticket.category.replace(/_/g, " ")}
                                </span>
                              </div>
                              <p className="font-semibold text-slate-800 mt-0.5">{ticket.subject}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {tt.created.replace("{date}", formatDate(ticket.createdAt, lang))}
                                {ticket.updatedAt ? tt.updated.replace("{date}", formatDate(ticket.updatedAt, lang)) : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-medium ${cfg.color} ${cfg.bg}`}>
                                {cfg.icon} {tt.statusLabels[uiStatus] ?? uiStatus}
                              </span>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Conversation thread */}
                      {isExpanded && (
                        <div className="px-5 pb-5 space-y-3 border-t border-slate-100 pt-4">
                          {/* Original description */}
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">{tt.meLabel}</div>
                            <div className="flex-1">
                              <div className="rounded-2xl rounded-ss-sm p-3.5 text-sm bg-slate-100 text-slate-700">
                                {ticket.description}
                              </div>
                              <p className="text-xs text-slate-400 mt-1 px-1">{formatDate(ticket.createdAt, lang)}</p>
                            </div>
                          </div>

                          {/* Messages */}
                          {ticket.messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                msg.sender === "user" ? "bg-cyan-500 text-white" : "bg-slate-200 text-slate-600"
                              }`}>
                                {msg.sender === "user" ? tt.meLabel : tt.agentLabel}
                              </div>
                              <div className={`flex-1 max-w-lg ${msg.sender === "user" ? "items-end" : ""}`}>
                                <div className={`rounded-2xl p-3.5 text-sm ${
                                  msg.sender === "user"
                                    ? "bg-cyan-500 text-white rounded-se-sm"
                                    : "bg-slate-100 text-slate-700 rounded-ss-sm"
                                }`}>
                                  {msg.content}
                                </div>
                                <p className="text-xs text-slate-400 mt-1 px-1">{formatDate(msg.createdAt, lang)}</p>
                              </div>
                            </div>
                          ))}

                          {/* Reply input */}
                          {isActive && (
                            <div className="flex gap-2 mt-3">
                              <input
                                type="text"
                                value={replyText[ticket._id] ?? ""}
                                onChange={(e) => setReplyText((prev) => ({ ...prev, [ticket._id]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(ticket._id); } }}
                                placeholder={tt.replyPlaceholder}
                                className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                              />
                              <button
                                onClick={() => handleReply(ticket._id)}
                                disabled={sendingReply === ticket._id || !replyText[ticket._id]?.trim()}
                                className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                              >
                                {sendingReply === ticket._id
                                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  : <Send className="w-3.5 h-3.5" />
                                }
                                {tt.send}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* ── New Ticket ─────────────────────────────────────────── */}
          {activeView === "new" && (
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-lg">{tt.ticketSubmittedTitle}</h3>
                  <p className="text-slate-500 mt-1 text-sm">{tt.ticketSubmittedBody}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-5 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {tt.categoryLabel} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
                    >
                      <option value="">{tt.selectCategoryPlaceholder}</option>
                      {API_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{tt.categoryLabels[cat] ?? cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {tt.subjectLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={tt.subjectPlaceholder}
                      required
                      maxLength={100}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {tt.descriptionLabel} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder={tt.descriptionPlaceholder}
                      required
                      rows={5}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{tt.attachmentsLabel}</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-cyan-300 hover:bg-cyan-50/30 transition-colors cursor-pointer">
                      <Paperclip className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <p className="text-sm text-slate-500">{tt.attachmentsHint}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{tt.attachmentsFileTypes}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-60"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {tt.submitTicket}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView("tickets")}
                      className="px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-sm transition-colors"
                    >
                      {tt.cancel}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── FAQ ──────────────────────────────────────────────────── */}
          {activeView === "faq" && (
            <div className="p-6 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder={tt.faqSearchPlaceholder}
                  className="w-full ps-10 pe-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
                />
              </div>

              {filteredFaq.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>{tt.faqNoResults.replace("{query}", faqSearch)}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFaq.map((item, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                        className="w-full flex items-start justify-between gap-3 p-4 text-start hover:bg-slate-50 transition-colors"
                      >
                        <p className="font-medium text-slate-800 text-sm">{item.q}</p>
                        {expandedFaq === idx
                          ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        }
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
                    <p className="text-sm font-medium text-slate-700">{tt.faqHelpMore}</p>
                    <p className="text-xs text-slate-400">{tt.faqHelpMoreBody}</p>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 text-sm text-cyan-600 font-medium hover:text-cyan-700">
                  {tt.helpCenter} <ExternalLink className="w-3.5 h-3.5" />
                  {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// silence unused import
void getTicket;
