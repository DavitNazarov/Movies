# 🎬 Movies App

A production-ready **MERN** experience for exploring films, watching trailers, and managing user accounts. The project combines a secure Express API with a responsive React UI powered by live data from The Movie Database (TMDB).

---

## 🚀 Highlights

- 🔐 **Authentication flow** with session hydration, protected routes, and cookie-based logout that fully clears the client state.
- 🙋 **Profile management** so signed-in users can rename themselves from the new `/profile` screen.
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
| Data / APIs | MongoDB, TMDB API, SendGrid                             |

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
SENDGRID_API_KEY=<sendgrid-key>
EMAIL_FROM=<no-reply@example.com>
NODE_ENV=development
```

`Frontend/.env`

```
VITE_API_BASE_URL=http://localhost:5000
VITE_TMDB_BEARER=<tmdb-read-access-token>
```

### 3. Run Locally

```bash
# backend
cd Backend
npm run dev

# frontend (new terminal)
cd Frontend
npm run dev
```

Visit <http://localhost:5173>.

---

## 🔁 Key Workflows

- **Profile rename:** `PATCH /api/users/me` secured by `verifyToken`; the React profile screen uses optimistic updates and toast feedback.
- **Admin delete:** `DELETE /api/users/:id` restricted by `isAdmin`, surfaced in the dashboard table.
- **Breadcrumb titles:** On `/movies/:id` the UI fetches TMDB details and caches titles locally for human-friendly navigation.
- **Logout fix:** Server clears cookies with matching attributes (SameSite + secure), client clears context to avoid stale UI.

---

## 🧪 Helpful Commands

| Location    | Command           | Description                       |
| ----------- | ----------------- | --------------------------------- |
| `Backend/`  | `npm run dev`     | Start Express server with nodemon |
|             | `npm run start`   | Start in production mode          |
| `Frontend/` | `npm run dev`     | Vite dev server with HMR          |
|             | `npm run build`   | Production build                  |
|             | `npm run preview` | Preview built assets              |

---

## 🛟 Troubleshooting

- **CORS PATCH errors** – ensure the backend server has been restarted after updating the `cors` middleware (now includes `PATCH`).
- **Missing trailer video** – verify the TMDB bearer token has permissions for `/movie/{id}` with `append_to_response=videos`.
- **Cookies not set** – when testing via HTTPS ensure `NODE_ENV=production` so cookies use `SameSite="none"` and `secure=true`.

---

## 📬 Support & Contributions

Open issues or PRs are welcome. For questions reach out via GitHub issues.

Enjoy the movies! 🍿
