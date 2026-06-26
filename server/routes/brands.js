import express from "express";
import Brand from "../models/Brand.js";
import authMiddleware from "../middleware/authMiddleware.js";
import crypto from "crypto";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const existingBrand = await Brand.findOne({
      name: {
        $regex: new RegExp(`^${req.body.name.trim()}$`, "i"),
      },
      category: req.body.category,
    });

    if (existingBrand) {
      if (!existingBrand.status) {
        existingBrand.status = true;

        await existingBrand.save();

        return res.status(200).json({
          message: "Brand reactivated",
          brand: existingBrand,
        });
      }

      return res.status(400).json({
        message: "Brand already exists",
      });
    }

    const brand = await Brand.create({
      ...req.body,
      brandCode: `BRD-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
    });

    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const brands = await Brand.find({}).populate("category");

    res.json(brands);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/category/:categoryId", authMiddleware, async (req, res) => {
  try {
    const brands = await Brand.find({
      category: req.params.categoryId,
      status: true,
    });

    res.json(brands);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  const brand = await Brand.findById(req.params.id).populate("category", "name");
  res.json(brand);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json(brand);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Brand.findByIdAndUpdate(req.params.id, {
    status: false,
  });

  res.json({
    message: "Brand deleted",
  });
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { search = "" } = req.query;

    const brands = await Brand.find({
      status: true,

      name: {
        $regex: search,
        $options: "i",
      },
    }).populate("category");

    res.json(brands);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;
