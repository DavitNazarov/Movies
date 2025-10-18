import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./db/connectDB.js";
import { User } from "./model/User.model.js";
import usersRouter from "./routes/users.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//  __dirname logic
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRouter);

app.get("/api/auth/me", async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Unauthenticated" });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId).select(
      "_id name email imageUrl isAdmin isVerified"
    );
    if (!user) return res.status(401).json({ error: "Unauthenticated" });
    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

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
