import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Volume2, Focus, Lock, Wifi, Wind, Zap, ArrowLeft } from "lucide-react";

const POD_IMAGE = "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/8bd54b2ba1b5f87de79c099636bfb4d644c3a7e5c60f7bb9ac0579b12f6dd2e1.png";

const features = [
  { icon: Volume2, title: "عزل صوتي متقدم", desc: "تقنية عزل صوتي احترافية توفر بيئة هادئة تماماً" },
  { icon: Focus, title: "تركيز أعلى", desc: "بيئة مصممة خصيصاً لرفع الإنتاجية والتركيز" },
  { icon: Lock, title: "خصوصية تامة", desc: "مساحة شخصية مغلقة لمكالماتك واجتماعاتك المهمة" },
  { icon: Wifi, title: "إنترنت فائق السرعة", desc: "اتصال مستقر وسريع لضمان سلاسة عملك" },
  { icon: Wind, title: "تهوية ذكية", desc: "نظام تهوية متطور يضمن راحتك طوال الوقت" },
  { icon: Zap, title: "شحن وتقنية", desc: "منافذ شحن متعددة وشاشة عرض مدمجة" },
];

export default function PodPage() {
  return (
    <main data-testid="pod-page" className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={POD_IMAGE} alt="البود الذكي" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-44">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#f47424] mb-3">البود الذكي</p>
            <h1 data-testid="pod-title" className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              مساحتك الخاصة للتركيز والإنتاجية
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
              كبائن عمل ذكية معزولة صوتياً ومجهزة بأحدث التقنيات. مثالية للمكالمات المهمة، الاجتماعات الافتراضية، والعمل الذي يتطلب تركيزاً عالياً.
            </p>
            <Link to="/contact">
              <Button
                data-testid="pod-cta"
                className="bg-[#f47424] text-white hover:bg-[#d9641d] px-8 py-3 rounded-md font-bold text-base shadow-md"
              >
                <span className="flex items-center gap-2">
                  احجز بودك الآن
                  <ArrowLeft size={16} />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">مميزات البود الذكي</h2>
            <p className="text-gray-500 text-base md:text-lg">تصميم متقدم يجمع بين التقنية والراحة</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                data-testid={`pod-feature-${i}`}
                className="group p-6 bg-white rounded-xl border border-gray-100 transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-[#f47424]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                <div className="card-hover-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#EDF0F4]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-6">
            جرّب البود الذكي اليوم
          </h2>
          <p className="text-gray-500 text-base md:text-lg mb-10">
            احصل على تجربة عمل فريدة في بيئة معزولة ومجهزة بالكامل
          </p>
          <Link to="/contact">
            <Button
              data-testid="pod-final-cta"
              className="bg-[#f47424] text-white hover:bg-[#d9641d] px-10 py-3 rounded-md font-bold text-base shadow-md hover:shadow-lg"
            >
              تواصل معنا
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
