import { useLanguage } from "./LanguageProvider";
import { en } from "./en";
import { ar } from "./ar";

export const useTranslation = () => {
  const { lang, isRTL } = useLanguage();
  return { t: lang === "ar" ? ar : en, lang, isRTL };
};
