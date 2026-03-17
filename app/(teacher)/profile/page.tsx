"use client";

import { useState } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Globe,
  MapPin,
  DollarSign,
  CheckCircle2,
  Camera,
  Plus,
  Trash2,
  Edit2,
  Save,
  ChevronRight,
  AlertCircle,
  Eye,
  Download,
} from "lucide-react";

// ─── Section nav ──────────────────────────────────────────────────────────────

const sections = [
  { id: "personal", label: "Personal Info", icon: User, done: true },
  { id: "professional", label: "Professional Info", icon: Briefcase, done: true },
  { id: "education", label: "Education", icon: GraduationCap, done: true },
  { id: "certifications", label: "Certifications", icon: Award, done: false },
  { id: "resume", label: "Resume / CV", icon: FileText, done: false },
  { id: "languages", label: "Languages", icon: Globe, done: true },
  { id: "location", label: "Location & Compensation", icon: MapPin, done: false },
];

const subjects = [
  "Islamic Studies", "Arabic Language", "English Language", "Mathematics",
  "Science", "Physics", "Chemistry", "Biology", "Computer Science",
  "Social Studies", "Physical Education", "Art", "Other",
];
const gradeLevels = [
  "Kindergarten (KG1, KG2)", "Elementary (Grades 1–6)",
  "Middle School (Grades 7–9)", "High School (Grades 10–12)",
];
const cities = [
  "Riyadh", "Jeddah", "Khobar / Dammam", "Mecca", "Medina", "Abha", "Tabuk", "Dhahran", "Other",
];
const proficiencyLevels = ["Native", "Fluent", "Intermediate", "Basic"];
const experienceOptions = ["0–1 years", "1–3 years", "3–5 years", "5–10 years", "10+ years"];
const degreeTypes = ["Bachelor's", "Master's", "PhD", "Diploma"];

// ─── Reusable field ───────────────────────────────────────────────────────────

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors bg-white";
const selectCls =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors bg-white appearance-none cursor-pointer";

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, done }: { title: string; subtitle?: string; done?: boolean }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          {title}
          {done ? (
            <CheckCircle2 size={16} className="text-green-500" />
          ) : (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Incomplete</span>
          )}
        </h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState("personal");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Mathematics", "Physics"]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>(["High School (Grades 10–12)", "Middle School (Grades 7–9)"]);
  const [selectedCities, setSelectedCities] = useState<string[]>(["Riyadh", "Jeddah"]);
  const [certifications, setCertifications] = useState([
    { id: 1, name: "Teaching License – Saudi MOE", org: "Saudi Ministry of Education", issueDate: "2022-01", expiryDate: "2026-01" },
  ]);

  const completeness = Math.round((sections.filter(s => s.done).length / sections.length) * 100);

  function toggleItem(arr: string[], setArr: (a: string[]) => void, item: string) {
    setArr(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your information visible to schools</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-primary border border-brand-primary/40 rounded-lg hover:bg-brand-primary-light transition-colors">
            <Eye size={15} /> Preview
          </button>
          <div className="text-sm font-semibold text-brand-primary bg-brand-primary-light px-3 py-1.5 rounded-lg">
            {completeness}% Complete
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Section nav + avatar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="relative inline-block mb-3">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center text-white text-2xl font-bold mx-auto">
                AH
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Camera size={13} className="text-gray-600" />
              </button>
            </div>
            <h3 className="font-semibold text-gray-900">Ahmed Hassan</h3>
            <p className="text-xs text-gray-500 mt-0.5">Mathematics & Physics Teacher</p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle2 size={11} /> Profile Approved
              </span>
            </div>
            {/* Completeness bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Profile strength</span>
                <span className="font-medium text-brand-primary">{completeness}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: `${completeness}%`, background: "var(--brand-gradient)" }}
                />
              </div>
            </div>
          </div>

          {/* Section nav */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3">
            {sections.map(({ id, label, icon: Icon, done }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left mb-0.5
                  ${activeSection === id
                    ? "bg-brand-primary-light text-brand-primary-dark"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon size={15} className={activeSection === id ? "text-brand-primary" : "text-gray-400"} />
                <span className="flex-1">{label}</span>
                {done
                  ? <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                  : <AlertCircle size={13} className="text-amber-400 shrink-0" />
                }
              </button>
            ))}
          </div>
        </div>

        {/* Right: Form panels */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">

            {/* ── Personal Info ─────────────────────────────────────── */}
            {activeSection === "personal" && (
              <div>
                <SectionHeader title="Personal Information" done />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name (English)" required>
                    <input defaultValue="Ahmed Hassan" className={inputCls} />
                  </FormField>
                  <FormField label="Full Name (Arabic)" required>
                    <input defaultValue="أحمد حسن" className={inputCls} dir="rtl" />
                  </FormField>
                  <FormField label="ID Type" required>
                    <select className={selectCls} defaultValue="National ID">
                      <option>National ID</option>
                      <option>Iqama</option>
                    </select>
                  </FormField>
                  <FormField label="ID Number" required>
                    <input defaultValue="1098765432" className={inputCls} />
                  </FormField>
                  <FormField label="Date of Birth" required>
                    <input type="date" defaultValue="1990-05-15" className={inputCls} />
                  </FormField>
                  <FormField label="Gender" required>
                    <select className={selectCls} defaultValue="Male">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </FormField>
                  <FormField label="Nationality" required>
                    <input defaultValue="Saudi Arabian" className={inputCls} />
                  </FormField>
                  <FormField label="Contact Email" required>
                    <input type="email" defaultValue="ahmed.hassan@email.com" className={inputCls} />
                  </FormField>
                  <FormField label="Mobile Number" required>
                    <div className="flex">
                      <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600 shrink-0">+966</span>
                      <input defaultValue="501234567" className={`${inputCls} rounded-l-none`} />
                    </div>
                  </FormField>
                  <FormField label="WhatsApp Number">
                    <div className="flex">
                      <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600 shrink-0">+966</span>
                      <input defaultValue="501234567" className={`${inputCls} rounded-l-none`} />
                    </div>
                  </FormField>
                </div>
                <SaveButton />
              </div>
            )}

            {/* ── Professional Info ──────────────────────────────────── */}
            {activeSection === "professional" && (
              <div>
                <SectionHeader title="Professional Information" done />
                <div className="space-y-5">
                  <FormField label="Subjects Taught" required>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {subjects.map(s => (
                        <button
                          key={s}
                          onClick={() => toggleItem(selectedSubjects, setSelectedSubjects, s)}
                          className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors
                            ${selectedSubjects.includes(s)
                              ? "bg-brand-primary text-white border-brand-primary"
                              : "bg-white text-gray-600 border-gray-200 hover:border-brand-primary/50"
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <FormField label="Grade Levels" required>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {gradeLevels.map(g => (
                        <button
                          key={g}
                          onClick={() => toggleItem(selectedGrades, setSelectedGrades, g)}
                          className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors
                            ${selectedGrades.includes(g)
                              ? "bg-brand-primary text-white border-brand-primary"
                              : "bg-white text-gray-600 border-gray-200 hover:border-brand-primary/50"
                            }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Years of Experience" required>
                      <select className={selectCls} defaultValue="5–10 years">
                        {experienceOptions.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Employment Status" required>
                      <select className={selectCls} defaultValue="Available immediately">
                        <option>Currently employed</option>
                        <option>Available immediately</option>
                        <option>Available with notice period</option>
                      </select>
                    </FormField>
                  </div>
                </div>
                <SaveButton />
              </div>
            )}

            {/* ── Education ─────────────────────────────────────────── */}
            {activeSection === "education" && (
              <div>
                <SectionHeader title="Educational Credentials" done />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Degree Type" required>
                    <select className={selectCls} defaultValue="Bachelor's">
                      {degreeTypes.map(d => <option key={d}>{d}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Major / Specialization" required>
                    <input defaultValue="Mathematics Education" className={inputCls} />
                  </FormField>
                  <FormField label="University Name" required>
                    <input defaultValue="King Abdulaziz University" className={inputCls} />
                  </FormField>
                  <FormField label="Graduation Year" required>
                    <input type="number" defaultValue={2014} className={inputCls} />
                  </FormField>
                  <FormField label="Country of Graduation" required>
                    <input defaultValue="Saudi Arabia" className={inputCls} />
                  </FormField>
                  <FormField label="Degree Certificate (PDF, max 10MB)">
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:border-brand-primary/40 transition-colors cursor-pointer">
                      <p className="text-xs text-gray-500">
                        <span className="text-brand-primary font-medium">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">degree_certificate.pdf · Uploaded</p>
                    </div>
                  </FormField>
                </div>
                <SaveButton />
              </div>
            )}

            {/* ── Certifications ────────────────────────────────────── */}
            {activeSection === "certifications" && (
              <div>
                <SectionHeader title="Certifications" subtitle="Upload teaching licenses and professional certificates" />
                <div className="space-y-3 mb-5">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField label="Certification Name" required>
                              <input defaultValue={cert.name} className={inputCls} />
                            </FormField>
                            <FormField label="Issuing Organization" required>
                              <input defaultValue={cert.org} className={inputCls} />
                            </FormField>
                            <FormField label="Issue Date" required>
                              <input type="month" defaultValue={cert.issueDate} className={inputCls} />
                            </FormField>
                            <FormField label="Expiry Date">
                              <input type="month" defaultValue={cert.expiryDate} className={inputCls} />
                            </FormField>
                          </div>
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Certificate File (PDF, max 5MB)</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-2.5 text-center hover:border-brand-primary/40 transition-colors cursor-pointer">
                              <p className="text-xs text-gray-500">
                                <span className="text-brand-primary font-medium">Upload file</span>
                                <span className="text-gray-400 ml-1">or drag & drop</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setCertifications(certifications.filter(c => c.id !== cert.id))}
                          className="shrink-0 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setCertifications([...certifications, { id: Date.now(), name: "", org: "", issueDate: "", expiryDate: "" }])}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-primary/30 rounded-xl text-sm text-brand-primary hover:border-brand-primary/60 hover:bg-brand-primary-light transition-colors w-full justify-center"
                >
                  <Plus size={15} /> Add Certification
                </button>
                <SaveButton />
              </div>
            )}

            {/* ── Resume ────────────────────────────────────────────── */}
            {activeSection === "resume" && (
              <div>
                <SectionHeader title="Resume / CV" subtitle="Upload your latest CV for schools to download" />
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-brand-primary/40 transition-colors cursor-pointer mb-4">
                  <div className="w-14 h-14 bg-brand-primary-light rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FileText size={24} className="text-brand-primary" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Drop your CV here</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — max 10MB</p>
                  <button className="mt-4 px-5 py-2 text-sm font-medium text-brand-primary border border-brand-primary/40 rounded-lg hover:bg-brand-primary-light transition-colors">
                    Browse Files
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">No CV uploaded yet</p>
                    <p className="text-xs text-gray-400">Upload your CV to let schools review your full profile</p>
                  </div>
                  <button className="shrink-0 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-white transition-colors">
                    <Download size={13} /> Download
                  </button>
                </div>
              </div>
            )}

            {/* ── Languages ─────────────────────────────────────────── */}
            {activeSection === "languages" && (
              <div>
                <SectionHeader title="Languages" done />
                <div className="space-y-4">
                  {[
                    { lang: "Arabic", defaultLevel: "Native" },
                    { lang: "English", defaultLevel: "Fluent" },
                  ].map(({ lang, defaultLevel }) => (
                    <div key={lang} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{lang}</p>
                      </div>
                      <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 bg-white" defaultValue={defaultLevel}>
                        {proficiencyLevels.map(l => <option key={l}>{l}</option>)}
                      </select>
                    </div>
                  ))}
                  <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-primary/30 rounded-xl text-sm text-brand-primary hover:border-brand-primary/60 hover:bg-brand-primary-light transition-colors w-full justify-center">
                    <Plus size={15} /> Add Language
                  </button>
                </div>
                <SaveButton />
              </div>
            )}

            {/* ── Location & Compensation ────────────────────────────── */}
            {activeSection === "location" && (
              <div>
                <SectionHeader title="Location & Compensation Preferences" subtitle="Help schools find you based on where you want to work" />
                <div className="space-y-5">
                  <FormField label="Preferred Cities" required>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {cities.map(c => (
                        <button
                          key={c}
                          onClick={() => toggleItem(selectedCities, setSelectedCities, c)}
                          className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors
                            ${selectedCities.includes(c)
                              ? "bg-brand-primary text-white border-brand-primary"
                              : "bg-white text-gray-600 border-gray-200 hover:border-brand-primary/50"
                            }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Contract Type Preference">
                      <select className={selectCls} defaultValue="Full time">
                        <option>Full time</option>
                        <option>Part-time</option>
                        <option>Temporary / Substitute</option>
                        <option>Any</option>
                      </select>
                    </FormField>
                    <FormField label="Expected Monthly Salary (SAR)">
                      <div className="flex gap-2">
                        <input type="number" placeholder="Min" className={inputCls} defaultValue={10000} />
                        <input type="number" placeholder="Max" className={inputCls} defaultValue={14000} />
                      </div>
                    </FormField>
                  </div>

                  <div className="bg-brand-primary-light border border-brand-primary/20 rounded-xl p-3 flex items-start gap-2.5">
                    <DollarSign size={15} className="text-brand-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-brand-primary-dark">
                      Salary is negotiated directly between you and the school. Abjad does not interfere in salary terms.
                    </p>
                  </div>
                </div>
                <SaveButton />
              </div>
            )}

          </div>

          {/* Section Navigation arrows */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                const idx = sections.findIndex(s => s.id === activeSection);
                if (idx > 0) setActiveSection(sections[idx - 1].id);
              }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-white border border-gray-200 transition-colors disabled:opacity-40"
              disabled={activeSection === sections[0].id}
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                const idx = sections.findIndex(s => s.id === activeSection);
                if (idx < sections.length - 1) setActiveSection(sections[idx + 1].id);
              }}
              className="flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary-dark px-3 py-2 rounded-lg hover:bg-brand-primary-light border border-brand-primary/30 transition-colors disabled:opacity-40"
              disabled={activeSection === sections[sections.length - 1].id}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SaveButton() {
  return (
    <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">
      <button
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors"
        style={{ background: "var(--brand-gradient)" }}
      >
        <Save size={14} /> Save Changes
      </button>
    </div>
  );
}
