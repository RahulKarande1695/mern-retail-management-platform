import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// CREATE
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const product = await Product.create({
        ...req.body,
        image: req.file?.filename,
      });

      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// GET ALL
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const { search = "" } = req.query;

      const products = await Product.find({
        name: {
          $regex: search,
          $options: "i",
        },
      }).populate("category");

      res.json(products);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// GET ONE
router.get("/:id", async (req, res) => {
  const product =
    await Product.findById(
      req.params.id
    ).populate("category");

  res.json(product);
});

// UPDATE
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const payload = {
        ...req.body,
      };

      if (req.file) {
        payload.image =
          req.file.filename;
      }

      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          payload,
          { new: true }
        );

      res.json(product);
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
    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Product deleted",
    });
  }
);

export default router;