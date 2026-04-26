import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { TRANSLATIONS } from "@/lib/i18n";

const LanguageContext = createContext(null);

const STORAGE_KEY = "kun_lang";

function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ar" || saved === "en") return saved;
  } catch {
    /* ignore */
  }
  // Browser language detection
  const nav = (typeof navigator !== "undefined" && (navigator.language || navigator.userLanguage)) || "";
  if (nav.toLowerCase().startsWith("ar")) return "ar";
  if (nav.toLowerCase().startsWith("en")) return "en";
  return "ar";
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);

  const setLang = useCallback((next) => {
    if (next !== "ar" && next !== "en") return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "ar" ? "en" : "ar");
  }, [lang, setLang]);

  // Sync <html dir> and <html lang>
  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const t = useCallback(
    (key, fallback = "") => {
      const dict = TRANSLATIONS[lang] || {};
      return dict[key] ?? fallback ?? key;
    },
    [lang]
  );

  const value = {
    lang,
    setLang,
    toggleLang,
    dir: lang === "ar" ? "rtl" : "ltr",
    isRtl: lang === "ar",
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Safe defaults if used outside provider (e.g. during early render)
    return {
      lang: "ar",
      setLang: () => {},
      toggleLang: () => {},
      dir: "rtl",
      isRtl: true,
      t: (k, f = "") => f || k,
    };
  }
  return ctx;
}
