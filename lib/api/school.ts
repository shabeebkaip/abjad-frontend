// School API client — typed wrappers around apiFetch for all school endpoints
import { apiFetch } from './client';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SchoolProfile {
  _id: string;
  userId: string;
  nameAr?: string;
  nameEn?: string;
  type?: 'government' | 'private' | 'international' | 'ahli';
  educationLevel?: 'elementary' | 'middle' | 'high' | 'k12' | 'mixed';
  gender?: 'male' | 'female' | 'mixed';
  city?: string;
  district?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  foundedYear?: number;
  studentsCount?: '<100' | '100-500' | '500-1000' | '1000-5000' | '>5000';
  logoUrl?: string | null;
  adminContact?: { name?: string; jobTitle?: string; phone?: string; email?: string };
  documents?: {
    commercialRegistration?: { url: string; key: string; uploadedAt: string } | null;
    ministryLicense?:         { url: string; key: string; uploadedAt: string } | null;
  };
  profileStatus: 'draft' | 'pending' | 'verified' | 'rejected' | 'suspended';
  completionPercentage: number;
  submittedAt?: string | null;
  verifiedAt?: string | null;
}

export interface SchoolJob {
  _id: string;
  schoolId?: string | { _id: string; nameEn?: string; nameAr?: string };
  title: string;
  description?: string;
  subjects: string[];
  gradeLevels: string[];
  employmentType: 'full_time' | 'part_time' | 'contract' | 'temporary';
  positions?: number;
  startDate?: string;
  deadline?: string;
  city: string;
  languageRequirement?: 'arabic' | 'english' | 'bilingual';
  experienceRequired?: string;
  degreeRequired?: string;
  teachingLicenseRequired?: boolean;
  salary: { min?: number; max?: number; display: 'show' | 'negotiable' | 'hidden' };
  contractDuration?: { type: 'day' | 'month' | 'year'; value: number };
  isAnonymous: boolean;
  status: 'draft' | 'active' | 'closed' | 'expired';
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobsListResponse {
  jobs: SchoolJob[];
  total: number;
  page: number;
  totalPages: number;
}

export interface JobStats {
  job: { title: string; status: string; viewsCount?: number };
  applications: { total: number; byStatus: Record<string, number> };
  views: number;
}

export interface SchoolApplication {
  _id: string;
  teacherId: { _id: string; name?: string; email?: string } | string;
  jobId:     { _id: string; title: string; city?: string }  | string;
  status: 'submitted' | 'reviewing' | 'shortlisted' | 'interview_scheduled' | 'offer_extended' | 'hired' | 'rejected' | 'withdrawn';
  coverLetter?: string;
  matchScore?: number;
  isRead: boolean;
  statusHistory?: Array<{ status: string; timestamp: string; note?: string }>;
  referenceNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApplicationsListResponse {
  applications: SchoolApplication[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CandidateProfile {
  _id: string;
  userId: string;
  personal?: {
    fullNameAr?: string;
    fullNameEn?: string;
    gender?: string;
    nationality?: string;
    photoUrl?: string;
  };
  professional?: {
    subjects?: string[];
    gradeLevels?: string[];
    experienceRange?: string;
    employmentStatus?: string;
    noticePeriodDays?: number;
  };
  education?: { degreeType?: string; major?: string; university?: string; graduationYear?: number; country?: string };
  languages?: Array<{ language: string; proficiency: string }>;
  locationPreferences?: { preferredCities?: string[] };
  salaryExpectations?: { minMonthlySAR?: number; maxMonthlySAR?: number };
  resume?: { fileUrl?: string; originalName?: string };
  certifications?: Array<{ _id: string; name: string; issuer: string; issueDate?: string }>;
  completionPercentage: number;
  profileStatus: string;
}

export interface CandidateNote {
  _id: string;
  content: string;
  tags?: string[];
  createdBy: string;
  createdAt: string;
}

export interface Shortlist {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  jobId?: string | { _id: string; title: string };
  teachers: Array<{ teacherId: string | { _id: string }; addedAt: string; notes?: string; tags?: string[] }>;
  isArchived: boolean;
  createdAt: string;
}

export interface SchoolInterview {
  _id: string;
  applicationId: string;
  jobId:     { _id?: string; title: string }                         | string;
  teacherId: { _id?: string; name?: string; email?: string }         | string;
  type: 'in_person' | 'video' | 'phone' | 'abjad_coordinated';
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
  location?: string;
  interviewers?: Array<{ name: string; email?: string; role?: string }>;
  instructions?: string;
  status: 'pending' | 'accepted' | 'declined' | 'rescheduled' | 'completed' | 'cancelled';
  responseDeadline?: string;
  feedback?: {
    rating?: number;
    strengths?: string;
    weaknesses?: string;
    recommendation?: 'hire' | 'maybe' | 'reject';
    notes?: string;
    evaluator?: string;
  };
  createdAt?: string;
}

export interface SchoolOffer {
  _id: string;
  applicationId: string;
  jobId:     { _id?: string; title: string; city?: string }      | string;
  teacherId: { _id?: string; name?: string; email?: string }     | string;
  position: string;
  salary: number;
  contractDuration?: string;
  startDate?: string;
  benefits?: string;
  terms?: string;
  deadline: string;
  status: 'sent' | 'viewed' | 'accepted' | 'declined' | 'negotiating' | 'expired';
  offerLetterUrl?: string;
  viewedAt?: string;
  negotiationHistory?: Array<{ counterSalary?: number; message: string; createdAt: string }>;
  createdAt?: string;
}

export interface DashboardData {
  profile:      { completionPercentage: number; status: string; nameAr?: string; nameEn?: string };
  jobs:         { byStatus: { active?: number; draft?: number; closed?: number; expired?: number }; total: number; active: number };
  applications: { byStatus: Record<string, number>; recentCount: number; recent: SchoolApplication[] };
  hiringFunnel: { total: number; reviewing: number; shortlisted: number; interviewed: number; offered: number; hired: number };
  upcomingInterviews: SchoolInterview[];
  activeOffers:       SchoolOffer[];
}

export interface AnalyticsData {
  applicationTrend: Array<{ _id: string; count: number }>;
  topJobs:          Array<{ count: number; job: { title: string; status: string } }>;
  averageTimeToHire: number;
  totalHired: number;
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'interviewer' | 'viewer';
  status: 'active' | 'inactive';
  joinedAt: string;
}

export interface SupportTicket {
  _id: string;
  ticketNumber: string;
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: Array<{ _id?: string; sender: 'user' | 'admin'; content: string; createdAt: string }>;
  createdAt: string;
  updatedAt?: string;
}

// ── School Profile ─────────────────────────────────────────────────────────────

export async function getSchoolProfile(): Promise<SchoolProfile> {
  return (await apiFetch<SchoolProfile>('/api/school/profile')).data!;
}
export async function updateBasicInfo(data: Partial<Pick<SchoolProfile, 'nameAr'|'nameEn'|'type'|'educationLevel'|'gender'|'foundedYear'|'studentsCount'>>): Promise<SchoolProfile> {
  return (await apiFetch<SchoolProfile>('/api/school/profile/basic', { method: 'PATCH', body: JSON.stringify(data) })).data!;
}
export async function updateSchoolLocation(data: { city?: string; district?: string; address?: string }): Promise<SchoolProfile> {
  return (await apiFetch<SchoolProfile>('/api/school/profile/location', { method: 'PATCH', body: JSON.stringify(data) })).data!;
}
export async function updateSchoolContact(data: { website?: string; phone?: string; email?: string }): Promise<SchoolProfile> {
  return (await apiFetch<SchoolProfile>('/api/school/profile/contact', { method: 'PATCH', body: JSON.stringify(data) })).data!;
}
export async function updateAdminContact(data: { name?: string; jobTitle?: string; phone?: string; email?: string }): Promise<SchoolProfile> {
  return (await apiFetch<SchoolProfile>('/api/school/profile/admin-contact', { method: 'PATCH', body: JSON.stringify(data) })).data!;
}
export async function uploadSchoolLogo(file: File): Promise<{ logoUrl: string; completionPercentage: number }> {
  const form = new FormData(); form.append('file', file);
  return (await apiFetch<{ logoUrl: string; completionPercentage: number }>('/api/school/profile/logo', { method: 'POST', body: form })).data!;
}
export async function uploadSchoolDocument(docType: 'commercialRegistration' | 'ministryLicense', file: File): Promise<{ documents: SchoolProfile['documents']; completionPercentage: number }> {
  const form = new FormData(); form.append('file', file);
  return (await apiFetch<{ documents: SchoolProfile['documents']; completionPercentage: number }>(`/api/school/profile/documents/${docType}`, { method: 'POST', body: form })).data!;
}
export async function submitSchoolProfile(): Promise<{ profileStatus: string; submittedAt: string }> {
  return (await apiFetch<{ profileStatus: string; submittedAt: string }>('/api/school/profile/submit', { method: 'POST' })).data!;
}

// ── Jobs ───────────────────────────────────────────────────────────────────────

export async function createJob(data: Partial<Omit<SchoolJob, '_id'|'createdAt'|'updatedAt'|'viewsCount'|'applicationsCount'|'status'>>): Promise<SchoolJob> {
  return (await apiFetch<SchoolJob>('/api/school/jobs', { method: 'POST', body: JSON.stringify(data) })).data!;
}
export async function listSchoolJobs(params?: { status?: string; page?: number; limit?: number }): Promise<JobsListResponse> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.page)   q.set('page',   String(params.page));
  if (params?.limit)  q.set('limit',  String(params.limit));
  return (await apiFetch<JobsListResponse>(`/api/school/jobs?${q}`)).data!;
}
export async function getSchoolJob(jobId: string): Promise<SchoolJob> {
  return (await apiFetch<SchoolJob>(`/api/school/jobs/${jobId}`)).data!;
}
export async function updateJob(jobId: string, data: Partial<SchoolJob>): Promise<SchoolJob> {
  return (await apiFetch<SchoolJob>(`/api/school/jobs/${jobId}`, { method: 'PATCH', body: JSON.stringify(data) })).data!;
}
export async function publishJob(jobId: string): Promise<SchoolJob> {
  return (await apiFetch<SchoolJob>(`/api/school/jobs/${jobId}/publish`, { method: 'POST' })).data!;
}
export async function closeJob(jobId: string): Promise<SchoolJob> {
  return (await apiFetch<SchoolJob>(`/api/school/jobs/${jobId}/close`, { method: 'POST' })).data!;
}
export async function deleteJob(jobId: string): Promise<void> {
  await apiFetch(`/api/school/jobs/${jobId}`, { method: 'DELETE' });
}
export async function getJobStats(jobId: string): Promise<JobStats> {
  return (await apiFetch<JobStats>(`/api/school/jobs/${jobId}/stats`)).data!;
}

// ── Candidates ─────────────────────────────────────────────────────────────────

export async function searchCandidates(params?: {
  subjects?: string[]; gradeLevels?: string[]; experienceRange?: string;
  city?: string[]; gender?: string; nationality?: string; degreeType?: string;
  language?: string; employmentStatus?: string; sortBy?: string; page?: number; limit?: number;
}): Promise<{ teachers: CandidateProfile[]; total: number; page: number; totalPages: number }> {
  const q = new URLSearchParams();
  params?.subjects?.forEach(s  => q.append('subjects',    s));
  params?.gradeLevels?.forEach(g => q.append('gradeLevels', g));
  params?.city?.forEach(c       => q.append('city',        c));
  if (params?.experienceRange) q.set('experienceRange', params.experienceRange);
  if (params?.gender)          q.set('gender',          params.gender);
  if (params?.nationality)     q.set('nationality',     params.nationality);
  if (params?.degreeType)      q.set('degreeType',      params.degreeType);
  if (params?.language)        q.set('language',        params.language);
  if (params?.employmentStatus)q.set('employmentStatus',params.employmentStatus);
  if (params?.sortBy)          q.set('sortBy',          params.sortBy);
  if (params?.page)            q.set('page',            String(params.page));
  if (params?.limit)           q.set('limit',           String(params.limit));
  return (await apiFetch<{ teachers: CandidateProfile[]; total: number; page: number; totalPages: number }>(`/api/school/candidates?${q}`)).data!;
}
export async function getCandidate(teacherId: string): Promise<CandidateProfile> {
  return (await apiFetch<CandidateProfile>(`/api/school/candidates/${teacherId}`)).data!;
}
export async function addCandidateNote(teacherId: string, data: { content: string; applicationId?: string; tags?: string[] }): Promise<CandidateNote> {
  return (await apiFetch<CandidateNote>(`/api/school/candidates/${teacherId}/notes`, { method: 'POST', body: JSON.stringify(data) })).data!;
}
export async function getCandidateNotes(teacherId: string): Promise<CandidateNote[]> {
  return (await apiFetch<CandidateNote[]>(`/api/school/candidates/${teacherId}/notes`)).data!;
}

// ── Applications ───────────────────────────────────────────────────────────────

export async function listSchoolApplications(params?: { jobId?: string; status?: string; page?: number; limit?: number }): Promise<ApplicationsListResponse> {
  const q = new URLSearchParams();
  if (params?.jobId)  q.set('jobId',  params.jobId);
  if (params?.status) q.set('status', params.status);
  if (params?.page)   q.set('page',   String(params.page));
  if (params?.limit)  q.set('limit',  String(params.limit));
  return (await apiFetch<ApplicationsListResponse>(`/api/school/applications?${q}`)).data!;
}
export async function getSchoolApplication(applicationId: string): Promise<SchoolApplication> {
  return (await apiFetch<SchoolApplication>(`/api/school/applications/${applicationId}`)).data!;
}
export async function updateApplicationStatus(applicationId: string, data: { status: string; note?: string; rejectionReason?: string }): Promise<SchoolApplication> {
  return (await apiFetch<SchoolApplication>(`/api/school/applications/${applicationId}/status`, { method: 'PATCH', body: JSON.stringify(data) })).data!;
}
export async function getApplicationStatsByJob(jobId: string): Promise<Record<string, number>> {
  return (await apiFetch<Record<string, number>>(`/api/school/applications/jobs/${jobId}/stats`)).data!;
}

// ── Shortlists ─────────────────────────────────────────────────────────────────

export async function createShortlist(data: { name: string; description?: string; color?: string; jobId?: string }): Promise<Shortlist> {
  return (await apiFetch<Shortlist>('/api/school/shortlists', { method: 'POST', body: JSON.stringify(data) })).data!;
}
export async function listShortlists(archived?: boolean): Promise<Shortlist[]> {
  return (await apiFetch<Shortlist[]>(`/api/school/shortlists${archived ? '?archived=true' : ''}`)).data!;
}
export async function getShortlist(id: string): Promise<Shortlist> {
  return (await apiFetch<Shortlist>(`/api/school/shortlists/${id}`)).data!;
}
export async function updateShortlist(id: string, data: Partial<Pick<Shortlist,'name'|'description'|'color'|'isArchived'>>): Promise<Shortlist> {
  return (await apiFetch<Shortlist>(`/api/school/shortlists/${id}`, { method: 'PATCH', body: JSON.stringify(data) })).data!;
}
export async function deleteShortlist(id: string): Promise<void> {
  await apiFetch(`/api/school/shortlists/${id}`, { method: 'DELETE' });
}
export async function addToShortlist(shortlistId: string, teacherId: string, data?: { notes?: string; tags?: string[] }): Promise<Shortlist> {
  return (await apiFetch<Shortlist>(`/api/school/shortlists/${shortlistId}/teachers`, { method: 'POST', body: JSON.stringify({ teacherId, ...data }) })).data!;
}
export async function removeFromShortlist(shortlistId: string, teacherId: string): Promise<void> {
  await apiFetch(`/api/school/shortlists/${shortlistId}/teachers/${teacherId}`, { method: 'DELETE' });
}

// ── Interviews ─────────────────────────────────────────────────────────────────

export async function scheduleInterview(data: {
  applicationId: string; jobId: string; teacherId: string;
  type: string; scheduledAt: string; duration: number;
  meetingLink?: string; location?: string;
  interviewers?: Array<{ name: string; email?: string; role?: string }>;
  instructions?: string; responseDeadline?: string;
}): Promise<SchoolInterview> {
  return (await apiFetch<SchoolInterview>('/api/school/interviews', { method: 'POST', body: JSON.stringify(data) })).data!;
}
export async function listSchoolInterviews(params?: { status?: string; jobId?: string; page?: number; limit?: number }): Promise<{ interviews: SchoolInterview[]; total: number }> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.jobId)  q.set('jobId',  params.jobId);
  if (params?.page)   q.set('page',   String(params.page));
  if (params?.limit)  q.set('limit',  String(params.limit));
  return (await apiFetch<{ interviews: SchoolInterview[]; total: number }>(`/api/school/interviews?${q}`)).data!;
}
export async function cancelInterview(interviewId: string): Promise<SchoolInterview> {
  return (await apiFetch<SchoolInterview>(`/api/school/interviews/${interviewId}/cancel`, { method: 'POST' })).data!;
}
export async function completeInterview(interviewId: string, feedback: {
  rating: number; strengths?: string; weaknesses?: string;
  recommendation: 'hire' | 'maybe' | 'reject'; notes?: string; evaluator?: string;
}): Promise<SchoolInterview> {
  return (await apiFetch<SchoolInterview>(`/api/school/interviews/${interviewId}/complete`, { method: 'POST', body: JSON.stringify(feedback) })).data!;
}

// ── Offers ─────────────────────────────────────────────────────────────────────

export async function extendOffer(data: {
  applicationId: string; jobId: string; teacherId: string;
  position: string; salary: number; contractDuration?: string;
  startDate?: string; benefits?: string; terms?: string;
  deadline: string; offerLetterUrl?: string;
}): Promise<SchoolOffer> {
  return (await apiFetch<SchoolOffer>('/api/school/offers', { method: 'POST', body: JSON.stringify(data) })).data!;
}
export async function listSchoolOffers(params?: { status?: string; jobId?: string; page?: number; limit?: number }): Promise<{ offers: SchoolOffer[]; total: number }> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.jobId)  q.set('jobId',  params.jobId);
  if (params?.page)   q.set('page',   String(params.page));
  if (params?.limit)  q.set('limit',  String(params.limit));
  return (await apiFetch<{ offers: SchoolOffer[]; total: number }>(`/api/school/offers?${q}`)).data!;
}
export async function revokeOffer(offerId: string): Promise<SchoolOffer> {
  return (await apiFetch<SchoolOffer>(`/api/school/offers/${offerId}/revoke`, { method: 'POST' })).data!;
}
export async function negotiateOffer(offerId: string, data: { action: 'accept'|'counter'; message: string; counterSalary?: number }): Promise<SchoolOffer> {
  return (await apiFetch<SchoolOffer>(`/api/school/offers/${offerId}/negotiate`, { method: 'POST', body: JSON.stringify(data) })).data!;
}
export async function confirmHire(offerId: string): Promise<SchoolOffer> {
  return (await apiFetch<SchoolOffer>(`/api/school/offers/${offerId}/confirm-hire`, { method: 'POST' })).data!;
}

// ── Dashboard & Analytics ──────────────────────────────────────────────────────

export async function getSchoolDashboard(): Promise<DashboardData> {
  return (await apiFetch<DashboardData>('/api/school/dashboard')).data!;
}
export async function getAnalytics(): Promise<AnalyticsData> {
  return (await apiFetch<AnalyticsData>('/api/school/dashboard/analytics')).data!;
}

// ── Team ───────────────────────────────────────────────────────────────────────

export async function listTeam(): Promise<TeamMember[]> {
  return (await apiFetch<TeamMember[]>('/api/school/team')).data!;
}
export async function addTeamMember(data: { name: string; email: string; role: string }): Promise<TeamMember> {
  return (await apiFetch<TeamMember>('/api/school/team', { method: 'POST', body: JSON.stringify(data) })).data!;
}
export async function updateTeamRole(memberId: string, role: string): Promise<TeamMember> {
  return (await apiFetch<TeamMember>(`/api/school/team/${memberId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) })).data!;
}
export async function removeTeamMember(memberId: string): Promise<void> {
  await apiFetch(`/api/school/team/${memberId}`, { method: 'DELETE' });
}

// ── Support (shared endpoints) ─────────────────────────────────────────────────

export async function listSupportTickets(params?: { status?: string; page?: number; limit?: number }): Promise<{ tickets: SupportTicket[]; total: number }> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.page)   q.set('page',   String(params.page));
  if (params?.limit)  q.set('limit',  String(params.limit));
  return (await apiFetch<{ tickets: SupportTicket[]; total: number }>(`/api/support/tickets?${q}`)).data!;
}
export async function createSupportTicket(data: { category: string; subject: string; description: string }): Promise<SupportTicket> {
  return (await apiFetch<SupportTicket>('/api/support/tickets', { method: 'POST', body: JSON.stringify(data) })).data!;
}
export async function replySupportTicket(ticketId: string, content: string): Promise<SupportTicket> {
  return (await apiFetch<SupportTicket>(`/api/support/tickets/${ticketId}/reply`, { method: 'POST', body: JSON.stringify({ content }) })).data!;
}
export async function closeSupportTicket(ticketId: string): Promise<SupportTicket> {
  return (await apiFetch<SupportTicket>(`/api/support/tickets/${ticketId}/close`, { method: 'POST' })).data!;
}

// ── Notifications ──────────────────────────────────────────────────────────────

export interface SchoolNotification {
  _id: string;
  type: 'application_status' | 'interview_invitation' | 'interview_reminder' | 'offer_received' | 'message' | 'profile_status' | 'system';
  title: string;
  body: string;
  isRead: boolean;
  data?: Record<string, string>;
  createdAt: string;
  readAt?: string;
}

export interface SchoolNotificationsResponse {
  notifications: SchoolNotification[];
  total: number;
  unreadCount: number;
}

export async function listSchoolNotifications(params?: { limit?: number; unreadOnly?: boolean; type?: string }): Promise<SchoolNotificationsResponse> {
  const q = new URLSearchParams();
  if (params?.limit)      q.set('limit',      String(params.limit));
  if (params?.unreadOnly) q.set('unreadOnly',  'true');
  if (params?.type)       q.set('type',        params.type);
  return (await apiFetch<SchoolNotificationsResponse>(`/api/notifications?${q}`)).data!;
}

export async function getSchoolNotificationUnreadCount(): Promise<number> {
  const res = await apiFetch<{ count: number }>('/api/notifications/unread-count');
  return res.data!.count;
}

export async function markSchoolNotificationRead(notificationId: string): Promise<void> {
  await apiFetch(`/api/notifications/${notificationId}/read`, { method: 'PATCH' });
}

export async function markAllSchoolNotificationsRead(): Promise<void> {
  await apiFetch('/api/notifications/read-all', { method: 'PATCH' });
}

export async function deleteSchoolNotification(notificationId: string): Promise<void> {
  await apiFetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });
}
