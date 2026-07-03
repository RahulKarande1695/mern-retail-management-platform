import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({
      status: true,
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
      status: true,
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
      status: true,
    });

    const sales = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const refunds = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$refundAmount",
          },
        },
      },
    ]);

    const returnRequests = await Order.countDocuments({
      "items.returnStatus": "Requested",
    });

    const topProducts = await Order.aggregate([
      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.productName",

          totalSold: {
            $sum: "$items.quantity",
          },

          revenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.price"],
            },
          },
        },
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);

    const recentOrders = await Order.find({
      status: true,
    })
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .populate("customer", "name");

    res.json({
      totalOrders,

      deliveredOrders,

      cancelledOrders,

      totalSales: sales[0]?.total || 0,

      refundAmount: refunds[0]?.total || 0,

      returnRequests,

      topProducts,

      recentOrders,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

export default router;
