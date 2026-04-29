import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DEFAULTS = {
  phone: "0535420969",
  email: "info@kun.com",
  whatsapp: "0535420969",
  address_ar: "طريق الملك سلمان",
  address_en: "King Salman Road",
  map_embed: "",
  map_lat: 24.7136,
  map_lng: 46.6753,
  social: {},
  admin_notify_email: "",
};

const SettingsContext = createContext(DEFAULTS);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    axios
      .get(`${API}/settings`)
      .then((r) => setSettings({ ...DEFAULTS, ...(r.data || {}), social: { ...(r.data?.social || {}) } }))
      .catch(() => {});
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
