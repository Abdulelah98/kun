import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { DEFAULT_CONTENT } from "@/lib/defaultContent";

const ContentContext = createContext(null);
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function ContentProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    axios
      .get(`${API}/content`)
      .then((r) => {
        if (cancel) return;
        const map = {};
        // backend returns {key: {key, ar, en, active, updated_at}}
        for (const [k, v] of Object.entries(r.data || {})) {
          map[k] = v?.ar || {};
        }
        setContent(map);
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
      for (const [k, v] of Object.entries(r.data || {})) {
        map[k] = v?.ar || {};
      }
      setContent(map);
    } catch {
      /* noop */
    }
  };

  return (
    <ContentContext.Provider value={{ content, loading, refresh }}>
      {children}
    </ContentContext.Provider>
  );
}

/**
 * Merge CMS content with defaults. CMS values take priority;
 * any missing field falls back to the default.
 * For arrays like `items`, the CMS array fully replaces defaults when non-empty.
 */
export function useContent(key) {
  const ctx = useContext(ContentContext);
  const fromCms = ctx?.content?.[key] || {};
  const defaults = DEFAULT_CONTENT[key] || {};
  // Shallow merge; for list fields use CMS if it has items, otherwise default
  const merged = { ...defaults };
  for (const [k, v] of Object.entries(fromCms)) {
    if (Array.isArray(v) && v.length === 0 && Array.isArray(defaults[k])) continue;
    if (v === "" || v === null || v === undefined) continue;
    merged[k] = v;
  }
  return merged;
}
