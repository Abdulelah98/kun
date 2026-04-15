import { Link } from "react-router-dom";
import { Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_kun-conversion-site/artifacts/lox96qjv_KUN-LOGO.svg";

export default function Footer() {
  return (
    <footer data-testid="main-footer" className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img src={LOGO_URL} alt="KUN" className="h-10 mb-4 brightness-0 invert" />
            <p className="text-gray-400 text-sm leading-relaxed">
              رائدون في توفير مساحات العمل المشتركة في الرياض. نقدم بيئة عمل احترافية وتعاونية لتحقيق أهدافك.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { label: "الرئيسية", path: "/" },
                { label: "المساحات", path: "/spaces" },
                { label: "خدمات الأعمال", path: "/business" },
                { label: "البود الذكي", path: "/pod" },
                { label: "من نحن", path: "/about" },
              ].map((link) => (
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
            <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <a href="mailto:info@kunws.com" className="flex items-center gap-2 hover:text-[#f47424] transition-colors">
                <Mail size={16} />
                info@kunws.com
              </a>
              <a href="tel:+966535420969" className="flex items-center gap-2 hover:text-[#f47424] transition-colors">
                <Phone size={16} />
                +966 53 542 0969
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                المملكة العربية السعودية، الرياض
              </div>
              <div className="flex gap-3 pt-2">
                <a
                  href="https://instagram.com/kun__work"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-instagram"
                  className="text-gray-400 hover:text-[#f47424] transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://twitter.com/Kun__sa"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-twitter"
                  className="text-gray-400 hover:text-[#f47424] transition-colors"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">
          2025 &copy; KUN - جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
