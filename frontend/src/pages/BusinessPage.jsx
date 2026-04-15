import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, Users, Building, ArrowLeft, CheckCircle2 } from "lucide-react";

const businessServices = [
  {
    icon: Scale,
    title: "الخدمات القانونية",
    desc: "نقدم استشارات قانونية شاملة تشمل تأسيس الشركات، صياغة العقود، والتمثيل القانوني لحماية مصالح عملك.",
    features: ["تأسيس الشركات والمؤسسات", "صياغة ومراجعة العقود", "الاستشارات القانونية", "التمثيل أمام الجهات الحكومية"],
    image: "https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
  },
  {
    icon: Users,
    title: "الموارد البشرية",
    desc: "حلول متكاملة لإدارة الموارد البشرية من التوظيف وإدارة الرواتب إلى تطوير الكفاءات وبناء فرق العمل.",
    features: ["التوظيف واستقطاب الكفاءات", "إدارة الرواتب والمزايا", "تطوير الموظفين", "إدارة شؤون العاملين"],
    image: "https://images.unsplash.com/photo-1637665662134-db459c1bbb46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nJTIwcm9vbXxlbnwwfHx8fDE3NzYyNTc2OTV8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    icon: Building,
    title: "حلول مساحات العمل",
    desc: "تصميم وتجهيز مساحات العمل وفق أحدث المعايير العالمية مع حلول مرنة تتكيف مع نمو أعمالك.",
    features: ["تصميم وتجهيز المكاتب", "حلول مرنة للتوسع", "إدارة المرافق", "خدمات الدعم التقني"],
    image: "https://images.unsplash.com/photo-1770993151375-0dee97eda931?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtZWV0aW5nJTIwcm9vbSUyMGdsYXNzJTIwb2ZmaWNlfGVufDB8fHx8MTc3NjI1NzY4OHww&ixlib=rb-4.1.0&q=85",
  },
];

export default function BusinessPage() {
  return (
    <main data-testid="business-page" className="pt-16">
      {/* Header */}
      <section className="bg-[#F9FAFB] py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#f47424] mb-3">خدمات الأعمال</p>
          <h1 data-testid="business-title" className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            خدمات أعمال متكاملة
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            حلول احترافية لدعم نمو مشروعك وتسهيل أعمالك
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {businessServices.map((s, i) => (
            <div
              key={i}
              data-testid={`business-service-${i}`}
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center`}
            >
              <div className={`${i % 2 !== 0 ? "md:order-2" : ""}`}>
                <div className="w-14 h-14 rounded-lg bg-orange-50 flex items-center justify-center mb-6">
                  <s.icon className="w-7 h-7 text-[#f47424]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{s.title}</h2>
                <p className="text-gray-500 leading-relaxed mb-6">{s.desc}</p>
                <ul className="space-y-3 mb-8">
                  {s.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-[#f47424] flex-shrink-0" />
                      <span className="text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button
                    data-testid={`business-cta-${i}`}
                    className="bg-[#f47424] text-white hover:bg-[#d9641d] font-bold px-6 py-3 rounded-md"
                  >
                    <span className="flex items-center gap-2">
                      تواصل معنا
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
