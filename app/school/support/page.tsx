"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus, Loader2, AlertCircle, X, Send, CheckCircle2,
  MessageSquare, Ticket, ChevronDown, Star, Clock,
  Circle,
} from "lucide-react";
import {
  listSupportTickets,
  createSupportTicket,
  replySupportTicket,
  closeSupportTicket,
} from "@/lib/api/school";
import type { SupportTicket } from "@/lib/api/school";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  { label: "Technical",             value: "technical"           },
  { label: "Profile & Applications",value: "profile_application" },
  { label: "Payment",               value: "payment"             },
  { label: "Report",                value: "report"              },
  { label: "General",               value: "general"             },
  { label: "Other",                 value: "other"               },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(isoStr: string): string {
  const secs = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (secs < 60)    return "just now";
  if (secs < 3600)  return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 172800) return "Yesterday";
  return `${Math.floor(secs / 86400)}d ago`;
}

function categoryLabel(val: string): string {
  return CATEGORY_OPTIONS.find((c) => c.value === val)?.label ?? val;
}

// ─── Badges ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SupportTicket["status"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    open:        { label: "Open",        cls: "bg-blue-100 text-blue-700 border-blue-200"     },
    in_progress: { label: "In Progress", cls: "bg-amber-100 text-amber-700 border-amber-200"  },
    resolved:    { label: "Resolved",    cls: "bg-green-100 text-green-700 border-green-200"  },
    closed:      { label: "Closed",      cls: "bg-slate-100 text-slate-500 border-slate-200"  },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-600 border-gray-200" };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>
  );
}

function PriorityBadge({ priority }: { priority: SupportTicket["priority"] }) {
  const map: Record<string, { label: string; cls: string }> = {
    low:    { label: "Low",    cls: "bg-slate-100 text-slate-500"  },
    medium: { label: "Medium", cls: "bg-blue-100 text-blue-600"    },
    high:   { label: "High",   cls: "bg-amber-100 text-amber-700"  },
    urgent: { label: "Urgent", cls: "bg-red-100 text-red-600"      },
  };
  const { label, cls } = map[priority] ?? { label: priority, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
      {categoryLabel(category)}
    </span>
  );
}

// ─── Create Ticket Modal ──────────────────────────────────────────────────────

interface CreateTicketModalProps {
  onClose: () => void;
  onCreated: (ticket: SupportTicket) => void;
}

function CreateTicketModal({ onClose, onCreated }: CreateTicketModalProps) {
  const [category, setCategory]     = useState("general");
  const [subject, setSubject]       = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!subject.trim())      { setError("Subject is required."); return; }
    if (!description.trim())  { setError("Description is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const ticket = await createSupportTicket({
        category,
        subject:     subject.trim(),
        description: description.trim(),
      });
      onCreated(ticket);
      onClose();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to create ticket.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--brand-gradient)" }}
            >
              <Ticket size={18} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900">New Support Ticket</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl mb-4">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition bg-white pr-9"
                style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              >
                {CATEGORY_OPTIONS.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your issue"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue in detail. Include any relevant steps to reproduce, error messages, or screenshots…"
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !subject.trim() || !description.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : (
              <><Send size={14} /> Submit Ticket</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Ticket List Item ─────────────────────────────────────────────────────────

interface TicketListItemProps {
  ticket: SupportTicket;
  isSelected: boolean;
  onSelect: () => void;
}

function TicketListItem({ ticket: t, isSelected, onSelect }: TicketListItemProps) {
  const unreadMessages = t.messages.filter((m) => m.sender === "admin").length;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3.5 border-b border-gray-100 transition-colors ${
        isSelected ? "bg-blue-50 border-l-2" : "hover:bg-gray-50 border-l-2 border-l-transparent"
      }`}
      style={isSelected ? { borderLeftColor: "var(--brand-primary)" } : {}}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className={`text-sm font-semibold truncate flex-1 ${isSelected ? "" : "text-gray-900"}`}
          style={isSelected ? { color: "var(--brand-primary)" } : {}}>
          {t.subject}
        </p>
        {unreadMessages > 0 && (
          <span
            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
            style={{ background: "var(--brand-gradient)" }}
          />
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        <CategoryBadge category={t.category} />
        <StatusBadge status={t.status} />
        <PriorityBadge priority={t.priority} />
      </div>
      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
        <Clock size={10} />
        {timeAgo(t.createdAt)}
      </p>
    </button>
  );
}

// ─── Ticket Detail Panel ──────────────────────────────────────────────────────

interface TicketDetailProps {
  ticket: SupportTicket;
  onUpdated: (ticket: SupportTicket) => void;
}

function TicketDetail({ ticket: t, onUpdated }: TicketDetailProps) {
  const [replyText, setReplyText]     = useState("");
  const [sending, setSending]         = useState(false);
  const [closing, setClosing]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [t.messages.length]);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    setError(null);
    try {
      const updated = await replySupportTicket(t._id, replyText.trim());
      onUpdated(updated);
      setReplyText("");
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    if (!confirm("Mark this ticket as resolved?")) return;
    setClosing(true);
    try {
      const updated = await closeSupportTicket(t._id);
      onUpdated(updated);
    } catch {
      // silently fail
    } finally {
      setClosing(false);
    }
  };

  const canReply   = t.status !== "closed" && t.status !== "resolved";
  const canResolve = t.status === "open" || t.status === "in_progress";

  // Build message thread: first message is the original description
  const allMessages: Array<{ sender: "user" | "admin"; content: string; createdAt: string }> = [
    { sender: "user", content: t.description, createdAt: t.createdAt },
    ...t.messages,
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-gray-900 mb-1">{t.subject}</h3>
            <p className="text-xs text-gray-400">#{t.ticketNumber}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <StatusBadge status={t.status} />
            <PriorityBadge priority={t.priority} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <CategoryBadge category={t.category} />
          <span className="text-xs text-gray-400">
            Opened {timeAgo(t.createdAt)}
          </span>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {allMessages.map((msg, i) => {
          const isUser = msg.sender === "user";
          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  isUser
                    ? "text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
                style={isUser ? { background: "var(--brand-gradient)" } : {}}
              >
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={`text-xs mt-1.5 ${
                    isUser ? "text-white/60 text-right" : "text-gray-400"
                  }`}
                >
                  {isUser ? "You" : "Abjad Support"} · {timeAgo(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply box */}
      {canReply ? (
        <div className="px-5 py-4 border-t border-gray-100 shrink-0">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl mb-3">
              <AlertCircle size={13} className="shrink-0" /> {error}
            </div>
          )}
          <div className="flex items-end gap-2">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleReply();
              }}
              className="flex-1 px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
            <button
              onClick={handleReply}
              disabled={sending || !replyText.trim()}
              className="p-3 rounded-xl text-white transition-all hover:shadow-md disabled:opacity-60 shrink-0"
              style={{ background: "var(--brand-gradient)" }}
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          {canResolve && (
            <button
              onClick={handleClose}
              disabled={closing}
              className="flex items-center gap-1.5 mt-2 text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              {closing ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
              Mark as Resolved
            </button>
          )}
        </div>
      ) : (
        <div className="px-5 py-3 border-t border-gray-100 shrink-0">
          <p className="text-xs text-gray-400 text-center">
            This ticket is {t.status}. No further replies can be sent.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Feedback Section ─────────────────────────────────────────────────────────

function FeedbackSection() {
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
  };

  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="text-sm font-bold text-gray-900 mb-1">Rate Your Experience</h2>
      <p className="text-xs text-gray-400 mb-4">
        How satisfied are you with our support service?
      </p>

      {submitted ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 size={18} />
          <p className="text-sm font-semibold">Thank you for your feedback!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Stars */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={26}
                  className={`transition-colors ${
                    star <= (hover || rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-sm text-gray-500 ml-1">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </span>
            )}
          </div>

          {/* Comment */}
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any additional comments? (optional)"
            className="w-full max-w-lg px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
            style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
          />

          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-50 hover:shadow-md"
            style={{ background: "var(--brand-gradient)" }}
          >
            <Send size={13} />
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SupportPage() {
  const [tickets, setTickets]           = useState<SupportTicket[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSupportTickets({ limit: 50 });
      const loaded = res.tickets ?? [];
      setTickets(loaded);
      if (loaded.length > 0 && !selectedId) {
        setSelectedId(loaded[0]._id);
      }
    } catch (e: unknown) {
      setError((e as Error)?.message ?? "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const selectedTicket = tickets.find((t) => t._id === selectedId) ?? null;

  const handleCreated = (ticket: SupportTicket) => {
    setTickets((prev) => [ticket, ...prev]);
    setSelectedId(ticket._id);
  };

  const handleUpdated = (updated: SupportTicket) => {
    setTickets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare size={20} style={{ color: "var(--brand-primary)" }} />
            Support
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Get help from the Abjad support team</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg shrink-0"
          style={{ background: "var(--brand-gradient)" }}
        >
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      {/* Two-panel layout */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-gray-300" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle size={30} className="text-red-400" />
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={loadTickets}
            className="px-4 py-2 text-sm font-medium text-white rounded-xl"
            style={{ background: "var(--brand-gradient)" }}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden" style={{ height: "calc(100vh - 20rem)", minHeight: "500px" }}>
          <div className="flex h-full">
            {/* Left: ticket list */}
            <div className="w-full sm:w-80 xl:w-96 shrink-0 border-r border-gray-100 flex flex-col h-full">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <p className="text-xs font-semibold text-gray-500">
                  {tickets.length} ticket{tickets.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {tickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: "var(--brand-gradient)" }}
                    >
                      <Ticket size={20} className="text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">No tickets yet</p>
                    <p className="text-xs text-gray-400 mb-4">Need help? Open a support ticket.</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-xl"
                      style={{ background: "var(--brand-gradient)" }}
                    >
                      <Plus size={12} /> New Ticket
                    </button>
                  </div>
                ) : (
                  tickets.map((t) => (
                    <TicketListItem
                      key={t._id}
                      ticket={t}
                      isSelected={selectedId === t._id}
                      onSelect={() => setSelectedId(t._id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right: ticket detail */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {selectedTicket ? (
                <TicketDetail
                  key={selectedTicket._id}
                  ticket={selectedTicket}
                  onUpdated={handleUpdated}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <Circle size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-500">Select a ticket to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback section */}
      <FeedbackSection />

      {/* Create ticket modal */}
      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
