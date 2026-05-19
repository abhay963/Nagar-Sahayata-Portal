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

import userRoutes from "./routes/userRoutes.js";

import reportRoutes from "./routes/reportRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";


// ================= EXPRESS APP =================

const app = express();


// ================= MIDDLEWARE =================

app.use(

  cors({

    origin: [

      "http://localhost:5173",

      "https://nagar-sahayata-portal.vercel.app",
    ],

    credentials: true,
  })
);


app.use(

  express.json({

    limit: "50mb",
  })
);


app.use(

  express.urlencoded({

    extended: true,

    limit: "50mb",
  })
);


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
    "❌ SERVER ERROR:",
    err.message
  );

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

    await connectAuthDB();

    app.listen(PORT, () => {

      console.log(
        `🚀 Server running on port ${PORT}`
      );
    });

  } catch (error) {

    console.error(
      "❌ Failed to start server:",
      error.message
    );
  }
};


// ================= START APP =================

startServer();