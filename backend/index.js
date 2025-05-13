import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import adminSettingsRoutes from "./routes/adminSettingsRoutes.js";
import morgan from "morgan";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(express.json());

// Set up CORS for deployment
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:3000",
      "https://sports-website-1.onrender.com",
      "https://sports-website-r0ec.onrender.com",
      "https://sportswebsite-dgjyy690z-sairajbs-projects.vercel.app",
    ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/admin/stats", statsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/elevate", registrationRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/admin", adminSettingsRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the server! API is running.");
});

// MongoDB Connection
const mongoURI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sports_portal";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
