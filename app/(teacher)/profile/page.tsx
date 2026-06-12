"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Save,
  ChevronRight,
  AlertCircle,
  Eye,
  Download,
  Loader2,
  X,
} from "lucide-react";
import {
  getProfile,
  updatePersonal,
  updateProfessional,
  updateEducation,
  updateLanguages,
  updateLocation,
  updateSalary,
  addCertification,
  removeCertification,
  submitProfile,
  uploadProfilePhoto,
  uploadResume,
  uploadEducationCertificate,
  uploadCertificationFile,
} from "@/lib/api/teacher";
import type { TeacherProfile } from "@/lib/api/teacher";
import { useAuth } from "@/lib/auth/useAuth";

// ─── Constants ────────────────────────────────────────────────────────────────

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
  "Riyadh", "Jeddah", "Khobar / Dammam", "Mecca", "Medina", "Abha", "Tabuk", "Other",
];
const proficiencyLevels = ["native", "fluent", "intermediate", "basic"] as const;
const proficiencyLabels: Record<string, string> = {
  native: "Native", fluent: "Fluent", intermediate: "Intermediate", basic: "Basic",
};
const experienceOptions = ["0–1 years", "1–3 years", "3–5 years", "5–10 years", "10+ years"];

// ─── API ↔ UI enum maps ────────────────────────────────────────────────────────

const SUBJECT_UI_TO_API: Record<string, string> = {
  "Islamic Studies": "islamic_studies", "Arabic Language": "arabic",
  "English Language": "english",       "Mathematics": "math",
  "Science": "science",                "Physics": "physics",
  "Chemistry": "chemistry",            "Biology": "biology",
  "Computer Science": "computer_science", "Social Studies": "social_studies",
  "Physical Education": "pe",          "Art": "art", "Other": "other",
};
const SUBJECT_API_TO_UI: Record<string, string> = Object.fromEntries(
  Object.entries(SUBJECT_UI_TO_API).map(([k, v]) => [v, k])
);

// Grade UI groups map to multiple API values
const GRADE_UI_TO_API: Record<string, string[]> = {
  "Kindergarten (KG1, KG2)":    ["kg"],
  "Elementary (Grades 1–6)":    ["elementary_1","elementary_2","elementary_3","elementary_4","elementary_5","elementary_6"],
  "Middle School (Grades 7–9)": ["middle_7","middle_8","middle_9"],
  "High School (Grades 10–12)": ["high_10","high_11","high_12"],
};
const GRADE_API_TO_UI_GROUP: Record<string, string> = {
  kg: "Kindergarten (KG1, KG2)",
  elementary_1: "Elementary (Grades 1–6)", elementary_2: "Elementary (Grades 1–6)",
  elementary_3: "Elementary (Grades 1–6)", elementary_4: "Elementary (Grades 1–6)",
  elementary_5: "Elementary (Grades 1–6)", elementary_6: "Elementary (Grades 1–6)",
  middle_7: "Middle School (Grades 7–9)", middle_8: "Middle School (Grades 7–9)",
  middle_9: "Middle School (Grades 7–9)",
  high_10: "High School (Grades 10–12)", high_11: "High School (Grades 10–12)",
  high_12: "High School (Grades 10–12)",
};

const EXP_UI_TO_API: Record<string, string> = {
  "0–1 years": "0-1", "1–3 years": "1-3", "3–5 years": "3-5",
  "5–10 years": "5-10", "10+ years": "10+",
};
const EXP_API_TO_UI: Record<string, string> = Object.fromEntries(
  Object.entries(EXP_UI_TO_API).map(([k, v]) => [v, k])
);

const CITY_UI_TO_API: Record<string, string[]> = {
  "Riyadh": ["riyadh"],   "Jeddah": ["jeddah"],
  "Khobar / Dammam": ["khobar", "dammam"],
  "Mecca": ["mecca"],     "Medina": ["medina"],
  "Abha": ["abha"],       "Tabuk": ["tabuk"],  "Other": ["other"],
};
const CITY_API_TO_UI: Record<string, string> = {
  riyadh: "Riyadh", jeddah: "Jeddah",
  khobar: "Khobar / Dammam", dammam: "Khobar / Dammam",
  mecca: "Mecca", medina: "Medina", abha: "Abha", tabuk: "Tabuk", other: "Other",
};

const CONTRACT_UI_TO_API: Record<string, string> = {
  "Full time": "full_time", "Part-time": "part_time",
  "Temporary / Substitute": "substitute",
};
const CONTRACT_API_TO_UI: Record<string, string> = Object.fromEntries(
  Object.entries(CONTRACT_UI_TO_API).map(([k, v]) => [v, k])
);

const degreeApiToUi: Record<string, string> = {
  bachelor: "Bachelor's", master: "Master's", phd: "PhD", diploma: "Diploma", other: "Other",
};
const degreeUiToApi: Record<string, TeacherProfile["education"]["degreeType"]> = {
  "Bachelor's": "bachelor", "Master's": "master", "PhD": "phd", "Diploma": "diploma", "Other": "other",
};

// SRD 2.2.2 — three employment statuses. "noticePeriodDays" is captured separately
// (conditional input) only when status === "Currently employed".
const employmentApiToUi: Record<string, string> = {
  employed: "Currently employed",
  unemployed: "Available immediately",
  freelance: "Freelance / Self-employed",
};
const employmentUiToApi: Record<string, TeacherProfile["professional"]["employmentStatus"]> = {
  "Currently employed": "employed",
  "Available immediately": "unemployed",
  "Freelance / Self-employed": "freelance",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ISO date/datetime → "yyyy-MM" for <input type="month">
function toMonthValue(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 7); // works for "2028-06" and "2028-06-01T00:00:00.000Z"
}

function initials(firstName?: string, lastName?: string, email?: string): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return "?";
}

function displayName(profile: TeacherProfile | null, firstName?: string, lastName?: string): string {
  if (profile?.personal?.fullNameEn) return profile.personal.fullNameEn;
  if (firstName && lastName) return `${firstName} ${lastName[0]}.`;
  if (firstName) return firstName;
  return "—";
}

function sectionDone(profile: TeacherProfile | null, id: string): boolean {
  if (!profile) return false;
  const p = profile.personal;
  const pr = profile.professional;
  const ed = profile.education;
  switch (id) {
    case "personal":      return !!(p?.fullNameEn && p?.gender && p?.nationality);
    case "professional":  return !!(pr?.subjects?.length && pr?.gradeLevels?.length && pr?.experienceRange);
    case "education":     return !!(ed?.degreeType && ed?.major && ed?.university);
    case "certifications": return profile.certifications.length > 0;
    case "resume":        return !!profile.resume?.fileUrl;
    case "languages":     return profile.languages.length > 0;
    case "location":      return !!(profile.locationPreferences?.preferredCities?.length);
    default:              return false;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
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

function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
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

function toggleItem<T>(arr: T[], setArr: (a: T[]) => void, item: T) {
  setArr(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
}

// ─── Types for local form state ───────────────────────────────────────────────

type CertDraft = {
  _id?: string;          // undefined = new (not yet POSTed)
  name: string;
  issuer: string;
  issueDate: string;
  hasExpiry: boolean;
  expiryDate: string;
  fileUrl?: string;
  pendingFile?: File;
};

type LangDraft = { language: string; proficiency: string };

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("personal");
  const [showPreview, setShowPreview] = useState(false);

  // Per-section draft state
  const [personal, setPersonal] = useState({
    fullNameEn: "", fullNameAr: "", nationalId: "", idType: "National ID",
    dateOfBirth: "", gender: "male" as "male" | "female", nationality: "", whatsapp: "",
  });
  const [professional, setProfessional] = useState({
    subjects: [] as string[], gradeLevels: [] as string[],
    experienceRange: "", employmentStatus: "", noticePeriodDays: "",
  });
  const [education, setEducation] = useState({
    degreeType: "Bachelor's", major: "", university: "", graduationYear: "", country: "",
  });
  const [certs, setCerts] = useState<CertDraft[]>([]);
  const [languages, setLanguages] = useState<LangDraft[]>([]);
  const [location, setLocation] = useState({
    preferredCities: [] as string[], willingToRelocate: false,
    contractTypes: [] as string[], minSalary: "", maxSalary: "",
  });

  const [saving, setSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const eduCertInputRef = useRef<HTMLInputElement>(null);

  // ── Load profile ────────────────────────────────────────────────────────────

  const loadProfile = useCallback(async () => {
    try {
      const p = await getProfile();
      setProfile(p);

      // Seed personal
      setPersonal({
        fullNameEn:  p.personal?.fullNameEn  ?? "",
        fullNameAr:  p.personal?.fullNameAr  ?? "",
        nationalId:  p.personal?.nationalId  ?? "",
        idType:      "National ID",
        dateOfBirth: p.personal?.dateOfBirth ? p.personal.dateOfBirth.slice(0, 10) : "",
        gender:      p.personal?.gender      ?? "male",
        nationality: p.personal?.nationality ?? "",
        whatsapp:    p.personal?.whatsapp    ?? "",
      });

      // Seed professional — convert API enums to UI display strings
      const apiSubjects = p.professional?.subjects ?? [];
      const apiGrades   = p.professional?.gradeLevels ?? [];
      setProfessional({
        subjects:         apiSubjects.map((s) => SUBJECT_API_TO_UI[s] ?? s),
        gradeLevels:      [...new Set(apiGrades.map((g) => GRADE_API_TO_UI_GROUP[g]).filter(Boolean))],
        experienceRange:  EXP_API_TO_UI[p.professional?.experienceRange ?? ""] ?? "",
        employmentStatus: employmentApiToUi[p.professional?.employmentStatus ?? ""] ?? "",
        noticePeriodDays: p.professional?.noticePeriodDays != null ? String(p.professional.noticePeriodDays) : "",
      });

      // Seed education
      setEducation({
        degreeType:     degreeApiToUi[p.education?.degreeType ?? ""] ?? "Bachelor's",
        major:          p.education?.major          ?? "",
        university:     p.education?.university     ?? "",
        graduationYear: p.education?.graduationYear ? String(p.education.graduationYear) : "",
        country:        p.education?.country        ?? "",
      });

      // Seed certifications
      setCerts(p.certifications.map((c) => ({
        _id:        c._id,
        name:       c.name,
        issuer:     c.issuer,
        issueDate:  toMonthValue(c.issueDate),
        hasExpiry:  c.hasExpiry,
        expiryDate: toMonthValue(c.expiryDate),
        fileUrl:    c.fileUrl,
      })));

      // Seed languages
      setLanguages(p.languages.map((l) => ({
        language:    l.language,
        proficiency: l.proficiency,
      })));

      // Seed location + salary — convert API enums to UI display strings
      const apiCities    = p.locationPreferences?.preferredCities ?? [];
      const apiContracts = p.salaryExpectations?.contractTypes     ?? [];
      setLocation({
        preferredCities:   [...new Set(apiCities.map((c) => CITY_API_TO_UI[c]).filter(Boolean))],
        willingToRelocate: p.locationPreferences?.willingToRelocate ?? false,
        contractTypes:     apiContracts.map((c) => CONTRACT_API_TO_UI[c] ?? c),
        minSalary:         p.salaryExpectations?.minMonthlySAR ? String(p.salaryExpectations.minMonthlySAR) : "",
        maxSalary:         p.salaryExpectations?.maxMonthlySAR ? String(p.salaryExpectations.maxMonthlySAR) : "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  // ── Section save handlers ────────────────────────────────────────────────────

  const savePersonal = async () => {
    setSaving(true);
    try {
      const updated = await updatePersonal({
        fullNameEn:  personal.fullNameEn  || undefined,
        fullNameAr:  personal.fullNameAr  || undefined,
        nationalId:  personal.nationalId  || undefined,
        dateOfBirth: personal.dateOfBirth || undefined,
        gender:      personal.gender,
        nationality: personal.nationality || undefined,
        whatsapp:    personal.whatsapp    || undefined,
      });
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveProfessional = async () => {
    setSaving(true);
    try {
      // Expand UI grade groups → individual API grade values
      const apiGrades = professional.gradeLevels.flatMap((g) => GRADE_UI_TO_API[g] ?? []);
      const employmentStatus = employmentUiToApi[professional.employmentStatus];
      const parsedNoticeDays = parseInt(professional.noticePeriodDays, 10);
      const updated = await updateProfessional({
        subjects:         professional.subjects.map((s) => SUBJECT_UI_TO_API[s] ?? s),
        gradeLevels:      apiGrades,
        experienceRange:  EXP_UI_TO_API[professional.experienceRange] || undefined,
        employmentStatus,
        // Only send notice period when employed AND a valid number is entered.
        // Backend service also sanitizes, but sending the right shape is cleaner.
        noticePeriodDays: employmentStatus === "employed" && Number.isFinite(parsedNoticeDays)
          ? parsedNoticeDays
          : undefined,
      });
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveEducation = async () => {
    setSaving(true);
    try {
      const updated = await updateEducation({
        degreeType:     degreeUiToApi[education.degreeType],
        major:          education.major          || undefined,
        university:     education.university     || undefined,
        graduationYear: education.graduationYear ? parseInt(education.graduationYear) : undefined,
        country:        education.country        || undefined,
      });
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveLanguages = async () => {
    setSaving(true);
    try {
      const updated = await updateLanguages(
        languages.map((l) => ({
          language:    l.language,
          proficiency: l.proficiency as TeacherProfile["languages"][0]["proficiency"],
        }))
      );
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
      const apiCities    = location.preferredCities.flatMap((c) => CITY_UI_TO_API[c] ?? []);
      const apiContracts = location.contractTypes.map((c) => CONTRACT_UI_TO_API[c] ?? c).filter(Boolean);
      const [u1, u2] = await Promise.all([
        updateLocation({
          preferredCities:   apiCities,
          willingToRelocate: location.willingToRelocate,
        }),
        updateSalary({
          minMonthlySAR: location.minSalary ? parseInt(location.minSalary) : undefined,
          maxMonthlySAR: location.maxSalary ? parseInt(location.maxSalary) : undefined,
          contractTypes: apiContracts.length ? apiContracts : undefined,
        }),
      ]);
      setProfile(u2 ?? u1);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveCertifications = async () => {
    setSaving(true);
    try {
      let updatedProfile: TeacherProfile | null = profile;

      for (const cert of certs) {
        if (!cert._id) {
          // ── New cert: create then optionally upload file ──────────
          const result = await addCertification({
            name:       cert.name,
            issuer:     cert.issuer,
            issueDate:  cert.issueDate,
            hasExpiry:  cert.hasExpiry,
            expiryDate: cert.hasExpiry ? cert.expiryDate : undefined,
          });
          updatedProfile = result;
          if (cert.pendingFile) {
            const newCertId = result.certifications.at(-1)?._id;
            if (newCertId) updatedProfile = await uploadCertificationFile(newCertId, cert.pendingFile);
          }
        } else {
          // ── Existing cert: check for field changes or pending file ─
          const original = profile?.certifications.find((c) => c._id === cert._id);
          const fieldsChanged = original && (
            original.name   !== cert.name   ||
            original.issuer !== cert.issuer ||
            toMonthValue(original.issueDate)  !== cert.issueDate ||
            toMonthValue(original.expiryDate) !== cert.expiryDate
          );

          if (fieldsChanged) {
            // No PATCH endpoint — delete then re-add with updated data
            updatedProfile = await removeCertification(cert._id);
            const result = await addCertification({
              name:       cert.name,
              issuer:     cert.issuer,
              issueDate:  cert.issueDate,
              hasExpiry:  cert.hasExpiry,
              expiryDate: cert.hasExpiry ? cert.expiryDate : undefined,
            });
            updatedProfile = result;
            if (cert.pendingFile) {
              const newCertId = result.certifications.at(-1)?._id;
              if (newCertId) updatedProfile = await uploadCertificationFile(newCertId, cert.pendingFile);
            }
          } else if (cert.pendingFile) {
            // Fields unchanged — just upload the new file
            updatedProfile = await uploadCertificationFile(cert._id, cert.pendingFile);
          }
        }
      }

      if (updatedProfile) {
        setProfile(updatedProfile);
        setCerts(updatedProfile.certifications.map((c) => ({
          _id: c._id, name: c.name, issuer: c.issuer,
          issueDate: toMonthValue(c.issueDate), hasExpiry: c.hasExpiry,
          expiryDate: toMonthValue(c.expiryDate), fileUrl: c.fileUrl,
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCert = async (cert: CertDraft) => {
    if (!cert._id) {
      // Not yet saved — just remove from local state
      setCerts((prev) => prev.filter((c) => c !== cert));
      return;
    }
    try {
      const updated = await removeCertification(cert._id);
      setProfile(updated);
      setCerts(updated.certifications.map((c) => ({
        _id: c._id, name: c.name, issuer: c.issuer,
        issueDate: toMonthValue(c.issueDate), hasExpiry: c.hasExpiry,
        expiryDate: toMonthValue(c.expiryDate), fileUrl: c.fileUrl,
      })));
    } catch (err) {
      console.error(err);
    }
  };

  // ── File upload handlers ─────────────────────────────────────────────────────

  const handlePhotoUpload = async (file: File) => {
    try {
      const updated = await uploadProfilePhoto(file);
      setProfile(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResumeUpload = async (file: File) => {
    setSaving(true);
    try {
      const updated = await uploadResume(file);
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleEduCertUpload = async (file: File) => {
    setSaving(true);
    try {
      const updated = await uploadEducationCertificate(file);
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitProfile = async () => {
    setSaving(true);
    try {
      const updated = await submitProfile();
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── Derived ──────────────────────────────────────────────────────────────────

  const completeness = profile?.completionPercentage ?? 0;
  const profileStatus = profile?.profileStatus ?? "draft";

  const sectionList = [
    { id: "personal",       label: "Personal Info",         icon: User,         done: sectionDone(profile, "personal") },
    { id: "professional",   label: "Professional Info",     icon: Briefcase,    done: sectionDone(profile, "professional") },
    { id: "education",      label: "Education",             icon: GraduationCap,done: sectionDone(profile, "education") },
    { id: "certifications", label: "Certifications",        icon: Award,        done: sectionDone(profile, "certifications") },
    { id: "resume",         label: "Resume / CV",           icon: FileText,     done: sectionDone(profile, "resume") },
    { id: "languages",      label: "Languages",             icon: Globe,        done: sectionDone(profile, "languages") },
    { id: "location",       label: "Location & Compensation",icon: MapPin,      done: sectionDone(profile, "location") },
  ];

  const statusBadge = () => {
    switch (profileStatus) {
      case "approved":  return <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium"><CheckCircle2 size={11} /> Verified by Abjad</span>;
      case "pending":   return <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium"><Loader2 size={11} className="animate-spin" /> Verification in progress</span>;
      case "rejected":  return <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium"><X size={11} /> Profile Rejected</span>;
      default:          return <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium"><AlertCircle size={11} /> Draft</span>;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your information visible to schools</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-primary border border-brand-primary/40 rounded-lg hover:bg-brand-primary-light transition-colors"
          >
            <Eye size={15} /> Preview
          </button>
          <div className="text-sm font-semibold text-brand-primary bg-brand-primary-light px-3 py-1.5 rounded-lg">
            {completeness}% Complete
          </div>
          {profileStatus === "draft" && completeness >= 70 && (
            <button
              onClick={handleSubmitProfile}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-60"
              style={{ background: "var(--brand-gradient)" }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              Submit for Review
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Section nav + avatar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Avatar card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="relative inline-block mb-3">
              {profile?.personal?.photoUrl ? (
                <img
                  src={profile.personal.photoUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mx-auto"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  {initials(user?.firstName, user?.lastName, user?.email)}
                </div>
              )}
              <button
                onClick={() => photoInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Camera size={13} className="text-gray-600" />
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f); }}
              />
            </div>
            <h3 className="font-semibold text-gray-900">{displayName(profile, user?.firstName, user?.lastName)}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {professional.subjects.slice(0, 2).join(" & ") || "Teacher"}
            </p>
            <div className="mt-3">{statusBadge()}</div>
            {/* Completeness bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Profile strength</span>
                <span className="font-medium text-brand-primary">{completeness}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${completeness}%`, background: "var(--brand-gradient)" }}
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
                    ? "bg-brand-primary-light text-brand-primary-dark"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon size={15} className={activeSection === id ? "text-brand-primary" : "text-gray-400"} />
                <span className="flex-1">{label}</span>
                {done
                  ? <CheckCircle2 size={13} className="text-green-500 shrink-0" />
                  : <AlertCircle  size={13} className="text-amber-400 shrink-0" />
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
                <SectionHeader title="Personal Information" done={sectionDone(profile, "personal")} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name (English)" required>
                    <input
                      value={personal.fullNameEn}
                      onChange={(e) => setPersonal((p) => ({ ...p, fullNameEn: e.target.value }))}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Full Name (Arabic)" required>
                    <input
                      value={personal.fullNameAr}
                      onChange={(e) => setPersonal((p) => ({ ...p, fullNameAr: e.target.value }))}
                      className={inputCls}
                      dir="rtl"
                    />
                  </FormField>
                  <FormField label="ID Type" required>
                    <select
                      value={personal.idType}
                      onChange={(e) => setPersonal((p) => ({ ...p, idType: e.target.value }))}
                      className={selectCls}
                    >
                      <option>National ID</option>
                      <option>Iqama</option>
                    </select>
                  </FormField>
                  <FormField label="ID Number" required>
                    <input
                      value={personal.nationalId}
                      onChange={(e) => setPersonal((p) => ({ ...p, nationalId: e.target.value }))}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Date of Birth" required>
                    <input
                      type="date"
                      value={personal.dateOfBirth}
                      onChange={(e) => setPersonal((p) => ({ ...p, dateOfBirth: e.target.value }))}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Gender" required>
                    <select
                      value={personal.gender}
                      onChange={(e) => setPersonal((p) => ({ ...p, gender: e.target.value as "male" | "female" }))}
                      className={selectCls}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </FormField>
                  <FormField label="Nationality" required>
                    <input
                      value={personal.nationality}
                      onChange={(e) => setPersonal((p) => ({ ...p, nationality: e.target.value }))}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Contact Email" required>
                    <input
                      type="email"
                      value={user?.email ?? ""}
                      readOnly
                      className={`${inputCls} bg-gray-50 text-gray-500 cursor-default`}
                    />
                  </FormField>
                  <FormField label="WhatsApp Number">
                    <div className="flex">
                      <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600 shrink-0">+966</span>
                      <input
                        value={personal.whatsapp}
                        onChange={(e) => setPersonal((p) => ({ ...p, whatsapp: e.target.value }))}
                        className={`${inputCls} rounded-l-none`}
                      />
                    </div>
                  </FormField>
                </div>
                <SaveButton saving={saving} onClick={savePersonal} />
              </div>
            )}

            {/* ── Professional Info ──────────────────────────────────── */}
            {activeSection === "professional" && (
              <div>
                <SectionHeader title="Professional Information" done={sectionDone(profile, "professional")} />
                <div className="space-y-5">
                  <FormField label="Subjects Taught" required>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {subjects.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleItem(professional.subjects, (v) => setProfessional((p) => ({ ...p, subjects: v })), s)}
                          className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors
                            ${professional.subjects.includes(s)
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
                      {gradeLevels.map((g) => (
                        <button
                          key={g}
                          onClick={() => toggleItem(professional.gradeLevels, (v) => setProfessional((p) => ({ ...p, gradeLevels: v })), g)}
                          className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors
                            ${professional.gradeLevels.includes(g)
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
                      <select
                        value={professional.experienceRange}
                        onChange={(e) => setProfessional((p) => ({ ...p, experienceRange: e.target.value }))}
                        className={selectCls}
                      >
                        <option value="">Select…</option>
                        {experienceOptions.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Employment Status" required>
                      <select
                        value={professional.employmentStatus}
                        onChange={(e) => setProfessional((p) => ({
                          ...p,
                          employmentStatus: e.target.value,
                          // Clear notice period whenever the status moves away from "Currently employed".
                          noticePeriodDays: e.target.value === "Currently employed" ? p.noticePeriodDays : "",
                        }))}
                        className={selectCls}
                      >
                        <option value="">Select…</option>
                        <option>Currently employed</option>
                        <option>Available immediately</option>
                        <option>Freelance / Self-employed</option>
                      </select>
                    </FormField>
                  </div>
                  {professional.employmentStatus === "Currently employed" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Notice Period (days)">
                        <input
                          type="number"
                          min={0}
                          max={180}
                          step={1}
                          inputMode="numeric"
                          value={professional.noticePeriodDays}
                          onChange={(e) => setProfessional((p) => ({ ...p, noticePeriodDays: e.target.value }))}
                          placeholder="e.g. 30"
                          className={selectCls}
                        />
                      </FormField>
                    </div>
                  )}
                </div>
                <SaveButton saving={saving} onClick={saveProfessional} />
              </div>
            )}

            {/* ── Education ─────────────────────────────────────────── */}
            {activeSection === "education" && (
              <div>
                <SectionHeader title="Educational Credentials" done={sectionDone(profile, "education")} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Degree Type" required>
                    <select
                      value={education.degreeType}
                      onChange={(e) => setEducation((ed) => ({ ...ed, degreeType: e.target.value }))}
                      className={selectCls}
                    >
                      {["Bachelor's", "Master's", "PhD", "Diploma", "Other"].map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Major / Specialization" required>
                    <input
                      value={education.major}
                      onChange={(e) => setEducation((ed) => ({ ...ed, major: e.target.value }))}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="University Name" required>
                    <input
                      value={education.university}
                      onChange={(e) => setEducation((ed) => ({ ...ed, university: e.target.value }))}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Graduation Year" required>
                    <input
                      type="number"
                      value={education.graduationYear}
                      onChange={(e) => setEducation((ed) => ({ ...ed, graduationYear: e.target.value }))}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Country of Graduation" required>
                    <input
                      value={education.country}
                      onChange={(e) => setEducation((ed) => ({ ...ed, country: e.target.value }))}
                      className={inputCls}
                    />
                  </FormField>
                  <FormField label="Degree Certificate (PDF, max 10MB)">
                    <div
                      className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:border-brand-primary/40 transition-colors cursor-pointer"
                      onClick={() => eduCertInputRef.current?.click()}
                    >
                      <p className="text-xs text-gray-500">
                        <span className="text-brand-primary font-medium">Click to upload</span> or drag & drop
                      </p>
                      {profile?.education?.certificateUrl ? (
                        <p className="text-xs text-green-600 mt-0.5 flex items-center justify-center gap-1">
                          <CheckCircle2 size={11} /> Certificate uploaded
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-0.5">No file uploaded yet</p>
                      )}
                    </div>
                    <input
                      ref={eduCertInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleEduCertUpload(f); }}
                    />
                  </FormField>
                </div>
                <SaveButton saving={saving} onClick={saveEducation} />
              </div>
            )}

            {/* ── Certifications ────────────────────────────────────── */}
            {activeSection === "certifications" && (
              <div>
                <SectionHeader title="Certifications" subtitle="Upload teaching licenses and professional certificates" done={sectionDone(profile, "certifications")} />
                <div className="space-y-3 mb-5">
                  {certs.map((cert, idx) => (
                    <CertCard
                      key={cert._id ?? `new-${idx}`}
                      cert={cert}
                      onChange={(updated) => setCerts((prev) => prev.map((c, i) => i === idx ? updated : c))}
                      onDelete={() => handleDeleteCert(cert)}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCerts((prev) => [...prev, { name: "", issuer: "", issueDate: "", hasExpiry: false, expiryDate: "" }])}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-primary/30 rounded-xl text-sm text-brand-primary hover:border-brand-primary/60 hover:bg-brand-primary-light transition-colors w-full justify-center"
                >
                  <Plus size={15} /> Add Certification
                </button>
                <SaveButton saving={saving} onClick={saveCertifications} />
              </div>
            )}

            {/* ── Resume ────────────────────────────────────────────── */}
            {activeSection === "resume" && (
              <div>
                <SectionHeader title="Resume / CV" subtitle="Upload your latest CV for schools to download" done={sectionDone(profile, "resume")} />
                <div
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-brand-primary/40 transition-colors cursor-pointer mb-4"
                  onClick={() => resumeInputRef.current?.click()}
                >
                  <div className="w-14 h-14 bg-brand-primary-light rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <FileText size={24} className="text-brand-primary" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Drop your CV here</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — max 10MB</p>
                  <button
                    type="button"
                    className="mt-4 px-5 py-2 text-sm font-medium text-brand-primary border border-brand-primary/40 rounded-lg hover:bg-brand-primary-light transition-colors"
                  >
                    Browse Files
                  </button>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f); }}
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {profile?.resume?.fileUrl ? (
                      <>
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {profile.resume.originalName ?? "resume.pdf"}
                        </p>
                        <p className="text-xs text-gray-400">
                          Uploaded {profile.resume.uploadedAt ? new Date(profile.resume.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-800">No CV uploaded yet</p>
                        <p className="text-xs text-gray-400">Upload your CV to let schools review your full profile</p>
                      </>
                    )}
                  </div>
                  {profile?.resume?.fileUrl && (
                    <a
                      href={profile.resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                    >
                      <Download size={13} /> Download
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* ── Languages ─────────────────────────────────────────── */}
            {activeSection === "languages" && (
              <div>
                <SectionHeader title="Languages" done={sectionDone(profile, "languages")} />
                <div className="space-y-4">
                  {languages.map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <input
                          value={lang.language}
                          onChange={(e) => setLanguages((prev) => prev.map((l, i) => i === idx ? { ...l, language: e.target.value } : l))}
                          className={inputCls}
                          placeholder="Language name"
                        />
                      </div>
                      <select
                        value={lang.proficiency}
                        onChange={(e) => setLanguages((prev) => prev.map((l, i) => i === idx ? { ...l, proficiency: e.target.value } : l))}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 bg-white"
                      >
                        {proficiencyLevels.map((l) => <option key={l} value={l}>{proficiencyLabels[l]}</option>)}
                      </select>
                      <button
                        onClick={() => setLanguages((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setLanguages((prev) => [...prev, { language: "", proficiency: "fluent" }])}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-brand-primary/30 rounded-xl text-sm text-brand-primary hover:border-brand-primary/60 hover:bg-brand-primary-light transition-colors w-full justify-center"
                  >
                    <Plus size={15} /> Add Language
                  </button>
                </div>
                <SaveButton saving={saving} onClick={saveLanguages} />
              </div>
            )}

            {/* ── Location & Compensation ────────────────────────────── */}
            {activeSection === "location" && (
              <div>
                <SectionHeader title="Location & Compensation Preferences" subtitle="Help schools find you based on where you want to work" done={sectionDone(profile, "location")} />
                <div className="space-y-5">
                  <FormField label="Preferred Cities" required>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {cities.map((c) => (
                        <button
                          key={c}
                          onClick={() => toggleItem(location.preferredCities, (v) => setLocation((l) => ({ ...l, preferredCities: v })), c)}
                          className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors
                            ${location.preferredCities.includes(c)
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
                      <select
                        value={location.contractTypes[0] ?? "Full time"}
                        onChange={(e) => setLocation((l) => ({ ...l, contractTypes: [e.target.value] }))}
                        className={selectCls}
                      >
                        <option>Full time</option>
                        <option>Part-time</option>
                        <option>Temporary / Substitute</option>
                        <option>Any</option>
                      </select>
                    </FormField>
                    <FormField label="Expected Monthly Salary (SAR)">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={location.minSalary}
                          onChange={(e) => setLocation((l) => ({ ...l, minSalary: e.target.value }))}
                          className={inputCls}
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={location.maxSalary}
                          onChange={(e) => setLocation((l) => ({ ...l, maxSalary: e.target.value }))}
                          className={inputCls}
                        />
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
                <SaveButton saving={saving} onClick={saveLocation} />
              </div>
            )}

          </div>

          {/* Section Navigation arrows */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                const idx = sectionList.findIndex((s) => s.id === activeSection);
                if (idx > 0) setActiveSection(sectionList[idx - 1].id);
              }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-white border border-gray-200 transition-colors disabled:opacity-40"
              disabled={activeSection === sectionList[0].id}
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                const idx = sectionList.findIndex((s) => s.id === activeSection);
                if (idx < sectionList.length - 1) setActiveSection(sectionList[idx + 1].id);
              }}
              className="flex items-center gap-1.5 text-sm text-brand-primary hover:text-brand-primary-dark px-3 py-2 rounded-lg hover:bg-brand-primary-light border border-brand-primary/30 transition-colors disabled:opacity-40"
              disabled={activeSection === sectionList[sectionList.length - 1].id}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Profile Preview Modal ─────────────────────────────────── */}
      {showPreview && profile && (
        <ProfilePreviewModal
          profile={profile}
          displayName={displayName(profile, user?.firstName, user?.lastName)}
          initials={initials(user?.firstName, user?.lastName, user?.email)}
          subjects={professional.subjects}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

// ─── Cert Card ─────────────────────────────────────────────────────────────────

function CertCard({
  cert,
  onChange,
  onDelete,
}: {
  cert: CertDraft;
  onChange: (updated: CertDraft) => void;
  onDelete: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputCls =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors bg-white";

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Certification Name <span className="text-red-500">*</span></label>
              <input
                value={cert.name}
                onChange={(e) => onChange({ ...cert, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Issuing Organization <span className="text-red-500">*</span></label>
              <input
                value={cert.issuer}
                onChange={(e) => onChange({ ...cert, issuer: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Date <span className="text-red-500">*</span></label>
              <input
                type="month"
                value={cert.issueDate}
                onChange={(e) => onChange({ ...cert, issueDate: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
              <input
                type="month"
                value={cert.expiryDate}
                onChange={(e) => onChange({ ...cert, expiryDate: e.target.value, hasExpiry: !!e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Certificate File (PDF, max 5MB)</label>

            {/* Already-uploaded file row */}
            {(cert.fileUrl || cert.pendingFile) && (
              <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg mb-2">
                <FileText size={15} className="text-green-600 shrink-0" />
                <span className="text-xs text-green-700 font-medium flex-1 truncate">
                  {cert.pendingFile ? cert.pendingFile.name : "Certificate uploaded"}
                </span>
                {cert.fileUrl && !cert.pendingFile && (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-brand-primary hover:underline shrink-0 flex items-center gap-1"
                  >
                    <Download size={11} /> View
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-gray-500 hover:text-gray-700 shrink-0"
                >
                  Replace
                </button>
              </div>
            )}

            {/* Upload drop zone — shown when no file yet */}
            {!cert.fileUrl && !cert.pendingFile && (
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-2.5 text-center hover:border-brand-primary/40 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <p className="text-xs text-gray-500">
                  <span className="text-brand-primary font-medium">Upload file</span>
                  <span className="text-gray-400 ml-1">or drag & drop</span>
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onChange({ ...cert, pendingFile: f });
              }}
            />
          </div>
        </div>
        <button
          onClick={onDelete}
          className="shrink-0 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Profile Preview Modal ─────────────────────────────────────────────────────

function ProfilePreviewModal({
  profile,
  displayName: name,
  initials: ini,
  subjects,
  onClose,
}: {
  profile: TeacherProfile;
  displayName: string;
  initials: string;
  subjects: string[];
  onClose: () => void;
}) {
  const degreeLabel = degreeApiToUi[profile.education?.degreeType ?? ""] ?? profile.education?.degreeType ?? "—";
  const expLabel    = EXP_API_TO_UI[profile.professional?.experienceRange ?? ""] ?? profile.professional?.experienceRange ?? "—";

  const statusColors: Record<string, string> = {
    approved: "bg-green-100 text-green-700",
    pending:  "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
    draft:    "bg-slate-100 text-slate-600",
  };
  const statusLabel: Record<string, string> = {
    approved: "Approved", pending: "Under Review", rejected: "Rejected", draft: "Draft",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Profile Preview</p>
            <p className="text-xs text-gray-400 mt-0.5">This is how your profile appears to schools</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Hero */}
          <div className="flex items-start gap-5">
            {profile.personal?.photoUrl ? (
              <img src={profile.personal.photoUrl} alt={name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
                style={{ background: "var(--brand-gradient)" }}
              >
                {ini}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[profile.profileStatus] ?? statusColors.draft}`}>
                  {statusLabel[profile.profileStatus] ?? profile.profileStatus}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{subjects.slice(0, 3).join(" · ") || "—"}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {profile.personal?.nationality && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <User size={11} /> {profile.personal.nationality}
                  </span>
                )}
                {profile.professional?.experienceRange && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Briefcase size={11} /> {expLabel} experience
                  </span>
                )}
                {(profile.locationPreferences?.preferredCities?.length ?? 0) > 0 && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={11} /> {profile.locationPreferences.preferredCities!.map((c) => CITY_API_TO_UI[c] ?? c).join(", ")}
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-gray-400">Match score</p>
              <p className="text-2xl font-bold" style={{ color: "var(--brand-primary)" }}>
                {profile.completionPercentage}%
              </p>
            </div>
          </div>

          {/* Subjects & Grades */}
          {(subjects.length > 0 || (profile.professional?.gradeLevels?.length ?? 0) > 0) && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Teaching</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <span key={s} className="px-2.5 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary-dark)" }}>{s}</span>
                ))}
              </div>
              {profile.professional?.gradeLevels && profile.professional.gradeLevels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {[...new Set(profile.professional.gradeLevels.map((g) => GRADE_API_TO_UI_GROUP[g]).filter(Boolean))].map((g) => (
                    <span key={g} className="px-2.5 py-1 text-xs rounded-full bg-slate-100 text-slate-600 font-medium">{g}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Education */}
          {profile.education?.degreeType && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Education</h3>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <GraduationCap size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{degreeLabel} in {profile.education.major ?? "—"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{profile.education.university ?? "—"} · {profile.education.graduationYear ?? "—"} · {profile.education.country ?? "—"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.certifications.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Certifications</h3>
              <div className="space-y-2">
                {profile.certifications.map((c) => (
                  <div key={c._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Award size={15} className="text-amber-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.issuer} · {toMonthValue(c.issueDate)}</p>
                    </div>
                    {c.fileUrl && (
                      <a href={c.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-primary hover:underline shrink-0 flex items-center gap-1">
                        <Download size={11} /> View
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile.languages.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((l, i) => (
                  <span key={i} className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
                    {l.language} · <span className="capitalize">{proficiencyLabels[l.proficiency] ?? l.proficiency}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Salary */}
          {(profile.salaryExpectations?.minMonthlySAR || profile.salaryExpectations?.maxMonthlySAR) && (
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Salary Expectation</h3>
              <p className="text-sm text-gray-700 font-medium">
                {profile.salaryExpectations.minMonthlySAR?.toLocaleString()} – {profile.salaryExpectations.maxMonthlySAR?.toLocaleString()} SAR / month
              </p>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-white rounded-lg"
            style={{ background: "var(--brand-gradient)" }}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
