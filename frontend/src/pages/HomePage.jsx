import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useCallback, useState } from "react";
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
import { useContent, useSectionActive } from "@/contexts/ContentContext";
import { resolveMediaUrl } from "@/components/admin/MediaPicker";

const AUDIENCE_ICONS = [Rocket, Zap, Users, UserCheck, Building2];
const WHY_ICONS = [Zap, TrendingDown, CheckCircle2, Shield];

const VIDEO_URL_FALLBACK = "https://customer-assets.emergentagent.com/job_kun-conversion-site/artifacts/xk8jcmjb_WhatsApp-Video-2024-02-28-at-8.10.04-AM.mp4";
const HERO_FALLBACK = "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/76af9fc8d16e1c9d906e9279b800de6f60c589b2bfd340b6c56981e341f3cdd3.png";

// Animated counter that runs once when scrolled into view
export default function HomePage() {
  const galleryRef = useRef(null);
  const bgWordsRef = useRef([]);
  const scrollPosRef = useRef({ last: 0, offsets: {} });

  // CMS content
  const hero = useContent("home_hero");
  const about = useContent("home_about");
  const servicesOverview = useContent("services_overview");
  const whyBlock = useContent("home_why");
  const audienceBlock = useContent("home_audience");
  const galleryBlock = useContent("home_gallery");
  const finalCta = useContent("home_final_cta");

  // Section visibility (admin can disable any section)
  const heroActive = useSectionActive("home_hero");
  const aboutActive = useSectionActive("home_about");
  const servicesActive = useSectionActive("services_overview");
  const whyActive = useSectionActive("home_why");
  const audienceActive = useSectionActive("home_audience");
  const galleryActive = useSectionActive("home_gallery");
  const finalCtaActive = useSectionActive("home_final_cta");

  const services = (servicesOverview.items || []).map((it) => ({
    logo: resolveMediaUrl(it.image) || "/assets/logos/spaces.svg",
    title: it.title,
    desc: it.description,
    path: it.link || "/",
  }));
  const whyItemsList = (whyBlock.items || []).map((it, i) => ({
    icon: WHY_ICONS[i % WHY_ICONS.length],
    title: it.title,
    desc: it.description,
  }));
  const audiences = (audienceBlock.items || []).map((it, i) => ({
    icon: AUDIENCE_ICONS[i % AUDIENCE_ICONS.length],
    label: it.label,
    desc: it.description,
  }));
  const galleryImages = (galleryBlock.images || []).map((src, i) => ({
    src: resolveMediaUrl(src),
    alt: `مساحة ${i + 1}`,
  }));

  const scrollGallery = (dir) => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
    }
  };

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const delta = currentY - scrollPosRef.current.last;
    scrollPosRef.current.last = currentY;

    bgWordsRef.current.forEach((el, i) => {
      if (!el) return;
      const section = el.closest("section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.bottom < -100 || rect.top > viewH + 100) return;

      const key = `w${i}`;
      const prev = scrollPosRef.current.offsets[key] || 0;
      const maxShift = 50;
      const speed = 0.12;
      const next = Math.max(-maxShift, Math.min(maxShift, prev + delta * speed));
      scrollPosRef.current.offsets[key] = next;
      el.style.transform = `translateX(${next}px)`;
    });
  }, []);

  useEffect(() => {
    scrollPosRef.current.last = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const setBgRef = (idx) => (el) => { bgWordsRef.current[idx] = el; };

  return (
    <main data-testid="home-page">
      {/* Hero Section */}
      {heroActive && (
      <section data-testid="hero-section" className="hero-video-container" style={{ backgroundImage: `url(${resolveMediaUrl(hero.fallback_image) || HERO_FALLBACK})` }}>
        <video autoPlay muted loop playsInline poster={resolveMediaUrl(hero.fallback_image) || HERO_FALLBACK}>
          <source src={hero.video_url || VIDEO_URL_FALLBACK} type="video/mp4" />
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
                  {hero.title_line1} <span className="text-[#f47424]">{hero.title_highlight}</span>
                  <br />
                  {hero.title_line2}
                </h1>
                <div className="w-12 h-[3px] bg-[#f47424] mx-auto rounded-full mb-7 hero-line-reveal" />
              </div>
              <p
                data-testid="hero-subtext"
                className="text-[0.9375rem] sm:text-base md:text-[1.0625rem] text-white/75 max-w-2xl mx-auto mb-10 hero-text-entrance hero-delay-1 font-medium leading-[1.8]"
              >
                {hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center hero-text-entrance hero-delay-2">
                <Link to="/contact">
                  <Button
                    data-testid="hero-cta-book"
                    className="bg-[#f47424] text-white hover:bg-[#d9641d] px-9 py-2.5 rounded-full font-bold text-[0.9375rem] shadow-[0_4px_18px_rgba(244,116,36,0.3)] hover:shadow-[0_6px_24px_rgba(244,116,36,0.4)] transition-all duration-300 hover:-translate-y-[2px] h-12"
                  >
                    {hero.cta_primary}
                  </Button>
                </Link>
                <Link to="/services">
                  <Button
                    data-testid="hero-cta-explore"
                    variant="outline"
                    className="border-white/25 text-white hover:bg-white/10 hover:border-white/40 px-9 py-2.5 rounded-full font-bold text-[0.9375rem] h-12 transition-all duration-300"
                  >
                    {hero.cta_secondary}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* About Us Section */}
      {aboutActive && (
      <section data-testid="about-section" className="py-20 md:py-28 bg-white relative overflow-hidden">
        <span ref={setBgRef(0)} className="section-bg-word section-bg-word--left" aria-hidden="true">من نحن</span>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Text block - all on the right side */}
          <div className="flex justify-start mt-12 md:mt-16">
            <div className="w-full md:max-w-2xl text-right">
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 tracking-tight leading-[1.55] mb-6">
                {about.title_line1}
                <br />
                <span className="inline-block mt-2">{about.title_line2} <span className="text-[#f47424]">{about.title_highlight}</span></span>
              </h2>
              <p className="text-gray-600 text-base md:text-[1.05rem] leading-[2]">
                <span className="font-bold text-gray-900">{about.brand_word}</span> {about.body}
              </p>
            </div>
          </div>

          {/* Stats row - centered in the page */}
          <div className="mt-14 md:mt-16 pt-10 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 md:gap-10 max-w-3xl mx-auto text-center">
              <div data-testid="about-stat-0">
                <div className="text-3xl md:text-5xl font-bold text-[#f47424] mb-2 tracking-tight" data-testid="about-stat-0-value">
                  {about.stat1_value}
                </div>
                <div className="text-xs md:text-sm text-gray-500">{about.stat1_label}</div>
              </div>
              <div data-testid="about-stat-1">
                <div className="text-3xl md:text-5xl font-bold text-[#f47424] mb-2 tracking-tight" data-testid="about-stat-1-value">
                  {about.stat2_value}
                </div>
                <div className="text-xs md:text-sm text-gray-500">{about.stat2_label}</div>
              </div>
              <div data-testid="about-stat-2">
                <div className="text-3xl md:text-5xl font-bold text-[#f47424] mb-2 tracking-tight" data-testid="about-stat-2-value">{about.stat3_value}</div>
                <div className="text-xs md:text-sm text-gray-500">{about.stat3_label}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Services Overview */}
      {servicesActive && (
      <section data-testid="services-section" className="services-section py-28 md:py-36 relative overflow-hidden">
        <span ref={setBgRef(1)} className="section-bg-word section-bg-word--right" aria-hidden="true">خدماتنا</span>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mt-24 md:mt-28">
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
      )}

      {/* Why KUN */}
      {whyActive && (
      <section data-testid="why-kun-section" className="py-20 md:py-28 bg-white relative overflow-hidden">
        <span ref={setBgRef(2)} className="section-bg-word section-bg-word--left" aria-hidden="true">لماذا كن</span>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 mt-16 md:mt-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">{whyBlock.title}</h2>
              <p className="text-gray-500 text-base md:text-lg mb-10">{whyBlock.subtitle}</p>
              <div className="space-y-5">
                {whyItemsList.map((item, i) => (
                  <div
                    key={i}
                    data-testid={`why-item-${i}`}
                    className="why-card group relative flex items-center gap-5 bg-white rounded-[20px] border border-gray-100 py-5 pr-6 pl-5 md:pr-7 md:pl-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] hover:shadow-[0_12px_32px_rgba(244,116,36,0.12)] hover:-translate-y-[3px] transition-all duration-300 ease-out overflow-hidden"
                    style={{ animation: `whyCardFadeIn 0.6s ${0.1 + i * 0.08}s both ease-out` }}
                  >
                    <span className="absolute right-0 top-4 bottom-4 w-[3px] rounded-full bg-[#f47424] opacity-80 group-hover:opacity-100 group-hover:top-3 group-hover:bottom-3 transition-all duration-300" />

                    <div className="flex-1 text-right order-1 min-w-0">
                      <h3 className="text-[1.05rem] md:text-[1.1rem] font-bold text-gray-900 leading-tight mb-1.5 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-[0.85rem] md:text-[0.9rem] leading-[1.7]">
                        {item.desc}
                      </p>
                    </div>

                    <div className="why-icon-box order-2 flex-shrink-0 w-[54px] h-[54px] md:w-[58px] md:h-[58px] rounded-[14px] bg-[#f47424]/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#f47424]/15 group-hover:scale-[1.05]">
                      <item.icon className="w-6 h-6 md:w-[26px] md:h-[26px] text-[#f47424]" strokeWidth={2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden md:mt-24 lg:mt-32">
              <img
                src={resolveMediaUrl(whyBlock.image)}
                alt="مساحة عمل كن"
                className="w-full h-80 md:h-[460px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Target Audience - Dark themed */}
      {audienceActive && (
      <section data-testid="audience-section" className="py-24 md:py-32 bg-[#0A1128] relative overflow-hidden">
        <span ref={setBgRef(3)} className="section-bg-word section-bg-word--right section-bg-word--dark" aria-hidden="true">عملاؤنا</span>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">{audienceBlock.title}</h2>
            <p className="text-gray-400 text-base md:text-lg">{audienceBlock.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-5 md:gap-6 max-w-6xl mx-auto">
            {audiences.map((a, i) => {
              // Place 3 cards on top row, 2 cards centered on bottom row (md+)
              const layoutClass =
                i < 3
                  ? "md:col-span-2"
                  : i === 3
                  ? "md:col-span-2 md:col-start-2"
                  : "md:col-span-2";
              return (
                <div
                  key={i}
                  data-testid={`audience-item-${i}`}
                  className={`audience-card group relative ${layoutClass} rounded-2xl p-6 md:p-7 bg-[#0F1A33] border border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-[#f47424]/30 hover:-translate-y-1`}
                >
                  <div className="flex items-center gap-5">
                    {/* Icon on left (visually) - rendered first in RTL = appears left */}
                    <div className="order-2 flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-[#f47424]/5 border border-[#f47424]/20 transition-all duration-300 group-hover:bg-[#f47424]/10 group-hover:scale-105">
                      <a.icon className="w-7 h-7 md:w-8 md:h-8 text-[#f47424]" strokeWidth={1.8} />
                    </div>
                    {/* Text on right */}
                    <div className="order-1 flex-1 text-right min-w-0">
                      <h3 className="text-white font-bold text-[1.05rem] md:text-[1.15rem] mb-1.5 tracking-tight leading-tight">{a.label}</h3>
                      <p className="text-gray-400 text-[0.8rem] md:text-[0.85rem] leading-[1.6]">{a.desc}</p>
                    </div>
                  </div>
                  {/* Subtle orange glow on hover */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#f47424]/[0.04] to-transparent" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Image Gallery */}
      {galleryActive && (
      <section data-testid="gallery-section" className="py-20 md:py-28 bg-white relative overflow-hidden">
        <span ref={setBgRef(4)} className="section-bg-word section-bg-word--left" aria-hidden="true">مساحاتنا</span>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-10 mt-16 md:mt-20 relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{galleryBlock.title}</h2>
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
          <div ref={galleryRef} className="gallery-scroll relative z-10">
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
      )}

      {/* Final CTA */}
      {finalCtaActive && (
      <section data-testid="final-cta-section" className="py-28 md:py-36 bg-[#EDF0F4] relative overflow-hidden">
        <span ref={setBgRef(5)} className="section-bg-word section-bg-word--center" style={{ top: '15%' }} aria-hidden="true">تواصل</span>
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="text-center relative z-10 mt-16 md:mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-6">
              {finalCta.title}
            </h2>
            <p className="text-gray-500 text-base md:text-lg mb-10">
              {finalCta.subtitle}
            </p>
            <Link to="/contact">
              <Button
                data-testid="final-cta-button"
                className="bg-[#f47424] text-white hover:bg-[#d9641d] px-10 py-3 rounded-md font-bold text-base shadow-md hover:shadow-lg transition-all h-12"
              >
                {finalCta.cta_text}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      )}
    </main>
  );
}
