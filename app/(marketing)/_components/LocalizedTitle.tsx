"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Server `metadata` exports can't know the client-stored language, so the
// browser tab title stays English on Arabic pages. This overrides it once
// the language is known client-side. Server metadata remains the
// English/no-JS fallback.
type SeoPage = "home" | "about" | "teachers" | "schools" | "contact" | "pricing";

const TITLE_KEY: Record<SeoPage, "homeTitle" | "aboutTitle" | "teachersTitle" | "schoolsTitle" | "contactTitle" | "pricingTitle"> = {
  home: "homeTitle",
  about: "aboutTitle",
  teachers: "teachersTitle",
  schools: "schoolsTitle",
  contact: "contactTitle",
  pricing: "pricingTitle",
};

export default function LocalizedTitle({ page }: { page: SeoPage }) {
  const { t } = useTranslation();
  const title = t.seo[TITLE_KEY[page]];

  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
