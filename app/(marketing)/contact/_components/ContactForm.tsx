"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";

const ROLES = [
  { value: "", label: "Select your role" },
  { value: "school_admin", label: "School Administrator" },
  { value: "hiring_manager", label: "Hiring Manager" },
  { value: "teacher", label: "Teacher" },
  { value: "substitute_teacher", label: "Substitute Teacher" },
];

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
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
            Contact Form
          </span>
          <h2
            className="font-extrabold text-white mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em" }}
          >
            Send Us a Message
          </h2>
          <p className="text-white/55 text-base max-w-xl mx-auto">
            Fill in the form below and our team will get back to you within{" "}
            <strong className="text-white/80">24–48 hours</strong>.
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
              <h3 className="text-2xl font-bold text-gray-900">Message Received!</h3>
              <p className="text-gray-500 max-w-sm">
                Thank you for reaching out. Our team will review your details and contact you within
                24–48 hours.
              </p>
              <button
                onClick={() => { setForm(INITIAL); setSubmitted(false); }}
                className="mt-2 text-sm font-semibold rounded-full px-6 py-2 transition-all hover:scale-105"
                style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Sara Al-Mutairi"
                    className="field-input"
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@school.sa"
                    className="field-input"
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Phone Number" required>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+966 5x xxx xxxx"
                    className="field-input"
                  />
                </Field>
                <Field label="Your Role" required>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="field-input"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value} disabled={r.value === ""}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="City / Location">
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Riyadh, Jeddah, Dammam"
                  className="field-input"
                />
              </Field>

              <Field label="Your Message" required>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us what you need — a substitute teacher, a permanent hire, or looking for work as an educator..."
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
                    Submit Now
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                Your information is handled privately and used only to match you appropriately.
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
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
