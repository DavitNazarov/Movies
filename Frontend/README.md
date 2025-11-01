# Frontend – Movies App

Modern React SPA built with Vite for the Movies MERN project. It consumes the Express API, talks to TMDB, and renders the complete browsing, profile, and admin experiences.

---

## ✨ Frontend Features

- Auth-aware navigation with dynamic dropdown and sidebar content
- Profile page for renaming the current user (using `/api/users/me`)
- Admin dashboard table with delete controls (powered by `/api/users/:id`)
- Responsive movie detail page with adaptive trailer embeds
- Search + genre browsing with TMDB data and cached breadcrumbs that display movie titles

---

## 🏗️ Stack

- React 19 + Vite 7
- React Router 7
- Tailwind CSS 4
- Radix UI primitives
- Axios & React Toastify
- Framer Motion animations

---

## 🔧 Setup

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000
VITE_TMDB_BEARER=<tmdb-read-access-token>
```

Run the app:

```bash
npm run dev
```

Build & preview:

```bash
npm run build
npm run preview
```

---

## 📂 Key Directories

- `src/pages/` – route components (Home, Movies, Profile, Dashboard…)
- `src/components/` – shared UI and movie widgets
- `src/context/AuthContext.jsx` – authentication provider + actions
- `src/api/tmdb.js` – TMDB SDK helper functions
- `src/lib/api.js` – Axios instance targeting the Express backend

---

## 🔁 Notable Workflows

- **Name change:** `Profile.index.jsx` posts to `/api/users/me` and updates context on success.
- **Admin deletes:** `Admin/Dashboard.jsx` lists users and issues `DELETE /api/users/:id` with optimistic UI updates.
- **Breadcrumb titles:** `components/ui/BreadCrumb.index.jsx` watches the route and fetches TMDB titles for `/movies/:id` paths.
- **Trailer sizing:** `MovieTrailer.jsx` observes container width to maintain a responsive 16:9 iframe on every device.

---

## ✅ Linting

Run ESLint (configured via `eslint.config.js`):

```bash
npm run lint
```

---

## 🙋 Need Help?

Check the root README for full-stack instructions or open an issue on the main repository.
