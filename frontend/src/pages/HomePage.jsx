import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import {
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
    logo: "/assets/logos/spaces.svg",
    title: "المساحات",
    desc: "مكاتب مشتركة، خاصة، وقاعات اجتماعات بتجهيزات احترافية متكاملة",
    path: "/spaces",
  },
  {
    logo: "/assets/logos/business.svg",
    title: "خدمات الأعمال",
    desc: "خدمات قانونية، موارد بشرية، وحلول أعمال متكاملة لنمو مشروعك",
    path: "/business",
  },
  {
    logo: "/assets/logos/pod.svg",
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
        <div className="hero-gradient-overlay" />
        <div className="hero-content">
          <div className="hero-glass-box relative overflow-hidden rounded-2xl px-14 sm:px-16 md:px-20 lg:px-24 py-14 md:py-20 lg:py-24 max-w-[66rem]">
            {/* Brand shape - bottom left decorative element */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 654.02 1091.59"
              className="absolute bottom-5 left-5 w-[120px] md:w-[180px] h-auto pointer-events-none select-none"
              style={{ opacity: 0.06 }}
              aria-hidden="true"
            >
              <path
                fill="white"
                d="m1.73,1074.21l413.96-204.63c13.95-6.97,28.76-10.51,44.01-10.51,54.27,0,98.42,44.17,98.42,98.46,0,37.43-20.8,71.13-54.28,87.93l-216.75,107.77h342.39c5.2-26.14,7.86-52.85,7.86-79.76,0-112.2-44.03-216.43-123.97-293.48-76.4-73.64-180.29-115.88-285.03-115.88-39.42,0-78.17,5.73-115.83,17.09l524.82-260.68V73.25L1.72,389v347.24h0s0,337.98,0,337.98Z"
              />
            </svg>

            <div className="relative z-10">
              <div className="hero-text-entrance">
                <h1
                  data-testid="hero-headline"
                  className="text-[2.2rem] sm:text-[2.4rem] md:text-[3rem] lg:text-[3.8rem] font-black text-white leading-[1.28] tracking-tight mb-5"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  مساحتك <span className="text-[#f47424]">الاحترافية</span>
                  <br />
                  تبدأ من هنا
                </h1>
                <div className="w-12 h-[3px] bg-[#f47424] mx-auto rounded-full mb-7 hero-line-reveal" />
              </div>
              <p
                data-testid="hero-subtext"
                className="text-[0.9375rem] sm:text-base md:text-[1.0625rem] text-white/75 max-w-2xl mx-auto mb-10 hero-text-entrance hero-delay-1 font-medium leading-[1.8]"
              >
                وفّر وقتك وركّز على نمو أعمالك — مكاتب جاهزة، قاعات اجتماعات،
                <br className="hidden sm:block" />
                وخدمات أعمال متكاملة في قلب الرياض
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center hero-text-entrance hero-delay-2">
                <Link to="/spaces">
                  <Button
                    data-testid="hero-cta-book"
                    className="bg-[#f47424] text-white hover:bg-[#d9641d] px-9 py-2.5 rounded-full font-bold text-[0.9375rem] shadow-[0_4px_18px_rgba(244,116,36,0.3)] hover:shadow-[0_6px_24px_rgba(244,116,36,0.4)] transition-all duration-300 hover:-translate-y-[2px] h-12"
                  >
                    احجز مساحتك الآن
                  </Button>
                </Link>
                <Link to="/services">
                  <Button
                    data-testid="hero-cta-explore"
                    variant="outline"
                    className="border-white/25 text-white hover:bg-white/10 hover:border-white/40 px-9 py-2.5 rounded-full font-bold text-[0.9375rem] h-12 transition-all duration-300"
                  >
                    استكشف الخدمات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section data-testid="services-section" className="services-section py-28 md:py-36 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 md:mb-24">
            <div className="inline-block mb-6">
              <span className="services-eyebrow relative inline-block text-[0.8rem] font-extrabold tracking-[0.22em] text-white bg-[#f47424] px-6 py-2 rounded-md shadow-[0_4px_16px_rgba(244,116,36,0.25)]">
                خدماتنا
              </span>
            </div>
            <h2 className="text-[2.2rem] md:text-[2.8rem] lg:text-[3.2rem] font-black text-gray-900 tracking-tight leading-[1.15]">
              كل ما تحتاجه لبيئة عمل
              <span className="relative inline-block mx-2">
                <span className="relative z-10">متكاملة</span>
                <span className="absolute bottom-1 right-0 w-full h-[10px] bg-[#f47424]/15 rounded-sm -z-0" />
              </span>
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {services.map((s, i) => (
              <Link
                key={s.path}
                to={s.path}
                data-testid={`service-card-${i}`}
                className="service-card group relative overflow-hidden rounded-[20px] p-9 md:p-10 bg-white border border-gray-100/80"
              >
                {/* Full-card hover logo background */}
                <div className="service-hover-bg absolute inset-0 z-[1] flex items-center justify-center pointer-events-none">
                  <img
                    src={s.logo}
                    alt=""
                    className="w-[70%] h-[70%] object-contain"
                    draggable={false}
                  />
                </div>

                {/* Default small logo */}
                <div className="service-logo-wrap relative z-10 w-[80px] h-[80px] rounded-[16px] bg-[#f9f9f9] border border-gray-100/60 flex items-center justify-center mb-8">
                  <img
                    src={s.logo}
                    alt={s.title}
                    className="w-[48px] h-[48px] object-contain"
                    draggable={false}
                  />
                </div>

                {/* Text content */}
                <div className="service-card-text relative z-10">
                  <h3 className="text-[1.4rem] font-bold text-gray-900 mb-3.5 tracking-tight leading-tight">{s.title}</h3>
                  <p className="text-gray-400 text-[0.9rem] leading-[1.8] mb-7">{s.desc}</p>
                </div>

                {/* CTA */}
                <span className="service-cta relative z-10 inline-flex items-center gap-1.5 text-[#f47424] font-semibold text-[0.85rem]">
                  <span className="service-cta-text">اكتشف المزيد</span>
                  <ArrowLeft size={15} className="service-cta-arrow" />
                </span>

                {/* Bottom accent line */}
                <div className="service-accent-line absolute bottom-0 right-0 h-[3px] bg-gradient-to-l from-[#f47424] to-[#f4942f] w-0 z-10" />
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
