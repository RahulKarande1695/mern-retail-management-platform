import mongoose from "mongoose";
import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { addressId, paymentMethod } = req.body;

    // Validate address
    const address = await Address.findOne({
      _id: addressId,
      customer: req.user.id,
      status: true,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    // Get customer cart
    const cart = await Cart.findOne({
      customer: req.user.id,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate stock & prepare order items
    const productIds = cart.items.map((item) => item.product._id);

    const products = await Product.find({
      _id: {
        $in: productIds,
      },
    });

    const productMap = new Map();

    products.forEach((product) => {
      productMap.set(product._id.toString(), product);
    });

    for (const item of cart.items) {
      const product = productMap.get(item.product._id.toString());

      if (!product || !product.status) {
        return res.status(400).json({
          message: `${item.product.name} not available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} has only ${product.stock} items available`,
        });
      }

      totalAmount += product.sellingPrice * item.quantity;

      orderItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.image,
        quantity: item.quantity,
        acceptedQty: 0,
        cancelledQty: 0,
        price: product.sellingPrice,
        itemStatus: "Placed",
        trackingHistory: [
          {
            status: "Placed",
          },
        ],
      });
    }

    // Create order
    const [order] = await Order.create(
      [
        {
          orderNumber: "ORD-" + Date.now(),
          customer: req.user.id,
          items: orderItems,
          totalAmount,
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
          deliveryAddress: {
            fullName: address.fullName,
            mobile: address.mobile,
            pincode: address.pincode,
            state: address.state,
            district: address.district,
            city: address.city,
            taluka: address.taluka,
            village: address.village,
            postOffice: address.postOffice,
            houseNo: address.houseNo,
            area: address.area,
            landmark: address.landmark,
            location: address.location,
          },
          trackingHistory: [
            {
              status: "Placed",
            },
          ],
        },
      ],
      {
        session,
      },
    );

    // Reduce stock
    for (const item of cart.items) {
      await Product.bulkWrite(
        cart.items.map((item) => ({
          updateOne: {
            filter: {
              _id: item.product._id,
            },
            update: {
              $inc: {
                stock: -item.quantity,
              },
            },
          },
        })),
        {
          session,
        },
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save({
      session,
    });
    await session.commitTransaction();
    res.status(201).json(order);
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({
      message: err.message,
    });
  } finally {
    session.endSession();
  }
});

export default router;
