import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Briefcase, Podcast, ArrowLeft } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";
import { resolveMediaUrl } from "@/components/admin/MediaPicker";

const FALLBACK_ICONS = [LayoutGrid, Briefcase, Podcast];

export default function ServicesPage() {
  const header = useContent("services_page_header");
  const services = useContent("services_page_items");
  const items = services.items || [];

  return (
    <main data-testid="services-page" className="pt-16">
      {/* Header - Dark navy */}
      <section className="bg-[#0A1128] py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f47424] mb-4">{header.eyebrow}</p>
          <h1 data-testid="services-title" className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-[1.2]">
            {header.title}
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {header.subtitle}
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {items.map((s, i) => {
            const Icon = FALLBACK_ICONS[i % FALLBACK_ICONS.length];
            return (
              <div
                key={i}
                data-testid={`service-detail-${i}`}
                className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${i % 2 !== 0 ? "md:direction-ltr" : ""}`}
              >
                <div className={`${i % 2 !== 0 ? "md:order-2" : ""}`}>
                  <div className="w-14 h-14 rounded-lg bg-orange-50 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-[#f47424]" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{s.title}</h2>
                  <p className="text-gray-500 leading-relaxed mb-6">{s.description}</p>
                  {s.link && (
                    <Link to={s.link}>
                      <Button
                        data-testid={`service-cta-${i}`}
                        className="bg-[#f47424] text-white hover:bg-[#d9641d] font-bold px-6 py-3 rounded-md"
                      >
                        <span className="flex items-center gap-2">
                          اكتشف المزيد
                          <ArrowLeft size={16} />
                        </span>
                      </Button>
                    </Link>
                  )}
                </div>
                <div className={`rounded-2xl overflow-hidden ${i % 2 !== 0 ? "md:order-1" : ""}`}>
                  <img src={resolveMediaUrl(s.image)} alt={s.title} className="w-full h-72 md:h-[380px] object-cover" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
