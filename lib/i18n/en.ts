export interface Translations {
  nav: { signIn: string; register: string };
  hero: { badge: string; headline: string; sub: string };
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
    badge: "Saudi Arabia's #1 Education Hiring Platform",
    headline: "Where Great\nTeachers Meet\nGreat Schools",
    sub: "Join thousands of educators building meaningful careers across the Kingdom.",
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
    subtitle: "Sign in to your Abjad account",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    remember: "Remember me",
    forgot: "Forgot password?",
    cta: "Sign in",
    signingIn: "Signing in…",
    or: "or",
    noAccount: "Don't have an account?",
    createAccount: "Create account",
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
