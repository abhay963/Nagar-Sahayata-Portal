 // models/report.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  problemType: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true }, // e.g. "Ranchi, Jharkhand"
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  imageBase64: { type: String }, // or image URL if using Cloudinary later
  status: { type: String, default: "Pending" },
  priority: {
    type: String,
    enum: ["Normal", "Medium", "High"],
    default: "Normal"
  },
  department: { 
    type: String, 
    required: true // ✅ Now department is mandatory for reports
  },
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.Mixed, ref: "User", default: null }
}, { timestamps: true });

// Pre-save middleware to handle userId
reportSchema.pre('save', function(next) {
  if (this.userId === "anonymous" || (typeof this.userId === 'string' && !mongoose.Types.ObjectId.isValid(this.userId))) {
    this.userId = null;
  }
  next();
});

export default mongoose.model("Report", reportSchema);
