import express from "express";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==============================
// GET ALL NOTIFICATIONS
// ==============================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==============================
// MARK SINGLE NOTIFICATION READ
// ==============================

router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==============================
// MARK ALL READ
// ==============================

router.patch("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    res.json({
      message: "All notifications marked as read",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==============================
// DELETE SINGLE NOTIFICATION
// (Optional)
// ==============================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.json({
      message: "Notification deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;
