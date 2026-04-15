import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import {
  Briefcase,
  Rocket,
  Users,
  UserCheck,
  Building2,
  Zap,
  TrendingDown,
  CheckCircle2,
  Shield,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  DoorOpen,
  Podcast,
} from "lucide-react";

const VIDEO_URL = "https://customer-assets.emergentagent.com/job_kun-conversion-site/artifacts/xk8jcmjb_WhatsApp-Video-2024-02-28-at-8.10.04-AM.mp4";
const HERO_FALLBACK = "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/76af9fc8d16e1c9d906e9279b800de6f60c589b2bfd340b6c56981e341f3cdd3.png";

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85", alt: "مساحة عمل مشتركة" },
  { src: "https://images.unsplash.com/photo-1772751541531-e084e8f56630?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85", alt: "مكاتب مشتركة" },
  { src: "https://images.unsplash.com/photo-1770993151375-0dee97eda931?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtZWV0aW5nJTIwcm9vbSUyMGdsYXNzJTIwb2ZmaWNlfGVufDB8fHx8MTc3NjI1NzY4OHww&ixlib=rb-4.1.0&q=85", alt: "قاعة اجتماعات" },
  { src: "https://images.unsplash.com/photo-1637665662134-db459c1bbb46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nJTIwcm9vbXxlbnwwfHx8fDE3NzYyNTc2OTV8MA&ixlib=rb-4.1.0&q=85", alt: "غرفة مؤتمرات" },
  { src: "https://images.unsplash.com/photo-1746021451691-4385f318ec13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85", alt: "مكتب خاص" },
  { src: "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/8bd54b2ba1b5f87de79c099636bfb4d644c3a7e5c60f7bb9ac0579b12f6dd2e1.png", alt: "بود ذكي" },
];

const services = [
  {
    icon: LayoutGrid,
    title: "المساحات",
    desc: "مكاتب مشتركة، خاصة، وقاعات اجتماعات بتجهيزات احترافية متكاملة",
    path: "/spaces",
  },
  {
    icon: Briefcase,
    title: "خدمات الأعمال",
    desc: "خدمات قانونية، موارد بشرية، وحلول أعمال متكاملة لنمو مشروعك",
    path: "/business",
  },
  {
    icon: Podcast,
    title: "البود الذكي",
    desc: "كبائن عمل ذكية معزولة صوتياً لتركيز أعلى وإنتاجية أفضل",
    path: "/pod",
  },
];

const audiences = [
  { icon: Rocket, label: "رواد الأعمال" },
  { icon: Zap, label: "الشركات الناشئة" },
  { icon: Users, label: "الفرق الصغيرة والمتوسطة" },
  { icon: UserCheck, label: "المستقلين" },
  { icon: Building2, label: "الشركات الكبيرة" },
];

const whyItems = [
  { icon: Zap, text: "مرونة عالية في التوسع" },
  { icon: TrendingDown, text: "تقليل التكاليف التشغيلية" },
  { icon: CheckCircle2, text: "جاهزية فورية" },
  { icon: Shield, text: "بيئة احترافية" },
];

export default function HomePage() {
  const galleryRef = useRef(null);

  const scrollGallery = (dir) => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
    }
  };

  return (
    <main data-testid="home-page">
      {/* Hero Section */}
      <section data-testid="hero-section" className="hero-video-container" style={{ backgroundImage: `url(${HERO_FALLBACK})` }}>
        <video autoPlay muted loop playsInline poster={HERO_FALLBACK}>
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1
            data-testid="hero-headline"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-6 animate-fade-in-up"
          >
            تجربة عمل مختلفة… تبدأ من هنا
          </h1>
          <p
            data-testid="hero-subtext"
            className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200 font-medium"
          >
            مساحات عمل مرنة، مكاتب خاصة، وغرف اجتماعات في بيئة احترافية متكاملة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
            <Link to="/spaces">
              <Button
                data-testid="hero-cta-book"
                className="bg-[#f47424] text-white hover:bg-[#d9641d] px-8 py-3 rounded-md font-bold text-base shadow-md hover:shadow-lg transition-all h-12"
              >
                احجز الآن
              </Button>
            </Link>
            <Link to="/services">
              <Button
                data-testid="hero-cta-explore"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 rounded-md font-bold text-base h-12"
              >
                استكشف الخدمات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section data-testid="services-section" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#f47424] mb-3">خدماتنا</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">كل ما تحتاجه لبيئة عمل متكاملة</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <Link
                key={s.path}
                to={s.path}
                data-testid={`service-card-${i}`}
                className="group bg-white border border-gray-100 rounded-xl p-8 transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="w-14 h-14 rounded-lg bg-orange-50 flex items-center justify-center mb-6">
                  <s.icon className="w-7 h-7 text-[#f47424]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="inline-flex items-center gap-1 text-[#f47424] font-semibold text-sm">
                  اكتشف المزيد
                  <ArrowLeft size={16} />
                </span>
                <div className="card-hover-line" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section data-testid="audience-section" className="py-20 md:py-28 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#f47424] mb-3">عملاؤنا</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">لمن صُممت هذه المساحات؟</h2>
            <p className="text-gray-500 text-base md:text-lg">مساحات مرنة تناسب مختلف أساليب العمل</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {audiences.map((a, i) => (
              <div
                key={i}
                data-testid={`audience-item-${i}`}
                className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                  <a.icon className="w-6 h-6 text-[#f47424]" />
                </div>
                <span className="text-sm font-semibold text-gray-800">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why KUN */}
      <section data-testid="why-kun-section" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#f47424] mb-3">لماذا نحن</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-8">لماذا تختار كن؟</h2>
              <div className="space-y-6">
                {whyItems.map((item, i) => (
                  <div
                    key={i}
                    data-testid={`why-item-${i}`}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-5 h-5 text-[#f47424]" />
                    </div>
                    <span className="text-lg font-semibold text-gray-800">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1772751541531-e084e8f56630?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85"
                alt="مساحة عمل كن"
                className="w-full h-80 md:h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section data-testid="gallery-section" className="py-20 md:py-28 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#f47424] mb-3">معرض الصور</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">اكتشف مساحاتنا</h2>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                data-testid="gallery-prev"
                onClick={() => scrollGallery(1)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#f47424] hover:text-[#f47424] transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <button
                data-testid="gallery-next"
                onClick={() => scrollGallery(-1)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#f47424] hover:text-[#f47424] transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>
          <div ref={galleryRef} className="gallery-scroll">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                data-testid={`gallery-image-${i}`}
                className="w-[300px] md:w-[380px] h-[240px] md:h-[280px] rounded-xl overflow-hidden"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section data-testid="final-cta-section" className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-6">
            ابدأ اليوم وارتقِ بطريقة عملك
          </h2>
          <p className="text-gray-500 text-base md:text-lg mb-10">
            انضم إلى مجتمع كن واحصل على بيئة عمل احترافية تدعم نمو أعمالك
          </p>
          <Link to="/contact">
            <Button
              data-testid="final-cta-button"
              className="bg-[#f47424] text-white hover:bg-[#d9641d] px-10 py-3 rounded-md font-bold text-base shadow-md hover:shadow-lg transition-all h-12"
            >
              تواصل معنا
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
