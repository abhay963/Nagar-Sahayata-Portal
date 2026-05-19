// ================= LOAD ENV FIRST =================

import "./config/env.js";


// ================= PACKAGE IMPORTS =================

import express from "express";

import cors from "cors";

import path from "path";


// ================= DB =================

import {
  connectAuthDB,
} from "./config/db.js";


// ================= ROUTES =================

import authRoutes from "./routes/auth.js";

import otpRoutes from "./routes/otpRoutes.js";

import userRoutes from "./routes/userRoutes.js";

import reportRoutes from "./routes/reportRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";


// ================= ENV DEBUG =================

console.log("\n===== ENV CHECK =====");

console.log(
  "CLOUDINARY_CLOUD_NAME:",
  process.env.CLOUDINARY_CLOUD_NAME
    ? "✅ FOUND"
    : "❌ MISSING"
);

console.log(
  "CLOUDINARY_API_KEY:",
  process.env.CLOUDINARY_API_KEY
    ? "✅ FOUND"
    : "❌ MISSING"
);

console.log(
  "CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET
    ? "✅ FOUND"
    : "❌ MISSING"
);

console.log(
  "MONGO_URI_AUTH:",
  process.env.MONGO_URI_AUTH
    ? "✅ FOUND"
    : "❌ MISSING"
);

console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET
    ? "✅ FOUND"
    : "❌ MISSING"
);

console.log("======================\n");


// ================= EXPRESS APP =================

const app = express();


// ================= MIDDLEWARE =================

app.use(cors({

  origin: [
    "http://localhost:5173",
    "https://nagar-sahayata-portal.vercel.app",
  ],

  credentials: true,
}));


app.use(express.json({

  limit: "50mb",
}));


app.use(express.urlencoded({

  extended: true,

  limit: "50mb",
}));


// ================= STATIC FILES =================

app.use(

  "/uploads/profile-images",

  express.static(

    path.join(
      process.cwd(),
      "uploads/profile-images"
    )
  )
);


// ================= API ROUTES =================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/otp",
  otpRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);


// ================= HEALTH CHECK =================

app.get("/", (req, res) => {

  res.status(200).json({

    success: true,

    message:
      "Nagar Sahayata Backend Running Successfully 🚀",
  });
});


// ================= 404 HANDLER =================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message: "Route not found",
  });
});


// ================= GLOBAL ERROR HANDLER =================

app.use((err, req, res, next) => {

  console.error(
    "\n❌ GLOBAL SERVER ERROR:"
  );

  console.error(err);

  res.status(
    err.status || 500
  ).json({

    success: false,

    message:
      err.message ||
      "Internal Server Error",
  });
});


// ================= PORT =================

const PORT =
  process.env.PORT || 5000;


// ================= START SERVER =================

const startServer = async () => {

  try {

    console.log(
      "\n🔄 Connecting Database..."
    );

    await connectAuthDB();

    console.log(
      "✅ MongoDB Connected Successfully"
    );

    app.listen(PORT, () => {

      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "\n❌ Failed to start server:"
    );

    console.error(error);
  }
};


// ================= START APP =================

startServer();