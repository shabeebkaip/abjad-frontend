import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, School, Mail, Phone, MapPin, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div
          className="rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden"
          style={{ background: "var(--brand-gradient)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="inline-block bg-white/20 text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full">
                Ready to get started?
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                🇸🇦 Made in Saudi Arabia
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
              Your next chapter starts here
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
              Join thousands of teachers and schools already using Abjad to build better careers and better classrooms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register?role=teacher"
                className="flex items-center justify-center gap-2 bg-white font-semibold text-sm px-7 py-4 rounded-2xl hover:shadow-xl hover:shadow-black/20 transition-all hover:-translate-y-0.5"
                style={{ color: "var(--brand-primary-dark)" }}
              >
                <GraduationCap size={17} />
                I&apos;m a Teacher
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/register?role=school"
                className="flex items-center justify-center gap-2 bg-white/15 border border-white/40 text-white font-semibold text-sm px-7 py-4 rounded-2xl hover:bg-white/25 transition-all"
              >
                <School size={17} />
                I&apos;m a School
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const footerLinks = {
  "Platform": [
    { label: "For Teachers", href: "#teachers" },
    { label: "For Schools", href: "#schools" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#" },
  ],
  "Company": [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press", href: "#" },
  ],
  "Support": [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const SOCIALS = [
  { icon: Twitter, href: "#", label: "Twitter / X" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      {/* Top gradient accent line */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--brand-accent), transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-white/8">

          {/* Brand column */}
          <div className="col-span-2">
            {/* Logo */}
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/ABJAD.png"
                alt="Abjad"
                width={110}
                height={58}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              Built in Saudi Arabia 🇸🇦 — the education hiring platform connecting talented teachers with exceptional schools across the Kingdom and the GCC.
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              <a href="mailto:hello@abjad.sa" className="flex items-center gap-2.5 text-slate-400 hover:text-(--brand-accent) text-xs transition-colors group">
                <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-(--brand-accent)/15 flex items-center justify-center transition-colors">
                  <Mail size={12} />
                </div>
                hello@abjad.sa
              </a>
              <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                  <Phone size={12} />
                </div>
                +966 11 000 0000
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin size={12} />
                </div>
                Riyadh, Saudi Arabia
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-6">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-(--brand-accent)/20 hover:text-(--brand-accent) text-slate-400 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="col-span-1">
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 inline-flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-1.5 h-px bg-(--brand-accent) transition-all duration-200 rounded-full" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter column */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">Stay Updated</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Get the latest job alerts and platform updates.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-(--brand-accent)/50 focus:bg-white/8 transition-colors"
              />
              <button
                className="w-full py-2.5 text-xs font-semibold rounded-xl text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-(--brand-accent)/20"
                style={{ backgroundColor: "var(--brand-accent)" }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Abjad. All rights reserved. Built in Saudi Arabia 🇸🇦
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-slate-300 transition-colors">Cookies</Link>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-medium">All systems normal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
