// Shared number/currency/date formatting helpers — locale-aware, Western
// digits always (Decision 3a), currency as "SAR 8,500" (Decision 3b),
// Gregorian dates with Arabic month/day names when locale is "ar" (Decision 3c).
//
// Use these instead of ad hoc `.toLocaleString()` / `toLocaleDateString()`
// calls scattered across pages (PROJECT_PLAN_PANEL_I18N.md Risk #3 /
// acceptance criterion #4).

export type Locale = "en" | "ar";

// "latn" numbering system forces Western 0-9 digits even in the "ar" locale
// (which would otherwise render Eastern Arabic-Indic numerals ٠١٢٣).
function intlLocale(locale: Locale): string {
  return locale === "ar" ? "ar-SA-u-nu-latn" : "en-US";
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale)).format(value);
}

/** Renders "SAR 8,500" (Decision 3b) — same word order in both locales. */
export function formatCurrency(value: number, locale: Locale): string {
  return `SAR ${formatNumber(value, locale)}`;
}

export interface FormatDateOptions {
  dateStyle?: "full" | "long" | "medium" | "short";
  weekday?: "long" | "short" | "narrow";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  year?: "numeric" | "2-digit";
}

/** Gregorian calendar always (Hijri explicitly deferred — Decision 4). */
export function formatDate(
  value: string | number | Date,
  locale: Locale,
  options: FormatDateOptions = { dateStyle: "medium" },
): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(intlLocale(locale), { calendar: "gregory", ...options }).format(date);
}

export function formatTime(
  value: string | number | Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit", hour12: true },
): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(intlLocale(locale), options).format(date);
}
