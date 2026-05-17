import mongoose from "mongoose";


// ======================================================
// ================= SINGLE DATABASE ====================
// ======================================================

export const connectAuthDB =
  async () => {

    try {

      await mongoose.connect(
        process.env.MONGO_URI_AUTH
      );

      console.log(
        "✅ MongoDB Connected Successfully"
      );

    } catch (error) {

      console.error(
        "❌ MongoDB Connection Error:",
        error.message
      );

      process.exit(1);
    }
  };


// ======================================================
// ================= SAME CONNECTION ====================
// ======================================================

// Since now everything is inside
// same database (nagar_auth)

export const reportsConnection =
  mongoose;


// Dummy function so old code
// does not break

export const connectReportsDB =
  async () => {

    console.log(
      "✅ Reports using same Auth DB"
    );

    return mongoose;
  };