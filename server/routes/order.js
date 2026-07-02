import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import DeliveryBoy from "../models/DeliveryBoy.js";

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

router.post("/:orderId/assignDeliveryBoy", authMiddleware, async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Already assigned
    if (order.deliveryBoy) {
      return res.status(400).json({
        message: "Delivery Boy already assigned",
      });
    }

    // All items must be packed
    const canAssign = order.items.every((item) => item.itemStatus === "Packed");

    if (!canAssign) {
      return res.status(400).json({
        message: "All items must be packed before assigning Delivery Boy",
      });
    }

    // Delivery Boy validation
    const deliveryBoy = await DeliveryBoy.findOne({
      _id: deliveryBoyId,
      status: true,
    });

    if (!deliveryBoy) {
      return res.status(404).json({
        message: "Delivery Boy not found",
      });
    }

    if (!deliveryBoy.isVerified) {
      return res.status(400).json({
        message: "Delivery Boy is not verified",
      });
    }

    if (!deliveryBoy.isAvailable) {
      return res.status(400).json({
        message: "Delivery Boy is not available",
      });
    }

    // Assign Delivery Boy
    order.deliveryBoy = deliveryBoy._id;
    order.assignedAt = new Date();
    order.orderStatus = "Processing";

    // Order Tracking
    order.trackingHistory.push({
      status: "Assigned",
    });

    // Item Tracking
    order.items.forEach((item) => {
      item.itemStatus = "Assigned";

      item.trackingHistory.push({
        status: "Assigned",
      });
    });

    // Delivery Boy busy
    deliveryBoy.currentOrder = order._id;
    deliveryBoy.isAvailable = false;
    await order.save();
    await deliveryBoy.save();

    res.json({
      message: "Delivery Boy Assigned Successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/:orderId/accept-delivery", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!order.deliveryBoy) {
      return res.status(400).json({
        message: "Delivery Boy not assigned",
      });
    }

    if (order.deliveryBoy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    order.trackingHistory.push({
      status: "Accepted By Delivery Partner",
    });

    await order.save();

    res.json({
      message: "Delivery Accepted",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/:orderId/picked", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!order.deliveryBoy) {
      return res.status(400).json({
        message: "Delivery Boy not assigned",
      });
    }

    if (order.deliveryBoy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    order.pickedAt = new Date();

    order.trackingHistory.push({
      status: "Picked Up",
    });

    await order.save();

    res.json({
      message: "Order Picked Successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.post("/:orderId/delivered", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (!order.deliveryBoy) {
      return res.status(400).json({
        message: "Delivery Boy not assigned",
      });
    }

    if (order.deliveryBoy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    order.deliveredAt = new Date();
    order.orderStatus = "Delivered";
    order.trackingHistory.push({
      status: "Delivered",
    });
    order.items.forEach((item) => {
      item.itemStatus = "Delivered";
      item.trackingHistory.push({
        status: "Delivered",
      });
    });

    // COD Payment
    if (order.paymentMethod === "COD") {
      order.paymentStatus = "Paid";
    }

    const deliveryBoy = await DeliveryBoy.findById(order.deliveryBoy);

    if (deliveryBoy) {
      deliveryBoy.isAvailable = true;
      deliveryBoy.currentOrder = null;

      await deliveryBoy.save();
    }

    await order.save();

    res.json({
      message: "Order Delivered Successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      status: true,
    })
      .populate("customer")
      .populate("items.product")
      .populate("deliveryBoy", "name mobile vehicleType");
    console.log("GET ORDER");
    console.log(order._id.toString());
    console.log(order.orderNumber);
    console.log(order.items[0]._id.toString());
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
