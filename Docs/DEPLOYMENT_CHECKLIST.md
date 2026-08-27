# PathSeeker Deployment Checklist

Use this checklist before deploying PathSeeker to production. Complete the sections in order.

## 1. Security First

- [ ] Rotate every credential that has been exposed during development or chat:
  - [ ] MongoDB password and connection string
  - [ ] Gemini API key
  - [ ] Resend API key
  - [ ] JWT secret
  - [ ] Cloudinary API secret, if exposed
- [ ] Confirm `Server/.env` is not committed.
- [ ] Confirm `Server/.env.example` contains placeholders only.
- [ ] Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

- [ ] Never place MongoDB, Gemini, Resend, or Cloudinary secrets in the frontend.
- [ ] Enable HTTPS on both frontend and backend.
- [ ] Confirm production uses `NODE_ENV=production`.

## 2. MongoDB Atlas

- [ ] Create or select the production MongoDB database.
- [ ] Create a database user with a strong password.
- [ ] Restrict Atlas network access to the deployed backend IP where possible.
- [ ] Avoid `0.0.0.0/0` except for temporary testing.
- [ ] Set the backend variable:

```env
DB_URL=mongodb+srv://...
```

- [ ] Run the demo seeder only on a demo database.
- [ ] Do not run `seeder.js` against production; it deletes collections.
- [ ] Confirm indexes are created, including the Bookmark compound unique index.

## 3. Cloudinary

- [ ] Create or select the production Cloudinary product environment.
- [ ] Copy the cloud name, API key, and API secret into backend hosting secrets.
- [ ] Configure:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

- [ ] In Cloudinary Console, open **Settings > Security**.
- [ ] Enable **Allow delivery of PDF and ZIP files** if using a free plan.
- [ ] Confirm admin uploads are sent to `/api/admin/upload`.
- [ ] Confirm uploaded PDFs use `raw/upload` URLs and retain `.pdf` extensions.
- [ ] Confirm uploaded images use `image/upload` URLs.
- [ ] Confirm video and audio use `video/upload` URLs.
- [ ] Test a small image, PDF, video, and audio upload.
- [ ] Test each uploaded asset from a logged-out user browser.
- [ ] Configure Cloudinary lifecycle cleanup before deleting or replacing assets at scale.

## 4. Resend Email

- [ ] Create a production Resend API key.
- [ ] Verify a domain in Resend for real recipient delivery.
- [ ] Configure a verified sender:

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=PathSeeker <no-reply@mail.yourdomain.com>
```

- [ ] Do not use `onboarding@resend.dev` for production recipients.
- [ ] Use `onboarding@resend.dev` only for account-owner testing.
- [ ] Request a password reset using a real production account.
- [ ] Confirm the email renders as HTML in Gmail and Outlook.
- [ ] Confirm the plain-text fallback is readable.
- [ ] Confirm OTP expires after 15 minutes.
- [ ] Confirm OTP is not returned in production API responses.
- [ ] Check Resend delivery logs and bounce handling.

## 5. Backend Configuration

Set these variables in the backend hosting provider, not in frontend files:

```env
NODE_ENV=production
PORT=2408
DB_URL=mongodb+srv://...
JWT_SECRET=<strong-random-secret>
CORS_ORIGIN=https://your-frontend-domain.com
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
RESEND_API_KEY=...
RESEND_FROM_EMAIL=PathSeeker <no-reply@mail.yourdomain.com>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

- [ ] Confirm the backend start command is `npm start`.
- [ ] Confirm the backend listens on the host-provided port when required.
- [ ] Confirm the production frontend origin is exact, including protocol.
- [ ] Do not use `CORS_ORIGIN=*` in production.
- [ ] Confirm health logs show MongoDB connected and server started.
- [ ] Confirm the backend is reachable at its public HTTPS URL.

## 6. Frontend Configuration

- [x] Frontend API URL is environment-driven in `Frontend/src/services/api.js`; configure it before deployment.
- [ ] Recommended frontend variable:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

For local Vite development with the proxy, optionally set:

```env
VITE_API_PROXY_TARGET=http://localhost:2408
```

- [ ] Ensure the frontend never receives server-only secrets.
- [ ] Build the frontend with:

```bash
cd Frontend
npm install
npm run build
```

- [ ] Deploy the generated `Frontend/dist` directory or use the configured Vite hosting workflow.
- [ ] Configure SPA fallback so direct URLs such as `/user/decision-helper` load `index.html`.
- [ ] Confirm the frontend can reach the backend through HTTPS.
- [ ] Confirm browser CORS errors do not appear.

## 7. Install and Build Verification

From the repository root:

```bash
cd Server
npm install
npm test
node --check server.js
node --check Router.js
node --check controller/uploadController.js
node --check services/cloudinaryService.js

cd ../Frontend
npm install
npm run build
```

Expected results:

- [ ] Backend contract tests pass.
- [ ] Backend syntax checks pass.
- [ ] Frontend production build passes.
- [ ] Any bundle-size warning is recorded, not ignored.
- [ ] No new editor diagnostics exist in changed files.

## 8. Database and Demo Content

- [ ] Confirm production careers have accurate Pakistani education paths and PKR salary ranges.
- [ ] Confirm production resources have real file URLs, not dummy PDF URLs.
- [ ] Confirm production multimedia records have valid URLs and thumbnails.
- [ ] Confirm approved stories contain only permitted personal information.
- [ ] Confirm admin account uses a unique production password.
- [ ] Disable or remove demo accounts before public launch.
- [ ] Confirm no test assets remain in Cloudinary.
- [ ] Confirm no test OTPs or demo secrets remain in logs.

## 9. Required Production Smoke Tests

### Public visitor

- [ ] Home page loads.
- [ ] Public careers load.
- [ ] Public stories load.
- [ ] Public resources load.
- [ ] Resource filtering works.
- [ ] A resource PDF opens/downloads successfully.
- [ ] No browser console errors appear.

### User

- [ ] Registration works.
- [ ] Login works.
- [ ] Logout works.
- [ ] Forgot-password request sends email.
- [ ] OTP reset works with a valid code.
- [ ] Invalid and expired OTPs are rejected.
- [ ] Profile update works.
- [ ] Resume upload works according to the selected storage policy.
- [ ] Quiz supports choice, slider, Likert, and multi-select questions.
- [ ] Unanswered quiz questions are rejected.
- [ ] Quiz results persist to history.
- [ ] Career Bank search and filters work.
- [ ] Decision Helper compares two careers.
- [ ] Multimedia playback and ratings work.
- [ ] Bookmarks and sticky notes persist.
- [ ] Feedback submission and history work.
- [ ] AI copilot loads only for authenticated users.
- [ ] AI chat history persists.

### Admin

- [ ] Admin login works.
- [ ] Non-admin users cannot access admin routes.
- [ ] User role/status updates work.
- [ ] Career CRUD works.
- [ ] Quiz question CRUD works.
- [ ] Multimedia CRUD works.
- [ ] Resource CRUD works.
- [ ] Story approval works.
- [ ] Feedback response sends an in-app notification.
- [ ] Broadcast notifications work.
- [ ] Image upload works.
- [ ] PDF upload returns a `raw/upload` Cloudinary URL with `.pdf`.
- [ ] Video/audio upload returns a `video/upload` URL.
- [ ] Uploaded resources and media are visible to users.

## 10. Browser and Responsive Checks

- [ ] Chrome desktop.
- [ ] Edge desktop.
- [ ] Firefox desktop.
- [ ] Mobile width 360px.
- [ ] Mobile width 375px.
- [ ] Mobile width 390px.
- [ ] Tablet width.
- [ ] Landscape mobile.
- [ ] No horizontal overflow.
- [ ] Keyboard navigation works for login, modals, drawers, forms, and download controls.
- [ ] Focus indicators remain visible.
- [ ] Reduced-motion preference is respected.

## 11. Monitoring and Operations

- [ ] Enable backend error logging without logging secrets, passwords, OTPs, or tokens.
- [ ] Monitor MongoDB connection failures.
- [ ] Monitor Resend delivery failures, bounces, and quota.
- [ ] Monitor Cloudinary upload failures, storage, bandwidth, and PDF delivery settings.
- [ ] Configure uptime monitoring for the backend health URL.
- [ ] Set alerts for repeated 401, 403, 429, and 5xx responses.
- [ ] Define a backup and rollback procedure.
- [ ] Document who can rotate each provider credential.
- [ ] Record the deployed frontend and backend URLs.

## 12. Known Limitations to Disclose

- [ ] Public GET fallback is not a full offline/PWA implementation.
- [ ] Recommendations are currently role- and quiz-aware, not a mature behavioral recommendation engine.
- [ ] PDF export is print-based rather than generated server-side.
- [ ] AI context is controlled prompt grounding, not full Gemini function/tool calling.
- [ ] Some analytics are operational counts rather than complete time-series product analytics.
- [ ] Resume storage remains separate from Cloudinary unless migrated.

## 13. Final Go/No-Go Gate

Deploy only when all of the following are true:

- [ ] All production secrets are rotated and stored securely.
- [ ] MongoDB production access is restricted.
- [ ] CORS points only to the production frontend.
- [ ] Cloudinary PDF delivery is enabled and tested.
- [ ] Resend sender/domain is verified and tested.
- [ ] Frontend uses the production API URL.
- [ ] SPA fallback is configured.
- [ ] Backend tests pass.
- [ ] Frontend build passes.
- [ ] Admin upload and user download are verified end to end.
- [ ] No demo credentials or dummy URLs remain.
- [ ] Rollback and credential rotation owners are documented.

**Release decision:** `GO / NO-GO`  
**Frontend URL:**  
**Backend URL:**  
**Deployment date:**  
**Verified by:**  
