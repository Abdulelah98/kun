import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_kun-conversion-site/artifacts/lox96qjv_KUN-LOGO.svg";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "الخدمات", path: "/services", children: [
    { label: "المساحات", path: "/spaces" },
    { label: "خدمات الأعمال", path: "/business" },
    { label: "البود الذكي", path: "/pod" },
  ]},
  { label: "من نحن", path: "/about" },
  { label: "تواصل معنا", path: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header
      data-testid="main-navbar"
      className="fixed top-0 right-0 left-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link to="/" data-testid="nav-logo-link">
          <img src={LOGO_URL} alt="KUN" className="h-10 md:h-12" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" data-testid="desktop-nav">
          {navLinks.map((link) => (
            <div key={link.path} className="relative group">
              <Link
                to={link.path}
                data-testid={`nav-link-${link.path.replace("/", "") || "home"}`}
                className={`text-sm font-semibold transition-colors relative pb-1 flex items-center gap-1 ${
                  location.pathname === link.path || (link.children && link.children.some(c => location.pathname === c.path))
                    ? "text-[#f47424] after:absolute after:bottom-0 after:right-0 after:w-full after:h-0.5 after:bg-[#f47424]"
                    : "text-gray-600 hover:text-[#f47424]"
                }`}
              >
                {link.label}
                {link.children && <ChevronDown size={14} className="mt-0.5" />}
              </Link>
              {link.children && (
                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-lg border border-gray-100 shadow-lg py-2 min-w-[180px]">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        data-testid={`nav-link-${child.path.replace("/", "")}`}
                        className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                          location.pathname === child.path ? "text-[#f47424] bg-orange-50" : "text-gray-600 hover:text-[#f47424] hover:bg-gray-50"
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
          <Link to="/contact">
            <Button
              data-testid="nav-cta-button"
              className="bg-[#f47424] text-white hover:bg-[#d9641d] font-bold px-5 py-2 rounded-md text-sm"
            >
              احجز الآن
            </Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          data-testid="mobile-menu-toggle"
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav
          data-testid="mobile-nav"
          className="md:hidden bg-white border-t border-gray-100 py-4 px-6 space-y-3"
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
                <div className="pr-4 space-y-1">
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
              className="w-full bg-[#f47424] text-white hover:bg-[#d9641d] font-bold mt-2"
            >
              احجز الآن
            </Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
