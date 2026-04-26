import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { DEFAULT_CONTENT } from "@/lib/defaultContent";
import { DEFAULT_CONTENT_EN } from "@/lib/defaultContentEn";
import { useLanguage } from "@/contexts/LanguageContext";

const ContentContext = createContext(null);
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function ContentProvider({ children }) {
  // Stores raw blocks: { [key]: { ar: {...}, en: {...} } }
  const [raw, setRaw] = useState({});
  const [activeMap, setActiveMap] = useState({});
  const [loading, setLoading] = useState(true);

  const ingest = (data) => {
    const map = {};
    const active = {};
    for (const [k, v] of Object.entries(data || {})) {
      map[k] = { ar: v?.ar || {}, en: v?.en || {} };
      active[k] = v?.active !== false;
    }
    setRaw(map);
    setActiveMap(active);
  };

  useEffect(() => {
    let cancel = false;
    axios
      .get(`${API}/content`)
      .then((r) => {
        if (cancel) return;
        ingest(r.data);
      })
      .catch(() => {})
      .finally(() => !cancel && setLoading(false));
    return () => {
      cancel = true;
    };
  }, []);

  const refresh = async () => {
    try {
      const r = await axios.get(`${API}/content`);
      ingest(r.data);
    } catch {
      /* noop */
    }
  };

  return (
    <ContentContext.Provider value={{ raw, activeMap, loading, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

/**
 * Returns CMS content for the given key in the currently active language,
 * with smart fallbacks: CMS(active lang) → CMS(other lang) → defaults(active lang) → defaults(ar).
 * Empty/missing fields fall through field-by-field.
 */
export function useContent(key) {
  const ctx = useContext(ContentContext);
  const { lang } = useLanguage();

  const block = ctx?.raw?.[key] || {};
  const cmsActive = block[lang] || {};
  const cmsOther = block[lang === "ar" ? "en" : "ar"] || {};
  const defaultsActive = (lang === "en" ? DEFAULT_CONTENT_EN[key] : DEFAULT_CONTENT[key]) || {};
  const defaultsAr = DEFAULT_CONTENT[key] || {};

  // Priority (low → high; last write wins):
  //   defaultsAr < cmsOther < defaultsActive < cmsActive
  // Active-lang defaults beat the *other* language's CMS so visitors get a
  // localized experience even before the admin fills out a block.
  const layers = [defaultsAr, cmsOther, defaultsActive, cmsActive];
  const merged = {};
  for (const layer of layers) {
    for (const [k, v] of Object.entries(layer)) {
      if (Array.isArray(v) && v.length === 0 && Array.isArray(merged[k])) continue;
      if (v === "" || v === null || v === undefined) continue;
      merged[k] = v;
    }
  }
  return merged;
}

/** Returns true if the section is visible on the site (default: true). */
export function useSectionActive(key) {
  const ctx = useContext(ContentContext);
  const v = ctx?.activeMap?.[key];
  return v !== false;
}
