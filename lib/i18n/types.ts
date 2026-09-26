// Shared translation typing.
//
// CommonTranslations = marketing/auth strings (unchanged, lives in en/common.ts
// + ar/common.ts — verbatim copy of the old flat en.ts/ar.ts content, per
// PROJECT_PLAN_PANEL_I18N.md Decision 2: marketing/auth are NOT migrated in
// shape, just relocated into a `common` namespace so `Translations` can grow
// namespaces without becoming one monster file).
//
// TeacherTranslations = new namespace for app/(teacher)/** (M2). A `school`
// namespace will be added the same way for app/school/** (M3) — additive,
// no changes needed here to support it.
export interface CommonTranslations {
  nav: { signIn: string; register: string };
  hero: {
    badge: string; headline: string; sub: string;
    line1: string; line2: string; line3: string;
    cta_primary: string; cta_secondary: string; trusted_by: string;
    headlinePre: string; headlineAccent: string; headlineMid: string; headlineUnderline: string;
    ctaJoin: string;
  };
  stats: { value: string; label: string }[];
  card: {
    teacher_headline: string; teacher_sub: string;
    school_headline: string; school_sub: string;
    teacher_cta: string; school_cta: string;
    teacher_tab: string; school_tab: string;
    teacher_b1: string; teacher_b2: string; teacher_b3: string;
    school_b1: string; school_b2: string; school_b3: string;
  };
  features: {
    label: string; headlinePre: string; headlineAccent: string; headlinePost: string;
    sub: string; cta: string;
    items: { title: string; desc: string }[];
  };
  testimonial: { quote: string; name: string; role: string };
  startHiring: {
    label: string; headlinePre: string; headlinePost: string; sub: string; cta: string;
    tiles: { title: string; desc: string }[];
    ctaBoxText: string; ctaBoxButton: string;
  };
  howItWorks: {
    label: string; headlinePre: string; headlineAccent: string; sub: string;
    steps: { title: string; desc: string }[];
    ctaHeadline: string; ctaBodyBold: string; ctaBodyRest: string; ctaButton: string;
  };
  faq: {
    label: string; headlinePre: string; headlineAccent: string; sub: string;
    items: { q: string; a: string }[];
  };
  whyAbjad: {
    label: string; headlinePre: string; headlineAccent: string; headlinePost: string; sub: string;
    schools: {
      badge: string; headlineLine1: string; headlineLine2: string; body: string; cta: string;
      bullets: string[];
    };
    teachers: {
      badge: string; headlineLine1: string; headlineLine2: string; body: string; cta: string;
      bullets: string[];
    };
  };
  about: {
    hero: {
      badgeLocation: string; kicker: string;
      headlineLine1: string; headlineLine2: string; headlineAccent: string;
      sub: string; ctaJoin: string; ctaContact: string;
      stats: { val: string; label: string }[];
      tagline: string;
      bottomStats: { val: string; label: string }[];
    };
    mission: {
      kicker: string; kickerSub: string;
      quote: string; quoteAttribution: string;
      microStats: { val: string; label: string }[];
      narrative: string;
      pillars: { title: string; desc: string }[];
      cta: string;
    };
    vision: {
      kicker: string; headlinePre: string; headlineAccent: string; quote: string;
      whyKicker: string; whyKickerSub: string;
      whyItems: { title: string; desc: string }[];
      callout: string;
    };
    values: {
      kicker: string; kickerSub: string; headlinePre: string; headlineAccent: string; sub: string;
      items: { title: string; desc: string }[];
    };
    team: {
      kicker: string; headlinePre: string; headlineAccent: string; sub: string;
      members: { name: string; title: string; bio: string; tag: string }[];
      cta: string;
    };
    cta: {
      kicker: string; headlinePre: string; headlineAccent: string; sub: string;
      ctaTeacher: string; ctaSchool: string;
      taglines: string[];
    };
  };
  login: {
    welcome: string; subtitle: string; email: string; emailPlaceholder: string;
    password: string; passwordPlaceholder: string; remember: string; forgot: string;
    cta: string; signingIn: string; or: string; noAccount: string; createAccount: string;
    otpSent: string;
    subtitlePassword: string; signInCta: string; signingInPassword: string;
    useCodeInstead: string; usePasswordInstead: string; invalidCredentials: string;
    troubleSigningIn: string; tryCodeInstead: string;
    modeAnnouncePassword: string; modeAnnounceCode: string;
    showPassword: string; hidePassword: string;
  };
  register: {
    title: string; subtitle: string; chooseRole: string; yourDetails: string;
    iAmJoiningAs: string; teacher: string; teacherDesc: string; school: string;
    schoolDesc: string; continueAsTeacher: string; continueAsSchool: string;
    firstName: string; lastName: string; email: string; phone: string;
    subject: string; experience: string; schoolName: string; contactPerson: string;
    city: string; schoolType: string; password: string; confirmPassword: string;
    termsText: string; termsLink: string; andText: string; privacyLink: string;
    back: string; createAccountBtn: string; creating: string;
    alreadyHaveAccount: string; signIn: string; selectPlaceholder: string;
    experience0_1: string; experience2_4: string; experience5_9: string; experience10: string;
    passwordPlaceholder: string; confirmPasswordPlaceholder: string;
    passwordReq8Chars: string; passwordReqNotCommon: string; passwordsNoMatch: string;
    editPasswordLink: string;
  };
  forgotPassword: {
    title: string; subtitle: string; cta: string; sending: string; backToLogin: string;
  };
  resetPassword: {
    title: string; subtitle: string; newPassword: string; confirmPassword: string;
    cta: string; resetting: string; resendIn: string; resend: string;
    requestNewCode: string; backToForgot: string; successTitle: string;
    successBody: string; signInNow: string;
  };
  security: {
    title: string; addPasswordTitle: string; addPasswordBody: string;
    setPasswordCta: string; setPasswordSuccess: string; changePasswordTitle: string;
    currentPassword: string; currentPasswordIncorrect: string; changePasswordCta: string;
    changePasswordSuccess: string; alreadySetNotice: string; sessionExpired: string;
  };
  dashboardBanner: {
    passwordPromptTitle: string; passwordPromptBody: string;
    setPasswordAction: string; notNow: string;
  };
  verifyOtp: {
    title: string; subtitlePrefix: string; subtitleSuffix: string; defaultEmail: string;
    incompleteCode: string; invalidCodeFallback: string; verifying: string;
    verifyAndContinue: string; resendIn: string; resend: string; sending: string;
    resendFailedFallback: string; backToSignIn: string;
  };
  footer: string;
}

/** Small set of strings reused across several teacher-panel pages. */
export interface TeacherCommonTranslations {
  loading: string;
  retry: string;
  save: string;
  saving: string;
  cancel: string;
  close: string;
  delete: string;
  back: string;
  clearAll: string;
  clearFilters: string;
  somethingWentWrong: string;
  viewAll: string;
  all: string;
  yes: string;
  no: string;
  selectPlaceholder: string;
  switchToEnglish: string;
  switchToArabic: string;
  previousPage: string;
  nextPage: string;
}

export interface TeacherLayoutTranslations {
  navDashboard: string;
  navFindJobs: string;
  navSaved: string;
  navApplications: string;
  navInterviews: string;
  navProfile: string;
  navPremium: string;
  navNotifications: string;
  navSupport: string;
  myProfile: string;
  settings: string;
  signOut: string;
  me: string;
}

export interface TeacherDashboardTranslations {
  welcomeBack: string;
  subtitle: string;
  browseJobs: string;
  completeProfileTitle: string;
  completeProfileBody: string;
  moreViews: string;
  thereText: string;
  completeProfileCta: string;
  getVerifiedTitle: string;
  getVerifiedBody: string;
  verifiedBadge: string;
  submitForVerification: string;
  verificationInProgressTitle: string;
  verificationInProgressBody: string;
  statApplications: string;
  statInterviews: string;
  statOffers: string;
  statActive: string;
  statSubmittedChange: string;
  statUpcomingChange: string;
  statAwaitingReply: string;
  statNoneActive: string;
  statInProgressChange: string;
  recommendedForYou: string;
  recommendedSubtitle: string;
  viewAllLink: string;
  noRecommendationsTitle: string;
  noRecommendationsBody: string;
  completeProfileButton: string;
  why: string;
  activeOffers: string;
  recentActivity: string;
  noActivityTitle: string;
  noActivityBody: string;
  upcomingInterviews: string;
  allLink: string;
  noUpcomingInterviews: string;
  interviewConfirmed: string;
  interviewPending: string;
  viewDetails: string;
  notifications: string;
  noNotifications: string;
  quickActions: string;
  qaUpdateResume: string;
  qaBrowseJobs: string;
  qaViewApplications: string;
  qaEditProfile: string;
  profileStrength: string;
  criterionSubject: string;
  criterionGrade: string;
  criterionExperience: string;
  criterionCity: string;
  criterionLanguage: string;
  criterionQualifications: string;
  activityNoneYet: string;
  activityWillAppear: string;
  salaryNegotiable: string;
  salaryUndisclosed: string;
  salaryOnRequest: string;
  postedToday: string;
  postedOneDayAgo: string;
  postedDaysAgo: string;
  addAction: string;
  sectionPersonal: string;
  sectionProfessional: string;
  sectionEducation: string;
  sectionCertifications: string;
  sectionResume: string;
  sectionLanguages: string;
  sectionLocation: string;
}

export interface TeacherJobsTranslations {
  filters: string;
  searchPlaceholder: string;
  viewModeGroupLabel: string;
  listView: string;
  gridView: string;
  filterCity: string;
  filterSubject: string;
  filterGradeLevel: string;
  filterContractType: string;
  filterLanguage: string;
  filterExperience: string;
  filterSalaryRange: string;
  filterPostedDate: string;
  minSalaryLabel: string;
  maxSalaryLabel: string;
  resultsOf: string;
  noJobsTitle: string;
  noJobsBody: string;
  clearAllFilters: string;
  selectJobPrompt: string;
  showingOf: string;
  previousPageLabel: string;
  nextPageLabel: string;
  unsaveJob: string;
  saveJob: string;
  applied: string;
  jobOverview: string;
  employmentLabel: string;
  cityLabel: string;
  subjectsLabel: string;
  gradesLabel: string;
  salaryLabel: string;
  responsibilities: string;
  requirements: string;
  aboutTheRole: string;
  schoolCulture: string;
  benefits: string;
  requiredCertifications: string;
  preferredCertifications: string;
  languageOfInstruction: string;
  applicationSubmitted: string;
  applying: string;
  applyNow: string;
  postedVia: string;
  schoolFallback: string;
  closesOn: string;
  cityLabels: Record<string, string>;
  subjectLabels: Record<string, string>;
  gradeLevelLabels: Record<string, string>;
  contractTypeLabels: Record<string, string>;
  languageLabels: Record<string, string>;
  experienceLabels: Record<string, string>;
  postedWithinLabels: Record<string, string>;
  sortLabels: Record<string, string>;
  employmentTypeLabels: Record<string, string>;
  salaryNegotiable: string;
  salaryUndisclosed: string;
  salaryOnRequest: string;
  todayLabel: string;
  yesterdayLabel: string;
  daysAgoLabel: string;
  closesTodayLabel: string;
  daysLeftLabel: string;
  matchPercent: string;
}

export interface TeacherSavedJobsTranslations {
  title: string;
  loading: string;
  emptyCount: string;
  savedCount: string;
  browseJobs: string;
  emptyTitle: string;
  emptyBody: string;
  removeBtn: string;
  applied: string;
  applying: string;
  applyNow: string;
  showingOf: string;
  previousPageLabel: string;
  nextPageLabel: string;
  salaryNegotiable: string;
  salaryUndisclosed: string;
  salaryOnRequest: string;
  postedToday: string;
  postedOneDayAgo: string;
  postedDaysAgo: string;
  closedLabel: string;
  daysLeftLabel: string;
  matchPercent: string;
  cityLabels: Record<string, string>;
}

export interface TeacherApplicationsTranslations {
  title: string;
  subtitle: string;
  statTotalApplied: string;
  statResponseRate: string;
  statAvgResponseTime: string;
  statSuccessRate: string;
  pipelineTitle: string;
  tabAll: string;
  emptyTitle: string;
  emptyBody: string;
  withdrawTooltip: string;
  progressSubmitted: string;
  progressShortlisted: string;
  progressInterview: string;
  progressOffer: string;
  progressHired: string;
  appliedOn: string;
  updatedOn: string;
  matchPercent: string;
  offerReceivedAlert: string;
  hiredAlert: string;
  contractPending: string;
  downloadContract: string;
  downloadOfferLetter: string;
  feedbackShared: string;
  shareFeedback: string;
  hideTimeline: string;
  viewTimeline: string;
  statusLabels: Record<string, string>;
  jobFallback: string;
  undisclosed: string;
  negotiable: string;
}

export interface TeacherInterviewsTranslations {
  title: string;
  subtitle: string;
  nextInterview: string;
  joinMeeting: string;
  addToCalendar: string;
  statUpcoming: string;
  statConfirmed: string;
  statCompleted: string;
  statCancelled: string;
  tabUpcoming: string;
  tabAll: string;
  tabPast: string;
  emptyTitle: string;
  meetingLinkAvailable: string;
  confirm: string;
  reschedule: string;
  decline: string;
  submitFeedback: string;
  editFeedback: string;
  hideDetails: string;
  showDetails: string;
  interviewersLabel: string;
  respondBy: string;
  generalTipsTitle: string;
  tips: string[];
  typeLabels: Record<string, string>;
  statusLabels: Record<string, string>;
  jobFallback: string;
  schoolFallback: string;
  minutesSuffix: string;
}

export interface TeacherProfileTranslations {
  title: string;
  subtitle: string;
  preview: string;
  percentComplete: string;
  submitForReview: string;
  personalInfo: string;
  professionalInfo: string;
  education: string;
  certifications: string;
  resumeCv: string;
  languages: string;
  locationCompensation: string;
  incomplete: string;
  verifiedByAbjad: string;
  verificationInProgress: string;
  profileRejected: string;
  draft: string;
  teacherFallback: string;
  profileStrength: string;
  previous: string;
  next: string;
  fullNameEn: string;
  fullNameAr: string;
  idType: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  male: string;
  female: string;
  nationality: string;
  contactEmail: string;
  whatsappNumber: string;
  nationalId: string;
  iqama: string;
  saveChanges: string;
  savingLabel: string;
  subjectsTaught: string;
  gradeLevelsLabel: string;
  yearsOfExperience: string;
  employmentStatus: string;
  noticePeriodDays: string;
  noticePeriodPlaceholder: string;
  degreeType: string;
  major: string;
  universityName: string;
  graduationYear: string;
  countryOfGraduation: string;
  degreeCertificate: string;
  clickToUpload: string;
  orDragDrop: string;
  certificateUploaded: string;
  noFileUploaded: string;
  educationalCredentials: string;
  certificationsSubtitle: string;
  addCertification: string;
  resumeSubtitle: string;
  dropCvHere: string;
  cvFileTypes: string;
  browseFiles: string;
  uploaded: string;
  noCvUploaded: string;
  noCvBody: string;
  download: string;
  languageNamePlaceholder: string;
  addLanguage: string;
  locationSubtitle: string;
  preferredCities: string;
  contractTypePreference: string;
  fullTime: string;
  partTime: string;
  temporarySubstitute: string;
  any: string;
  expectedMonthlySalary: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  salaryNote: string;
  certificationName: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate: string;
  certificateFile: string;
  replace: string;
  uploadFile: string;
  view: string;
  profilePreviewLabel: string;
  profilePreviewSub: string;
  teaching: string;
  experienceSuffix: string;
  closePreview: string;
  matchScore: string;
  salaryExpectation: string;
  perMonth: string;
  statusApproved: string;
  statusUnderReview: string;
  statusRejected: string;
  statusDraft: string;
  subjectLabels: Record<string, string>;
  gradeLevelLabels: Record<string, string>;
  cityLabels: Record<string, string>;
  experienceLabels: Record<string, string>;
  degreeLabels: Record<string, string>;
  employmentStatusLabels: Record<string, string>;
  proficiencyLabels: Record<string, string>;
}

export interface TeacherSettingsTranslations {
  title: string;
  subtitle: string;
  backToDashboard: string;
}

export interface TeacherNotificationsTranslations {
  title: string;
  subtitle: string;
  newBadge: string;
  markAllAsRead: string;
  preferences: string;
  searchPlaceholder: string;
  clearSearch: string;
  filterLabel: string;
  unreadOnly: string;
  emptyTitle: string;
  emptyAllCaughtUp: string;
  emptyNothingHere: string;
  showAllNotifications: string;
  markUnread: string;
  deleteLabel: string;
  markReadLabel: string;
  teaserTitle: string;
  teaserBody: string;
  manage: string;
  typeLabels: Record<string, string>;
  filterLabels: Record<string, string>;
  minAgo: string;
  hoursAgo: string;
  yesterday: string;
}

export interface TeacherNotificationPrefsTranslations {
  backToNotifications: string;
  title: string;
  subtitle: string;
  channelsTitle: string;
  channelsSubtitle: string;
  emailTitle: string;
  emailDescription: string;
  pushTitle: string;
  pushDescription: string;
  soundTitle: string;
  soundDescription: string;
  typesTitle: string;
  typesSubtitle: string;
  unsavedChanges: string;
  allSaved: string;
  reset: string;
  saveChanges: string;
  loadFailed: string;
  saveFailed: string;
  saved: string;
  typeLabels: Record<string, { label: string; description: string }>;
}

export interface TeacherSupportTranslations {
  title: string;
  subtitle: string;
  liveChatTitle: string;
  liveChatStatus: string;
  emailSupportTitle: string;
  phoneTitle: string;
  phoneHours: string;
  tabMyTickets: string;
  tabNewTicket: string;
  tabFaq: string;
  noTicketsTitle: string;
  createFirstTicket: string;
  created: string;
  updated: string;
  meLabel: string;
  agentLabel: string;
  replyPlaceholder: string;
  send: string;
  ticketSubmittedTitle: string;
  ticketSubmittedBody: string;
  categoryLabel: string;
  selectCategoryPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  attachmentsLabel: string;
  attachmentsHint: string;
  attachmentsFileTypes: string;
  submitTicket: string;
  cancel: string;
  faqSearchPlaceholder: string;
  faqNoResults: string;
  faqHelpMore: string;
  faqHelpMoreBody: string;
  helpCenter: string;
  statusLabels: Record<string, string>;
  categoryLabels: Record<string, string>;
  faqItems: { q: string; a: string }[];
}

export interface TeacherBillingTranslations {
  title: string;
  subtitle: string;
  refresh: string;
  recentInvoices: string;
  noInvoices: string;
  renewsIn: string;
  changePlan: string;
  cancelPremium: string;
  cancelsAtPeriodEnd: string;
  monthSingular: string;
  monthsPlural: string;
  exclVat: string;
  upgradeTitle: string;
  upgradeBody: string;
  seePremiumPlans: string;
  cancelModalTitle: string;
  cancelModalBodyPrefix: string;
  cancelModalBodySuffix: string;
  endOfPeriod: string;
  keepPremium: string;
  cancelAtPeriodEnd: string;
  signedInAs: string;
  teacherAccount: string;
  statusLabels: Record<string, string>;
  invoiceStatusLabels: Record<string, string>;
}

export interface TeacherBillingPlansTranslations {
  backToBilling: string;
  badge: string;
  title: string;
  subtitle: string;
  noPlans: string;
}

export interface TeacherTranslations {
  common: TeacherCommonTranslations;
  layout: TeacherLayoutTranslations;
  dashboard: TeacherDashboardTranslations;
  jobs: TeacherJobsTranslations;
  savedJobs: TeacherSavedJobsTranslations;
  applications: TeacherApplicationsTranslations;
  interviews: TeacherInterviewsTranslations;
  profile: TeacherProfileTranslations;
  settings: TeacherSettingsTranslations;
  notifications: TeacherNotificationsTranslations;
  notificationPrefs: TeacherNotificationPrefsTranslations;
  support: TeacherSupportTranslations;
  billing: TeacherBillingTranslations;
  billingPlans: TeacherBillingPlansTranslations;
}

/**
 * Shared billing UI strings — used by components/billing/** which render in
 * BOTH the teacher panel and (later) the school panel. Lives at the top
 * level (sibling of `teacher`), NOT inside TeacherTranslations, so the
 * school panel can reuse the exact same keys without duplication.
 */
export interface BillingCheckoutTranslations {
  backToPlans: string;
  completeTitle: string;
  completeSubtitle: string;
  paymentMethodLabel: string;
  continueToPayment: string;
  encryptedNotice: string;
  enterDetails: string;
  loadingForm: string;
  demoTitle: string;
  demoBody: string;
  simulateCta: string;
  simulating: string;
  orderSummary: string;
  schoolPlanLabel: string;
  premiumTeacherLabel: string;
  subscriptionLabel: string;
  moneyBackGuarantee: string;
  cancelAnytime: string;
  zatcaInvoice: string;
  subtotal: string;
  vatLabel: string;
  total: string;
  manageSubscription: string;
  planNotFoundError: string;
  checkoutFailedError: string;
  demoCompleteFailedError: string;
  paymentFormErrorPrefix: string;
  paymentFormErrorFallback: string;
  hintMada: string;
  hintApplePay: string;
  hintStcPay: string;
  hintBankTransfer: string;
}

export interface BillingSuccessTranslations {
  verifyingTitle: string;
  verifyingBody: string;
  activatedTitle: string;
  activatedBodySchool: string;
  activatedBodyTeacher: string;
  planLabel: string;
  invoiceLabel: string;
  goToDashboard: string;
  manageSubscription: string;
  processingTitle: string;
  processingBody: string;
  goToBilling: string;
  declinedTitle: string;
  declinedBody: string;
  couldntVerifyTitle: string;
  tryAgain: string;
  referenceLabel: string;
  checkStatusFailedFallback: string;
  paymentDeclinedFallback: string;
}

export interface BillingPendingTranslations {
  awaitingTitle: string;
  awaitingBody: string;
  transferDetailsTitle: string;
  bankLabel: string;
  accountNameLabel: string;
  ibanLabel: string;
  swiftLabel: string;
  referenceLabel: string;
  amountLabel: string;
  transferDeadlineLabel: string;
  invoiceSectionTitle: string;
  invoiceNumberLabel: string;
  issuedLabel: string;
  totalLabel: string;
  downloadPdf: string;
  goToBilling: string;
  invoiceNotFoundFallback: string;
  loadFailedFallback: string;
  copyLabel: string;
  copiedLabel: string;
}

export interface BillingPlanCardTranslations {
  mostPopular: string;
  perMonthUnit: string;
  billedAs: string;
  save: string;
  alreadyOnPlan: string;
  manageSubscription: string;
  upgradeNow: string;
  subscribeToPremium: string;
  continueToCheckout: string;
  moneyBackGuarantee: string;
  cancelAnytime: string;
  zatcaInvoice: string;
  everythingIncluded: string;
  noFeatureDetails: string;
  alreadyHaveWarning: string;
}

export interface BillingPlanBadgeTranslations {
  startTrial: string;
  trial: string;
  lastDay: string;
  daySuffix: string;
  pastDue: string;
  cancelled: string;
  renewsSoon: string;
  expired: string;
}

export interface BillingTrialBannerTranslations {
  schoolTitle: string;
  teacherTitle: string;
  schoolBody: string;
  teacherBody: string;
  schoolCta: string;
  teacherCta: string;
  trialEndsToday: string;
  daysLeftInTrial: string;
  daySingular: string;
  dayPlural: string;
  pickPlanBody: string;
  choosePlan: string;
  endedTitle: string;
  endedBody: string;
  resubscribe: string;
}

export interface BillingPaywallTranslations {
  schoolTitle: string;
  teacherTitle: string;
  schoolBody: string;
  teacherBody: string;
  seePlans: string;
  maybeLater: string;
  closeLabel: string;
  defaultBullets: string[];
}

export interface BillingSharedTranslations {
  checkout: BillingCheckoutTranslations;
  success: BillingSuccessTranslations;
  pending: BillingPendingTranslations;
  planCard: BillingPlanCardTranslations;
  planBadge: BillingPlanBadgeTranslations;
  trialBanner: BillingTrialBannerTranslations;
  paywall: BillingPaywallTranslations;
}

export interface Translations extends CommonTranslations {
  teacher: TeacherTranslations;
  billingShared: BillingSharedTranslations;
}
