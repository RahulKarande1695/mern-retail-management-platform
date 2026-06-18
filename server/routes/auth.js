// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendOtp from "../utils/sendOtp.js";

const router = express.Router();

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// Post /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } =
      req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // Generate and save OTP
    const code = crypto.randomInt(100000, 999999).toString();
    await Otp.deleteMany({ email }); // clear old OTPs
    await Otp.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await sendOtp(email, code);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
  console.error("LOGIN ERROR:", err);

  res.status(500).json({
    message: err.message,
  });
}
});

// POST /auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await Otp.findOne({ email, code: otp });
    if (!record) return res.status(400).json({ message: "Invalid or expired OTP" });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    await Otp.deleteMany({ email }); // consume OTP

    const user = await User.findOne({ email });
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Refresh token → httpOnly cookie (can't be read by JS)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/refresh
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken } = generateTokens(decoded.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

export default router;