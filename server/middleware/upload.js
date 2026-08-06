import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async () => ({
    folder: "nagar-sahayata/profile-images",

    resource_type: "image",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],

    public_id: `profile-${Date.now()}`,
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
    fileSize: 2 * 1024 * 1024,
  },
});

export default upload;