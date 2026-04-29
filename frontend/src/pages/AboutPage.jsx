import { Eye, Target, Heart, Handshake } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { resolveMediaUrl } from "@/components/admin/MediaPicker";

const VALUE_ICONS = [Eye, Target, Heart, Handshake];

export default function AboutPage() {
  const header = useContent("about_main");
  const values = useContent("about_values");
  const { t } = useLanguage();

  const bodyParagraphs = (header.body || "").split(/\n\n+/).filter(Boolean);

  return (
    <main data-testid="about-page" className="pt-16">
      {/* Header - Dark navy */}
      <section className="bg-[#0A1128] py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f47424] mb-4">{header.eyebrow}</p>
          <h1 data-testid="about-title" className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-[1.2]">
            {header.title}
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{t("about.who_we_are")}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {bodyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src={resolveMediaUrl(header.image)}
                alt={header.title}
                className="w-full h-72 md:h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 md:py-28 bg-[#EDF0F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">{values.title}</h2>
            <p className="text-gray-500 text-base md:text-lg">{t("about.values_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(values.items || []).map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <div
                  key={i}
                  data-testid={`about-value-${i}`}
                  className="group relative p-8 bg-white rounded-xl border border-gray-100 transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-[0_20px_50px_-15px_rgba(244,116,36,0.25)] overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-lg bg-[#f47424]/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-[#f47424]/15">
                    <Icon className="w-6 h-6 text-[#f47424]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#f47424] rounded-t transition-all duration-500 ease-out group-hover:w-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
