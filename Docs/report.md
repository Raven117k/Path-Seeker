# PathSeeker SRS Compliance Report

**Audit date:** 2026-08-27  
**SRS baseline:** `contest.pdf`, supplied 12-page Aptech TechWiz 6 specification  
**Repository:** Career-Path / PathSeeker  
**Overall status:** **Partially complete; not ready to claim full SRS compliance**

## Executive Summary

PathSeeker has a working full-stack foundation: React/Vite frontend, Express/MongoDB backend, JWT authentication, role-based user/admin shells, career data, quiz scoring, multimedia, stories, resources, feedback, notifications, bookmarks, admin CRUD, a Decision Helper, responsive CSS, and an authenticated AI copilot with persistent chat history.

The implementation covers most of the SRS's visible product areas, but a number of requirements are either partial, represented by static/demo behavior, contradicted by the documentation, or missing entirely. The strongest implemented differentiator is the 11-axis Decision Helper. The largest delivery risks are security configuration, offline claims, incomplete quiz interaction types, analytics/recommendation claims that are not backed by behavior data, and the absence of automated tests.

## Status Legend

- **Implemented:** Evidence of a working implementation exists in the repository.
- **Partial:** The feature exists, but important SRS behavior, validation, persistence, or UX is incomplete.
- **Missing:** No meaningful implementation was found.
- **Risk:** Implemented foundation exists, but the current behavior or configuration is unsafe or misleading.

## Requirement Matrix

| SRS area | Status | Current evidence | Remaining work |
|---|---|---|---|
| Background, purpose, scope, Pakistani context | Partial | Product framing is documented in [README.md](README.md) and [CONTEST_PLAN.md](CONTEST_PLAN.md). | [Frontend/index.html](Frontend/index.html) still contains Tier-2 India wording. Align metadata and all remaining copy with Pakistan and TechWiz 6. |
| Role-based authentication | Partial | Registration, login, JWTs, roles, active-user checks, protected routes, password hashing, profile editing, and resume upload exist in [Server/Router.js](Server/Router.js), [Server/middleware/authMiddleware.js](Server/middleware/authMiddleware.js), [Server/controller/userController.js](Server/controller/userController.js), and [Frontend/src/components/AuthModal.jsx](Frontend/src/components/AuthModal.jsx). | Add production-grade validation, rate limiting, email verification, session revocation, and account lifecycle controls. |
| Forgot/reset password and OTP | Partial / Risk | Forgot/reset endpoints exist. | OTP is simulated and exposed in the response. Add an email provider and never return OTPs in production responses. |
| Personalized dashboard | Partial | [Frontend/src/pages/user/UserDashboard.jsx](Frontend/src/pages/user/UserDashboard.jsx) shows role greetings, quiz history, trending careers, top picks, and activity widgets. | Replace mostly role-based/static recommendations with quiz, bookmark, view, rating, and similarity data. Implement the promised personalized 90-day plan. |
| Career Bank | Partial | Career listing, detail views, domain/demand/salary/search filters, autocomplete route, saved filters, bookmarks, and admin career CRUD exist in [Frontend/src/pages/user/CareerBank.jsx](Frontend/src/pages/user/CareerBank.jsx), [Server/controller/careerController.js](Server/controller/careerController.js), and [Server/Router.js](Server/Router.js). | Add skill-match, maximum salary, province/location, pagination, debounced autocomplete, delete/rename/sync for saved preferences, and fix `skills` versus schema `requiredSkills` display mismatch. Remove remaining `$` labels where data is PKR. |
| Interest-based quiz | Partial | Timed quiz, scoring, domain results, history, recommended careers, and admin question CRUD exist in [Frontend/src/pages/user/InterestQuiz.jsx](Frontend/src/pages/user/InterestQuiz.jsx) and [Server/controller/quizController.js](Server/controller/quizController.js). | Implement the model-supported slider, Likert, and multi-select UI/scoring. Validate unanswered/invalid submissions. Ensure fallback results are not presented as persisted live results. |
| Career recommendations and roadmap | Partial | Career roadmap steps exist in [Server/models/Career.js](Server/models/Career.js) and admin forms. | Generate a user-specific 90-day plan with phases, weekly tasks, linked resources, and quiz/profile rationale. Current roadmap data is not consistently a 90-day plan. |
| Multimedia Center | Partial | Listing, filters, detail views, embedded video/audio, transcripts, views, ratings, and admin CRUD exist in [Frontend/src/pages/user/MultimediaCenter.jsx](Frontend/src/pages/user/MultimediaCenter.jsx) and [Server/controller/multimediaController.js](Server/controller/multimediaController.js). | Implement likes and bookmarks, rating deduplication, related-content recommendations, media moderation, and expose the currently hidden featured section. |
| Success Stories Hub | Partial | Public approved stories, user story endpoint, and admin approve/feature/delete workflow exist in [Server/controller/storyController.js](Server/controller/storyController.js) and [Frontend/src/pages/admin/ManageStories.jsx](Frontend/src/pages/admin/ManageStories.jsx). | Add the authenticated submission UI, explicit “what I wish I knew” field, edit workflow, validation, and better user-owned story management. |
| Resource Library | Partial | Search/filtering, preview text, download tracking, public display, and admin CRUD exist in [Frontend/src/pages/guest/GuestResources.jsx](Frontend/src/pages/guest/GuestResources.jsx) and [Server/controller/resourceController.js](Server/controller/resourceController.js). | Add verified file upload/storage, safe file validation, province/government-scheme filters, and offline download handling. |
| Feedback and analytics | Implemented / Partial | User feedback submission/history, admin inbox, category/sentiment display, responses, and notifications exist in [Frontend/src/pages/user/FeedbackAndSupport.jsx](Frontend/src/pages/user/FeedbackAndSupport.jsx), [Frontend/src/pages/admin/ManageFeedback.jsx](Frontend/src/pages/admin/ManageFeedback.jsx), and [Server/controller/feedbackController.js](Server/controller/feedbackController.js). | Sentiment is a keyword heuristic. Add trend, funnel, resolution-time, export, and product analytics if those SRS expectations are required. |
| Notifications | Implemented | Notification list, unread count, mark-all-read, feedback replies, and admin broadcasts exist in [Frontend/src/components/NotificationDrawer.jsx](Frontend/src/components/NotificationDrawer.jsx) and [Server/controller/bookmarkController.js](Server/controller/bookmarkController.js). | Add notification preferences, per-notification read state, push/email channels, and robust fallback behavior. |
| Bookmarks and sticky notes | Implemented / Partial | Career/resource bookmarks, notes, update/delete, and user-owned queries exist in [Frontend/src/pages/user/BookmarksAndNotes.jsx](Frontend/src/pages/user/BookmarksAndNotes.jsx) and [Server/controller/bookmarkController.js](Server/controller/bookmarkController.js). | Add the database compound unique index, import/export lifecycle, and bookmark-driven recommendations. |
| Sharing and PDF export | Partial | The UI offers a print-based export path. | Replace `window.print()` with real PDF generation/download, shareable comparison URLs, Web Share support, and explicit sharing permissions. |
| Admin control panel | Partial | Admin routes and screens cover users, careers, quiz questions, multimedia, stories, resources, feedback, and settings in [Frontend/src/App.jsx](Frontend/src/App.jsx), [Frontend/src/pages/admin](Frontend/src/pages/admin), and [Server/Router.js](Server/Router.js). | Add user create/delete, story editing, resource uploads, stronger validation, and safer update payloads. |
| Admin analytics | Partial | Dashboard counts, role breakdown, quiz-domain counts, feedback totals, and Recharts visualizations exist in [Frontend/src/pages/admin/AdminDashboard.jsx](Frontend/src/pages/admin/AdminDashboard.jsx) and [Server/controller/adminController.js](Server/controller/adminController.js). | Add real time-series growth, career views, media engagement, retention/conversion, export, and bounded aggregation queries. Current documentation overstates live analytics. |
| System intelligence | Risk | Quiz history exists. Some dashboard copy claims “If you liked this” and similarity behavior. | There is no predictive model, collaborative filtering, recent-view model, career similarity service, or behavior-based “if liked” engine. Remove unsupported claims or implement the underlying data and algorithms. |
| AI career copilot | Partial | Authenticated `POST /api/ai/chat`, profile/quiz/career/resource grounding, Gemini integration, fallback behavior, and UI rendering exist in [Server/controller/aiController.js](Server/controller/aiController.js), [Server/Router.js](Server/Router.js), and [Frontend/src/components/Chatbot.jsx](Frontend/src/components/Chatbot.jsx). | The documented Gemini function/tool-calling architecture was not implemented; context is sent directly in the prompt. Add controlled tools if required for production claims. |
| Persistent AI chat history | Implemented / Partial | [Server/models/ChatConversation.js](Server/models/ChatConversation.js), `GET /api/ai/history`, and chat persistence save one private bounded conversation per user. | Add reset/delete, pagination, retention policy, multi-conversation support, and concurrency handling. |
| Accessibility | Partial | Labels, semantic controls, focus-visible styles, theme switching, font-size switching, reduced-motion rules, and ARIA attributes exist across shared components and [Frontend/src/index.css](Frontend/src/index.css). | Add automated accessibility tests, audit small text/icon-only controls, replace alert-based feedback, verify keyboard focus in modals/drawers, and complete WCAG contrast/browser testing. |
| Responsive compatibility | Implemented / Partial | Shared mobile rules cover shells, grids, forms, tables, media, modals, and narrow viewports in [Frontend/src/index.css](Frontend/src/index.css). Browser checks found no horizontal overflow at 360px/375px and desktop widths. | Test every route at 360px, 375px, 390px, 600px, tablet, and landscape. Inline page styles remain fragile and should gradually be replaced with semantic classes. |
| Offline / PWA | Missing / Risk | `apiFetch` has session cache and opt-in static GET fallbacks. | There is no manifest, service worker, IndexedDB, offline queue, mutation replay, install support, or persistent offline cache. Either implement PWA behavior or remove “Works offline” claims from [GuestHome.jsx](Frontend/src/pages/guest/GuestHome.jsx) and [Footer.jsx](Frontend/src/components/Footer.jsx). |
| Security | Risk | JWT verification and role checks exist in [Server/middleware/authMiddleware.js](Server/middleware/authMiddleware.js). | Rotate the exposed Gemini key and database credentials, remove committed secrets, require a production JWT secret, restrict CORS, add rate limiting, request validation, security headers, upload MIME/size limits, and safer admin update handling. |
| Performance | Partial / Risk | Client timeout, session GET cache, static fallbacks, bounded AI queries, and some limits exist. | Add pagination/indexing strategy, compression/image optimization, bounded public queries, and aggregation-based admin analytics. Measure with Lighthouse and browser performance tools. |
| Browser compatibility | Partial | Vite SPA and responsive CSS target modern browsers. | Configure server fallback for direct BrowserRouter deep links and verify Chrome, Edge, and Firefox. |
| Interface/API contracts | Partial | REST routes are centralized in [Server/Router.js](Server/Router.js), with a shared frontend client in [Frontend/src/services/api.js](Frontend/src/services/api.js). | Add OpenAPI/schema documentation, consistent validation/error format, versioning, pagination contracts, and API tests. |
| Sitemap | Implemented | Sitemap modal and footer entry exist in [Frontend/src/components/SitemapModal.jsx](Frontend/src/components/SitemapModal.jsx) and [Frontend/src/components/Footer.jsx](Frontend/src/components/Footer.jsx). | Verify every current route, including AI chat-related user flows, is represented and clickable. |
| Documentation and deliverables | Partial | Root README, server README, plan, contest strategy, seeders, chatbot notes, and schema files exist. | Reconcile documentation with implementation, update stale “India”/offline/PDF/analytics claims, complete installation instructions, add test data and credentials documentation without exposing real secrets, and produce the required diagrams/demo video/report package. |

## SRS Non-Functional Review

### Safety and security

**Not complete.** The application has JWT and role protection, but production hardening is outstanding:

- Credentials and API secrets have existed in [Server/.env](Server/.env); rotate them and keep `.env` untracked.
- [Server/middleware/authMiddleware.js](Server/middleware/authMiddleware.js) contains a hardcoded JWT fallback.
- [Server/server.js](Server/server.js) currently permits wildcard CORS.
- There is no rate limiting, schema validation, security-header middleware, or upload size/MIME validation.
- Password-reset OTP behavior is development-only and must not disclose OTPs in production.

### Accessibility and user-friendliness

**Partially complete.** The app has responsive shells, labels, themes, font scaling, focus styles, and reduced-motion support. It still needs automated accessibility testing, a full keyboard/modal audit, better non-alert feedback, and a contrast review for small and muted text.

### Performance and availability

**Partially complete.** Static public fallbacks and session caching help availability, but this is not an offline application. Several endpoints and admin analytics can load large result sets into memory. There is no verified Lighthouse baseline or browser compatibility matrix.

### Scalability

**Partially complete.** The separation between frontend API calls, Express controllers, and Mongoose models is appropriate for an MVP. Pagination, indexes, bounded queries, aggregation, file storage, rate limiting, and structured validation are needed before production growth.

## Documentation Drift Found

1. [README.md](README.md) describes offline resilience, personalized recommendations, PDF export, analytics, and broader feature completeness more strongly than the code supports.
2. [CONTEST_PLAN.md](CONTEST_PLAN.md) still describes the AI chat counsellor as out of scope even though the project now contains an AI copilot and persistent chat history.
3. [Frontend/index.html](Frontend/index.html) contains Tier-2 India wording.
4. [Frontend/README.md](Frontend/README.md) remains largely the Vite starter document.
5. Server route/model documentation was updated for AI chat, but the full project README still lists an outdated model count and incomplete API inventory in places.

## Highest-Priority Remaining Work

### P0: Before public/demo deployment

1. Rotate the exposed MongoDB and Gemini credentials; remove secrets from tracked files and configure deployment secrets.
2. Set a strong production `JWT_SECRET`; remove or isolate the hardcoded fallback.
3. Restrict CORS to the deployed frontend origin.
4. Add request validation, rate limiting, upload limits, and security headers.
5. Fix PKR currency labels and the `skills`/`requiredSkills` mismatch.
6. Add backend/API tests and replace the placeholder backend test script.
7. Decide whether to implement real PWA/offline support or remove unsupported offline claims.

### P1: To satisfy the functional SRS more fully

1. Implement all quiz question types and robust answer validation.
2. Build a real personalized 90-day roadmap linked to careers/resources.
3. Add the user-facing success-story submission flow.
4. Implement actual PDF/share/export behavior.
5. Replace static/copy-only recommendations with behavior-backed recommendation logic.
6. Expand admin analytics using bounded database aggregation and time-series data.
7. Add bookmark-driven and “if you liked this” recommendations.

### P2: Polish and operational completeness

1. Add notification preferences and richer delivery channels.
2. Add career filter persistence to the user account, with deletion/renaming.
3. Add multi-conversation AI history, reset, retention, and export.
4. Add OpenAPI documentation and a consistent error contract.
5. Run Lighthouse and browser matrix testing; record results in the final submission report.
6. Reconcile all README, plan, metadata, and contest claims with verified behavior.

## Verification Performed

- Inspected the supplied SRS text and repository `contest.pdf` presence.
- Audited frontend pages/components/services and backend routes/controllers/models.
- Frontend production build: **passes** with an existing bundle-size warning.
- Editor diagnostics for recently changed areas: **no errors reported**.
- Focused responsive browser checks at 360px/375px and desktop widths: **no horizontal overflow detected**.
- Frontend full lint: **fails on existing repository-wide issues** (reported previously as 148 errors and 12 warnings).
- Backend test script: **not implemented**; `npm test` is a placeholder that exits unsuccessfully.

## Final Verdict

PathSeeker is a strong, functional MVP and satisfies a substantial portion of the visible SRS. It is **not yet fully compliant** because multiple requirements are only partial, several advanced claims are not implemented, offline support is absent, security hardening is incomplete, and the required delivery/testing evidence is missing.

For a convincing submission, present the working core honestly: role-based career guidance, quiz, Career Bank, Decision Helper, resources, multimedia, stories, admin control, responsive UI, and AI copilot. Before calling it complete, address the P0 security and contract mismatches, then either implement or explicitly scope the offline, recommendation, analytics, sharing, and advanced quiz requirements.
