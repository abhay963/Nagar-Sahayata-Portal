import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";


// ================= CLOUDINARY STORAGE =================

const storage = new CloudinaryStorage({

  cloudinary,

  params: async (req, file) => ({

    folder: "nagar-sahayata/profile-images",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    public_id: `upload-${Date.now()}`,
  }),
});


// ================= FILE FILTER =================

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
        "Only PNG, JPEG, JPG, WEBP files are allowed"
      )
    );
  }
};


// ================= MULTER =================

const upload = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default upload;