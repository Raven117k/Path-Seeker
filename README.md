# PathSeeker — Career Passport

> **From Curiosity to Career** — a role-tailored career-guidance web platform for Pakistani students, graduates, and professionals. Built for **TechWiz 6** (Aptech Limited), under the Career Passport theme.

[![Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20Vite%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB-6366f1)](#)
[![Theme](https://img.shields.io/badge/Theme-Decoding%20Careers-8b5cf6)](#)
[![Status](https://img.shields.io/badge/Status-Hackathon%20Build-10b981)](#)

---

## 📌 What is PathSeeker?

PathSeeker is a **Career Passport** — a single web product that serves three different audiences, with three different *problems* and three different *next steps*:

| Audience | Their pain | What PathSeeker gives them |
|----------|-----------|----------------------------|
| **Student** (Matric, F.Sc, ICS, A/O Levels) | "I have no idea what to do after school" | 3-question mini-quiz → 1 career recommendation → 90-day action plan |
| **Graduate** (just placed / job-hunting) | "I picked the wrong branch" | Career Bank + Decision Helper (compare 2 careers on 11 axes) |
| **Professional** (career switch / upskilling) | "I need a roadmap, not a listicle" | Multimedia Centre + curated resources + success stories |

The product is **mobile-first** and provides graceful public GET fallbacks when the API is unavailable. It is not currently a full offline/PWA application.

---

## 🗂️ Repository layout

```
Career-Path/
├── contest.pdf           # Original TechWiz 6 Aptech brief
├── README.md             # ← you are here
├── CONTEST_PLAN.md       # How we win — strategy, rubric mapping, 24-hr runbook
│
├── Frontend/             # React 19 + Vite SPA
│   ├── src/
│   │   ├── components/   # Navbar, Footer, Shells, Modals, Drawer
│   │   ├── context/      # AuthContext (user, theme, fontSize, modals)
│   │   ├── pages/
│   │   │   ├── guest/    # GuestHome, GuestCareers, GuestStories, GuestResources
│   │   │   ├── user/     # UserDashboard, CareerBank, InterestQuiz, Multimedia…
│   │   │   └── admin/    # AdminDashboard, ManageUsers/Careers/Quiz/...
│   │   └── services/     # api.js (centralised client w/ static fallback)
│   └── package.json
│
└── Server/               # Node 18 + Express + Mongoose
    ├── config/           # MongoDB connection
    ├── controllers/      # 9 controllers (one per resource)
    ├── middleware/       # authMiddleware (JWT verify)
    ├── models/           # 10 Mongoose schemas
    ├── uploads/          # Resume PDFs, etc.
    ├── server.js         # Entry point
    ├── Router.js         # Mounts all routes
    ├── seeder.js         # Seeds from seeder payloads
    └── demoSeeder.js     # Populates demo data for judges
```

---

## 🚀 Quick start (judges: 3 commands to a working demo)

```bash
# 1. Backend
cd Server
npm install
node demoSeeder.js          # populate with demo data
node server.js              # starts on :2408

# 2. Frontend (in a new terminal)
cd Frontend
npm install
npm run dev                 # starts on :5173

# 3. Open
http://localhost:5173
```

### Demo accounts (all `password123`)

| Role | Email | What to show |
|------|-------|--------------|
| **Student** | `alex@student.com` | Take the quiz, see career recommendation |
| **Graduate** | `sarah@graduate.com` | Career Bank + Decision Helper |
| **Professional** | `david@pro.com` | Multimedia + Resources + Stories |
| **Admin** | `admin@pathseeker.com` | Sentiment-tagged feedback, approval queue, analytics |

---

## 🏗️ Architecture

### Frontend (React 19 + Vite)

- **Routing:** `react-router-dom` v7, with `BrowserRouter` at the root
- **State:** `AuthContext` holds user, theme, fontSize, modal flags, notifications — *no* Redux/Zustand needed at this size
- **API client:** `src/services/api.js` is a thin `fetch` wrapper with:
  - JWT injection from `localStorage`
  - 10s request timeout
  - **Session-storage GET cache (5 min TTL)**
  - **Static JSON fallback** so the public site never 404s if the DB is down
  - 401/403 → forced logout
- **Design system:** CSS variables only, dark/light themes via `[data-theme]`, font-size scaling via `[data-font-size]`
- **Motion:** IntersectionObserver-based scroll reveals, marquee, animated stat counters, page transitions
- **Responsive:** Mobile-first, with three breakpoints (≤600px, ≤820px, ≤980px) plus 1180px+ for the multimedia grid

### Backend (Node 18 + Express + Mongoose)

- **Auth:** JWT in `Authorization: Bearer` header; middleware verifies + attaches `req.user`
- **Models:** User, Career, QuizQuestion, QuizResult, Bookmark, Feedback, Resource, SuccessStory, Multimedia, Notification
- **Roles:** `student | graduate | professional | admin` — enforced at middleware
- **Uploads:** `multer` writes to `/uploads` (e.g. resume PDFs)
- **Seeders:** `demoSeeder.js` populates 50 users, 100 careers, 12 quiz questions, 48 stories, 70 resources, 60 multimedia records, 45 feedback tickets, bookmarks, and notifications — so judges see a *populated* state, not a blank canvas
- **Error contract:** all controllers throw on failure; client never silently succeeds on mutations

### Three audiences, three shells

```
┌─────────────────────────────────────────────────────┐
│  Navbar  (public site)                              │
│  /          /careers    /stories    /resources      │
└─────────────────────────────────────────────────────┘
                          ↓ sign in
┌─────────────────────────────────────────────────────┐
│  UserShell  (sidebar + topbar)                      │
│  /user/dashboard | /user/careers | /user/quiz | …   │
└─────────────────────────────────────────────────────┘
                          ↓ admin
┌─────────────────────────────────────────────────────┐
│  AdminShell  (sidebar + topbar + System online)     │
│  /admin/   /admin/users | /admin/feedback | …       │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Feature inventory (what each page does)

### Public site
- **`/` GuestHome** — Hero, "decoder ring" callout, role-aware CTA, live stat strip, audience cards, 3-tool grid, bottom CTA
- **`/careers`** — Career Bank preview (public); full features behind login
- **`/stories`** — Featured success stories
- **`/resources`** — Public resource previews

### User panel (Student / Graduate / Professional)
- **`/user/dashboard`** — Greeting, recent activity, top 3 career picks, quiz CTA
- **`/user/careers`** — Full career bank with search + domain filter
- **`/user/quiz`** — 8–10 question quiz (single-choice, multi-choice, slider, likert) with timer, scoring across 6 domains
- **`/user/multimedia`** — Video/podcast grid with rating, transcript, likes
- **`/user/stories`** — Full stories wall
- **`/user/resources`** — Search + download with counter
- **`/user/bookmarks`** — Saved careers/resources + sticky notes + PDF export
- **`/user/feedback`** — Submit feedback with category + sentiment
- **`/user/profile`** — Edit profile, upload resume PDF, manage skills

### Admin panel
- **`/admin/`** — Recharts dashboard: user growth, quiz attempts by domain, feedback sentiment, top careers by views
- **`/admin/users`** — User table with role toggle, active toggle, search
- **`/admin/careers`** — Full CRUD on careers
- **`/admin/quiz`** — Question bank CRUD
- **`/admin/multimedia`** — Media CRUD
- **`/admin/stories`** — Approval queue + featured toggle
- **`/admin/resources`** — Resource CRUD
- **`/admin/feedback`** — Sentiment-tagged inbox + reply + broadcast notification
- **`/admin/settings`** — Profile (reuses UserProfile)

---

## 🎨 Design system

### Colours (light + dark)

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--accent-primary` | `#6366f1` (indigo) | `#8b5cf6` (violet) | CTA, links, focus |
| `--accent-secondary` | `#8b5cf6` | `#6366f1` | Hover, gradient end |
| `--accent-cyan` | `#06b6d4` | same | Info chips |
| `--accent-emerald` | `#10b981` | same | Success |
| `--accent-amber` | `#f59e0b` | same | Warning, "trending" |
| `--accent-rose` | `#f43f5e` | same | Error, destructive |

### Typography
- **Display:** `Outfit` (600/700/800)
- **Body:** `Plus Jakarta Sans` (400/500/600)
- **Scale:** 14 / 16 / 18 px via `[data-font-size]` (accessibility)

### Motion language
- **Reveal:** `translateY(20px) → 0` + `opacity 0 → 1` over 600ms `cubic-bezier(.2,.7,.2,1)`
- **Marquee:** 30s linear infinite for stats
- **Card lift:** `translateY(-4px)` + shadow intensify on hover
- **Skeleton:** 1.4s shimmer gradient (used in `PageLoader`)
- **Reduced motion:** all of the above are disabled under `prefers-reduced-motion: reduce`

---

## 📱 Responsive strategy

- **Mobile (≤600px):** single-column, hamburger nav, bottom-sheet admin nav, condensed cards
- **Tablet (601–820px):** 2-col grids, collapsed sidebar (icons only)
- **Small desktop (821–1180px):** 3-col grids, full sidebar
- **Large desktop (1180px+):** 4-col multimedia grid, max-width containers

The `index.css` file contains a defensive `@media (max-width: 700px)` block that rewrites inline-styled grids into single columns — because most of the pages use inline `style={{ gridTemplateColumns: '…' }}` and we don't want to refactor every one to win mobile.

---

## 🔌 API surface (high level)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/sign-up` | Register (role, education, skills) |
| POST | `/api/sign-in` | Login → JWT + user |
| POST | `/api/forgot-password` | Simulated OTP |
| POST | `/api/reset-password` | OTP + new password |
| GET  | `/api/careers` | Public career list (uses static fallback) |
| GET  | `/api/careers/:id` | Career detail |
| GET  | `/api/quiz/questions` | Quiz questions (uses static fallback) |
| POST | `/api/quiz/submit` | Submit answers, get scored result |
| GET  | `/api/quiz/history` | User's previous attempts |
| GET/POST/DELETE | `/api/bookmarks` | User's saved items + notes |
| GET/POST | `/api/feedback` | Submit + view own feedback |
| GET  | `/api/notifications` | User's notifications |
| PUT  | `/api/notifications/read` | Mark all read |
| GET  | `/api/profile` | Current user profile |
| PUT  | `/api/profile` | Update profile (incl. resume PDF) |
| GET  | `/api/admin/dashboard-stats` | Analytics |
| GET  | `/api/admin/users` | All users |
| GET  | `/api/admin/feedback` | All feedback + sentiment stats |

(Full route table in `Server/Router.js`.)

---

## 🛠️ How to run, build, and test

```bash
# Frontend — dev
cd Frontend && npm run dev          # Vite on :5173

# Frontend — production
npm run build && npm run preview

# Server — dev
cd Server && node server.js         # Express on :2408

# Server — seed demo data
node demoSeeder.js                  # idempotent; safe to re-run

# Lint
cd Frontend && npm run lint
```

---

## 🧭 How we win — see `CONTEST_PLAN.md`

The complete rubric mapping, 24-hour runbook, pitch script, and feature ranking live in **[CONTEST_PLAN.md](./CONTEST_PLAN.md)**. Key headlines:

- **P0 moat feature:** Decision Helper (side-by-side career compare on 11 weighted axes) — no other team will ship it
- **Real-life problem matrix:** 10 named pain points, each mapped to a feature
- **Pitch script:** 5-min, slide-by-slide, ready to read out
- **Risk register:** MongoDB rate-limits, demo battery, "is this just CRUD?" — each mitigated

---

## 🧪 What's done in this refactor (and what's not)

### ✅ Done
- **Design system cleanup** — single source of truth in `index.css`, no duplicate tokens
- **Scroll animations** — IntersectionObserver-powered reveals on all pages
- **Responsive audit** — 360px → 1920px verified for every route
- **Refactor** — large pages split, shared components extracted (`StatCard`, `Section`, `EmptyState`, `SkeletonGrid`, etc.)
- **Premium polish** — animated mesh background, marquee, stat counters, page transitions
- **Static fallback hardened** — every public GET has a working fallback
- **Root README** (this file) + **CONTEST_PLAN.md**

### ⏭️ Suggested follow-ups (post-hackathon, real-life use)
- Wire up **real SMS/email OTP** via Twilio + SendGrid
- **Urdu/English i18n** — strings already extracted, add `ur.json` and a language toggle
- **PWA manifest** + service worker for true offline (currently we have *cache*, not *offline*)
- **Real career data** — partner with `Careers360`, `NSDC`, or `AICTE` to pull authoritative data
- **Scholarship auto-aggregator** — connect HEC, PEEF, Ehsaas, SEEF, and provincial scholarship portals
- **AI chat counsellor** — fine-tune a small model on verified career data, with explicit "I might be wrong" disclaimers
- **Mobile app** — Capacitor or React Native wrap of the existing SPA

---

## 🌍 How this solves real-life problems

This is the **judges' "real-world value" criterion** answered honestly:

1. **Decision paralysis after Class 12** → 3-question mini-quiz on the homepage
2. **No comparison tool** → Decision Helper (the only one of its kind)
3. **Guidance is expensive or unavailable** → free, with scholarship and skills-route links
4. **English-only excludes regional students** → i18n-ready, vernacular copy-ready
5. **No offline-first mobile experience** → static fallback + sessionStorage cache
6. **Parents gate-keep decisions** → share-as-PDF for every result
7. **No follow-through after "research"** → 90-day action plan per recommendation
8. **Admin moderation is a chore** → sentiment auto-tag in feedback
9. **No success-story loop** → stories wall with admin approval
10. **Abroad-vs-Pakistan is treated as binary** → every career has both scores honestly displayed

Full problem matrix, with data sources, in `CONTEST_PLAN.md` §4.

---

## 📄 License & credits

Built for **TechWiz 6** by the PathSeeker team.

- React 19 · Vite · react-router-dom · lucide-react · recharts · canvas-confetti
- Node 18 · Express · Mongoose · jsonwebtoken · bcryptjs · multer
- Fonts: Outfit + Plus Jakarta Sans (Google Fonts)

---

> **PathSeeker — from curiosity to career, decoded.**
