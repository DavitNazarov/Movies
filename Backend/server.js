import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./db/connectDB.js";
import usersRouter from "./routes/users.route.js";
import adminRequestsRouter from "./routes/adminRequests.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//  __dirname logic
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",
  "https://moviedb-ch39.onrender.com",
];
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow same-origin requests (no Origin header) and known domains
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRouter);
app.use("/api/admin-requests", adminRequestsRouter);

// ===== Serve React build =====
app.use(express.static(path.join(__dirname, "dist")));
app.get(/.*/, (_, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ===== Start server =====
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
