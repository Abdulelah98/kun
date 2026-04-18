import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Briefcase, Podcast, ArrowLeft } from "lucide-react";

const services = [
  {
    icon: LayoutGrid,
    title: "المساحات",
    desc: "مكاتب مشتركة ومكاتب خاصة وقاعات اجتماعات مجهزة بالكامل. بيئة عمل احترافية تلبي جميع احتياجاتك مع مرونة في الاشتراك.",
    path: "/spaces",
    image: "https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    icon: Briefcase,
    title: "خدمات الأعمال",
    desc: "خدمات قانونية متكاملة وإدارة الموارد البشرية وحلول أعمال مصممة لدعم نمو مشروعك بأعلى معايير الاحترافية.",
    path: "/business",
    image: "https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
  },
  {
    icon: Podcast,
    title: "البود الذكي",
    desc: "كبائن عمل معزولة صوتياً ومجهزة بأحدث التقنيات. مثالية للمكالمات المهمة والعمل الذي يتطلب تركيزاً عالياً.",
    path: "/pod",
    image: "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/8bd54b2ba1b5f87de79c099636bfb4d644c3a7e5c60f7bb9ac0579b12f6dd2e1.png",
  },
];

export default function ServicesPage() {
  return (
    <main data-testid="services-page" className="pt-16">
      {/* Header - Dark navy */}
      <section className="bg-[#0A1128] py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f47424] mb-4">الخدمات</p>
          <h1 data-testid="services-title" className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-5 leading-[1.2]">
            خدماتنا المتكاملة
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            حلول شاملة لبيئة عمل احترافية تدعم نمو أعمالك
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {services.map((s, i) => (
            <div
              key={s.path}
              data-testid={`service-detail-${i}`}
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${i % 2 !== 0 ? "md:direction-ltr" : ""}`}
            >
              <div className={`${i % 2 !== 0 ? "md:order-2" : ""}`}>
                <div className="w-14 h-14 rounded-lg bg-orange-50 flex items-center justify-center mb-6">
                  <s.icon className="w-7 h-7 text-[#f47424]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{s.title}</h2>
                <p className="text-gray-500 leading-relaxed mb-6">{s.desc}</p>
                <Link to={s.path}>
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
              </div>
              <div className={`rounded-2xl overflow-hidden ${i % 2 !== 0 ? "md:order-1" : ""}`}>
                <img src={s.image} alt={s.title} className="w-full h-72 md:h-[380px] object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
