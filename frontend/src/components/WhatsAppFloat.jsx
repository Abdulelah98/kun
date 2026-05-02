import { MessageCircle } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WhatsAppFloat() {
  const { whatsapp } = useSettings();
  const { t } = useLanguage();

  if (!whatsapp) return null;

  // Strip non-digits & ensure international format (+966)
  const digits = String(whatsapp).replace(/[^0-9]/g, "");
  const intl = digits.replace(/^0/, "966");
  const href = `https://wa.me/${intl}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float"
      aria-label={t("contact.whatsapp_title")}
      className="
        group fixed bottom-6 z-50
        end-6
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-[#25D366] hover:bg-[#1fb957]
        shadow-[0_8px_24px_rgba(37,211,102,0.4)]
        hover:shadow-[0_12px_32px_rgba(37,211,102,0.55)]
        transition-all duration-300 hover:scale-110
      "
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 animate-ping" />
      <MessageCircle size={26} strokeWidth={2.2} className="relative text-white drop-shadow" fill="currentColor" />
    </a>
  );
}
