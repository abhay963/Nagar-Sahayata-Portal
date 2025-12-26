import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { connectAuthDB, connectReportsDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import otpRoutes from "./routes/otpRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

connectAuthDB();
connectReportsDB();

app.use(cors());
app.use(express.json());

// Serve static folder for profile images
app.use("/uploads/profile-images", express.static(path.join(process.cwd(), "uploads/profile-images")));

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
