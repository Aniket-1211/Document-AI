import bcrypt from "bcryptjs";

import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  clearAuthCookie,
  createToken,
  getCookieOptions,
} from "../utils/auth.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists with this email",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  const token = createToken(user._id.toString());

  res.cookie("token", token, getCookieOptions());

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = createToken(user._id.toString());

  res.cookie("token", token, getCookieOptions());

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

export {
  register,
  login,
  logout,
  getCurrentUser,
};
