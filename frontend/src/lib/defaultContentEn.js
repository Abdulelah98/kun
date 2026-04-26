// English fallback content. Used when CMS doesn't have an English value for a block.
// Mirrors the shape of /app/frontend/src/lib/defaultContent.js but only for keys we have translated.
// Missing keys here will fall back to the Arabic defaults (so EN visitors won't see blanks).

export const DEFAULT_CONTENT_EN = {
  home_hero: {
    eyebrow: "Integrated workspace solutions",
    title_line1: "Your professional",
    title_highlight: "workspace",
    title_line2: "starts here",
    subtitle:
      "Save time and focus on growing your business — ready offices, meeting rooms, and integrated business services in the heart of Riyadh.",
    cta_primary: "Book your free tour",
    cta_secondary: "Explore services",
  },
  home_about: {
    title_line1: "An integrated work environment",
    title_line2: "built to support",
    title_highlight: "your success",
    brand_word: "KUN",
    body:
      "is a leading Saudi brand in smart workspaces and integrated business services. We provide entrepreneurs and companies with a professional, flexible environment that supports their ambitions and accelerates their growth.",
    stat1_value: "+500",
    stat1_label: "Trusted clients",
    stat2_value: "+20",
    stat2_label: "Integrated services",
    stat3_value: "24/7",
    stat3_label: "Continuous support",
  },
  services_overview: {
    title: "Our services",
    items: [
      {
        title: "Spaces",
        description: "Shared and private offices, plus fully equipped meeting rooms.",
        link: "/spaces",
      },
      {
        title: "Business Services",
        description: "Legal, HR, and integrated business solutions to grow your venture.",
        link: "/business",
      },
      {
        title: "Smart Pod",
        description: "Soundproof smart pods for higher focus and productivity.",
        link: "/pod",
      },
    ],
  },
  home_why: {
    title: "Why choose KUN?",
    subtitle: "Real advantages that make a tangible difference in your daily work.",
    items: [
      { title: "High scaling flexibility", description: "Grow or downsize your team easily without long-term commitments." },
      { title: "Lower operating costs", description: "Pay only for what you need, no heavy fixed expenses." },
      { title: "Instant readiness", description: "Start working from day one in fully equipped spaces." },
      { title: "Professional environment", description: "Carefully designed to boost productivity and focus." },
    ],
  },
  home_audience: {
    title: "Who are these spaces for?",
    subtitle: "Flexible spaces that suit different working styles.",
    items: [
      { label: "Entrepreneurs", description: "Spaces that give you the freedom to build your idea." },
      { label: "Startups", description: "Launch faster with a more professional experience." },
      { label: "Small & medium teams", description: "Flexible solutions that grow with your team." },
      { label: "Freelancers", description: "A professional environment to focus and deliver." },
      { label: "Enterprises", description: "Tech-ready infrastructure to scale and manage teams." },
    ],
  },
  home_gallery: {
    title: "Discover our spaces",
  },
  home_final_cta: {
    title: "Start today and elevate the way you work",
    subtitle: "Join the KUN community and get a professional environment that supports your business growth.",
    cta_text: "Book your free tour",
  },
};
