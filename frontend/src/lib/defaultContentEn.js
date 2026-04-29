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
 "Save time and focus on growing your business ready offices, meeting rooms, and integrated business services in the heart of Riyadh.",
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
 image: "/assets/logos/spaces.svg",
 link: "/spaces",
 },
 {
 title: "Business Services",
 description: "Legal, HR, and integrated business solutions to grow your venture.",
 image: "/assets/logos/business.svg",
 link: "/business",
 },
 {
 title: "Smart Pod",
 description: "Soundproof smart pods for higher focus and productivity.",
 image: "/assets/logos/pod.svg",
 link: "/pod",
 },
 ],
 },
 home_why: {
 title: "Why choose KUN?",
 subtitle: "Real advantages that make a tangible difference in your daily work.",
 image:
 "https://images.unsplash.com/photo-1772751541531-e084e8f56630?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
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
 title: "Start today and elevate the way you work",
 subtitle: "Join the KUN community and get a professional environment that supports your business growth.",
 cta_text: "Book your free tour",
 },

 // ==================== ABOUT ====================
 about_main: {
 eyebrow: "About us",
 title: "Get to know KUN",
 body:
 "Welcome to KUN Riyadh's leading provider of coworking spaces. We believe a professional, collaborative environment produces creative work.\n\nBecause your success matters most to us, we offer first-class office spaces designed to meet your needs, achieve your goals, and suit projects of all types and sizes.\n\nOur offices are designed to deliver the best professional, collaborative work environment, located in the north of Riyadh and crafted with creativity and care so your work is always at its best.",
 image:
 "https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
 },
 about_values: {
 title: "Our values",
 items: [
 { title: "Vision", description: "To be the first choice for coworking spaces in Saudi Arabia, delivering an inspiring environment that fuels innovation and growth." },
 { title: "Mission", description: "To provide professional, flexible workspaces with integrated services that empower entrepreneurs and companies to achieve their goals efficiently." },
 { title: "Passion", description: "We believe a professional, collaborative environment produces creative work. Our passion is supporting our clients' success." },
 { title: "Collaboration", description: "We build a collaborative community of professionals and entrepreneurs to share expertise and forge successful partnerships." },
 ],
 },

 // ==================== SERVICES ====================
 services_page_header: {
 eyebrow: "Services",
 title: "Our integrated services",
 subtitle: "Comprehensive solutions for a professional work environment that supports your growth",
 },
 services_page_items: {
 items: [
 {
 title: "Spaces",
 description:
 "Shared offices, private offices and fully equipped meeting rooms. A professional environment that meets all your needs with flexible subscription options.",
 image: "https://images.unsplash.com/photo-1765366417046-f46361a7f26f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBjb3dvcmtpbmclMjBzcGFjZSUyMGJyaWdodHxlbnwwfHx8fDE3NzYyNTc2Nzl8MA&ixlib=rb-4.1.0&q=85",
 link: "/spaces",
 },
 {
 title: "Business Services",
 description:
 "Integrated legal services, HR management and business solutions designed to support your project's growth at the highest professional standards.",
 image: "https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
 link: "/business",
 },
 {
 title: "Smart Pod",
 description:
 "Soundproof work pods equipped with the latest technology ideal for important calls and high-focus work.",
 image: "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/8bd54b2ba1b5f87de79c099636bfb4d644c3a7e5c60f7bb9ac0579b12f6dd2e1.png",
 link: "/pod",
 },
 ],
 },

 // ==================== CONTACT ====================
 contact_header: {
 eyebrow: "Contact us",
 title: "We'd love to hear from you",
 subtitle: "Our team is ready to help you pick the perfect workspace for your business",
 },
 contact_info: {
 address_label: "Address",
 address_value: "Riyadh, Saudi Arabia",
 phone_label: "Phone",
 phone_value: "+966 53 542 0969",
 email_label: "Email",
 email_value: "info@kunws.com",
 working_hours_label: "Working hours",
 working_hours_value: "24/7 continuous support",
 },
 contact_form: {
 title: "Send us a message",
 name_label: "Your name",
 phone_label: "Phone number",
 email_label: "Email",
 service_label: "Service type",
 message_label: "Your message",
 submit_text: "Send request",
 success_message: "Your request was sent successfully! We'll get in touch shortly",
 },

 // ==================== SPACES ====================
 spaces_header: {
 eyebrow: "Spaces",
 title: "Workspaces that match your ambition",
 subtitle: "Pick the perfect space for your business from a range of flexible options",
 },
 spaces_shared_desks: {
 title: "Shared Desks",
 price_start_badge: "From",
 price_display: "1,500 SAR / month",
 features_eyebrow: "What you get",
 features_title: "Everything you need for unlimited productivity",
 cta: "Book your shared desk",
 },
 spaces_private_offices: {
 title: "Private Offices",
 price_start_badge: "From",
 price_display: "3,500 SAR / month",
 features_title: "Everything you need for unlimited productivity",
 },
 spaces_meeting_rooms: {
 title: "Meeting Rooms",
 pick_date_title: "Pick date & time",
 available_times_title: "Available times",
 empty_state_text: "Pick a meeting room to get started",
 cta: "Book meeting room",
 },

 // ==================== BUSINESS ====================
 business_header: {
 eyebrow: "Business Services",
 title: "Integrated business services",
 subtitle: "Professional solutions to support your growth and simplify operations",
 },
 business_services: {
 items: [
 {
 title: "Legal Services",
 description:
 "Comprehensive legal counsel including company formation, contract drafting and legal representation to protect your business interests.",
 image:
 "https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxtb2Rlcm4lMjBwcml2YXRlJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDB8fHx8MTc3NjI1Nzk0OHww&ixlib=rb-4.1.0&q=85",
 },
 {
 title: "Human Resources",
 description:
 "End-to-end HR solutions, from talent acquisition and payroll to people development and team building.",
 image:
 "https://images.unsplash.com/photo-1637665662134-db459c1bbb46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBvZmZpY2UlMjBtZWV0aW5nJTIwcm9vbXxlbnwwfHx8fDE3NzYyNTc2OTV8MA&ixlib=rb-4.1.0&q=85",
 },
 {
 title: "Workspace solutions",
 description:
 "Designing and equipping workspaces to the highest international standards with flexible solutions that scale with you.",
 image:
 "https://images.unsplash.com/photo-1770993151375-0dee97eda931?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBtZWV0aW5nJTIwcm9vbSUyMGdsYXNzJTIwb2ZmaWNlfGVufDB8fHx8MTc3NjI1NzY4OHww&ixlib=rb-4.1.0&q=85",
 },
 ],
 },

 // ==================== POD ====================
 pod_header: {
 eyebrow: "Smart Pod",
 title: "Your private space for focus & productivity",
 subtitle:
 "Smart, soundproofed work pods equipped with the latest tech ideal for important calls, virtual meetings and deep-focus work.",
 hero_image:
 "https://static.prod-images.emergentagent.com/jobs/5a4c12ca-bf7c-43dd-b928-467b4172e275/images/8bd54b2ba1b5f87de79c099636bfb4d644c3a7e5c60f7bb9ac0579b12f6dd2e1.png",
 },
 pod_features: {
 title: "Smart Pod features",
 items: [
 { title: "Advanced soundproofing", description: "Professional acoustic insulation for a fully quiet environment" },
 { title: "Higher focus", description: "An environment designed to lift productivity and concentration" },
 { title: "Total privacy", description: "A closed personal space for your important calls and meetings" },
 { title: "High-speed internet", description: "A stable, fast connection for smooth workflows" },
 { title: "Smart ventilation", description: "Advanced ventilation that keeps you comfortable throughout the day" },
 { title: "Power & tech", description: "Multiple power outlets and a built-in display" },
 ],
 },

 // ==================== GLOBAL ====================
 global_navbar: {
 logo_alt: "KUN",
 cta_text: "Book your free tour",
 links: [
 { label: "Home", href: "/" },
 { label: "Spaces", href: "/spaces" },
 { label: "Business Services", href: "/business" },
 { label: "Smart Pod", href: "/pod" },
 { label: "About", href: "/about" },
 { label: "Contact", href: "/contact" },
 ],
 },
 global_footer: {
 brand_description:
 "Leaders in coworking spaces in Riyadh. We provide a professional, collaborative environment to help you achieve your goals.",
 rights_text: "2025 © KUN All rights reserved",
 quick_links_title: "Quick Links",
 quick_links: [
 { label: "Home", href: "/" },
 { label: "Spaces", href: "/spaces" },
 { label: "Business Services", href: "/business" },
 { label: "Smart Pod", href: "/pod" },
 { label: "About", href: "/about" },
 ],
 social_title: "Follow us",
 },
};
