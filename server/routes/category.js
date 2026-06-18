import express from "express";
import Category from "../models/Category.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE
router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
    console.log(req.body)
      const category =
        await Category.create(
          req.body
        );

      res.status(201).json(
        category
      );
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

      const categories =
        await Category.find({
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
  }
);

// GET ONE
router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    const category =
      await Category.findById(
        req.params.id
      );

    res.json(category);
  }
);


// UPDATE
router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {
    const updated =
      await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updated);
  }
);


// DELETE
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    await Category.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Category deleted",
    });
  }
);

export default router;