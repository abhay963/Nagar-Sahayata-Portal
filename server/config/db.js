import mongoose from "mongoose";

export const connectAuthDB = async () => {
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