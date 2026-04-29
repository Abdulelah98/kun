import { Link } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useBranding } from "@/contexts/BrandingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";

export default function Footer() {
  const branding = useBranding();
  const { t, isRtl } = useLanguage();
  const settings = useSettings();
  const LOGO_URL = branding.logo_primary;

  const links = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.spaces"), path: "/spaces" },
    { label: t("nav.business"), path: "/business" },
    { label: t("nav.pod"), path: "/pod" },
    { label: t("nav.about"), path: "/about" },
  ];

  const phone = settings.phone || "0535420969";
  const phoneTel = `+966${phone.replace(/^0/, "").replace(/\s/g, "")}`;
  const email = settings.email || "info@kun.com";
  const address = isRtl ? settings.address_ar : settings.address_en;
  const social = settings.social || {};

  return (
    <footer data-testid="main-footer" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img src={LOGO_URL} alt="KUN" className="h-10 mb-4 brightness-0 invert" />
            <p className="text-gray-400 text-sm leading-relaxed">
              {t("footer.brand_description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("footer.quick_links")}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    data-testid={`footer-link-${link.path.replace("/", "") || "home"}`}
                    className="text-gray-400 hover:text-[#f47424] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("footer.contact_us")}</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-[#f47424] transition-colors">
                <Mail size={16} />
                {email}
              </a>
              <a href={`tel:${phoneTel}`} className="flex items-center gap-2 hover:text-[#f47424] transition-colors">
                <Phone size={16} />
                {phone}
              </a>
              {address && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {address}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                {social.instagram && (
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" data-testid="footer-instagram" className="text-gray-400 hover:text-[#f47424] transition-colors">
                    <Instagram size={20} />
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target="_blank" rel="noopener noreferrer" data-testid="footer-twitter" className="text-gray-400 hover:text-[#f47424] transition-colors">
                    <Twitter size={20} />
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer" data-testid="footer-linkedin" className="text-gray-400 hover:text-[#f47424] transition-colors">
                    <Linkedin size={20} />
                  </a>
                )}
                {social.snapchat && (
                  <a href={social.snapchat} target="_blank" rel="noopener noreferrer" data-testid="footer-snapchat" className="text-gray-400 hover:text-[#f47424] transition-colors text-xs font-bold border border-current rounded px-1.5 py-0.5">
                    SC
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-gray-500 text-xs">
          <span>2025 {t("footer.rights")}</span>
          <span className="flex items-center gap-1.5">
            {isRtl ? "تطوير" : "Developed by"}
            <a
              href="https://ilogic.com.sa"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="developer-credit"
              className="font-semibold text-gray-300 hover:text-[#f47424] transition-colors"
            >
              {isRtl ? "آي لوجيك" : "iLogic"}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
