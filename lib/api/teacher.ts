// Teacher API client — typed wrappers around apiFetch for all teacher endpoints
import { apiFetch } from './client';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TeacherProfile {
  _id: string;
  uuid: string;
  userId: string;
  profileStatus: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';
  completionPercentage: number;
  personal: {
    fullNameAr?: string;
    fullNameEn?: string;
    nationalId?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female';
    nationality?: string;
    photoUrl?: string;
    whatsapp?: string;
  };
  professional: {
    subjects?: string[];
    gradeLevels?: string[];
    experienceRange?: string;
    employmentStatus?: 'employed' | 'unemployed' | 'freelance';
    // SRD 2.2.2 — only meaningful when employmentStatus === 'employed'.
    noticePeriodDays?: number;
  };
  education: {
    degreeType?: 'bachelor' | 'master' | 'phd' | 'diploma' | 'other';
    major?: string;
    university?: string;
    graduationYear?: number;
    country?: string;
    certificateUrl?: string;
  };
  certifications: Array<{
    _id: string;
    name: string;
    issuer: string;
    issueDate: string;
    hasExpiry: boolean;
    expiryDate?: string;
    fileUrl?: string;
  }>;
  languages: Array<{
    language: string;
    proficiency: 'native' | 'fluent' | 'intermediate' | 'basic';
  }>;
  locationPreferences: {
    preferredCities?: string[];
    willingToRelocate?: boolean;
  };
  salaryExpectations: {
    minMonthlySAR?: number;
    maxMonthlySAR?: number;
    contractTypes?: string[];
  };
  resume: {
    fileUrl?: string;
    originalName?: string;
    uploadedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  _id: string;
  title: string;
  schoolId: string | { _id: string; name?: string };
  school?: { name: string; logoUrl?: string };
  subjects: string[];
  gradeLevels: string[];
  employmentType: string;
  salary: { min: number; max: number; display: 'show' | 'hide' | 'negotiable' };
  city: string;
  deadline: string;
  isAnonymous: boolean;
  viewsCount: number;
  applicationsCount: number;
  isSaved?: boolean;
  // Flagged on listings when an authenticated teacher has a non-withdrawn
  // application against this job (SRD 2.3 — show "Applied" instead of "Apply").
  isApplied?: boolean;
  matchScore?: number;
  // SRD 5.1.1 — per-criterion breakdown (0–100 each). Used to render
  // "Why this match" chips under recommendation cards.
  matchBreakdown?: {
    subjects: number;
    gradeLevels: number;
    experience: number;
    location: number;
    language: number;
    qualifications: number;
  };
  createdAt: string;
  // Detail-only fields
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  languageRequirement?: string;
  startDate?: string;
  schedule?: string;
  // SRD 3.2.1 / 6.1.3 — bilingual + structured detail content
  titleAr?: string;
  titleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionSections?: {
    responsibilities?: { ar?: string; en?: string };
    requirements?:     { ar?: string; en?: string };
    culture?:          { ar?: string; en?: string };
    benefits?:         { ar?: string; en?: string };
  };
  campus?: string;
  certificationsRequired?: string[];
  certificationsPreferred?: string[];
  contractDuration?: { type: 'day' | 'month' | 'year'; value?: number };
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Application {
  _id: string;
  referenceNumber: string;
  jobId: {
    _id: string;
    title: string;
    subjects: string[];
    city: string;
    salary: { min: number; max: number; display: string };
    deadline: string;
  };
  status: 'submitted' | 'reviewing' | 'shortlisted' | 'interview_scheduled' | 'offer_extended' | 'hired' | 'rejected' | 'withdrawn';
  statusHistory: Array<{ status: string; timestamp: string; note?: string }>;
  matchScore?: number;
  coverLetter?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApplicationStats {
  total: number;
  submitted: number;
  reviewing: number;
  shortlisted: number;
  interview_scheduled: number;
  offer_extended: number;
  hired: number;
  rejected: number;
  withdrawn: number;
  responseRate: number;
  // SRD 2.5.4 — null when no applications have been responded to yet
  avgResponseHours: number | null;
  successRate: number;
}

export interface Interview {
  _id: string;
  jobId: { _id?: string; title: string; subjects?: string[]; city?: string };
  schoolId: { _id?: string; name: string };
  type: 'video' | 'in_person' | 'phone';
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
  interviewers?: Array<{ name: string }>;
  instructions?: string;
  status: 'pending' | 'accepted' | 'declined' | 'rescheduled' | 'completed' | 'cancelled';
  responseDeadline?: string;
  createdAt?: string;
  // SRD 2.6.4 — teacher post-interview feedback (separate from school's hire/maybe/reject)
  teacherFeedback?: {
    rating: number;       // 1–5
    comment?: string;
    submittedAt: string;
  };
}

export interface Offer {
  _id: string;
  jobId: { _id?: string; title: string; city?: string };
  schoolId: { _id?: string; name: string };
  position: string;
  salary: number;
  contractDuration?: string;
  startDate?: string;
  benefits?: string;
  terms?: string;
  deadline: string;
  status: 'sent' | 'viewed' | 'accepted' | 'declined' | 'negotiating' | 'expired';
  offerLetterUrl?: string;
  // SRD 2.7.3 — final signed contract uploaded by the school post-acceptance
  contractUrl?: string;
  hireConfirmedAt?: string;
  viewedAt?: string;
  negotiationHistory?: Array<{ counterSalary?: number; message: string; createdAt: string }>;
  applicationId?: string;
  createdAt?: string;
}

export interface Notification {
  _id: string;
  type: 'job_match' | 'application_status' | 'interview_invitation' | 'interview_reminder' | 'offer_received' | 'message' | 'profile_status' | 'system';
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export interface SupportTicket {
  _id: string;
  ticketNumber: string;
  category: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: Array<{
    _id?: string;
    sender: 'user' | 'admin';
    content: string;
    createdAt: string;
    attachments?: Array<{ url: string; name: string }>;
  }>;
  attachments?: Array<{ url: string; name: string }>;
  createdAt: string;
  updatedAt?: string;
  // SRD 2.9.3 — 24-hour response SLA timestamps
  responseDueAt?: string;
  firstResponseAt?: string;
}

// SRD 2.10.3 — Activity Feed entry shape (mirrors the backend)
export interface ActivityEntry {
  type:
    | 'application_submitted'
    | 'application_status'
    | 'interview_scheduled'
    | 'interview_response'
    | 'offer_received'
    | 'offer_response'
    | 'profile_update';
  title: string;
  timestamp: string;
  link?: string;
}

export interface DashboardData {
  profile: {
    completionPercentage: number;
    status: string;
    profileStatus: string;
    suggestions: string[];
  };
  applications: {
    stats: ApplicationStats;
    activeCount: number;
  };
  upcomingInterviews: Interview[];
  activeOffers: Offer[];
  recommendations: Job[];
  notifications: {
    recent: Notification[];
    unreadCount: number;
  };
  activity?: ActivityEntry[];
}

// ── API Functions ─────────────────────────────────────────────────────────────

// Dashboard
export async function getDashboard(): Promise<DashboardData> {
  const res = await apiFetch<DashboardData>('/api/teacher/dashboard');
  return res.data!;
}

// Profile
export async function getProfile(): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile');
  return res.data!;
}

export async function updatePersonal(data: Partial<TeacherProfile['personal']>): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/personal', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function updateProfessional(data: Partial<TeacherProfile['professional']>): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/professional', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function updateEducation(data: Partial<TeacherProfile['education']>): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/education', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function updateLanguages(languages: TeacherProfile['languages']): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/languages', {
    method: 'PATCH',
    body: JSON.stringify({ languages }),
  });
  return res.data!;
}

export async function updateLocation(data: TeacherProfile['locationPreferences']): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/location', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function updateSalary(data: TeacherProfile['salaryExpectations']): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/salary', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function addCertification(data: {
  name: string;
  issuer: string;
  issueDate: string;
  hasExpiry: boolean;
  expiryDate?: string;
}): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/certifications', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function removeCertification(certId: string): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>(`/api/teacher/profile/certifications/${certId}`, {
    method: 'DELETE',
  });
  return res.data!;
}

export async function submitProfile(): Promise<TeacherProfile> {
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/submit', { method: 'POST' });
  return res.data!;
}

// File uploads — returns updated profile
export async function uploadProfilePhoto(file: File): Promise<TeacherProfile> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/photo', { method: 'POST', body: form });
  return res.data!;
}

export async function uploadResume(file: File): Promise<TeacherProfile> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/resume', { method: 'POST', body: form });
  return res.data!;
}

export async function uploadEducationCertificate(file: File): Promise<TeacherProfile> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiFetch<TeacherProfile>('/api/teacher/profile/education/certificate', { method: 'POST', body: form });
  return res.data!;
}

export async function uploadCertificationFile(certId: string, file: File): Promise<TeacherProfile> {
  const form = new FormData();
  form.append('file', file);
  const res = await apiFetch<TeacherProfile>(`/api/teacher/profile/certifications/${certId}/upload`, { method: 'POST', body: form });
  return res.data!;
}

// Jobs
export interface JobListParams {
  city?: string[];
  subjects?: string[];
  gradeLevels?: string[];
  languageRequirement?: string;
  experienceRequired?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  postedWithin?: number;
  sortBy?: 'newest' | 'deadline' | 'salary_asc' | 'salary_desc';
  page?: number;
  limit?: number;
}

export async function listJobs(params?: JobListParams): Promise<JobsResponse> {
  const q = new URLSearchParams();
  if (params) {
    params.city?.forEach((c) => q.append('city', c));
    params.subjects?.forEach((s) => q.append('subjects', s));
    params.gradeLevels?.forEach((g) => q.append('gradeLevels', g));
    if (params.languageRequirement) q.set('languageRequirement', params.languageRequirement);
    if (params.experienceRequired)  q.set('experienceRequired', params.experienceRequired);
    if (params.employmentType)       q.set('employmentType', params.employmentType);
    if (params.salaryMin !== undefined) q.set('salaryMin', String(params.salaryMin));
    if (params.salaryMax !== undefined) q.set('salaryMax', String(params.salaryMax));
    if (params.postedWithin !== undefined) q.set('postedWithin', String(params.postedWithin));
    if (params.sortBy) q.set('sortBy', params.sortBy);
    if (params.page)  q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
  }
  const qs = q.toString();
  const res = await apiFetch<JobsResponse>(`/api/jobs${qs ? `?${qs}` : ''}`);
  return res.data!;
}

export async function getJob(jobId: string): Promise<{ job: Job; isSaved: boolean }> {
  const res = await apiFetch<{ job: Job; isSaved: boolean }>(`/api/jobs/${jobId}`);
  return res.data!;
}

export async function getJobRecommendations(): Promise<Job[]> {
  const res = await apiFetch<{ jobs: Job[] }>('/api/jobs/recommendations');
  return res.data?.jobs ?? [];
}

export async function saveJob(jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/save`, { method: 'POST' });
}

export async function unsaveJob(jobId: string): Promise<void> {
  await apiFetch(`/api/jobs/${jobId}/save`, { method: 'DELETE' });
}

export async function getSavedJobs(page = 1, limit = 20): Promise<JobsResponse> {
  const res = await apiFetch<JobsResponse>(`/api/jobs/saved?page=${page}&limit=${limit}`);
  return res.data!;
}

// Applications
export async function applyForJob(jobId: string, coverLetter?: string): Promise<Application> {
  const res = await apiFetch<Application>('/api/applications', {
    method: 'POST',
    body: JSON.stringify({ jobId, ...(coverLetter ? { coverLetter } : {}) }),
  });
  return res.data!;
}

export async function listApplications(params?: { status?: string; page?: number; limit?: number }): Promise<{ applications: Application[]; total: number; page: number; totalPages: number }> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.page)   q.set('page', String(params.page));
  if (params?.limit)  q.set('limit', String(params.limit));
  const qs = q.toString();
  const res = await apiFetch<{ applications: Application[]; total: number; page: number; totalPages: number }>(`/api/applications${qs ? `?${qs}` : ''}`);
  return res.data!;
}

export async function getApplicationStats(): Promise<ApplicationStats> {
  const res = await apiFetch<ApplicationStats>('/api/applications/stats');
  return res.data!;
}

export async function withdrawApplication(applicationId: string): Promise<Application> {
  const res = await apiFetch<Application>(`/api/applications/${applicationId}/withdraw`, { method: 'PATCH' });
  return res.data!;
}

// Interviews
export async function listInterviews(params?: { status?: string; page?: number; limit?: number }): Promise<{ interviews: Interview[]; total: number; page: number; totalPages: number }> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.page)   q.set('page', String(params.page));
  if (params?.limit)  q.set('limit', String(params.limit));
  const qs = q.toString();
  const res = await apiFetch<{ interviews: Interview[]; total: number; page: number; totalPages: number }>(`/api/interviews${qs ? `?${qs}` : ''}`);
  return res.data!;
}

export async function getUpcomingInterviews(): Promise<Interview[]> {
  const res = await apiFetch<{ interviews: Interview[] }>('/api/interviews/upcoming');
  return res.data?.interviews ?? [];
}

export async function respondToInterview(
  interviewId: string,
  action: 'accepted' | 'declined' | 'reschedule_requested',
  reason?: string,
  proposedTime?: string,
): Promise<Interview> {
  const res = await apiFetch<Interview>(`/api/interviews/${interviewId}/respond`, {
    method: 'PATCH',
    body: JSON.stringify({ action, ...(reason ? { reason } : {}), ...(proposedTime ? { proposedTime } : {}) }),
  });
  return res.data!;
}

// SRD 2.6.4 — submit teacher post-interview feedback (1-5 stars + optional comment)
export async function submitInterviewFeedback(
  interviewId: string,
  rating: number,
  comment?: string,
): Promise<Interview> {
  const res = await apiFetch<Interview>(`/api/interviews/${interviewId}/feedback`, {
    method: 'POST',
    body: JSON.stringify({ rating, ...(comment ? { comment } : {}) }),
  });
  return res.data!;
}

// Offers
export async function listOffers(params?: { status?: string; page?: number; limit?: number }): Promise<{ offers: Offer[]; total: number; page: number; totalPages: number }> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.page)   q.set('page', String(params.page));
  if (params?.limit)  q.set('limit', String(params.limit));
  const qs = q.toString();
  const res = await apiFetch<{ offers: Offer[]; total: number; page: number; totalPages: number }>(`/api/offers${qs ? `?${qs}` : ''}`);
  return res.data!;
}

export async function respondToOffer(
  offerId: string,
  action: 'accepted' | 'declined' | 'negotiate',
  options?: { reason?: string; counterSalary?: number; message?: string },
): Promise<Offer> {
  const res = await apiFetch<Offer>(`/api/offers/${offerId}/respond`, {
    method: 'PATCH',
    body: JSON.stringify({ action, ...options }),
  });
  return res.data!;
}

// Notifications
export async function listNotifications(params?: {
  type?: string;
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<NotificationsResponse> {
  const q = new URLSearchParams();
  if (params?.type)                q.set('type', params.type);
  if (params?.unreadOnly)          q.set('unreadOnly', 'true');
  if (params?.page !== undefined)  q.set('page', String(params.page));
  if (params?.limit !== undefined) q.set('limit', String(params.limit));
  if (params?.search?.trim())      q.set('search', params.search.trim());
  const qs = q.toString();
  const res = await apiFetch<NotificationsResponse>(`/api/notifications${qs ? `?${qs}` : ''}`);
  return res.data!;
}

export async function getUnreadCount(): Promise<number> {
  const res = await apiFetch<{ count: number }>('/api/notifications/unread-count');
  return res.data?.count ?? 0;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await apiFetch(`/api/notifications/${notificationId}/read`, { method: 'PATCH' });
}

// SRD 2.8.3 — toggle a notification back to unread
export async function markNotificationUnread(notificationId: string): Promise<void> {
  await apiFetch(`/api/notifications/${notificationId}/unread`, { method: 'PATCH' });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch('/api/notifications/read-all', { method: 'PATCH' });
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await apiFetch(`/api/notifications/${notificationId}`, { method: 'DELETE' });
}

// SRD 2.8.2 — notification preferences
export type NotificationTypeKey =
  | 'job_match'
  | 'application_status'
  | 'interview_invitation'
  | 'interview_reminder'
  | 'offer_received'
  | 'message'
  | 'profile_status'
  | 'system';

export interface NotificationPreferences {
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  soundEnabled: boolean;
  notificationPreferences: Record<NotificationTypeKey, boolean>;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const res = await apiFetch<NotificationPreferences>('/api/notifications/preferences');
  if (!res.data) throw new Error('Invalid response from server');
  return res.data;
}

export async function updateNotificationPreferences(
  patch: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const res = await apiFetch<NotificationPreferences>('/api/notifications/preferences', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  if (!res.data) throw new Error('Invalid response from server');
  return res.data;
}

// Support
export async function listTickets(params?: { status?: string; page?: number; limit?: number }): Promise<{ tickets: SupportTicket[]; total: number; page: number; totalPages: number }> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.page)   q.set('page', String(params.page));
  if (params?.limit)  q.set('limit', String(params.limit));
  const qs = q.toString();
  const res = await apiFetch<{ tickets: SupportTicket[]; total: number; page: number; totalPages: number }>(`/api/support/tickets${qs ? `?${qs}` : ''}`);
  return res.data!;
}

export async function createTicket(data: {
  category: string;
  subject: string;
  description: string;
  attachments?: Array<{ url: string; name: string }>;
}): Promise<SupportTicket> {
  const res = await apiFetch<SupportTicket>('/api/support/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data!;
}

export async function getTicket(ticketId: string): Promise<SupportTicket> {
  const res = await apiFetch<SupportTicket>(`/api/support/tickets/${ticketId}`);
  return res.data!;
}

export async function replyToTicket(ticketId: string, content: string, attachments?: Array<{ url: string; name: string }>): Promise<SupportTicket> {
  const res = await apiFetch<SupportTicket>(`/api/support/tickets/${ticketId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content, ...(attachments ? { attachments } : {}) }),
  });
  return res.data!;
}

export async function closeTicket(ticketId: string): Promise<SupportTicket> {
  const res = await apiFetch<SupportTicket>(`/api/support/tickets/${ticketId}/close`, { method: 'PATCH' });
  return res.data!;
}

export async function submitFeedback(data: {
  type: 'post_hire' | 'platform' | 'suggestion' | 'report';
  rating?: number;
  content: string;
  isAnonymous?: boolean;
  relatedId?: string;
  relatedModel?: 'Job' | 'Application' | 'Interview';
}): Promise<void> {
  await apiFetch('/api/support/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
