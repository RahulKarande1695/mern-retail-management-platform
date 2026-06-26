import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      customer: req.user.id,
    }).populate("items.product");

    if (!cart) {
      return res.json({
        items: [],
      });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product || !product.status) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    let cart = await Cart.findOne({
      customer: req.user.id,
    });

    if (!cart) {
      cart = await Cart.create({
        customer: req.user.id,
        items: [],
      });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (item) {
      const newQty = item.quantity + quantity;

      if (newQty > product.stock) {
        return res.status(400).json({
          message: "Stock limit exceeded",
        });
      }

      item.quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    res.json({
      message: "Added to cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/update", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
      customer: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({
      customer: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/clear", authMiddleware, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      {
        customer: req.user.id,
      },
      {
        items: [],
      },
    );

    res.json({
      message: "Cart cleared",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;