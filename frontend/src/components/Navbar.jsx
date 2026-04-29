import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBranding } from "@/contexts/BrandingContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const branding = useBranding();
  const { lang, toggleLang, t } = useLanguage();
  const LOGO_URL = branding.logo_primary;
  const LOGO_DARK_URL = branding.logo_alt || branding.logo_primary;

  const navLinks = [
    { label: t("nav.home"), path: "/" },
    {
      label: t("nav.services"),
      path: "/services",
      children: [
        { label: t("nav.spaces"), path: "/spaces" },
        { label: t("nav.business"), path: "/business" },
        { label: t("nav.pod"), path: "/pod" },
      ],
    },
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.contact"), path: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled && !mobileOpen;
  const lightSurface = !transparent || hovered;
  const useDarkLogo = lightSurface;

  // The label shows the OTHER language (so users know what they switch TO)
  const switchLabel = lang === "ar" ? "EN" : "AR";

  return (
    <header
      data-testid="main-navbar"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        transparent && !hovered
          ? "bg-transparent border-b border-transparent"
          : "backdrop-blur-2xl bg-white/85 border-b border-gray-100 shadow-[0_1px_20px_rgba(0,0,0,0.04)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px]">
        <Link to="/" data-testid="nav-logo-link" className="relative block h-10 md:h-12 w-10 md:w-12">
          <img
            src={LOGO_URL}
            alt="KUN"
            className={`absolute inset-0 h-full w-full object-contain brightness-0 invert transition-opacity duration-300 ${useDarkLogo ? "opacity-0" : "opacity-100"}`}
          />
          <img
            src={LOGO_DARK_URL}
            alt="KUN"
            aria-hidden={!useDarkLogo}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${useDarkLogo ? "opacity-100" : "opacity-0"}`}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10" data-testid="desktop-nav">
          {navLinks.map((link) => (
            <div key={link.path} className="relative group">
              <Link
                to={link.path}
                data-testid={`nav-link-${link.path.replace("/", "") || "home"}`}
                className={`text-[15px] font-semibold transition-colors duration-300 relative pb-1.5 flex items-center gap-1 nav-link-hover ${
                  location.pathname === link.path || (link.children && link.children.some(c => location.pathname === c.path))
                    ? lightSurface ? "text-[#f47424]" : "text-white"
                    : lightSurface ? "text-gray-600 hover:text-[#f47424]" : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {link.children && <ChevronDown size={14} className="mt-0.5 opacity-60" />}
                <span className={`absolute bottom-0 start-0 h-[2px] transition-all duration-300 ${
                  location.pathname === link.path || (link.children && link.children.some(c => location.pathname === c.path))
                    ? "w-full bg-[#f47424]"
                    : "w-0 group-hover:w-full bg-[#f47424]"
                }`} />
              </Link>
              {link.children && (
                <div className="absolute top-full start-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)] py-2 min-w-[190px]">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        data-testid={`nav-link-${child.path.replace("/", "")}`}
                        className={`block px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                          location.pathname === child.path ? "text-[#f47424] bg-orange-50" : "text-gray-600 hover:text-[#f47424] hover:bg-gray-50 hover:ps-6"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {/* Language Switcher */}
          <button
            data-testid="lang-toggle-desktop"
            onClick={toggleLang}
            aria-label={t("lang.toggle.aria")}
            className={`flex items-center gap-1.5 text-[13px] font-bold tracking-wide rounded-full px-3.5 py-1.5 border transition-all duration-300 ${
              lightSurface
                ? "border-gray-200 text-gray-700 hover:border-[#f47424] hover:text-[#f47424]"
                : "border-white/30 text-white hover:border-white hover:bg-white/10"
            }`}
          >
            <Globe size={15} strokeWidth={2.2} />
            <span>{switchLabel}</span>
          </button>
          <Link to="/contact">
            <Button
              data-testid="nav-cta-button"
              className="bg-[#f47424] text-white hover:bg-[#d9641d] font-bold px-6 py-2.5 rounded-full text-sm shadow-[0_4px_16px_rgba(244,116,36,0.3)] hover:shadow-[0_6px_24px_rgba(244,116,36,0.4)] transition-all duration-300 hover:-translate-y-[1px]"
            >
              {t("nav.cta")}
            </Button>
          </Link>
        </nav>

        {/* Mobile right side: language toggle + menu */}
        <div className="md:hidden flex items-center gap-3">
          <button
            data-testid="lang-toggle-mobile"
            onClick={toggleLang}
            aria-label={t("lang.toggle.aria")}
            className={`flex items-center gap-1 text-[12px] font-bold rounded-full px-2.5 py-1 border transition-colors ${
              lightSurface
                ? "border-gray-200 text-gray-700"
                : "border-white/40 text-white"
            }`}
          >
            <Globe size={13} strokeWidth={2.2} />
            <span>{switchLabel}</span>
          </button>
          <button
            data-testid="mobile-menu-toggle"
            className={`transition-colors ${lightSurface ? "text-gray-700" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav
          data-testid="mobile-nav"
          className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 py-5 px-6 space-y-3"
        >
          {navLinks.map((link) => (
            <div key={link.path}>
              <Link
                to={link.path}
                data-testid={`mobile-nav-link-${link.path.replace("/", "") || "home"}`}
                className={`block text-base font-semibold py-2 ${
                  location.pathname === link.path ? "text-[#f47424]" : "text-gray-700"
                }`}
                onClick={() => !link.children && setMobileOpen(false)}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className={`${lang === "ar" ? "pr-4" : "pl-4"} space-y-1`}>
                  {link.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      data-testid={`mobile-nav-link-${child.path.replace("/", "")}`}
                      className={`block text-sm py-1.5 ${
                        location.pathname === child.path ? "text-[#f47424] font-semibold" : "text-gray-500"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link to="/contact" onClick={() => setMobileOpen(false)}>
            <Button
              data-testid="mobile-nav-cta"
              className="w-full bg-[#f47424] text-white hover:bg-[#d9641d] font-bold mt-2 rounded-full shadow-[0_4px_16px_rgba(244,116,36,0.3)]"
            >
              {t("nav.cta")}
            </Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
