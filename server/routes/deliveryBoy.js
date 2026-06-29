import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import DeliveryBoy from "../models/DeliveryBoy.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get(
  "/pending",
  authMiddleware,
  async (req, res) => {
    try {
      const deliveryBoys =
        await DeliveryBoy.find({
          status: true,
          verificationStatus:
            "Pending",
        }).sort({
          createdAt: -1,
        });

      res.json(deliveryBoys);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// GET ALL
router.get("/", authMiddleware, async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find({
      status: true,
    }).sort({
      createdAt: -1,
    });

    res.json(deliveryBoys);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const deliveryBoy =
        await DeliveryBoy.findById(
          req.user.id
        ).select("-password");

      res.json(deliveryBoy);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// GET ONE
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findOne({
      _id: req.params.id,
      status: true,
    });

    if (!deliveryBoy) {
      return res.status(404).json({
        message: "Delivery boy not found",
      });
    }

    res.json(deliveryBoy);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// CREATE
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
    { name: "drivingLicenseImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const existingDeliveryBoy =
        await DeliveryBoy.findOne({
          $or: [
            { email: req.body.email },
            { mobile: req.body.mobile },
            {
              aadhaarNumber:
                req.body.aadhaarNumber,
            },
            {
              panNumber:
                req.body.panNumber,
            },
            {
              drivingLicenseNumber:
                req.body.drivingLicenseNumber,
            },
            {
              vehicleNumber:
                req.body.vehicleNumber,
            },
          ],
        });

      if (existingDeliveryBoy) {
        return res.status(400).json({
          message:
            "Delivery boy already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          req.body.password,
          10
        );

      const deliveryBoy =
        await DeliveryBoy.create({
          ...req.body,

          password: hashedPassword,

          photo:
            req.files?.photo?.[0]
              ?.filename || "",

          aadhaarImage:
            req.files
              ?.aadhaarImage?.[0]
              ?.filename || "",

          panImage:
            req.files
              ?.panImage?.[0]
              ?.filename || "",

          drivingLicenseImage:
            req.files
              ?.drivingLicenseImage?.[0]
              ?.filename || "",
        });

      res.status(201).json(
        deliveryBoy
      );
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const deliveryBoy = await DeliveryBoy.findOne({
      email,
      status: true,
    });

    if (!deliveryBoy) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      deliveryBoy.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (!deliveryBoy.isVerified) {
      return res.status(400).json({
        message:
          "Your account is not verified yet.",
      });
    }

    const token = jwt.sign(
      {
        id: deliveryBoy._id,
        role: "deliveryBoy",
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      deliveryBoy,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post(
  "/change-password",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        oldPassword,
        newPassword,
      } = req.body;

      const deliveryBoy =
        await DeliveryBoy.findById(
          req.user.id
        );

      const isMatch =
        await bcrypt.compare(
          oldPassword,
          deliveryBoy.password
        );

      if (!isMatch) {
        return res.status(400).json({
          message:
            "Old password is incorrect",
        });
      }

      deliveryBoy.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await deliveryBoy.save();

      res.json({
        message:
          "Password changed successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.post(
  "/toggle-availability",
  authMiddleware,
  async (req, res) => {
    try {
      const deliveryBoy =
        await DeliveryBoy.findById(
          req.user.id
        );

      deliveryBoy.isAvailable =
        !deliveryBoy.isAvailable;

      await deliveryBoy.save();

      res.json({
        message:
          "Availability updated",
        isAvailable:
          deliveryBoy.isAvailable,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.post(
  "/:id/approve",
  authMiddleware,
  async (req, res) => {
    try {
      const deliveryBoy =
        await DeliveryBoy.findById(
          req.params.id
        );

      if (!deliveryBoy) {
        return res.status(404).json({
          message:
            "Delivery Boy not found",
        });
      }

      deliveryBoy.isVerified = true;

      deliveryBoy.verificationStatus =
        "Approved";

      deliveryBoy.rejectionReason = "";

      await deliveryBoy.save();

      res.json({
        message:
          "Delivery Boy verified successfully",
        deliveryBoy,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.post(
  "/:id/reject",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        rejectionReason,
      } = req.body;

      const deliveryBoy =
        await DeliveryBoy.findById(
          req.params.id
        );

      if (!deliveryBoy) {
        return res.status(404).json({
          message:
            "Delivery Boy not found",
        });
      }

      deliveryBoy.isVerified = false;

      deliveryBoy.verificationStatus =
        "Rejected";

      deliveryBoy.rejectionReason =
        rejectionReason;

      await deliveryBoy.save();

      res.json({
        message:
          "Delivery Boy rejected",
        deliveryBoy,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// UPDATE
router.put(
  "/profile",
  authMiddleware,
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
      };

      if (
        req.files?.photo?.[0]
      ) {
        updateData.photo =
          req.files.photo[0].filename;
      }

      const deliveryBoy =
        await DeliveryBoy.findByIdAndUpdate(
          req.user.id,
          updateData,
          {
            new: true,
          }
        );

      res.json(deliveryBoy);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaarImage", maxCount: 1 },
    { name: "panImage", maxCount: 1 },
    {
      name: "drivingLicenseImage",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
      };

      if (req.body.password) {
        updateData.password =
          await bcrypt.hash(
            req.body.password,
            10
          );
      }

      if (
        req.files?.photo?.[0]
      ) {
        updateData.photo =
          req.files.photo[0].filename;
      }

      if (
        req.files
          ?.aadhaarImage?.[0]
      ) {
        updateData.aadhaarImage =
          req.files
            .aadhaarImage[0]
            .filename;
      }

      if (
        req.files
          ?.panImage?.[0]
      ) {
        updateData.panImage =
          req.files.panImage[0]
            .filename;
      }

      if (
        req.files
          ?.drivingLicenseImage?.[0]
      ) {
        updateData.drivingLicenseImage =
          req.files
            .drivingLicenseImage[0]
            .filename;
      }

      const deliveryBoy =
        await DeliveryBoy.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
          }
        );

      if (!deliveryBoy) {
        return res.status(404).json({
          message:
            "Delivery boy not found",
        });
      }

      res.json(deliveryBoy);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      await DeliveryBoy.findByIdAndUpdate(
        req.params.id,
        {
          status: false,
        }
      );

      res.json({
        message:
          "Delivery boy deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

export default router;