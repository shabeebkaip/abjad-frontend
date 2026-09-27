"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Phone, MapPin, Twitter, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function CtaBanner() {
  const { t, isRTL } = useTranslation();
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div
          className="rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden"
          style={{ background: "var(--brand-gradient)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-12 -end-12 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -start-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute top-1/2 start-1/4 w-32 h-32 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="inline-block bg-white/20 text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full">
                {t.footerNav.ctaEyebrow}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                {t.footerNav.ctaBadge}
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
              {t.footerNav.ctaHeadline}
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-10">
              {t.footerNav.ctaBody}
            </p>

            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white font-bold text-sm px-10 py-4 rounded-2xl hover:shadow-xl hover:shadow-black/20 transition-all hover:-translate-y-0.5"
              style={{ color: "var(--brand-primary-dark)" }}
            >
              {t.footerNav.ctaButton}
              <ArrowRight size={15} className={isRTL ? "rotate-180" : ""} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const SOCIALS = [
  { icon: Twitter, href: "#", labelKey: "socialTwitter" as const },
  { icon: Linkedin, href: "#", labelKey: "socialLinkedin" as const },
  { icon: Instagram, href: "#", labelKey: "socialInstagram" as const },
];

export function Footer() {
  const { t } = useTranslation();

  const footerLinks: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: t.footerNav.platformGroup,
      links: [
        { label: t.footerNav.forTeachers, href: "#teachers" },
        { label: t.footerNav.forSchools, href: "#schools" },
        { label: t.footerNav.howItWorks, href: "#how-it-works" },
        { label: t.footerNav.pricing, href: "/pricing" },
      ],
    },
    {
      heading: t.footerNav.companyGroup,
      links: [
        { label: t.footerNav.aboutUs, href: "/about" },
        { label: t.footerNav.careers, href: "#" },
        { label: t.footerNav.blogs, href: "#" },
      ],
    },
    {
      heading: t.footerNav.supportGroup,
      links: [
        { label: t.footerNav.helpCenter, href: "#" },
        { label: t.footerNav.contactUs, href: "/contact" },
        { label: t.footerNav.privacyPolicy, href: "/privacy" },
        { label: t.footerNav.termsOfService, href: "/terms" },
      ],
    },
  ];

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
              {t.footerNav.brandBlurb}
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              <a href="mailto:hello@abjad.sa" className="flex items-center gap-2.5 text-slate-400 hover:text-(--brand-accent) text-xs transition-colors group">
                <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-(--brand-accent)/15 flex items-center justify-center transition-colors">
                  <Mail size={12} />
                </div>
                <span dir="ltr">hello@abjad.sa</span>
              </a>
              <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                  <Phone size={12} />
                </div>
                <span dir="ltr">+966 11 000 0000</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin size={12} />
                </div>
                {t.footerNav.addressLine}
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-6">
              {SOCIALS.map(({ icon: Icon, href, labelKey }) => (
                <a
                  key={labelKey}
                  href={href}
                  aria-label={t.footerNav[labelKey]}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-(--brand-accent)/20 hover:text-(--brand-accent) text-slate-400 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.heading} className="col-span-1">
              <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">{group.heading}</h4>
              <ul className="space-y-2.5">
                {group.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-0.5 rtl:hover:-translate-x-0.5 inline-flex items-center gap-1 group"
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
            <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">{t.footerNav.stayUpdated}</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              {t.footerNav.newsletterBody}
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={t.footerNav.emailPlaceholder}
                className="w-full px-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-(--brand-accent)/50 focus:bg-white/8 transition-colors"
              />
              <button
                className="w-full py-2.5 text-xs font-semibold rounded-xl text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-(--brand-accent)/20"
                style={{ backgroundColor: "var(--brand-accent)" }}
              >
                {t.footerNav.subscribe}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-slate-500 text-xs">
            {t.footerNav.copyright.replace("{year}", String(new Date().getFullYear()))}
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">{t.footerNav.privacy}</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">{t.footerNav.terms}</Link>
            <Link href="/cookies" className="hover:text-slate-300 transition-colors">{t.footerNav.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
