"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  UserCog,
  FileText,
  CheckCircle2,
  AlertCircle,
  Camera,
  Save,
  Loader2,
  X,
  Upload,
  ChevronRight,
  Info,
  Globe,
  Mail,
} from "lucide-react";
import {
  getSchoolProfile,
  updateBasicInfo,
  updateSchoolLocation,
  updateSchoolContact,
  updateAdminContact,
  uploadSchoolLogo,
  uploadSchoolDocument,
  submitSchoolProfile,
} from "@/lib/api/school";
import type { SchoolProfile } from "@/lib/api/school";
import { useAuth } from "@/lib/auth/useAuth";

// ─── Constants ────────────────────────────────────────────────────────────────

const SCHOOL_TYPES = [
  { value: "government",    label: "Government" },
  { value: "private",       label: "Private" },
  { value: "international", label: "International" },
  { value: "ahli",          label: "Ahli" },
] as const;

const EDUCATION_LEVELS = [
  { value: "elementary", label: "Elementary" },
  { value: "middle",     label: "Middle School" },
  { value: "high",       label: "High School" },
  { value: "k12",        label: "K-12" },
  { value: "mixed",      label: "Mixed" },
] as const;

const GENDERS = [
  { value: "male",   label: "Male" },
  { value: "female", label: "Female" },
  { value: "mixed",  label: "Mixed" },
] as const;

const STUDENT_COUNTS = [
  { value: "<100",       label: "Less than 100" },
  { value: "100-500",    label: "100 – 500" },
  { value: "500-1000",   label: "500 – 1,000" },
  { value: "1000-5000",  label: "1,000 – 5,000" },
  { value: ">5000",      label: "More than 5,000" },
] as const;

const SAUDI_CITIES = [
  { value: "riyadh",  label: "Riyadh" },
  { value: "jeddah",  label: "Jeddah" },
  { value: "makkah",  label: "Makkah" },
  { value: "madinah", label: "Madinah" },
  { value: "dammam",  label: "Dammam" },
  { value: "khobar",  label: "Khobar" },
  { value: "jubail",  label: "Jubail" },
  { value: "taif",    label: "Taif" },
  { value: "tabuk",   label: "Tabuk" },
  { value: "other",   label: "Other" },
] as const;

// Completion score weights
const COMPLETION_WEIGHTS = [
  { key: "nameAr",                 weight: 7,  label: "School Name (Arabic)" },
  { key: "nameEn",                 weight: 8,  label: "School Name (English)" },
  { key: "type",                   weight: 5,  label: "School Type" },
  { key: "educationLevel",         weight: 5,  label: "Education Level" },
  { key: "gender",                 weight: 5,  label: "Gender" },
  { key: "city",                   weight: 5,  label: "City" },
  { key: "logo",                   weight: 5,  label: "School Logo" },
  { key: "adminContact",           weight: 15, label: "Admin Contact" },
  { key: "phone",                  weight: 3,  label: "Phone" },
  { key: "email",                  weight: 2,  label: "Email" },
  { key: "commercialRegistration", weight: 20, label: "Commercial Registration" },
  { key: "ministryLicense",        weight: 15, label: "Ministry License" },
] as const;

type SectionId = "basic" | "location" | "contact" | "admin" | "documents";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUploadDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function sectionDone(profile: SchoolProfile | null, id: SectionId): boolean {
  if (!profile) return false;
  switch (id) {
    case "basic":
      return !!(profile.nameEn && profile.nameAr && profile.type && profile.educationLevel && profile.gender);
    case "location":
      return !!(profile.city);
    case "contact":
      return !!(profile.phone && profile.email);
    case "admin":
      return !!(profile.adminContact?.name && profile.adminContact?.phone && profile.adminContact?.email);
    case "documents":
      return !!(profile.documents?.commercialRegistration && profile.documents?.ministryLicense);
    default:
      return false;
  }
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

const inputCls =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors bg-white";

const selectCls =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors bg-white appearance-none cursor-pointer";

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

function SectionHeader({
  title,
  subtitle,
  done,
}: {
  title: string;
  subtitle?: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          {title}
          {done ? (
            <CheckCircle2 size={16} className="text-green-500" />
          ) : (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              Incomplete
            </span>
          )}
        </h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function SaveButton({
  saving,
  onClick,
}: {
  saving: boolean;
  onClick: () => void;
}) {
  return (
    <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">
      <button
        onClick={onClick}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60"
        style={{ background: "var(--brand-gradient)" }}
      >
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

// ─── Document Upload Zone ─────────────────────────────────────────────────────

function DocumentUploadZone({
  label,
  description,
  uploadedAt,
  uploading,
  onFile,
}: {
  label: string;
  description: string;
  uploadedAt?: string | null;
  uploading: boolean;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
        {uploadedAt && (
          <span className="shrink-0 flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">
            <CheckCircle2 size={11} />
            Uploaded {formatUploadDate(uploadedAt)}
          </span>
        )}
      </div>

      {uploading ? (
        <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-lg">
          <Loader2 size={16} className="animate-spin text-gray-400" />
          <span className="text-xs text-gray-500">Uploading…</span>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-brand-primary/40 hover:bg-gray-50/50 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={18} className="text-gray-400 mx-auto mb-1.5" />
          <p className="text-xs text-gray-500">
            <span className="font-medium" style={{ color: "var(--brand-primary)" }}>
              {uploadedAt ? "Replace document" : "Click to upload"}
            </span>
            {" "}or drag & drop
          </p>
          <p className="text-xs text-gray-400 mt-0.5">PDF only — max 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFile(file);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}

// ─── Completion Banner ────────────────────────────────────────────────────────

function CompletionBanner({ profile }: { profile: SchoolProfile }) {
  const missing = COMPLETION_WEIGHTS.filter(({ key }) => {
    switch (key) {
      case "nameAr":                 return !profile.nameAr;
      case "nameEn":                 return !profile.nameEn;
      case "type":                   return !profile.type;
      case "educationLevel":         return !profile.educationLevel;
      case "gender":                 return !profile.gender;
      case "city":                   return !profile.city;
      case "logo":                   return !profile.logoUrl;
      case "adminContact":           return !(profile.adminContact?.name && profile.adminContact?.phone);
      case "phone":                  return !profile.phone;
      case "email":                  return !profile.email;
      case "commercialRegistration": return !profile.documents?.commercialRegistration;
      case "ministryLicense":        return !profile.documents?.ministryLicense;
      default:                       return false;
    }
  });

  if (missing.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
      <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-blue-800 mb-1.5">
          Complete these sections to reach 60% and submit for verification:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {missing.map(({ key, label, weight }) => (
            <span
              key={key}
              className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-medium"
            >
              +{weight}% {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SchoolProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile]           = useState<SchoolProfile | null>(null);
  const [loading, setLoading]           = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>("basic");
  const [saving, setSaving]             = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Per-section form state
  const [basic, setBasic] = useState({
    nameEn: "", nameAr: "", type: "" as SchoolProfile["type"] | "",
    educationLevel: "" as SchoolProfile["educationLevel"] | "",
    gender: "" as SchoolProfile["gender"] | "",
    foundedYear: "", studentsCount: "" as SchoolProfile["studentsCount"] | "",
  });
  const [location, setLocation] = useState({
    city: "", district: "", address: "",
  });
  const [contact, setContact] = useState({
    website: "", phone: "", email: "",
  });
  const [adminContactForm, setAdminContactForm] = useState({
    name: "", jobTitle: "", phone: "", email: "",
  });

  // Document upload states
  const [uploadingCR, setUploadingCR] = useState(false);
  const [uploadingML, setUploadingML] = useState(false);

  // Logo upload
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ── Load profile ────────────────────────────────────────────────────────────

  const loadProfile = useCallback(async () => {
    try {
      const p = await getSchoolProfile();
      setProfile(p);

      setBasic({
        nameEn:         p.nameEn         ?? "",
        nameAr:         p.nameAr         ?? "",
        type:           p.type           ?? "",
        educationLevel: p.educationLevel ?? "",
        gender:         p.gender         ?? "",
        foundedYear:    p.foundedYear    ? String(p.foundedYear) : "",
        studentsCount:  p.studentsCount  ?? "",
      });
      setLocation({
        city:     p.city     ?? "",
        district: p.district ?? "",
        address:  p.address  ?? "",
      });
      setContact({
        website: p.website ?? "",
        phone:   p.phone   ?? "",
        email:   p.email   ?? "",
      });
      setAdminContactForm({
        name:     p.adminContact?.name     ?? "",
        jobTitle: p.adminContact?.jobTitle ?? "",
        phone:    p.adminContact?.phone    ?? "",
        email:    p.adminContact?.email    ?? "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  // ── Save handlers ────────────────────────────────────────────────────────────

  const saveBasic = async () => {
    setSaving(true);
    try {
      const updated = await updateBasicInfo({
        nameEn:         basic.nameEn         || undefined,
        nameAr:         basic.nameAr         || undefined,
        type:           (basic.type           || undefined) as SchoolProfile["type"] | undefined,
        educationLevel: (basic.educationLevel || undefined) as SchoolProfile["educationLevel"] | undefined,
        gender:         (basic.gender         || undefined) as SchoolProfile["gender"] | undefined,
        foundedYear:    basic.foundedYear     ? parseInt(basic.foundedYear) : undefined,
        studentsCount:  (basic.studentsCount  || undefined) as SchoolProfile["studentsCount"] | undefined,
      });
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveLocation = async () => {
    setSaving(true);
    try {
      const updated = await updateSchoolLocation({
        city:     location.city     || undefined,
        district: location.district || undefined,
        address:  location.address  || undefined,
      });
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveContact = async () => {
    setSaving(true);
    try {
      const updated = await updateSchoolContact({
        website: contact.website || undefined,
        phone:   contact.phone   || undefined,
        email:   contact.email   || undefined,
      });
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveAdminContact = async () => {
    setSaving(true);
    try {
      const updated = await updateAdminContact({
        name:     adminContactForm.name     || undefined,
        jobTitle: adminContactForm.jobTitle || undefined,
        phone:    adminContactForm.phone    || undefined,
        email:    adminContactForm.email    || undefined,
      });
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── File upload handlers ──────────────────────────────────────────────────────

  const handleLogoUpload = async (file: File) => {
    try {
      const result = await uploadSchoolLogo(file);
      setProfile((prev) =>
        prev ? { ...prev, logoUrl: result.logoUrl, completionPercentage: result.completionPercentage } : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDocumentUpload = async (
    docType: "commercialRegistration" | "ministryLicense",
    file: File
  ) => {
    if (docType === "commercialRegistration") setUploadingCR(true);
    else setUploadingML(true);
    try {
      const result = await uploadSchoolDocument(docType, file);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              documents: result.documents,
              completionPercentage: result.completionPercentage,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    } finally {
      if (docType === "commercialRegistration") setUploadingCR(false);
      else setUploadingML(false);
    }
  };

  const handleSubmitProfile = async () => {
    setSubmitting(true);
    try {
      const result = await submitSchoolProfile();
      setProfile((prev) =>
        prev
          ? { ...prev, profileStatus: result.profileStatus as SchoolProfile["profileStatus"], submittedAt: result.submittedAt }
          : prev
      );
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────────

  const completion    = profile?.completionPercentage ?? 0;
  const profileStatus = profile?.profileStatus ?? "draft";
  const schoolName    = profile?.nameEn ?? profile?.nameAr ?? user?.schoolName ?? "School";
  const initial       = schoolName[0]?.toUpperCase() ?? "S";

  const canSubmit     = completion >= 60 && profileStatus === "draft";

  const sectionList: { id: SectionId; label: string; icon: React.ElementType; done: boolean }[] = [
    { id: "basic",     label: "Basic Info",     icon: Building2, done: sectionDone(profile, "basic") },
    { id: "location",  label: "Location",       icon: MapPin,    done: sectionDone(profile, "location") },
    { id: "contact",   label: "Contact",        icon: Phone,     done: sectionDone(profile, "contact") },
    { id: "admin",     label: "Admin Contact",  icon: UserCog,   done: sectionDone(profile, "admin") },
    { id: "documents", label: "Documents",      icon: FileText,  done: sectionDone(profile, "documents") },
  ];

  const statusBadge = () => {
    switch (profileStatus) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
            <CheckCircle2 size={11} /> Verified by Abjad
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
            <Loader2 size={11} className="animate-spin" /> Verification in progress
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">
            <X size={11} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
            <AlertCircle size={11} /> Draft
          </span>
        );
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">School Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your school information visible to teachers
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="text-sm font-semibold px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
          >
            {completion}% Complete
          </div>
          {canSubmit && !submitSuccess && (
            <button
              onClick={handleSubmitProfile}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60"
              style={{ background: "var(--brand-gradient)" }}
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
              Submit for Verification
            </button>
          )}
          {submitSuccess && (
            <span className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg font-medium">
              <CheckCircle2 size={14} /> Submitted
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── Left sidebar ──────────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Logo / avatar card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="relative inline-block mb-3">
              {profile?.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={schoolName}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto border border-gray-100"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  {initial}
                </div>
              )}
              <button
                onClick={() => logoInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Camera size={13} className="text-gray-600" />
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleLogoUpload(f);
                  if (e.target) e.target.value = "";
                }}
              />
            </div>

            <h3 className="font-semibold text-gray-900 text-sm leading-snug">{schoolName}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            <div className="mt-3">{statusBadge()}</div>

            {/* Completion bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Profile strength</span>
                <span className="font-medium" style={{ color: "var(--brand-primary)" }}>
                  {completion}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${completion}%`, background: "var(--brand-gradient)" }}
                />
              </div>
            </div>
          </div>

          {/* Section nav */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3">
            {sectionList.map(({ id, label, icon: Icon, done }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left mb-0.5
                  ${activeSection === id
                    ? "text-brand-primary-dark"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
                style={
                  activeSection === id
                    ? { backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }
                    : {}
                }
              >
                <Icon
                  size={15}
                  style={activeSection === id ? { color: "var(--brand-primary)" } : {}}
                  className={activeSection === id ? "" : "text-gray-400"}
                />
                <span className="flex-1">{label}</span>
                {done
                  ? <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                  : <AlertCircle  size={13} className="text-amber-400 shrink-0" />
                }
              </button>
            ))}
          </div>
        </div>

        {/* ── Right form panels ──────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">

          {/* Completion info banner */}
          {profile && <CompletionBanner profile={profile} />}

          <div className="bg-white rounded-2xl border border-gray-100 p-6">

            {/* ── Basic Info ───────────────────────────────────────── */}
            {activeSection === "basic" && (
              <div>
                <SectionHeader
                  title="Basic Information"
                  subtitle="Core details about your school"
                  done={sectionDone(profile, "basic")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="School Name (English)" required>
                    <input
                      value={basic.nameEn}
                      onChange={(e) => setBasic((b) => ({ ...b, nameEn: e.target.value }))}
                      className={inputCls}
                      placeholder="e.g. Al-Manar International School"
                    />
                  </FormField>
                  <FormField label="School Name (Arabic)" required>
                    <input
                      value={basic.nameAr}
                      onChange={(e) => setBasic((b) => ({ ...b, nameAr: e.target.value }))}
                      className={inputCls}
                      dir="rtl"
                      placeholder="اسم المدرسة بالعربية"
                    />
                  </FormField>
                  <FormField label="School Type" required>
                    <select
                      value={basic.type}
                      onChange={(e) => setBasic((b) => ({ ...b, type: e.target.value as SchoolProfile["type"] }))}
                      className={selectCls}
                    >
                      <option value="">Select type…</option>
                      {SCHOOL_TYPES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Education Level" required>
                    <select
                      value={basic.educationLevel}
                      onChange={(e) => setBasic((b) => ({ ...b, educationLevel: e.target.value as SchoolProfile["educationLevel"] }))}
                      className={selectCls}
                    >
                      <option value="">Select level…</option>
                      {EDUCATION_LEVELS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="School Gender" required>
                    <select
                      value={basic.gender}
                      onChange={(e) => setBasic((b) => ({ ...b, gender: e.target.value as SchoolProfile["gender"] }))}
                      className={selectCls}
                    >
                      <option value="">Select…</option>
                      {GENDERS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Founded Year">
                    <input
                      type="number"
                      value={basic.foundedYear}
                      onChange={(e) => setBasic((b) => ({ ...b, foundedYear: e.target.value }))}
                      className={inputCls}
                      placeholder="e.g. 2005"
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                  </FormField>
                  <FormField label="Number of Students">
                    <select
                      value={basic.studentsCount}
                      onChange={(e) => setBasic((b) => ({ ...b, studentsCount: e.target.value as SchoolProfile["studentsCount"] }))}
                      className={selectCls}
                    >
                      <option value="">Select range…</option>
                      {STUDENT_COUNTS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
                <SaveButton saving={saving} onClick={saveBasic} />
              </div>
            )}

            {/* ── Location ─────────────────────────────────────────── */}
            {activeSection === "location" && (
              <div>
                <SectionHeader
                  title="Location"
                  subtitle="Where your school is located"
                  done={sectionDone(profile, "location")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="City" required>
                    <select
                      value={location.city}
                      onChange={(e) => setLocation((l) => ({ ...l, city: e.target.value }))}
                      className={selectCls}
                    >
                      <option value="">Select city…</option>
                      {SAUDI_CITIES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="District / Neighbourhood">
                    <input
                      value={location.district}
                      onChange={(e) => setLocation((l) => ({ ...l, district: e.target.value }))}
                      className={inputCls}
                      placeholder="e.g. Al Olaya"
                    />
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="Full Address">
                      <input
                        value={location.address}
                        onChange={(e) => setLocation((l) => ({ ...l, address: e.target.value }))}
                        className={inputCls}
                        placeholder="Street name, building number…"
                      />
                    </FormField>
                  </div>
                </div>
                <SaveButton saving={saving} onClick={saveLocation} />
              </div>
            )}

            {/* ── Contact ──────────────────────────────────────────── */}
            {activeSection === "contact" && (
              <div>
                <SectionHeader
                  title="School Contact"
                  subtitle="Public contact details for your school"
                  done={sectionDone(profile, "contact")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <FormField label="Website">
                      <div className="flex">
                        <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-xs text-gray-500 shrink-0">
                          <Globe size={13} />
                        </span>
                        <input
                          type="url"
                          value={contact.website}
                          onChange={(e) => setContact((c) => ({ ...c, website: e.target.value }))}
                          className={`${inputCls} rounded-l-none`}
                          placeholder="https://www.school.edu.sa"
                        />
                      </div>
                    </FormField>
                  </div>
                  <FormField label="Phone Number" required>
                    <div className="flex">
                      <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600 shrink-0">
                        +966
                      </span>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                        className={`${inputCls} rounded-l-none`}
                        placeholder="5XXXXXXXX"
                      />
                    </div>
                  </FormField>
                  <FormField label="Contact Email" required>
                    <div className="flex">
                      <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-xs text-gray-500 shrink-0">
                        <Mail size={13} />
                      </span>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                        className={`${inputCls} rounded-l-none`}
                        placeholder="info@school.edu.sa"
                      />
                    </div>
                  </FormField>
                </div>
                <SaveButton saving={saving} onClick={saveContact} />
              </div>
            )}

            {/* ── Admin Contact ─────────────────────────────────────── */}
            {activeSection === "admin" && (
              <div>
                <SectionHeader
                  title="Admin Contact"
                  subtitle="The person responsible for hiring at your school"
                  done={sectionDone(profile, "admin")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name" required>
                    <input
                      value={adminContactForm.name}
                      onChange={(e) => setAdminContactForm((a) => ({ ...a, name: e.target.value }))}
                      className={inputCls}
                      placeholder="e.g. Mohammed Al-Qahtani"
                    />
                  </FormField>
                  <FormField label="Job Title" required>
                    <input
                      value={adminContactForm.jobTitle}
                      onChange={(e) => setAdminContactForm((a) => ({ ...a, jobTitle: e.target.value }))}
                      className={inputCls}
                      placeholder="e.g. HR Manager"
                    />
                  </FormField>
                  <FormField label="Phone Number" required>
                    <div className="flex">
                      <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600 shrink-0">
                        +966
                      </span>
                      <input
                        type="tel"
                        value={adminContactForm.phone}
                        onChange={(e) => setAdminContactForm((a) => ({ ...a, phone: e.target.value }))}
                        className={`${inputCls} rounded-l-none`}
                        placeholder="5XXXXXXXX"
                      />
                    </div>
                  </FormField>
                  <FormField label="Email Address" required>
                    <input
                      type="email"
                      value={adminContactForm.email}
                      onChange={(e) => setAdminContactForm((a) => ({ ...a, email: e.target.value }))}
                      className={inputCls}
                      placeholder="admin@school.edu.sa"
                    />
                  </FormField>
                </div>
                <SaveButton saving={saving} onClick={saveAdminContact} />
              </div>
            )}

            {/* ── Documents ─────────────────────────────────────────── */}
            {activeSection === "documents" && (
              <div>
                <SectionHeader
                  title="Verification Documents"
                  subtitle="Required for Abjad to verify your school. Files are kept confidential."
                  done={sectionDone(profile, "documents")}
                />

                <div className="space-y-4">
                  <DocumentUploadZone
                    label="Commercial Registration (السجل التجاري)"
                    description="Official commercial registration certificate — PDF, max 5MB"
                    uploadedAt={profile?.documents?.commercialRegistration?.uploadedAt ?? null}
                    uploading={uploadingCR}
                    onFile={(file) => handleDocumentUpload("commercialRegistration", file)}
                  />

                  <DocumentUploadZone
                    label="Ministry of Education License (ترخيص وزارة التعليم)"
                    description="Ministry of Education operating license — PDF, max 5MB"
                    uploadedAt={profile?.documents?.ministryLicense?.uploadedAt ?? null}
                    uploading={uploadingML}
                    onFile={(file) => handleDocumentUpload("ministryLicense", file)}
                  />
                </div>

                {/* Security note */}
                <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5">
                  <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500">
                    Documents are used exclusively for verification by the Abjad team and are
                    never shared with teachers or third parties. Files are stored securely and
                    encrypted at rest.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Section Navigation arrows */}
          <div className="flex justify-between mt-2">
            <button
              onClick={() => {
                const idx = sectionList.findIndex((s) => s.id === activeSection);
                if (idx > 0) setActiveSection(sectionList[idx - 1].id);
              }}
              disabled={activeSection === sectionList[0].id}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-white border border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                const idx = sectionList.findIndex((s) => s.id === activeSection);
                if (idx < sectionList.length - 1) setActiveSection(sectionList[idx + 1].id);
              }}
              disabled={activeSection === sectionList[sectionList.length - 1].id}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={
                activeSection !== sectionList[sectionList.length - 1].id
                  ? { color: "var(--brand-primary)", borderColor: "color-mix(in srgb, var(--brand-primary) 30%, transparent)", backgroundColor: "var(--brand-primary-light)" }
                  : { color: "#9ca3af", borderColor: "#e5e7eb" }
              }
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
