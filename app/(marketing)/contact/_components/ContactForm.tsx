"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const ROLE_VALUES = ["school_admin", "hiring_manager", "teacher", "substitute_teacher"];

interface FormState {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  message: string;
}

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  role: "",
  location: "",
  message: "",
};

export default function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const roles = ROLE_VALUES.map((value, i) => ({ value, label: t.contactPage.form.roles[i] }));

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up to API endpoint
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section
      id="contact-form"
      className="py-24 overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-10">

        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 bg-white/10 text-white/70">
            {t.contactPage.form.badge}
          </span>
          <h2
            className="font-extrabold text-white mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em" }}
          >
            {t.contactPage.form.headline}
          </h2>
          <p className="text-white/55 text-base max-w-xl mx-auto">
            {t.contactPage.form.subPre}{" "}
            <strong className="text-white/80">{t.contactPage.form.subHighlight}</strong>.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-5">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--brand-accent-light)" }}
              >
                <CheckCircle2 size={32} style={{ color: "var(--brand-accent)" }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{t.contactPage.form.successTitle}</h3>
              <p className="text-gray-500 max-w-sm">
                {t.contactPage.form.successBody}
              </p>
              <button
                onClick={() => { setForm(INITIAL); setSubmitted(false); }}
                className="mt-2 text-sm font-semibold rounded-full px-6 py-2 transition-all hover:scale-105"
                style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
              >
                {t.contactPage.form.submitAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={t.contactPage.form.fullName} required>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder={t.contactPage.form.fullNamePlaceholder}
                    className="field-input"
                  />
                </Field>
                <Field label={t.contactPage.form.email} required>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder={t.contactPage.form.emailPlaceholder}
                    className="field-input"
                    dir="ltr"
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={t.contactPage.form.phone} required>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder={t.contactPage.form.phonePlaceholder}
                    className="field-input"
                    dir="ltr"
                  />
                </Field>
                <Field label={t.contactPage.form.role} required>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="field-input"
                  >
                    <option value="" disabled>{t.contactPage.form.roleSelectPlaceholder}</option>
                    {roles.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label={t.contactPage.form.location}>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder={t.contactPage.form.locationPlaceholder}
                  className="field-input"
                />
              </Field>

              <Field label={t.contactPage.form.message} required>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder={t.contactPage.form.messagePlaceholder}
                  className="field-input resize-none"
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white shadow-md hover:scale-[1.02] hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "var(--brand-gradient)" }}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={16} strokeWidth={2} />
                    {t.contactPage.form.submitButton}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                {t.contactPage.form.privacyNote}
              </p>
            </form>
          )}
        </div>
      </div>

      <style jsx>{`
        .field-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1.5px solid #e5e7eb;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: #111827;
          background: #f9fafb;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input:focus {
          border-color: var(--brand-accent);
          box-shadow: 0 0 0 3px rgba(0, 172, 211, 0.12);
          background: #fff;
        }
        .field-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-400 ms-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
