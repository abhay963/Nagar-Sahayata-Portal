// Import JWT library for token verification
import jwt from "jsonwebtoken";

// Import User model
import User from "../models/User.js";


// ================= AUTH MIDDLEWARE =================

// Middleware to protect private routes
// Checks JWT token before allowing access
export const protect = async (req, res, next) => {

  // Variable to store token
  let token;


  // ================= CHECK AUTH HEADER =================

  // Check if authorization header exists
  // and starts with "Bearer"
  //
  // Example:
  // Authorization: Bearer eyhshdhdh...
  if (

    req.headers.authorization &&

    req.headers.authorization.startsWith("Bearer")

  ) {

    try {

      // ================= GET TOKEN =================

      // Extract token from header
      token = req.headers.authorization.split(" ")[1];


      // ================= VERIFY TOKEN =================

      // Decode and verify JWT token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );


      // ================= GET USER =================

      // Find user from token payload
      // Exclude password field for security
      req.user = await User.findById(
        decoded.id
      ).select("-password");


      // ================= USER NOT FOUND =================

      // If token valid but user deleted
      if (!req.user) {

        return res.status(401).json({

          success: false,

          message: "User not found",
        });
      }


      // ================= CONTINUE =================

      // Allow request to continue
      next();

    } catch (error) {

      // ================= TOKEN ERROR =================

      console.error(
        "❌ Auth middleware error:",
        error.message
      );

      return res.status(401).json({

        success: false,

        message: "Not authorized, token failed",
      });
    }

  } else {

    // ================= NO TOKEN =================

    return res.status(401).json({

      success: false,

      message: "Not authorized, no token",
    });
  }
};