// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendOtp from "../utils/sendOtp.js";
import DeliveryBoy from "../models/DeliveryBoy.js";

const router = express.Router();

const generateTokens = (account, role) => {
  const accessToken = jwt.sign(
    {
      id: account._id,
      role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    {
      id: account._id,
      role,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};

// Post /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["customer", "shop"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const existingUser = await User.findOne({
      email,
      role,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// POST /auth/login
// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!["customer", "shop", "deliveryPartner"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    let account;

    // -----------------------------
    // Customer / Shop Login
    // -----------------------------
    if (role === "customer" || role === "shop") {
      account = await User.findOne({
        email,
        role,
      });

      if (!account) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const match = await account.comparePassword(password);

      if (!match) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
    }

    // -----------------------------
    // Delivery Partner Login
    // -----------------------------
    if (role === "deliveryPartner") {
      account = await DeliveryBoy.findOne({
        email,
        status: true,
      });

      if (!account) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      if (!account.isVerified) {
        return res.status(403).json({
          message: "Your account is not verified yet.",
        });
      }

      const match = await account.comparePassword(password);

      if (!match) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }
    }

    // -----------------------------
    // Generate OTP
    // -----------------------------

    const code = crypto.randomInt(100000, 999999).toString();

    await Otp.deleteMany({
      email,
      role,
    });

    await Otp.create({
      email,
      role,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendOtp(email, code);

    res.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

// POST /auth/verify-otp
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, role } = req.body;
    console.log(req.body)
    if (!["customer", "shop", "deliveryPartner"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const record = await Otp.findOne({
      email,
      role,
      code: otp,
    });

    if (!record) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    await Otp.deleteMany({
      email,
      role,
    });

    let account;

    if (role === "deliveryPartner") {
      account = await DeliveryBoy.findOne({
        email,
        status: true,
      });

      if (!account) {
        return res.status(404).json({
          message: "Delivery Partner not found",
        });
      }

      if (!account.isVerified) {
        return res.status(403).json({
          message: "Delivery Partner is not verified",
        });
      }
    } else {
      account = await User.findOne({
        email,
        role,
      });

      if (!account) {
        return res.status(404).json({
          message: "User not found",
        });
      }
    }

    const { accessToken, refreshToken } = generateTokens(
      account,
      role
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      role,
      user: {
        _id: account._id,
        name: account.name,
        email: account.email,
        role,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// POST /auth/refresh
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    let account;

    if (decoded.role === "deliveryPartner") {
      account = await DeliveryBoy.findById(decoded.id);

      if (!account) {
        return res.status(401).json({
          message: "Delivery Partner not found",
        });
      }

      if (!account.isVerified) {
        return res.status(403).json({
          message: "Delivery Partner not verified",
        });
      }
    } else {
      account = await User.findById(decoded.id);

      if (!account) {
        return res.status(401).json({
          message: "User not found",
        });
      }
    }

    const { accessToken, refreshToken } =
      generateTokens(account, decoded.role);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      role: decoded.role,
      user: {
        _id: account._id,
        name: account.name,
        email: account.email,
        role: decoded.role,
      },
    });
  } catch (err) {
    res.status(401).json({
      message: "Invalid refresh token",
    });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
});

export default router;
