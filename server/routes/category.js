import express from "express";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/authMiddleware.js";
import crypto from "crypto";
const router = express.Router();

// CREATE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const existingCategory = await Category.findOne({
      name: {
        $regex: new RegExp(`^${req.body.name.trim()}$`, "i"),
      },
    });

    if (existingCategory) {
      // Soft deleted asel tar reactivate
      if (!existingCategory.status) {
        existingCategory.status = true;

        existingCategory.description =
          req.body.description || existingCategory.description;

        await existingCategory.save();

        return res.status(200).json({
          message: "Category reactivated",
          category: existingCategory,
        });
      }

      // Already active
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      ...req.body,
      categoryCode: `CAT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// GET ALL
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search = "" } = req.query;

    const categories = await Category.find({
      name: {
        $regex: search,
        $options: "i",
      },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// GET ONE
router.get("/:id", authMiddleware, async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json(category);
});

// UPDATE
router.put("/:id", authMiddleware, async (req, res) => {
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(updated);
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, {
    status: false,
  });

  res.json({
    message: "Category deleted",
  });
});

export default router;
