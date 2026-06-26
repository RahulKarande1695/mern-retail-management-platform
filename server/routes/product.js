import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import crypto from "crypto";
const router = express.Router();

// CREATE
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
  const {
  category,
  brand,
  name,
  packSize,
} = req.body;
    const existingProduct =
  await Product.findOne({
    category,
    brand,
    name: {
      $regex: new RegExp(
        `^${name.trim()}$`,
        "i"
      ),
    },
    packSize,
  });
    if (existingProduct) {
      return res.status(400).json({
        message: "Product already exists",
      });
    }
    const product = await Product.create({
      ...req.body,
      image: req.file?.filename,
      productCode: `PRD-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
    });

    res.status(201).json(product);
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

    const products = await Product.find({
      name: {
        $regex: search,
        $options: "i",
      },
    })
      .populate("category")
      .populate("brand");

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// customer product route frontend ui la show kel aahe. Note: Express madhye route order khup matter karto
router.get("/customer", async (req, res) => {
  try {
    const products = await Product.find({
      status: true,
      stock: { $gt: 0 },
    })
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// GET ONE
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category","name").populate("category", "name")
.populate("brand", "name");

  res.json(product);
});

// UPDATE
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const payload = {
      ...req.body,
    };

    if (req.file) {
      payload.image = req.file.filename;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, {
    status: false,
  });

  res.json({
    message: "Product deleted",
  });
});



export default router;
