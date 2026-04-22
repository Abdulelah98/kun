import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { DEFAULT_CONTENT } from "@/lib/defaultContent";

const ContentContext = createContext(null);
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function ContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [activeMap, setActiveMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    axios
      .get(`${API}/content`)
      .then((r) => {
        if (cancel) return;
        const map = {};
        const active = {};
        for (const [k, v] of Object.entries(r.data || {})) {
          map[k] = v?.ar || {};
          // undefined/true mean active by default; only explicit false hides
          active[k] = v?.active !== false;
        }
        setContent(map);
        setActiveMap(active);
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
      const map = {};
      const active = {};
      for (const [k, v] of Object.entries(r.data || {})) {
        map[k] = v?.ar || {};
        active[k] = v?.active !== false;
      }
      setContent(map);
      setActiveMap(active);
    } catch {
      /* noop */
    }
  };

  return (
    <ContentContext.Provider value={{ content, activeMap, loading, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

/**
 * Merge CMS content with defaults. CMS values take priority;
 * any missing field falls back to the default.
 */
export function useContent(key) {
  const ctx = useContext(ContentContext);
  const fromCms = ctx?.content?.[key] || {};
  const defaults = DEFAULT_CONTENT[key] || {};
  const merged = { ...defaults };
  for (const [k, v] of Object.entries(fromCms)) {
    if (Array.isArray(v) && v.length === 0 && Array.isArray(defaults[k])) continue;
    if (v === "" || v === null || v === undefined) continue;
    merged[k] = v;
  }
  return merged;
}

/** Returns true if the section is visible on the site (default: true). */
export function useSectionActive(key) {
  const ctx = useContext(ContentContext);
  // Undefined means not saved yet → treat as active
  const v = ctx?.activeMap?.[key];
  return v !== false;
}
