import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

function updateOrderStatus(order) {
  const items = order.items;

  if (items.every((i) => i.itemStatus === "Delivered")) {
    order.orderStatus = "Delivered";
  } else if (items.every((i) => i.itemStatus === "Cancelled")) {
    order.orderStatus = "Cancelled";
  } else {
    order.orderStatus = "Processing";
  }
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      status: true,
    })
      .populate("customer", "name email")
      .populate("items.product")
      .sort({
        createdAt: -1,
      });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/customer/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user.id,
      status: true,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/customer/:customerId", authMiddleware, async (req, res) => {
  const orders = await Order.find({
    customer: req.params.customerId,
    status: true,
  }).sort({
    createdAt: -1,
  });

  res.json(orders);
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      orderNumber: "ORD-" + Date.now(),

      trackingHistory: [
        {
          status: "Placed",
        },
      ],
      items: req.body.items.map((item) => ({
        ...item,
        trackingHistory: [
          {
            status: "Placed",
          },
        ],
      })),
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post(
  "/:orderId/items/:itemId/accept",
  authMiddleware,
  async (req, res) => {
    try {
      const { acceptedQty } = req.body;

      const order = await Order.findById(req.params.orderId);
console.log(order.toObject());
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      const item = order.items.id(req.params.itemId);
      if (!item) {
        return res.status(404).json({
          message: "Item not found",
        });
      }

      if (acceptedQty < 0 || acceptedQty > item.quantity) {
        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      item.acceptedQty = acceptedQty;

      item.cancelledQty = item.quantity - acceptedQty;

      item.itemStatus =
        acceptedQty === item.quantity ? "Accepted" : "PartiallyAccepted";

      item.trackingHistory.push({
        status: item.itemStatus,
      });

      updateOrderStatus(order);

      await order.save();

      res.json(order);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.post(
  "/:orderId/items/:itemId/cancel",
  authMiddleware,
  async (req, res) => {
    try {
      const { cancelledQty } = req.body;

      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const item = order.items.id(req.params.itemId);

      if (!item) {
        return res.status(404).json({
          message: "Item not found",
        });
      }

      if (cancelledQty < 0 || cancelledQty > item.quantity) {
        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      item.cancelledQty = cancelledQty;
      item.cancelledQty = cancelledQty;

      item.itemStatus = "Cancelled";

      item.trackingHistory.push({
        status: "Cancelled",
      });

      order.refundAmount += cancelledQty * item.price;

      if (order.paymentStatus === "Paid") {
        order.paymentStatus = "RefundInitiated";
      }

      updateOrderStatus(order);

      await order.save();

      res.json(order);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.post(
  "/:orderId/items/:itemId/pack",
  authMiddleware,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const item = order.items.id(req.params.itemId);

      if (!item) {
        return res.status(404).json({
          message: "Item not found",
        });
      }

      item.itemStatus = "Packed";

      item.trackingHistory.push({
        status: "Packed",
      });

      updateOrderStatus(order);

      await order.save();

      res.json(order);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.post(
  "/:orderId/items/:itemId/delivered",
  authMiddleware,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      const item = order.items.id(req.params.itemId);

      if (!item) {
        return res.status(404).json({
          message: "Item not found",
        });
      }

      item.itemStatus = "Delivered";

      item.trackingHistory.push({
        status: "Delivered",
      });

      updateOrderStatus(order);

      await order.save();

      res.json(order);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      status: true,
    })
      .populate("customer")
      .populate("items.product")
      .populate("deliveryBoy", "name mobile vehicleType");
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, {
    status: false,
  });

  res.json({
    message: "Order deleted",
  });
});

export default router;
