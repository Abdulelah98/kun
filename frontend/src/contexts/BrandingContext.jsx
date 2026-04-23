import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const BrandingContext = createContext(null);
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DEFAULT = {
  primary_color: "#f47424",
  primary_hover: "#d9641d",
  secondary_color: "#0A1128",
  accent_color: "#EDF0F4",
  logo_primary:
    "https://customer-assets.emergentagent.com/job_kun-conversion-site/artifacts/lox96qjv_KUN-LOGO.svg",
  logo_alt: "/assets/kun-logo-dark.png",
  admin_logo: "",
  favicon: "",
};

const STYLE_TAG_ID = "kun-branding-overrides";

/**
 * Apply branding CSS variables + override Tailwind arbitrary color classes
 * (bg-[#f47424], text-[#f47424], border-[#f47424], hover:bg-[#d9641d], ...)
 * by injecting a runtime <style> tag. This avoids touching hundreds of files.
 */
function applyBrandingToDom(b) {
  const root = document.documentElement;
  root.style.setProperty("--brand-primary", b.primary_color);
  root.style.setProperty("--brand-primary-hover", b.primary_hover);
  root.style.setProperty("--brand-secondary", b.secondary_color);
  root.style.setProperty("--brand-accent", b.accent_color);

  // Favicon
  if (b.favicon) {
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = b.favicon;
  }

  // Dynamic stylesheet remapping the hardcoded brand colors to user's choices
  let tag = document.getElementById(STYLE_TAG_ID);
  if (!tag) {
    tag = document.createElement("style");
    tag.id = STYLE_TAG_ID;
    document.head.appendChild(tag);
  }
  const p = b.primary_color;
  const ph = b.primary_hover;
  const s = b.secondary_color;
  tag.textContent = `
    /* Primary brand color — overrides all Tailwind arbitrary #f47424 utilities */
    .bg-\\[\\#f47424\\],
    .hover\\:bg-\\[\\#f47424\\]:hover,
    [class*="data-\\[state\\=active\\]\\:bg-\\[\\#f47424\\]"][data-state="active"] {
      background-color: ${p} !important;
    }
    .text-\\[\\#f47424\\],
    .hover\\:text-\\[\\#f47424\\]:hover,
    .group-hover\\/item\\:text-\\[\\#f47424\\]:hover,
    .group:hover .group-hover\\:text-\\[\\#f47424\\] {
      color: ${p} !important;
    }
    .border-\\[\\#f47424\\],
    .hover\\:border-\\[\\#f47424\\]:hover,
    .focus\\:border-\\[\\#f47424\\]:focus,
    .group-hover\\/item\\:border-\\[\\#f47424\\]:hover {
      border-color: ${p} !important;
    }
    .from-\\[\\#f47424\\] { --tw-gradient-from: ${p} !important; }
    .to-\\[\\#f47424\\] { --tw-gradient-to: ${p} !important; }
    .ring-\\[\\#f47424\\],
    .focus\\:ring-\\[\\#f47424\\]:focus { --tw-ring-color: ${p} !important; }
    /* Primary with opacity: keep consistent hue */
    .bg-\\[\\#f47424\\]\\/10 { background-color: ${p}1a !important; }
    .bg-\\[\\#f47424\\]\\/15 { background-color: ${p}26 !important; }
    .bg-\\[\\#f47424\\]\\/20 { background-color: ${p}33 !important; }
    .bg-\\[\\#f47424\\]\\/25 { background-color: ${p}40 !important; }
    .bg-\\[\\#f47424\\]\\/30 { background-color: ${p}4d !important; }
    .bg-\\[\\#f47424\\]\\/90 { background-color: ${p}e6 !important; }
    .hover\\:bg-\\[\\#f47424\\]\\/90:hover { background-color: ${p}e6 !important; }
    .border-\\[\\#f47424\\]\\/20 { border-color: ${p}33 !important; }
    .border-\\[\\#f47424\\]\\/25 { border-color: ${p}40 !important; }
    .border-\\[\\#f47424\\]\\/30 { border-color: ${p}4d !important; }
    .border-\\[\\#f47424\\]\\/40 { border-color: ${p}66 !important; }
    /* Hover darker */
    .bg-\\[\\#d9641d\\],
    .hover\\:bg-\\[\\#d9641d\\]:hover { background-color: ${ph} !important; }
    /* Secondary dark navy — unify both hardcoded variants */
    .bg-\\[\\#0A1128\\],
    .bg-\\[\\#0B1E2D\\] { background-color: ${s} !important; }
    .text-\\[\\#0A1128\\],
    .text-\\[\\#0B1E2D\\] { color: ${s} !important; }
    .border-\\[\\#0A1128\\],
    .border-\\[\\#0B1E2D\\] { border-color: ${s} !important; }
  `;
}

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/branding`);
      const merged = { ...DEFAULT, ...(r.data || {}) };
      setBranding(merged);
      applyBrandingToDom(merged);
    } catch {
      applyBrandingToDom(DEFAULT);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Apply defaults immediately to avoid FOUC, then refresh from API
    applyBrandingToDom(DEFAULT);
    refresh();
  }, [refresh]);

  return (
    <BrandingContext.Provider value={{ branding, loaded, refresh, setBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const ctx = useContext(BrandingContext);
  return ctx?.branding || DEFAULT;
}

export function useBrandingActions() {
  const ctx = useContext(BrandingContext);
  return { refresh: ctx?.refresh || (() => {}), setBranding: ctx?.setBranding };
}
