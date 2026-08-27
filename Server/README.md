# PathSeeker Server

Node 18 + Express 5 + Mongoose 9 REST API for the PathSeeker Career Passport.

## Quick start

```bash
cp .env.example .env
# fill in DB_URL and JWT_SECRET
npm install
node demoSeeder.js     # populate demo data (idempotent)
node server.js         # http://localhost:2408
```

The server mounts every controller under `/api/*` (a duplicate mount under `/` is kept for backward compat — do not rely on it).

## Environment

| Var | Required | Default | Notes |
|-----|----------|---------|-------|
| `DB_URL` | yes | — | MongoDB Atlas SRV string. |
| `PORT` | no | `2408` | Express listen port. |
| `JWT_SECRET` | yes in prod | hardcoded fallback in dev | The dev fallback is a security risk; production must set this. |
| `CORS_ORIGIN` | no | `http://localhost:5173` | Set to your exact front-end URL in production. |
| `RESEND_API_KEY` | production | — | Resend API key used for password-reset emails. |
| `RESEND_FROM_EMAIL` | production | — | Verified Resend sender, for example `PathSeeker <no-reply@example.com>`. |
| `CLOUDINARY_CLOUD_NAME` | for uploads | — | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | for uploads | — | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | for uploads | — | Cloudinary API secret; keep private. |
| `GEMINI_API_KEY` | no | — | Enables Gemini responses for the authenticated career copilot. Without it, the copilot uses grounded live-data fallback responses. |
| `GEMINI_MODEL` | no | `gemini-2.0-flash` | Gemini model name used by the copilot. |

## Demo accounts (after running `node demoSeeder.js`)

| Role | Email | Password |
|------|-------|----------|
| Student | `alex@student.com` | `password123` |
| Graduate | `sarah@graduate.com` | `password123` |
| Professional | `david@pro.com` | `password123` |
| Admin | `admin@pathseeker.com` | `password123` |

## Route map

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/api/sign-up` | public | Register; sets role + skills + education |
| POST | `/api/sign-in` | public | Returns `{ user, token }` |
| POST | `/api/ai/chat` | user | Body: `{ message, currentPage }`; uses profile, latest quiz, careers, and resources as controlled context |
| GET | `/api/ai/history` | user | Loads the authenticated user\'s saved conversation messages |
| POST | `/api/forgot-password` | public | Sends a password-reset OTP through Resend; local development returns a test code when Resend is not configured |
| POST | `/api/reset-password` | public | OTP + new password |
| POST | `/api/admin/upload` | admin | Multipart `file`; uploads images, video, audio, or PDFs to Cloudinary |
| GET  | `/api/profile` | user | Self profile |
| PUT  | `/api/profile` | user | Update profile (incl. resume PDF) |
| GET  | `/api/careers` | public | List (with filter via query) |
| GET  | `/api/careers/suggestions` | public | Typeahead |
| GET  | `/api/careers/:id` | public | Detail; auto-increments `viewsCount` |
| POST/PUT/DELETE | `/api/careers/:id` | admin | CRUD |
| GET  | `/api/quiz/questions` | public | With static fallback in client |
| POST | `/api/quiz/submit` | user | Returns scored result |
| GET  | `/api/quiz/history` | user | Previous attempts |
| POST/PUT/DELETE | `/api/quiz/questions/:id` | admin | CRUD |
| GET  | `/api/multimedia` | public | Filter by type/tag |
| GET  | `/api/multimedia/:id` | public | Detail |
| POST | `/api/multimedia/:id/rate` | user | Body: `{ rating }` |
| GET  | `/api/stories` | public | Approved + featured |
| POST | `/api/stories` | user | Submit new story (unapproved) |
| PUT/DELETE | `/api/admin/stories/:id` | admin | Approve/feature/delete |
| GET  | `/api/resources` | public | Filter |
| POST | `/api/resources/:id/download` | public | Increments counter |
| POST/PUT/DELETE | `/api/resources/:id` | admin | CRUD |
| GET/POST | `/api/feedback` | user | Submit + own feedback |
| PUT | `/api/admin/feedback/:id/respond` | admin | Reply + status update |
| GET  | `/api/bookmarks` | user | List with sticky notes |
| POST | `/api/bookmarks` | user | Create |
| PUT | `/api/bookmarks/:id/note` | user | Update sticky note |
| DELETE | `/api/bookmarks/:id` | user | Delete |
| GET  | `/api/notifications` | user | List |
| PUT  | `/api/notifications/read` | user | Mark all read |
| GET  | `/api/admin/dashboard-stats` | admin | Counts + sentiment + domains |
| GET  | `/api/admin/users` | admin | All users |
| PUT | `/api/admin/users/:id` | admin | Role + active toggle |
| POST | `/api/admin/broadcast` | admin | Push notification to all users |

## Data model

11 Mongoose models in `models/`:

- **User** — name, email (unique, lowercased), hashed password, role, contact, education, skills[], interests[], isActive, OTP reset fields
- **Career** — title, domain (enum), description, overview, requiredSkills[], educationPath, salaryRange{min,max,currency}, jobDemand (enum), targetAudience[], featured, trending, viewsCount, roadmap[{title, description, duration, level}]
- **QuizQuestion** — questionText, type (enum), category, timeLimitSeconds, options[{text, domainWeights{}}]
- **QuizResult** — user, scores{domain: weight}, topDomain, recommendedCareers[], answers[]
- **Bookmark** — user, itemType, itemId, stickyNote, category
- **Feedback** — user (denormalised userName/userEmail), category, sentiment, status, adminResponse
- **Resource** — title, type (enum), description, fileUrl, previewContent, tags[], targetAudience[], downloadCount
- **SuccessStory** — name, role, domain, avatar, summary, timeline[{stage, title, description}], approved, featured
- **Multimedia** — title, type (video|podcast|anim_explainer), url, thumbnailUrl, description, transcript, duration, tags[], ratingAvg/ratingSum/ratingCount, viewsCount, likesCount
- **Notification** — user, type, title, message, isRead, createdAt
- **ChatConversation** — one private conversation per user with embedded user/assistant messages

## Hardening checklist (post-hackathon)

- [ ] Move `JWT_SECRET` to a real secret manager (HashiCorp Vault / AWS Secrets Manager)
- [ ] Add rate limiting (`express-rate-limit`) — at minimum on `/sign-in` and `/forgot-password`
- [ ] Add request validation (`joi` or `zod`) on every POST/PUT
- [ ] Restrict CORS to the front-end origin
- [x] Store admin images, media, and PDFs in Cloudinary; resumes remain on the existing local route
- [ ] Add email delivery (SendGrid / Resend) for the OTP — current implementation returns the OTP in the response, which is a dev convenience only
- [ ] Add per-user rating dedup on multimedia
- [ ] Add `unique` compound index on `Bookmark(user, itemType, itemId)` to prevent duplicate bookmarks
- [ ] Batch the admin broadcast notification insertion (currently `insertMany` after loading all users into memory)

## Scripts

```bash
node server.js         # production
nodemon server.js      # dev (auto-reload)
node demoSeeder.js     # populate demo data
node seeder.js         # wipe + reseed from static fixtures (use only in dev)
```
