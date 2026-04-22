// Page schemas for the CMS — every text + image on the site is listed here.
// Supported field types: "text", "textarea", "image", "images", "boolean", "number", "list"
// "list" items are flat objects whose fields follow the same primitive types.

export const PAGES = [
  { id: "home", label: "الصفحة الرئيسية", icon: "home" },
  { id: "services", label: "الخدمات", icon: "briefcase" },
  { id: "spaces", label: "المساحات", icon: "building" },
  { id: "business", label: "خدمات الأعمال", icon: "briefcase" },
  { id: "pod", label: "الكبسولة الذكية", icon: "box" },
  { id: "about", label: "من نحن", icon: "info" },
  { id: "contact", label: "تواصل معنا", icon: "phone" },
  { id: "global", label: "عام (Navbar/Footer)", icon: "globe" },
];

export const PAGE_BLOCKS = [
  // ==================== HOME ====================
  {
    key: "home_hero",
    page: "home",
    title: "الهيدر الرئيسي",
    description: "العنوان الكبير في أعلى الصفحة الرئيسية",
    fields: [
      { key: "eyebrow", label: "النص العلوي الصغير", type: "text" },
      { key: "title_line1", label: "السطر الأول من العنوان", type: "text", help: 'مثال: "مساحتك"' },
      { key: "title_highlight", label: "الكلمة المميزة بالبرتقالي", type: "text", help: 'مثال: "الاحترافية"' },
      { key: "title_line2", label: "السطر الثاني من العنوان", type: "text", help: 'مثال: "تبدأ من هنا"' },
      { key: "subtitle", label: "الوصف تحت العنوان", type: "textarea" },
      { key: "cta_primary", label: "نص زر الدعوة الأساسي", type: "text" },
      { key: "cta_secondary", label: "نص زر الدعوة الثانوي", type: "text" },
      { key: "video_url", label: "رابط فيديو الخلفية (MP4)", type: "text" },
      { key: "fallback_image", label: "صورة الخلفية البديلة", type: "image" },
    ],
  },
  {
    key: "home_about",
    page: "home",
    title: "قسم من نحن (الرئيسية)",
    fields: [
      { key: "title_line1", label: "السطر الأول", type: "text" },
      { key: "title_line2", label: "السطر الثاني", type: "text" },
      { key: "title_highlight", label: "الكلمة المميزة", type: "text" },
      { key: "body", label: "النص الوصفي", type: "textarea" },
      { key: "brand_word", label: "الكلمة المميزة في البداية", type: "text", help: 'مثال: "كن"' },
      { key: "stat1_value", label: "الرقم الأول", type: "text" },
      { key: "stat1_label", label: "وصف الرقم الأول", type: "text" },
      { key: "stat2_value", label: "الرقم الثاني", type: "text" },
      { key: "stat2_label", label: "وصف الرقم الثاني", type: "text" },
      { key: "stat3_value", label: "الرقم الثالث", type: "text" },
      { key: "stat3_label", label: "وصف الرقم الثالث", type: "text" },
    ],
  },
  {
    key: "services_overview",
    page: "services",
    title: "بطاقات الخدمات (الرئيسية)",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      {
        key: "items",
        label: "الخدمات",
        type: "list",
        itemSchema: [
          { key: "title", label: "اسم الخدمة", type: "text" },
          { key: "description", label: "الوصف", type: "textarea" },
          { key: "image", label: "الأيقونة / الصورة", type: "image" },
          { key: "link", label: "الرابط الداخلي", type: "text", help: "/spaces, /business ..." },
        ],
      },
    ],
  },
  {
    key: "home_why",
    page: "home",
    title: "لماذا تختار كن؟",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      { key: "subtitle", label: "الوصف", type: "textarea" },
      { key: "image", label: "صورة القسم", type: "image" },
      {
        key: "items",
        label: "المزايا",
        type: "list",
        itemSchema: [
          { key: "title", label: "اسم الميزة", type: "text" },
          { key: "description", label: "الوصف", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "home_audience",
    page: "home",
    title: "قسم العملاء (لمن صُممت هذه المساحات)",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      { key: "subtitle", label: "الوصف", type: "textarea" },
      {
        key: "items",
        label: "شرائح العملاء",
        type: "list",
        itemSchema: [
          { key: "label", label: "الفئة", type: "text" },
          { key: "description", label: "الوصف القصير", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "home_gallery",
    page: "home",
    title: "معرض الصور",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      { key: "images", label: "الصور", type: "images" },
    ],
  },
  {
    key: "home_final_cta",
    page: "home",
    title: "الدعوة النهائية للتواصل",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      { key: "subtitle", label: "الوصف", type: "textarea" },
      { key: "cta_text", label: "نص زر الدعوة", type: "text" },
    ],
  },

  // ==================== SPACES ====================
  {
    key: "spaces_header",
    page: "spaces",
    title: "رأس صفحة المساحات",
    fields: [
      { key: "eyebrow", label: "النص الصغير العلوي", type: "text" },
      { key: "title", label: "العنوان", type: "text" },
      { key: "subtitle", label: "الوصف", type: "textarea" },
    ],
  },
  {
    key: "spaces_shared_desks",
    page: "spaces",
    title: "نصوص قسم المكاتب المشتركة",
    description: "الأسعار والمقاعد تُحرّر من صفحة المكاتب المشتركة",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      { key: "price_start_badge", label: "تسمية السعر", type: "text", help: 'مثال: "يبدأ من"' },
      { key: "price_display", label: "السعر الظاهر", type: "text", help: 'مثال: "1,500 ريال / شهرياً"' },
      { key: "features_eyebrow", label: "النص الصغير قبل المزايا", type: "text" },
      { key: "features_title", label: "عنوان قائمة المزايا", type: "text" },
      {
        key: "features",
        label: "قائمة المزايا",
        type: "list",
        itemSchema: [
          { key: "text", label: "نص الميزة", type: "text" },
        ],
      },
      { key: "cta", label: "نص زر الحجز", type: "text" },
    ],
  },
  {
    key: "spaces_private_offices",
    page: "spaces",
    title: "نصوص قسم المكاتب الخاصة",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      { key: "price_start_badge", label: "تسمية السعر", type: "text" },
      { key: "price_display", label: "السعر الظاهر", type: "text" },
      { key: "features_title", label: "عنوان قائمة المزايا", type: "text" },
      {
        key: "features",
        label: "قائمة المزايا",
        type: "list",
        itemSchema: [
          { key: "text", label: "نص الميزة", type: "text" },
        ],
      },
    ],
  },
  {
    key: "spaces_meeting_rooms",
    page: "spaces",
    title: "نصوص قسم قاعات الاجتماعات",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      { key: "pick_date_title", label: "عنوان اختر التاريخ والوقت", type: "text" },
      { key: "available_times_title", label: "عنوان الأوقات المتاحة", type: "text" },
      { key: "empty_state_text", label: "النص عندما لا يتم اختيار قاعة", type: "text" },
      { key: "cta", label: "نص زر الحجز", type: "text" },
    ],
  },

  // ==================== BUSINESS ====================
  {
    key: "business_header",
    page: "business",
    title: "رأس صفحة خدمات الأعمال",
    fields: [
      { key: "eyebrow", label: "النص الصغير", type: "text" },
      { key: "title", label: "العنوان", type: "text" },
      { key: "subtitle", label: "الوصف", type: "textarea" },
    ],
  },
  {
    key: "business_services",
    page: "business",
    title: "قائمة خدمات الأعمال",
    fields: [
      {
        key: "items",
        label: "الخدمات",
        type: "list",
        itemSchema: [
          { key: "title", label: "اسم الخدمة", type: "text" },
          { key: "description", label: "الوصف", type: "textarea" },
          { key: "image", label: "الصورة", type: "image" },
        ],
      },
    ],
  },

  // ==================== POD ====================
  {
    key: "pod_header",
    page: "pod",
    title: "رأس صفحة الكبسولة الذكية",
    fields: [
      { key: "eyebrow", label: "النص الصغير", type: "text" },
      { key: "title", label: "العنوان", type: "text" },
      { key: "subtitle", label: "الوصف", type: "textarea" },
      { key: "hero_image", label: "صورة الكبسولة", type: "image" },
    ],
  },
  {
    key: "pod_features",
    page: "pod",
    title: "مزايا الكبسولة",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      {
        key: "items",
        label: "المزايا",
        type: "list",
        itemSchema: [
          { key: "title", label: "الميزة", type: "text" },
          { key: "description", label: "الوصف", type: "textarea" },
        ],
      },
    ],
  },

  // ==================== ABOUT ====================
  {
    key: "about_main",
    page: "about",
    title: "من نحن — المحتوى الرئيسي",
    fields: [
      { key: "eyebrow", label: "النص الصغير", type: "text" },
      { key: "title", label: "العنوان", type: "text" },
      { key: "body", label: "النص الوصفي", type: "textarea" },
      { key: "image", label: "الصورة الرئيسية", type: "image" },
    ],
  },
  {
    key: "about_values",
    page: "about",
    title: "قيمنا",
    fields: [
      { key: "title", label: "العنوان", type: "text" },
      {
        key: "items",
        label: "القيم",
        type: "list",
        itemSchema: [
          { key: "title", label: "القيمة", type: "text" },
          { key: "description", label: "الوصف", type: "textarea" },
        ],
      },
    ],
  },

  // ==================== CONTACT ====================
  {
    key: "contact_header",
    page: "contact",
    title: "رأس صفحة التواصل",
    fields: [
      { key: "eyebrow", label: "النص الصغير", type: "text" },
      { key: "title", label: "العنوان", type: "text" },
      { key: "subtitle", label: "الوصف", type: "textarea" },
    ],
  },
  {
    key: "contact_info",
    page: "contact",
    title: "معلومات التواصل (تظهر على الصفحة)",
    fields: [
      { key: "address_label", label: "عنوان العنوان", type: "text" },
      { key: "address_value", label: "العنوان", type: "textarea" },
      { key: "phone_label", label: "تسمية الهاتف", type: "text" },
      { key: "phone_value", label: "الهاتف", type: "text" },
      { key: "email_label", label: "تسمية البريد", type: "text" },
      { key: "email_value", label: "البريد الإلكتروني", type: "text" },
      { key: "working_hours_label", label: "تسمية ساعات العمل", type: "text" },
      { key: "working_hours_value", label: "ساعات العمل", type: "text" },
    ],
  },
  {
    key: "contact_form",
    page: "contact",
    title: "نموذج التواصل — النصوص",
    fields: [
      { key: "title", label: "عنوان النموذج", type: "text" },
      { key: "name_label", label: "تسمية الاسم", type: "text" },
      { key: "phone_label", label: "تسمية الهاتف", type: "text" },
      { key: "email_label", label: "تسمية البريد", type: "text" },
      { key: "service_label", label: "تسمية نوع الخدمة", type: "text" },
      { key: "message_label", label: "تسمية الرسالة", type: "text" },
      { key: "submit_text", label: "نص زر الإرسال", type: "text" },
      { key: "success_message", label: "رسالة النجاح", type: "text" },
    ],
  },

  // ==================== GLOBAL ====================
  {
    key: "global_navbar",
    page: "global",
    title: "شريط التنقل (Navbar)",
    fields: [
      { key: "logo_alt", label: "نص بديل للشعار", type: "text" },
      { key: "logo_image", label: "الشعار", type: "image" },
      { key: "cta_text", label: "نص زر الـCTA", type: "text" },
      {
        key: "links",
        label: "روابط القائمة",
        type: "list",
        itemSchema: [
          { key: "label", label: "النص", type: "text" },
          { key: "href", label: "الرابط", type: "text" },
        ],
      },
    ],
  },
  {
    key: "global_footer",
    page: "global",
    title: "التذييل (Footer)",
    fields: [
      { key: "brand_description", label: "وصف العلامة التجارية", type: "textarea" },
      { key: "rights_text", label: "نص حقوق النشر", type: "text" },
      { key: "quick_links_title", label: "عنوان الروابط السريعة", type: "text" },
      {
        key: "quick_links",
        label: "الروابط السريعة",
        type: "list",
        itemSchema: [
          { key: "label", label: "النص", type: "text" },
          { key: "href", label: "الرابط", type: "text" },
        ],
      },
      { key: "social_title", label: "عنوان وسائل التواصل", type: "text" },
    ],
  },
];

export const getBlockByKey = (key) => PAGE_BLOCKS.find((b) => b.key === key);
export const getBlocksByPage = (pageId) => PAGE_BLOCKS.filter((b) => b.page === pageId);
