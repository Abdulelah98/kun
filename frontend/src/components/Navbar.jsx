import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_kun-conversion-site/artifacts/lox96qjv_KUN-LOGO.svg";

const navLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "الخدمات", path: "/services" },
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
            <Link
              key={link.path}
              to={link.path}
              data-testid={`nav-link-${link.path.replace("/", "") || "home"}`}
              className={`text-sm font-semibold transition-colors relative pb-1 ${
                location.pathname === link.path
                  ? "text-[#f47424] after:absolute after:bottom-0 after:right-0 after:w-full after:h-0.5 after:bg-[#f47424]"
                  : "text-gray-600 hover:text-[#f47424]"
              }`}
            >
              {link.label}
            </Link>
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
            <Link
              key={link.path}
              to={link.path}
              data-testid={`mobile-nav-link-${link.path.replace("/", "") || "home"}`}
              className={`block text-base font-semibold py-2 ${
                location.pathname === link.path ? "text-[#f47424]" : "text-gray-700"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
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
