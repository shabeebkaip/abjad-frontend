"use client";

import Link from "@/components/MarketingLink";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { BILLING_UI_ENABLED } from "@/lib/billing-flags";

export function Footer() {
  const { t } = useTranslation();

  const footerLinks: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: t.footerNav.platformGroup,
      links: [
        { label: t.footerNav.forTeachers, href: "/teachers" },
        { label: t.footerNav.forSchools, href: "/schools" },
        { label: t.footerNav.howItWorks, href: "/#how-it-works" },
        ...(BILLING_UI_ENABLED ? [{ label: t.footerNav.pricing, href: "/pricing" }] : []),
      ],
    },
    {
      heading: t.footerNav.companyGroup,
      links: [
        { label: t.footerNav.aboutUs, href: "/about" },
      ],
    },
    {
      heading: t.footerNav.supportGroup,
      links: [
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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/8">

          {/* Brand column */}
          <div className="col-span-2">
            {/* Logo */}
            <Link href="/" aria-label={t.nav.homeAriaLabel} className="inline-block mb-5">
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
                  <MapPin size={12} />
                </div>
                {t.footerNav.addressLine}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.heading} className="col-span-1">
              <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">{group.heading}</h3>
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
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-slate-400 text-xs">
            {t.footerNav.copyright.replace("{year}", String(new Date().getFullYear()))}
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">{t.footerNav.privacy}</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">{t.footerNav.terms}</Link>
            <Link href="/cookies" className="hover:text-slate-300 transition-colors">{t.footerNav.cookies}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
