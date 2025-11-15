# 🎬 Movies App

A production-ready **MERN** experience for exploring films, watching trailers, and managing user accounts. The project combines a secure Express API with a responsive React UI powered by live data from The Movie Database (TMDB).

---

## 🚀 Highlights

- 🔐 **Authentication flow** with session hydration, protected routes, and cookie-based logout that fully clears the client state.
- 🙋 **Profile management** so signed-in users can rename themselves from the new `/profile` screen.
- 📬 **Resend email pipeline** delivers verification, welcome, and admin escalation messages.
- 🧭 **Admin access & action requests** let users ask for elevated permissions while secondary admins escalate delete/promote actions to the super admin.
- 🛡️ **Admin dashboard** offering user deletion controls directly from the existing data table.
- 🔎 **Search & browsing** across genres, lazy-loaded routes, and dynamic breadcrumbs that render human-friendly movie titles instead of numeric IDs.
- 🎞️ **Responsive trailers** embedded with aspect ratio handling that adapts to every screen size.
- ✉️ **Email verification** pipeline and welcome messages for new accounts.
- ❤️ **Favourites system** so authenticated users can rate films, save them, and manage a responsive favourites collection under the primary navigation.
- 🌟 **Interactive five-star ratings** with hover previews and persisted user feedback that feed aggregate scores.
- 🎁 **Hero refresh** for the home page with fully responsive gradient cards, spotlight metrics, and curated strip badges.
- 🧾 **Rich admin tooling** that now includes direct status toggles (verify/promote) and enhanced request visibility with state-based row styling.
- 🧲 **Similar movies carousel** redesigned to match the global slider aesthetic, including year stamps and silky hover states.

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
- Email notifications are sent via Resend when requests are created and when a
  decision is made, using templates in `Backend/mail/templates/`. Configure
  `RESEND_API_KEY` (or `RESEND_API_TOKEN`) to enable deliveries; otherwise the
  system safely logs skipped emails.

---
