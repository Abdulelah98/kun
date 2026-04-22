// Default/fallback content used whenever the CMS hasn't populated a block yet.
// Keys match the schemas defined in /app/frontend/src/pages/admin/contentSchema.js

export const DEFAULT_CONTENT = {
  home_hero: {
    eyebrow: "حلول مساحات عمل متكاملة",
    title_line1: "مساحتك",
    title_highlight: "الاحترافية",
    title_line2: "تبدأ من هنا",
    subtitle:
      "وفّر وقتك وركّز على نمو أعمالك — مكاتب جاهزة، قاعات اجتماعات، وخدمات أعمال متكاملة في قلب الرياض",
    cta_primary: "احجز جولتك المجانية",
    cta_secondary: "استكشف الخدمات",
    video_url:
      "https://customer-assets.emergentagent.com/job_kun-conversion-site/artifacts/xk8jcmjb_WhatsApp-Video-2024-02-28-at-8.10.04-AM.mp4",
    fallback_image:
      "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/76af9fc8d16e1c9d906e9279b800de6f60c589b2bfd340b6c56981e341f3cdd3.png",
  },
  home_about: {
    title_line1: "بيئة عمل متكاملة",
    title_line2: "صُنعت لتدعم",
    title_highlight: "نجاحك",
    brand_word: "كن",
    body:
      "علامة سعودية رائدة في تقديم مساحات العمل الذكية وخدمات الأعمال المتكاملة. نُوفّر لرواد الأعمال والشركات بيئة احترافية ومرنة تُواكب تطلعاتهم وتُسهّل رحلة نموّهم.",
    stat1_value: "+500",
    stat1_label: "عميل يثق بنا",
    stat2_value: "+20",
    stat2_label: "خدمة متكاملة",
    stat3_value: "24/7",
    stat3_label: "دعم مستمر",
  },
  services_overview: {
    title: "خدماتنا",
    items: [
      {
        title: "المساحات",
        description:
          "مكاتب مشتركة، خاصة، وقاعات اجتماعات بتجهيزات احترافية متكاملة",
        image: "/assets/logos/spaces.svg",
        link: "/spaces",
      },
      {
        title: "خدمات الأعمال",
        description:
          "خدمات قانونية، موارد بشرية، وحلول أعمال متكاملة لنمو مشروعك",
        image: "/assets/logos/business.svg",
        link: "/business",
      },
      {
        title: "البود الذكي",
        description:
          "كبائن عمل ذكية معزولة صوتياً لتركيز أعلى وإنتاجية أفضل",
        image: "/assets/logos/pod.svg",
        link: "/pod",
      },
    ],
  },
  home_why: {
    title: "لماذا تختار كن؟",
    subtitle: "مزايا حقيقية تصنع فرقاً ملموساً في تجربة عملك اليومية",
    image:
      "https://images.unsplash.com/photo-1772751541531-e084e8f56630?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
    items: [
      { title: "مرونة عالية في التوسع", description: "نمِّ فريقك أو قلّصه بسهولة دون التزامات طويلة الأجل." },
      { title: "تقليل التكاليف التشغيلية", description: "ادفع فقط مقابل ما تحتاجه، بلا مصاريف ثابتة مرهقة." },
      { title: "جاهزية فورية", description: "ابدأ العمل من اليوم الأول بمساحات مجهزة بالكامل." },
      { title: "بيئة احترافية", description: "صُممت بعناية لتعزيز الإنتاجية والتركيز على نمو أعمالك." },
    ],
  },
  home_audience: {
    title: "لمن صُممت هذه المساحات؟",
    subtitle: "مساحات مرنة تناسب مختلف أساليب العمل",
    items: [
      { label: "رواد الأعمال", description: "مساحات تمنحك الحرية لبناء فكرتك" },
      { label: "الشركات الناشئة", description: "انطلق أسرع وبتجربة أكثر احترافية" },
      { label: "الفرق الصغيرة والمتوسطة", description: "حلول مرنة تكبر مع فريقك" },
      { label: "المستقلين", description: "بيئة احترافية تساعدك على التركيز والإنجاز" },
      { label: "الشركات الكبيرة", description: "بنية تقنية تدعم التوسع وإدارة الفرق بكفاءة" },
    ],
  },
  home_gallery: {
    title: "اكتشف مساحاتنا",
    images: [
      "https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1772751541531-e084e8f56630?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1770993151375-0dee97eda931?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtZWV0aW5nJTIwcm9vbSUyMGdsYXNzJTIwb2ZmaWNlfGVufDB8fHx8MTc3NjI1NzY4OHww&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1637665662134-db459c1bbb46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nJTIwcm9vbXxlbnwwfHx8fDE3NzYyNTc2OTV8MA&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1746021451691-4385f318ec13?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
      "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/8bd54b2ba1b5f87de79c099636bfb4d644c3a7e5c60f7bb9ac0579b12f6dd2e1.png",
    ],
  },
  home_final_cta: {
    title: "ابدأ اليوم وارتقِ بطريقة عملك",
    subtitle: "انضم إلى مجتمع كن واحصل على بيئة عمل احترافية تدعم نمو أعمالك",
    cta_text: "احجز جولتك المجانية",
  },

  about_main: {
    eyebrow: "من نحن",
    title: "تعرّف على كن",
    body:
      "أهلاً بكم معنا في كن، الرواد على مستوى الرياض في توفير مساحات العمل المشتركة. نؤمن في كن بأن بيئة العمل الاحترافية والتعاونية تنتج أعمالاً إبداعية.\n\nولأن نجاحك هو الأهم لنا نقدم لك مساحات مكتبية من الدرجة الأولى، مصممة لتلبية احتياجاتك وتحقيق أهدافك وتتناسب مع مختلف أنواع وأحجام المشاريع والأعمال.\n\nمساحاتنا المكتبية مصممة ومنشأة لتأمين أفضل بيئة عمل احترافية وتشاركية، وتقع في شمال مدينة الرياض، صممت بابتكار واحتراف ليكون عملك أفضل دائماً.",
    image:
      "https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
  },
  about_values: {
    title: "قيمنا",
    items: [
      { title: "الرؤية", description: "أن نكون الخيار الأول لمساحات العمل المشتركة في المملكة العربية السعودية، ونقدم بيئة عمل ملهمة تدعم الابتكار والنمو." },
      { title: "الرسالة", description: "توفير مساحات عمل احترافية ومرنة مع خدمات متكاملة تمكن رواد الأعمال والشركات من تحقيق أهدافهم بكفاءة." },
      { title: "الشغف", description: "نؤمن بأن بيئة العمل الاحترافية والتعاونية تنتج أعمالاً إبداعية. شغفنا هو دعم نجاح عملائنا." },
      { title: "التعاون", description: "نبني مجتمعاً تعاونياً يجمع بين المهنيين ورواد الأعمال لتبادل الخبرات وبناء شراكات ناجحة." },
    ],
  },

  services_page_header: {
    eyebrow: "الخدمات",
    title: "خدماتنا المتكاملة",
    subtitle: "حلول شاملة لبيئة عمل احترافية تدعم نمو أعمالك",
  },
  services_page_items: {
    items: [
      {
        title: "المساحات",
        description: "مكاتب مشتركة ومكاتب خاصة وقاعات اجتماعات مجهزة بالكامل. بيئة عمل احترافية تلبي جميع احتياجاتك مع مرونة في الاشتراك.",
        image: "https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
        link: "/spaces",
      },
      {
        title: "خدمات الأعمال",
        description: "خدمات قانونية متكاملة وإدارة الموارد البشرية وحلول أعمال مصممة لدعم نمو مشروعك بأعلى معايير الاحترافية.",
        image: "https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
        link: "/business",
      },
      {
        title: "البود الذكي",
        description: "كبائن عمل معزولة صوتياً ومجهزة بأحدث التقنيات. مثالية للمكالمات المهمة والعمل الذي يتطلب تركيزاً عالياً.",
        image: "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/8bd54b2ba1b5f87de79c099636bfb4d644c3a7e5c60f7bb9ac0579b12f6dd2e1.png",
        link: "/pod",
      },
    ],
  },

  contact_header: {
    eyebrow: "تواصل معنا",
    title: "نسعد بتواصلك معنا",
    subtitle: "فريقنا جاهز لمساعدتك في اختيار المساحة المثالية لأعمالك",
  },
  contact_info: {
    address_label: "العنوان",
    address_value: "المملكة العربية السعودية، الرياض",
    phone_label: "الهاتف",
    phone_value: "+966 53 542 0969",
    email_label: "البريد الإلكتروني",
    email_value: "info@kunws.com",
    working_hours_label: "ساعات العمل",
    working_hours_value: "24/7 - دعم مستمر",
  },
  contact_form: {
    title: "أرسل لنا رسالة",
    name_label: "الاسم الكريم",
    phone_label: "رقم الهاتف",
    email_label: "البريد الإلكتروني",
    service_label: "نوع الخدمة",
    message_label: "رسالتك",
    submit_text: "إرسال الطلب",
    success_message: "تم إرسال طلبك بنجاح! سنتواصل معك قريباً",
  },

  // ==================== SPACES ====================
  spaces_header: {
    eyebrow: "المساحات",
    title: "مساحات عمل تناسب طموحك",
    subtitle: "اختر المساحة المثالية لأعمالك من بين خيارات متنوعة ومرنة",
  },
  spaces_shared_desks: {
    title: "المكاتب المشتركة",
    price_start_badge: "يبدأ من",
    price_display: "1,500 ريال / شهرياً",
    features_eyebrow: "ما الذي تحصل عليه",
    features_title: "كل ما تحتاجه لإنتاجية بلا حدود",
    features: [
      { text: "مكتب مشترك (Hot Desk)" },
      { text: "إنترنت فائق السرعة غير محدود" },
      { text: "ضيافة غير محدودة (قهوة، شاي، مياه)" },
      { text: "طباعة غير محدودة" },
      { text: "وصول مرن بالساعة أو اليوم" },
      { text: "استخدام المناطق المشتركة" },
    ],
    cta: "احجز مكتبك المشترك",
  },
  spaces_private_offices: {
    title: "المكاتب الخاصة",
    price_start_badge: "يبدأ من",
    price_display: "3,500 ريال / شهرياً",
    features_title: "كل ما تحتاجه لإنتاجية بلا حدود",
    features: [
      { text: "مكتب خاص مجهز بالكامل" },
      { text: "إنترنت فائق السرعة غير محدود" },
      { text: "ضيافة غير محدودة (قهوة، شاي، مياه)" },
      { text: "طباعة غير محدودة" },
      { text: "عنوان تجاري رسمي" },
      { text: "خدمة استقبال وسكرتارية" },
      { text: "قاعات اجتماعات (ساعات شهرية)" },
      { text: "دعم إداري وتشغيلي متكامل" },
    ],
  },
  spaces_meeting_rooms: {
    title: "قاعات الاجتماعات",
    pick_date_title: "اختر التاريخ والوقت",
    available_times_title: "الأوقات المتاحة",
    empty_state_text: "اختر قاعة اجتماعات للبدء",
    cta: "احجز القاعة",
  },

  // ==================== BUSINESS ====================
  business_header: {
    eyebrow: "خدمات الأعمال",
    title: "خدمات أعمال متكاملة",
    subtitle: "حلول احترافية لدعم نمو مشروعك وتسهيل أعمالك",
  },
  business_services: {
    items: [
      {
        title: "الخدمات القانونية",
        description:
          "نقدم استشارات قانونية شاملة تشمل تأسيس الشركات، صياغة العقود، والتمثيل القانوني لحماية مصالح عملك.",
        image:
          "https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
      },
      {
        title: "الموارد البشرية",
        description:
          "حلول متكاملة لإدارة الموارد البشرية من التوظيف وإدارة الرواتب إلى تطوير الكفاءات وبناء فرق العمل.",
        image:
          "https://images.unsplash.com/photo-1637665662134-db459c1bbb46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nJTIwcm9vbXxlbnwwfHx8fDE3NzYyNTc2OTV8MA&ixlib=rb-4.1.0&q=85",
      },
      {
        title: "حلول مساحات العمل",
        description:
          "تصميم وتجهيز مساحات العمل وفق أحدث المعايير العالمية مع حلول مرنة تتكيف مع نمو أعمالك.",
        image:
          "https://images.unsplash.com/photo-1770993151375-0dee97eda931?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtZWV0aW5nJTIwcm9vbSUyMGdsYXNzJTIwb2ZmaWNlfGVufDB8fHx8MTc3NjI1NzY4OHww&ixlib=rb-4.1.0&q=85",
      },
    ],
  },

  // ==================== POD ====================
  pod_header: {
    eyebrow: "البود الذكي",
    title: "مساحتك الخاصة للتركيز والإنتاجية",
    subtitle:
      "كبائن عمل ذكية معزولة صوتياً ومجهزة بأحدث التقنيات. مثالية للمكالمات المهمة، الاجتماعات الافتراضية، والعمل الذي يتطلب تركيزاً عالياً.",
    hero_image:
      "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/8bd54b2ba1b5f87de79c099636bfb4d644c3a7e5c60f7bb9ac0579b12f6dd2e1.png",
  },
  pod_features: {
    title: "مميزات البود الذكي",
    items: [
      { title: "عزل صوتي متقدم", description: "تقنية عزل صوتي احترافية توفر بيئة هادئة تماماً" },
      { title: "تركيز أعلى", description: "بيئة مصممة خصيصاً لرفع الإنتاجية والتركيز" },
      { title: "خصوصية تامة", description: "مساحة شخصية مغلقة لمكالماتك واجتماعاتك المهمة" },
      { title: "إنترنت فائق السرعة", description: "اتصال مستقر وسريع لضمان سلاسة عملك" },
      { title: "تهوية ذكية", description: "نظام تهوية متطور يضمن راحتك طوال الوقت" },
      { title: "شحن وتقنية", description: "منافذ شحن متعددة وشاشة عرض مدمجة" },
    ],
  },

  // ==================== GLOBAL (Navbar / Footer) ====================
  global_navbar: {
    logo_alt: "KUN",
    logo_image:
      "https://customer-assets.emergentagent.com/job_kun-conversion-site/artifacts/lox96qjv_KUN-LOGO.svg",
    cta_text: "احجز جولتك المجانية",
    links: [
      { label: "الرئيسية", href: "/" },
      { label: "المساحات", href: "/spaces" },
      { label: "خدمات الأعمال", href: "/business" },
      { label: "البود الذكي", href: "/pod" },
      { label: "من نحن", href: "/about" },
      { label: "تواصل معنا", href: "/contact" },
    ],
  },
  global_footer: {
    brand_description:
      "رائدون في توفير مساحات العمل المشتركة في الرياض. نقدم بيئة عمل احترافية وتعاونية لتحقيق أهدافك.",
    rights_text: "2025 © KUN - جميع الحقوق محفوظة",
    quick_links_title: "روابط سريعة",
    quick_links: [
      { label: "الرئيسية", href: "/" },
      { label: "المساحات", href: "/spaces" },
      { label: "خدمات الأعمال", href: "/business" },
      { label: "البود الذكي", href: "/pod" },
      { label: "من نحن", href: "/about" },
    ],
    social_title: "تابعنا",
  },
};
