import { useSettings } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WhatsAppFloat() {
  const { whatsapp } = useSettings();
  const { t } = useLanguage();

  if (!whatsapp) return null;

  const digits = String(whatsapp).replace(/[^0-9]/g, "");
  const intl = digits.replace(/^0/, "966");
  const href = `https://wa.me/${intl}`;
  const label = t("whatsapp.float.label");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float"
      aria-label={label}
      className="
        group fixed bottom-6 z-50
        start-6
        flex items-center
        h-14
        rounded-full
        bg-[#25D366] hover:bg-[#1fb957]
        shadow-[0_8px_24px_rgba(37,211,102,0.4)]
        hover:shadow-[0_12px_32px_rgba(37,211,102,0.55)]
        transition-[max-width,background-color,box-shadow] duration-500 ease-in-out
        w-auto max-w-14 hover:max-w-xs
        overflow-hidden
        whitespace-nowrap
      "
    >
      {/* Pulse ring behind the circle */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute start-0 top-0
          w-14 h-14 rounded-full bg-[#25D366] opacity-40
          animate-ping group-hover:hidden
        "
      />

      {/* Icon bubble - always at the start */}
      <span
        aria-hidden="true"
        className="
          relative flex items-center justify-center
          w-14 h-14 rounded-full shrink-0
        "
      >
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 text-white drop-shadow"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.1-.746.315-.688.645-1.03 1.318-1.044 2.264v.114c-.015.99.472 1.977 1.034 2.78 1.26 1.82 2.638 3.4 4.72 4.244.63.258 2.39.933 3.087.933.92 0 2.607-.547 2.993-1.434.23-.545.23-1.005.155-1.12-.085-.173-.361-.26-.775-.46z" />
          <path d="M15.984 4C9.376 4 4 9.377 4 15.985c0 2.123.56 4.21 1.622 6.047L4.009 28l6.11-1.602a11.95 11.95 0 0 0 5.865 1.532h.005C22.597 27.93 28 22.553 28 15.945 28 9.337 22.597 4 15.984 4zm0 21.938h-.004a9.92 9.92 0 0 1-5.056-1.385l-.363-.216-3.757.985 1.003-3.666-.236-.374a9.952 9.952 0 0 1-1.527-5.297c0-5.494 4.47-9.963 9.966-9.963 2.66 0 5.162 1.037 7.043 2.92a9.898 9.898 0 0 1 2.918 7.047c-.002 5.494-4.47 9.95-9.987 9.95z" />
        </svg>
      </span>

      {/* Expanding label */}
      <span
        className="
          text-white font-semibold text-sm
          pe-5 ps-2
          opacity-0
          group-hover:opacity-100
          transition-opacity duration-300 delay-150
        "
      >
        {label}
      </span>
    </a>
  );
}
