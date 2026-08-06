import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async () => ({
    folder: "nagar-sahayata/reports",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    public_id: `report-${Date.now()}`,
  }),
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PNG, JPEG, JPG and WEBP images are allowed."
      )
    );
  }
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadReportImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (!err) return next();

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image must be 5MB or smaller.",
      });
    }

    if (
      err.http_code === 401 ||
      err.http_code === 403 ||
      err.name === "UnexpectedResponse"
    ) {
      return res.status(502).json({
        success: false,
        message:
          "Cloudinary upload failed. Please check Cloudinary configuration.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Image upload failed.",
    });
  });
};

export const uploadTaskImages = (req, res, next) => {
  upload.fields([
    {
      name: "resolvedImage",
      maxCount: 1,
    },
    {
      name: "unableImage",
      maxCount: 1,
    },
  ])(req, res, (err) => {
    if (!err) return next();

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Image must be 5MB or smaller.",
      });
    }

    if (
      err.http_code === 401 ||
      err.http_code === 403 ||
      err.name === "UnexpectedResponse"
    ) {
      return res.status(502).json({
        success: false,
        message:
          "Cloudinary upload failed. Please check Cloudinary configuration.",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message || "Image upload failed.",
    });
  });
};