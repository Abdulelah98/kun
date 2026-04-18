# KUN Workspace Website - PRD

## Original Problem Statement
Build a modern, high-conversion bilingual (Arabic-first) website for KUN workspace brand providing workspace solutions, business services, and smart pods.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI (Arabic RTL)
- **Backend**: FastAPI + MongoDB
- **Font**: Cairo + Tajawal (Arabic)
- **Primary Color**: #f47424 (CTAs only)

## User Personas
- Entrepreneurs seeking workspace
- Startups needing flexible offices
- Corporates looking for meeting rooms
- Freelancers needing shared desks

## Core Requirements
- RTL Arabic layout throughout
- Hero section with video background
- Services overview (Spaces, Business, Pod)
- Shared desk booking with quantity selection
- Private office grid with availability status
- Meeting room booking with calendar
- Contact form with service dropdown
- WhatsApp integration
- Google Map embed

## What's Been Implemented (Dec 2025)
- [x] Homepage: Hero video, About Us, services cards, target audience, why KUN, image gallery, final CTA
- [x] Services overview page
- [x] Spaces page: Shared desks (quantity selector), private offices (grid with availability), meeting rooms (calendar + time slots)
- [x] Business services page (legal, HR, workspace solutions)
- [x] Pod page with features grid
- [x] About page with values
- [x] Contact page with form, WhatsApp button, social links, Google Map
- [x] Navbar with dropdown navigation
- [x] Footer with links and contact info
- [x] Backend: All booking & contact endpoints
- [x] All data-testid attributes

## What's Been Implemented (Feb 2026)
- [x] Hero content box repositioned to LEFT side of screen (centered on mobile)
- [x] Brand SVG shape fully contained inside hero box with overflow-hidden
- [x] Shape resized (160px/220px) and positioned with proper padding (bottom-6 left-6)
- [x] Shape opacity set to 0.1 for clean, balanced look
- [x] Refined hero glass box with adaptive left-to-right gradient (dark→transparent)
- [x] Added glassmorphism with blur(18px), saturate, brightness backdrop filters
- [x] Subtle top-highlight pseudo-element for premium glass edge effect
- [x] Improved internal padding and soft shadow
- [x] Compact hero box (max-w-3xl) with proportionally scaled text, buttons, and spacing
- [x] Light hero box: blur(3px), rgba(0,0,0,0.18→0.01) gradient, soft border/shadow
- [x] Hero height reduced to 70vh (75vh mobile) — next section visible without scrolling
- [x] Brand SVG opacity reduced to 0.06, lighter hero overlay gradient

## Prioritized Backlog
### P0 (Critical)
- None remaining

### P1 (Important)
- English language toggle (bilingual support)
- Real data integration (replace mock data)
- Admin dashboard for managing bookings

### P2 (Nice to have)
- Email notifications on booking
- reCAPTCHA on contact form
- SEO optimization
- Analytics integration

## Next Tasks
1. Add English language support with toggle
2. Build admin panel for bookings/contacts management
3. Integrate real payment for bookings
4. Add email notification system
