import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db";

// Connect to MongoDB
import path from "path";
import fs from "fs";

// Connect to MongoDB
connectDB();

const app = express();

// Ensure upload directory exists for static serving
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Static Files
app.use("/uploads", express.static(uploadDir));

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://localhost:3001",
      "http://72.62.226.36:3000",
      "http://72.62.226.36",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// API Routes Imports
import authRoutes from "./routes/authRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import therapistRoutes from "./routes/therapistRoutes";
import userRoutes from "./routes/userRoutes";
import blogRoutes from "./routes/blogRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import adminRoutes from "./routes/adminRoutes";
import eventRoutes from "./routes/eventRoutes";

// API Routes setup
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/users/therapists", therapistRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);

// Basic Route for testing
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "API is running" });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.use((req, res) => {
  res.send("Hello World from the backend!");
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
