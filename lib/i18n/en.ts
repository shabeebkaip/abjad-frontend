export interface Translations {
  nav: { signIn: string; register: string };
  hero: {
    badge: string; headline: string; sub: string;
    line1: string; line2: string; line3: string;
    cta_primary: string; cta_secondary: string; trusted_by: string;
  };
  stats: { teachers: string; schools: string; hires: string };
  card: {
    teacher_headline: string; teacher_sub: string;
    school_headline: string; school_sub: string;
    teacher_cta: string; school_cta: string;
    teacher_tab: string; school_tab: string;
    teacher_b1: string; teacher_b2: string; teacher_b3: string;
    school_b1: string; school_b2: string; school_b3: string;
  };
  features: {
    smart: { title: string; desc: string };
    schools: { title: string; desc: string };
    fast: { title: string; desc: string };
  };
  testimonial: { quote: string; name: string; role: string };
  login: {
    welcome: string; subtitle: string; email: string; emailPlaceholder: string;
    password: string; passwordPlaceholder: string; remember: string; forgot: string;
    cta: string; signingIn: string; or: string; noAccount: string; createAccount: string;
    otpSent: string;
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
  };
  footer: string;
}

export const en: Translations = {
  nav: {
    signIn: "Sign In",
    register: "Create Account",
  },
  hero: {
    badge: "Schools hiring now — 48 new listings this week",
    headline: "Where Great\nTeachers Meet\nGreat Schools",
    sub: "Stop sending CVs into the void. Abjad matches you directly with schools looking for your exact skills — in days, not months.",
    line1: "Where Great",
    line2: "Teachers Meet",
    line3: "Great Schools",
    cta_primary: "Find teaching jobs",
    cta_secondary: "Watch 60-sec demo",
    trusted_by: "Trusted by schools across the Kingdom",
  },
  stats: {
    teachers: "Teachers placed",
    schools: "Verified schools",
    hires: "Successful hires",
  },
  card: {
    teacher_headline: "Your next teaching job is here",
    teacher_sub: "2,000+ teachers found their school through Abjad",
    school_headline: "Find your ideal teacher fast",
    school_sub: "Most schools make a hire within 2 weeks",
    teacher_cta: "Start job hunting →",
    school_cta: "Start hiring →",
    teacher_tab: "I'm a Teacher",
    school_tab: "I'm a School",
    teacher_b1: "Browse hundreds of verified school listings",
    teacher_b2: "Set your availability & preferred subjects",
    teacher_b3: "Get matched with schools that suit you",
    school_b1: "Post jobs and receive matched candidates",
    school_b2: "Filter by subject, experience & availability",
    school_b3: "Interview and hire — all in one place",
  },
  features: {
    smart: { title: "Smart Matching", desc: "AI-powered job recommendations tailored to your skills" },
    schools: { title: "500+ Schools", desc: "Verified institutions across Saudi Arabia and the GCC" },
    fast: { title: "Fast Hiring", desc: "Most teachers receive interview invites within 48 hours" },
  },
  testimonial: {
    quote: "I found my ideal teaching position in Riyadh within two weeks of joining Abjad.",
    name: "Sara Al-Harbi",
    role: "Mathematics Teacher · Riyadh",
  },
  login: {
    welcome: "Welcome back",
    subtitle: "Enter your email to receive a verification code",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    remember: "Remember me",
    forgot: "Forgot password?",
    cta: "Send verification code",
    signingIn: "Sending code…",
    or: "or",
    noAccount: "Don't have an account?",
    createAccount: "Create account",
    otpSent: "Code sent! Check your inbox.",
  },
  register: {
    title: "Create account",
    subtitle: "Join Abjad and start your journey",
    chooseRole: "Choose Role",
    yourDetails: "Your Details",
    iAmJoiningAs: "I am joining as a…",
    teacher: "Teacher",
    teacherDesc: "Find teaching jobs",
    school: "School",
    schoolDesc: "Hire great teachers",
    continueAsTeacher: "Continue as Teacher",
    continueAsSchool: "Continue as School",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    phone: "Phone number",
    subject: "Subject",
    experience: "Experience",
    schoolName: "School name",
    contactPerson: "Contact person",
    city: "City",
    schoolType: "School type",
    password: "Password",
    confirmPassword: "Confirm password",
    termsText: "I agree to the",
    termsLink: "Terms of Service",
    andText: "and",
    privacyLink: "Privacy Policy",
    back: "Back",
    createAccountBtn: "Create Account",
    creating: "Creating…",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    selectPlaceholder: "Select…",
    experience0_1: "0–1 years",
    experience2_4: "2–4 years",
    experience5_9: "5–9 years",
    experience10: "10+ years",
  },
  footer: "Built in Saudi Arabia",
};
