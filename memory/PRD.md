# KUN Workspace Website - PRD

## Original Problem Statement
Build a modern, high-conversion bilingual (Arabic-first) website for KUN workspace brand providing workspace solutions, business services, and smart pods. Second phase expanded into a full advanced Admin Dashboard (CMS + Booking System) to dynamically control all content, manage 3 types of bookings (Shared Desks, Private Offices, Meeting Rooms), and handle contact messages.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI (Arabic RTL + admin dark theme)
- **Backend**: FastAPI (modular) + MongoDB
- **Auth**: JWT (HS256) with HttpOnly secure cookies, bcrypt password hashing
- **Font**: Cairo + Tajawal (Arabic)
- **Primary Color**: #f47424 (CTAs + admin accents)

### Backend Structure
```
/app/backend/
├── server.py                (thin app, wires routers + CORS + startup seed)
├── database.py              (motor client)
├── auth_utils.py            (bcrypt, jwt, get_current_user, require_admin/staff, cookies)
├── seed.py                  (admin + offices + rooms + shared desks + settings + content blocks)
├── models/schemas.py        (pydantic models)
└── routes/
    ├── auth.py              (/api/auth/login|me|logout)
    ├── public.py            (/api/offices|shared-desks|meeting-rooms|content|settings|contact|bookings/*)
    └── admin.py             (/api/admin/* full CRUD)
```

### Frontend Structure (admin)
```
/app/frontend/src/
├── lib/api.js               (axios instance with withCredentials)
├── contexts/AuthContext.jsx (checks /auth/me on mount)
└── pages/admin/
    ├── Login.jsx, AdminLayout.jsx, Dashboard.jsx
    ├── Bookings.jsx, Messages.jsx
    ├── Offices.jsx, MeetingRooms.jsx, SharedDesks.jsx
    ├── Content.jsx, Settings.jsx, Users.jsx
```

## User Personas
- **Public**: Entrepreneurs, startups, corporates, freelancers looking for workspace
- **Admin**: KUN staff managing content, bookings, messages, users

## Core Requirements (Public Site)
- RTL Arabic layout throughout
- Homepage (hero video, about, services, gallery, CTA)
- Spaces page (shared desks, private offices grid, meeting rooms calendar)
- Business services page, Pod page, About, Contact (form, map, WhatsApp)
- Navbar with dropdown, Footer

## Core Requirements (Admin Dashboard)
- Admin-only login (JWT HttpOnly cookies)
- Admin + Staff roles (staff = bookings/messages only)
- Full CMS control (texts, images, sections — bilingual AR/EN JSON per block)
- Manage 3 booking types (desk / office / meeting room), status workflow (pending/confirmed/rejected/cancelled)
- Meeting room hourly slot with duplicate-slot rejection (409)
- Contact messages (new/read/replied/archived)
- Site settings (phone, email, WhatsApp, map coords, social links, admin notify email)
- User management (admins can create/edit/delete staff; cannot delete self)

## What's Been Implemented

### Dec 2025 — Public site (mock data)
- [x] Full responsive Arabic-first site (Homepage, Services, Spaces, Business, Pod, About, Contact)
- [x] Shared desk quantity selector, office grid, meeting room calendar
- [x] Navbar with dynamic logo swap, Footer, WhatsApp button, Google Map

### Feb 2026 — Hero polish
- [x] Left-aligned hero glass box, cropped brand logo behavior, adjusted spacing/typography
- [x] Global light gray background darkened to #EDF0F4
- [x] Unified CTA buttons ("احجز جولتك المجانية") linking to /contact
- [x] Booking modal redesigned ("إرسال طلب"), close icon fixed

### Feb 2026 — Admin Dashboard (THIS ITERATION)
- [x] Modular FastAPI backend: routes/auth, routes/public, routes/admin, models/schemas, seed, database, auth_utils
- [x] MongoDB collections: users, offices, meeting_rooms, shared_desks, bookings, messages, content_blocks, settings
- [x] Startup seed: admin user (admin@kun.com / Kun@9632147), 6 offices, 2 meeting rooms, shared desks singleton, site settings, 3 content blocks
- [x] Migrated all public endpoints from mock arrays to DB queries
- [x] Auth: /api/auth/login (bcrypt + JWT in HttpOnly cookie, SameSite=None, Secure), /me, /logout
- [x] Public: /api/{offices, shared-desks, meeting-rooms, content, content/{key}, settings, contact, bookings/desk|office|meeting-room}
- [x] Admin CRUD (admin+staff read, admin write): /api/admin/{offices, meeting-rooms, shared-desks, content, settings, bookings, messages, users, stats}
- [x] Role-based access (admin vs staff) with 403 on staff writes
- [x] Meeting room duplicate slot detection (409)
- [x] Admin React dashboard (dark theme, RTL): Login, Layout with sidebar, Dashboard stats, Bookings with filters + status actions, Messages with dialog viewer, full CRUD UIs for Offices/MeetingRooms/SharedDesks/Content/Settings/Users
- [x] Content CMS with bilingual JSON editor (AR/EN tabs)
- [x] Tested end-to-end: 28/28 backend pytest pass, 9/9 frontend flows pass

## Prioritized Backlog

### P0 — None remaining

### P1 (Important)
- Wire public website pages to read from new CMS endpoints (currently SpacesPage already uses /api/offices; Home + About + Services need to hydrate from /api/content)
- English language toggle for public site (data model already bilingual)
- Richer media uploader for admin images (currently URL-based)

### P2 (Nice to have)
- Resend email notifications on new contact/booking (user opted to skip for now)
- Stripe payment integration for bookings
- reCAPTCHA on contact form
- SEO + sitemap + analytics
- Audit log for admin actions

## Next Tasks
1. Hydrate HomePage / AboutPage / ServicesPage from `/api/content/{key}` instead of hardcoded strings
2. Add English toggle on public site (header switcher + i18n context reading from content blocks)
3. Admin: add image/file upload (object storage) so content images don't require URLs
4. Add Resend (or alternative) email notifications when ready

## Credentials
- Admin login: `admin@kun.com` / `Kun@9632147` → `/admin/login`
- See `/app/memory/test_credentials.md`
