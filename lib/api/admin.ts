import { apiFetch } from './client';

export interface AdminStats {
  schools: Record<string, number>;
  teachers: Record<string, number>;
}

export interface SchoolProfile {
  _id: string;
  userId: string;
  nameEn?: string;
  nameAr?: string;
  type?: string;
  city?: string;
  profileStatus: string;
  completionPercentage: number;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  adminNotes?: string;
  logoUrl?: string;
  documents?: {
    commercialRegistration?: { url: string; uploadedAt: string };
    ministryLicense?: { url: string; uploadedAt: string };
  };
  adminContact?: { name?: string; phone?: string; email?: string };
}

export interface TeacherProfile {
  _id: string;
  userId: string;
  personal?: { fullName?: string; phone?: string; city?: string };
  professional?: { subjects?: string[]; gradeLevels?: string[]; experienceYears?: number };
  profileStatus: string;
  completionPercentage: number;
  submittedAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
  adminNotes?: string;
  photoUrl?: string;
  resumeUrl?: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Stats
export async function getAdminStats(): Promise<AdminStats> {
  const res = await apiFetch<AdminStats>('/api/admin/stats');
  return res.data!;
}

// Schools
export async function listSchools(status?: string, page = 1): Promise<{ schools: SchoolProfile[]; total: number }> {
  const params = new URLSearchParams({ page: String(page), limit: '20' });
  if (status) params.set('status', status);
  const res = await apiFetch<{ schools: SchoolProfile[]; total: number }>(`/api/admin/schools?${params}`);
  return res.data!;
}

export async function getSchool(profileId: string): Promise<SchoolProfile> {
  const res = await apiFetch<SchoolProfile>(`/api/admin/schools/${profileId}`);
  return res.data!;
}

export async function approveSchool(profileId: string, adminNotes?: string): Promise<SchoolProfile> {
  const res = await apiFetch<SchoolProfile>(`/api/admin/schools/${profileId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ adminNotes }),
  });
  return res.data!;
}

export async function rejectSchool(profileId: string, rejectionReason: string, adminNotes?: string): Promise<SchoolProfile> {
  const res = await apiFetch<SchoolProfile>(`/api/admin/schools/${profileId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ rejectionReason, adminNotes }),
  });
  return res.data!;
}

// Teachers
export async function listTeachers(status?: string, page = 1): Promise<{ teachers: TeacherProfile[]; total: number }> {
  const params = new URLSearchParams({ page: String(page), limit: '20' });
  if (status) params.set('status', status);
  const res = await apiFetch<{ teachers: TeacherProfile[]; total: number }>(`/api/admin/teachers?${params}`);
  return res.data!;
}

export async function approveTeacher(profileId: string, adminNotes?: string): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>(`/api/admin/teachers/${profileId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ adminNotes }),
  });
  return res.data!;
}

export async function rejectTeacher(profileId: string, rejectionReason: string, adminNotes?: string): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>(`/api/admin/teachers/${profileId}/reject`, {
    method: 'POST',
    body: JSON.stringify({ rejectionReason, adminNotes }),
  });
  return res.data!;
}
