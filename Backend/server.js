import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.route.js"; // Importing auth routes

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json()); ////* allows me to parse incoming requests:req.body

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
