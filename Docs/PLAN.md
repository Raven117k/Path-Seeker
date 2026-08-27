# Implementation Plan — PathSeeker (TechWiz 6 · Pakistan Edition)

Transform PathSeeker into a contest-winning application tailored specifically for **Pakistan** (TechWiz 6 by Aptech) and fix the blank page bug on `http://localhost:5173/user/decision-helper`.

## User Review Required

> [!IMPORTANT]
> **Localization Shift**: All context is being updated from India to **Pakistan**:
> - **Education System**: Matriculation (SSC), F.Sc (Pre-Engineering / Pre-Medical), ICS (Computer Science), I.Com, FA, O/A Levels, BS/BE/MBBS degrees.
> - **Entrance Exams**: MDCAT, ECAT, NTS (NAT/GAT), FAST test, NUST NET.
> - **Scholarships & Government Schemes**: HEC Scholarships, PEEF (Punjab Educational Endowment Fund), Ehsaas Undergraduate Scholarship, Kamyab Jawan Program, SEEF.
> - **Cities & Universities**: Islamabad, Karachi, Lahore, Peshawar, Quetta | NUST, FAST-NUCES, LUMS, AKU, UET, COMSATS, GIKI, IBA.
> - **Currency**: PKR (Rs. / PKR).
> - **Competition**: **TechWiz 6** (Global AI-Based Tech Competition by Aptech Limited).

---

## Key Issues & Fixes

### 1. Fix Blank Page on `/user/decision-helper`
- **Root Cause**: `DecisionHelper.jsx` threw unhandled `TypeError` exceptions during render when career objects `a` or `b` were null/undefined because functions (`growthScore`, `studyTimeLabel`, `goAbroadScore`, `indiaReadyScore`, `workLifeScore`, `riskScore`, `flexibilityScore`, `skillOverlap`) and axis formatting methods dereferenced `c.property` without optional chaining (`c?.property`).
- **Fix**: Add optional chaining (`c?.`) across all scoring and formatting functions, ensure fallback values if selection is transiently empty, and format salary bands in PKR.

### 2. Update Documentation & Contest Strategy
- **`CONTEST_PLAN.md`**: Re-frame strategy for TechWiz 6 SRS (Career Passport theme), replacing Indian references with Pakistani education pain points, 11-axis Decision Helper moat, pitch script, and real-world value matrix.
- **`README.md`**: Comprehensive update reflecting Pakistan edition, TechWiz 6 brief, setup commands, architecture, and feature inventory.

### 3. Update Frontend & Backend Seed Data
- **`Frontend/src/services/api.js`**: Update static fallback datasets (`STATIC_CAREERS`, `STATIC_RESOURCES`, `STATIC_QUIZ_QUESTIONS`, `STATIC_STORIES`) to use PKR salary ranges, Pakistani university paths, Matric/F.Sc/ICS options, and HEC/PEEF scholarship links.
- **`Frontend/src/i18n.js`**: Update copy, trust line ("Built for Pakistan"), and replace `indiaReady` with `pkReady` ("Pakistan-ready").
- **`Server/demoSeeder.js` & `Server/seeder.js`**: Update seed scripts to populate MongoDB Atlas with Pakistani users, careers, and resources.

---

## Proposed Changes

### Frontend Component & Pages

#### [MODIFY] [DecisionHelper.jsx](file:///c:/Users/Admin/Downloads/Career-Path/Career-Path/Frontend/src/pages/user/DecisionHelper.jsx)
- Add defensive optional chaining (`c?.`) across all heuristic scoring functions.
- Format salary band in PKR (`PKR ${Math.round(c.salaryRange.min/1000)}k–...`).
- Replace `indiaReady` axis with `pkReady` ("Pakistan-ready") scoring heuristic.

#### [MODIFY] [i18n.js](file:///c:/Users/Admin/Downloads/Career-Path/Career-Path/Frontend/src/i18n.js)
- Update text strings to specify Pakistan, TechWiz 6, and Pakistan-ready career metrics.

#### [MODIFY] [api.js](file:///c:/Users/Admin/Downloads/Career-Path/Career-Path/Frontend/src/services/api.js)
- Replace static career and resource dataset with Pakistani context (PKR salaries, Pakistani degrees, HEC/PEEF resources).

#### [MODIFY] [SitemapModal.jsx](file:///c:/Users/Admin/Downloads/Career-Path/Career-Path/Frontend/src/components/SitemapModal.jsx)
- Ensure Decision Helper route `/user/decision-helper` is explicitly highlighted in the User Panel sitemap.

---

### Backend & Seeder

#### [MODIFY] [demoSeeder.js](file:///c:/Users/Admin/Downloads/Career-Path/Career-Path/Server/demoSeeder.js)
#### [MODIFY] [seeder.js](file:///c:/Users/Admin/Downloads/Career-Path/Career-Path/Server/seeder.js)
- Update database seed scripts with Pakistani universities (NUST, FAST, LUMS, UET, COMSATS), PKR salaries, and Pakistani student/graduate personas.

---

### Documentation

#### [MODIFY] [CONTEST_PLAN.md](file:///c:/Users/Admin/Downloads/Career-Path/Career-Path/CONTEST_PLAN.md)
- Complete rewrite tailored to **TechWiz 6 (Aptech)** and **Pakistan**.

#### [MODIFY] [README.md](file:///c:/Users/Admin/Downloads/Career-Path/Career-Path/README.md)
- Update README for TechWiz 6 and Pakistan career guidance ecosystem.

---

## Verification Plan

### Automated Tests
- Run `npm run build` in `Frontend/` to ensure clean React compilation with no syntax or type errors.

### Manual Verification
- Verify `/user/decision-helper` renders cleanly without blank screen.
- Verify side-by-side comparison of 2 careers across 11 weighted axes in PKR currency.
- Verify sitemap modal includes Decision Helper.
