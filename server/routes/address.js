import express from "express";
import Address from "../models/Address.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET ALL ADDRESSES
router.get("/", authMiddleware, async (req, res) => {
  try {
    const addresses = await Address.find({
      customer: req.user.id,
      status: true,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json(addresses);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// GET ONE ADDRESS
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      customer: req.user.id,
      status: true,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.json(address);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ADD ADDRESS
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.body.isDefault) {
      await Address.updateMany(
        {
          customer: req.user.id,
        },
        {
          isDefault: false,
        }
      );
    }

    const address = await Address.create({
      ...req.body,
      customer: req.user.id,
    });

    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// UPDATE ADDRESS
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.body.isDefault) {
      await Address.updateMany(
        {
          customer: req.user.id,
        },
        {
          isDefault: false,
        }
      );
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        customer: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.json(address);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// SET DEFAULT ADDRESS
router.post("/:id/default", authMiddleware, async (req, res) => {
  try {
    await Address.updateMany(
      {
        customer: req.user.id,
      },
      {
        isDefault: false,
      }
    );

    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        customer: req.user.id,
      },
      {
        isDefault: true,
      },
      {
        new: true,
      }
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.json({
      message: "Default address updated",
      address,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE ADDRESS (Soft Delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        customer: req.user.id,
      },
      {
        status: false,
      },
      {
        new: true,
      }
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.json({
      message: "Address deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;