# 🎬 Movies App

A production-ready **MERN** experience for exploring films, watching trailers, and managing user accounts. The project combines a secure Express API with a responsive React UI powered by live data from The Movie Database (TMDB).

---

## 🚀 Highlights

- 🔐 **Authentication flow** with session hydration, protected routes, and cookie-based logout that fully clears the client state.
- 🙋 **Profile management** so signed-in users can rename themselves from the new `/profile` screen.
- 📬 **Resend email pipeline** delivers verification, welcome, and admin escalation messages.
- 🧭 **Admin access & action requests** let users ask for elevated permissions while secondary admins escalate delete/promote actions to the super admin.
- 🛡️ **Admin dashboard** offering user deletion controls directly from the existing data table. Admins can only remove or make admin (removed "mark unverified" function). Each table has a manual refresh button - tables only refresh on button click or page reload (no automatic polling).
- 🔎 **Responsive search** - search input appears in the main page after welcome section on mobile, and in the sidebar on desktop.
- 🎞️ **Responsive trailers** embedded with aspect ratio handling that adapts to every screen size.
- ✉️ **Email verification** pipeline and welcome messages for new accounts.
- ❤️ **Favourites system** (renamed from Portfolio) so authenticated users can rate films, save them, and manage a responsive favourites collection under the primary navigation.
- 🌟 **Interactive five-star ratings** with hover previews and persisted user feedback that feed aggregate scores.
- 🎁 **Hero refresh** for the home page with fully responsive gradient cards, spotlight metrics, and curated strip badges.
- 🧾 **Rich admin tooling** with enhanced request visibility and state-based row styling. Admin status now shows "Made by super admin" when promoted directly without a request. History modals for viewing past requests (last 30 days), user management modal with search functionality, and manual refresh buttons on all tables.
- 🧲 **Similar movies carousel** redesigned to match the global slider aesthetic, including year stamps and silky hover states.
- 📢 **Ad banner system** - logged-in users can request to display ads in banner sections between movie rows. Ads include image (URL or file upload), link URL, start/end dates, and are automatically shown/hidden based on dates. Super admin can approve/decline/deactivate requests in the dashboard, while other admins can view but not act. Overlapping date validation prevents conflicts, and deactivated ads are excluded from availability checks.

---

## 🧱 Tech Stack

| Layer       | Technologies                                            |
| ----------- | ------------------------------------------------------- |
| Frontend    | React 19, Vite 7, Tailwind CSS, Radix UI, Framer Motion |
| Backend     | Node.js 20, Express 4, Mongoose, JWT, bcryptjs          |
| Data / APIs | MongoDB, TMDB API, Resend                               |

---

## 🗂️ Project Structure

```
Movies/
├── Backend/          # Express API
│   ├── controllers/  # Auth logic, email templates
│   ├── routes/       # REST endpoints (auth, users)
│   └── server.js     # App bootstrap & CORS setup
├── Frontend/         # Vite + React SPA
│   ├── src/
│   │   ├── pages/    # Views (Home, Movies, Profile, Admin Dashboard, ...)
│   │   ├── components/ # Reusable UI, navigation, movie widgets
│   │   └── context/  # Auth context provider
└── README.md         # You are here
```

---

## ⚙️ Setup

### 1. Clone & Install

```bash
git clone https://github.com/DavitNazarov/Movies.git
cd Movies

# install backend dependencies + tooling
npm install

# install frontend packages
cd Frontend
npm install

# return to project root when you're done
cd ..
```

### 2. Environment Variables

Create `.env` files in both apps.

`Backend/.env`

```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
RESEND_API_KEY=<your-resend-api-key>
# Optional fallbacks:
# RESEND_API_TOKEN=<alternative-resend-token>
# RESEND_FROM_EMAIL="Movie Hub <no-reply@yourdomain.com>"
SUPERADMIN_FALLBACK_EMAIL=<optional-backup-email>
APP_URL=https://moviedb-ch39.onrender.com
APP_DASHBOARD_URL=https://moviedb-ch39.onrender.com/dashboard
NODE_ENV=development
```

`Frontend/.env`

```
VITE_API_BASE_URL=http://localhost:5000
VITE_TMDB_BEARER=<tmdb-read-access-token>
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p/w
```

> ℹ️ Generate a TMDB read access token from your TMDB account. The image URL
> prefix should end with `/w` so the app can append sizes such as `500`.

### 3. Run the App

```bash
# from the project root
npm run dev
```

The root `npm run dev` script starts the Express API (via `npm run server`) and
the Vite frontend (via `npm run client`) together. In production the Express
server serves the prebuilt frontend out of `Backend/dist`.

---

## 🔗 API Overview

- `POST /api/auth/signUp` – register users, auto-verifies, and sends a welcome
  email through Resend.
- `POST /api/auth/login` / `POST /api/auth/logout` – session cookies managed on
  the server with HTTP-only tokens.
- `GET /api/auth/me` – hydrates the client session; protected by the
  `verifyToken` middleware.
- `PATCH /api/users/me` – update the signed-in user's profile name.
- `POST /api/users/me/admin-request` – allow regular users to request admin
  access; tracked on the user document.
- `GET /api/users` – admin-only user listing for the dashboard.
- `POST /api/users/:id/admin-request` – super admin approves or rejects pending
  self-elevation requests.
- `DELETE /api/users/:id` – super admin deletes users (with guardrails against
  removing the super admin record).
- `/api/admin-requests` – endpoints for creating, reviewing, and resolving
  admin action requests between admins and the super admin.
- `POST /api/ad-requests` – logged-in users can submit ad banner requests with image (URL or file upload), link URL, and date range. Validates for overlapping dates and prevents conflicts.
- `GET /api/ad-requests` – admin-only listing of all ad requests.
- `GET /api/ad-requests/active` – public endpoint to get currently active ads (approved and within date range, excluding deactivated).
- `GET /api/ad-requests/unavailable-dates` – get unavailable date ranges for date picker validation (only approved ads).
- `GET /api/ad-requests/me` – get current user's ad requests.
- `POST /api/ad-requests/:id/decision` – super admin approves or declines ad requests.
- `POST /api/ad-requests/:id/deactivate` – super admin deactivates an active ad, making its time slot available again.

---

## 🧰 Admin Workflows

- `AdminActionRequest` documents capture escalations from regular admins who
  need a super admin to delete, promote, or demote another user. Each request
  stores requester/target snapshots, message history, and timestamps for audit
  trails. See `Backend/model/AdminActionRequest.model.js`.
- Secondary admins use the dashboard to submit requests. Duplicate pending
  requests are blocked, and super admin identities are protected so they cannot
  be targeted or demoted.
- Super admins resolve requests at `/api/admin-requests/:id/decision`, which in
  turn updates the MongoDB user document (promoting, demoting, or deleting) and
  records a `resolvedAt` timestamp plus optional response message.
- When a super admin makes a user admin directly (without a request), the status shows "Made by super admin" instead of "Approved" to distinguish from request-based promotions.
- Admin dashboard now only allows removing or making admin - the "mark unverified" function has been removed.
- **Table Refresh**: Each table (Users, Admin Requests, Ad Requests) has a refresh button at the top right. Tables only refresh on button click or page reload - no automatic polling intervals.
- **History Modals**: After 5 requests, all requests are moved to a "History" section accessible via a button below each table. History modals show requests from the last 30 days, and old requests are automatically deleted from the database after 30 days via a daily cron job.
- **User Management Modal**: If there are more than 10 users, a "View All Users" button appears, opening a modal with a searchable list of all users (search by name, email, or status). Users are not deleted after 30 days.
- Email notifications are sent via Resend when requests are created and when a
  decision is made, using templates in `Backend/mail/templates/`. Configure
  `RESEND_API_KEY` (or `RESEND_API_TOKEN`) to enable deliveries; otherwise the
  system safely logs skipped emails.

## 📢 Ad Banner System

- **Ad Request Model** (`Backend/model/AdRequest.model.js`) stores ad requests with image URL (or uploaded file path), link URL, start/end dates, and status (pending/approved/declined/deactivated).
- **⚠️ Important**: On Render.com's free tier, the filesystem is ephemeral - uploaded files are lost when the server restarts. For production, consider using cloud storage (AWS S3, Cloudinary) or use image URLs instead of file uploads.
- **User Flow**:
  - Logged-in users can submit ad requests from the Profile page (`/profile`).
  - Users can provide either an image URL or upload an image file (one is required).
  - Users must provide a link URL where users will be redirected when clicking the banner.
  - Users select start and end dates using a custom date picker that visually indicates unavailable time slots.
  - The system prevents overlapping date ranges - if another approved ad is active during the selected time, the user receives a generic error message.
  - Unavailable date ranges are fetched from the backend and displayed in the date picker.
- **Admin Flow**:
  - Super admins can approve, decline, or deactivate active ads in the Admin Dashboard.
  - Other admins can view ad requests but cannot take action.
  - Deactivated ads are immediately excluded from availability checks, making their time slots available again.
- **Display Logic**:
  - Active ads (approved and within date range, excluding deactivated) are automatically displayed in banner sections between movie rows on the home page.
  - The system shows countdown information (e.g., "expires in 1 hour") for the current ad.
  - If another user has a scheduled ad, it shows when it will start (e.g., "user2's ad starts in 1 hour").
  - After an ad expires, the next scheduled ad automatically appears.
  - Clicking an active banner redirects users to the specified link URL.
- **Banner Placement**: Ad banners appear only under Popular Movies on the home page.
- **History**: Ad requests older than 5 entries are moved to a History modal showing the last 30 days. Old requests are automatically deleted after 30 days via a daily cron job.

---
