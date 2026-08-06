import upload from "./upload.js";

const handleProfileImageUpload = (req, res, next) => {
  upload.single("profileImage")(req, res, (err) => {
    if (!err) return next();

    console.log("========= MULTER ERROR =========");
    console.log(err);
    console.log("name:", err.name);
    console.log("message:", err.message);
    console.log("code:", err.code);
    console.log("http_code:", err.http_code);
    console.log("===============================");

    return res.status(400).json({
      success: false,
      message: err.message || "Image upload failed.",
    });
  });
};

export default handleProfileImageUpload;