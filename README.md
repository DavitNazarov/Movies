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

# install root deps (linting hooks, etc.) if needed
npm install

# install backend & frontend packages
cd Backend && npm install
cd ../Frontend && npm install
```

### 2. Environment Variables

Create `.env` files in both apps.

`Backend/.env`

```
PORT=5000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
RESEND_API_KEY=<your-resend-api-key>
# Optional: only override if you have verified your own domain in Resend
# RESEND_FROM_EMAIL="Movie Hub <no-reply@yourdomain.com>"
SUPERADMIN_FALLBACK_EMAIL=<optional-backup-email>
APP_URL=https://moviedb-ch39.onrender.com
APP_DASHBOARD_URL=https://moviedb-ch39.onrender.com/dashboard
NODE_ENV=development
```

`
