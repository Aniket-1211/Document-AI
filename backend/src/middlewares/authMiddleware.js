import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/auth.js";

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  const user = await User.findById(decoded.userId).select("-passwordHash");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  req.user = user;
  next();
});

export { protect };
