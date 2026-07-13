import express from "express";
import PDFDocument from "pdfkit";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import DeliveryBoy from "../models/DeliveryBoy.js";
import { getIo } from "../socket/socket.js";
import { emitOrderUpdate } from "../events/orderEvents.js";
import { createNotification } from "../events/notificationEvents.js";

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

      if (!order.trackingHistory.some((track) => track.status === "Accepted")) {
        order.trackingHistory.push({
          status: "Accepted",
        });
      }

      updateOrderStatus(order);
      await order.save();
      await createNotification({
        userId: order.customer,
        orderId: order._id,
        title: "Order Accepted",
        message: `Your order ${order.orderNumber} has been accepted.`,
      });
      emitOrderUpdate(order);
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

      const allPacked = order.items.every(
        (item) =>
          item.itemStatus === "Packed" || item.itemStatus === "Cancelled",
      );

      if (allPacked) {
        order.trackingHistory.push({
          status: "Packed",
        });
      }

      updateOrderStatus(order);

      await order.save();

      await order.save();
      await createNotification({
        userId: order.customer,
        orderId: order._id,
        title: "Order Packed",
        message: `Your order ${order.orderNumber} has been packed.`,
      });
      emitOrderUpdate(order);
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
      await createNotification({
        userId: order.customer,
        orderId: order._id,
        title: "Delivery Partner Assigned",
        message: "Your delivery partner has been assigned.",
      });
      emitOrderUpdate(order);
      res.json(order);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.post(
  "/:orderId/items/:itemId/return",
  authMiddleware,
  async (req, res) => {
    try {
      const { reason } = req.body;
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      if (order.customer.toString() !== req.user.id) {
        return res.status(403).json({
          message: "Unauthorized",
        });
      }

      const item = order.items.id(req.params.itemId);

      if (!item) {
        return res.status(404).json({
          message: "Item not found",
        });
      }

      if (item.itemStatus !== "Delivered") {
        return res.status(400).json({
          message: "Only delivered items can return",
        });
      }

      if (item.returnStatus !== "None") {
        return res.status(400).json({
          message: "Return already requested",
        });
      }

      item.returnStatus = "Requested";

      order.returnReason = reason;

      item.trackingHistory.push({
        status: "Return Requested",
      });

      await order.save();

      res.json({
        message: "Return Requested Successfully",
        order,
      });
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
      return res.status(400).json({
        message: "No delivery partner available",
      });
    }

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
    await createNotification({
      userId: deliveryBoy._id,
      orderId: order._id,
      title: "New Delivery Assigned",
      message: `Order ${order.orderNumber} has been assigned to you.`,
    });
    emitOrderUpdate(order);
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
    await createNotification({
      userId: order.customer,
      orderId: order._id,
      title: "Delivery Accepted",
      message: "Delivery partner has accepted your order.",
    });
    emitOrderUpdate(order);
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
    await createNotification({
      userId: order.customer,
      orderId: order._id,
      title: "Order Picked Up",
      message: "Your order is on the way.",
    });
    emitOrderUpdate(order);
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
    await createNotification({
      userId: order.customer,
      orderId: order._id,
      title: "Order Delivered",
      message: "Your order has been delivered successfully.",
    });
    emitOrderUpdate(order);
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

// GET ALL RETURN REQUESTS
router.get("/returns", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      "items.returnStatus": "Requested",
      status: true,
    })
      .populate("customer", "name email mobile")
      .populate("deliveryAddress")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/returns/approved", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      "items.returnStatus": "Approved",
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

router.post(
  "/:orderId/items/:itemId/return/approve",
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

      if (item.returnStatus !== "Requested") {
        return res.status(400).json({
          message: "Return not requested",
        });
      }

      item.returnStatus = "Approved";

      order.refundAmount += item.price * item.quantity;

      order.paymentStatus = "RefundInitiated";

      item.trackingHistory.push({
        status: "Return Approved",
      });

      await order.save();

      res.json({
        message: "Return Approved",
        order,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

router.post(
  "/:orderId/items/:itemId/return/reject",
  authMiddleware,
  async (req, res) => {
    try {
      const { reason } = req.body;

      const order = await Order.findById(req.params.orderId);

      const item = order.items.id(req.params.itemId);

      item.returnStatus = "Rejected";

      order.rejectionReason = reason;

      item.trackingHistory.push({
        status: "Return Rejected",
      });

      await order.save();

      res.json({
        message: "Return Rejected",
        order,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
);

// PROCESS REFUND
router.post(
  "/:orderId/items/:itemId/refund",
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

      // only approved return refund allowed
      if (item.returnStatus !== "Approved") {
        return res.status(400).json({
          message: "Return is not approved",
        });
      }

      const refundAmount = item.price * item.quantity;

      order.refundAmount += refundAmount;

      order.paymentStatus = "Refunded";

      order.refundDate = new Date();

      item.returnStatus = "Returned";

      item.trackingHistory.push({
        status: "Refund Completed",
      });

      order.trackingHistory.push({
        status: "Refund Completed",
      });

      await order.save();

      res.json({
        message: "Refund processed successfully",

        refundAmount,

        order,
      });
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

// DOWNLOAD INVOICE

router.get("/:id/invoice", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${order.orderNumber}.pdf`,
    );

    doc.pipe(res);

    // TITLE
    doc.fontSize(22).text("DG Flake Grocery Invoice", {
      align: "center",
    });

    doc.moveDown();

    // ORDER INFO

    doc.fontSize(12);

    doc.text(`Invoice No : ${order.orderNumber}`);

    doc.text(`Date : ${order.createdAt.toDateString()}`);

    doc.text(`Customer : ${order.customer.name}`);

    doc.text(`Email : ${order.customer.email}`);

    doc.moveDown();

    // ITEMS

    doc.fontSize(16).text("Items");

    doc.moveDown();

    order.items.forEach((item, index) => {
      doc.fontSize(12).text(
        `${index + 1}. ${item.productName}
Qty: ${item.quantity}
Price: ₹${item.price}
Total: ₹${item.price * item.quantity}`,
      );

      doc.moveDown();
    });

    doc.moveDown();

    doc.fontSize(16).text(`Total Amount : ₹${order.totalAmount}`);

    doc.text(`Payment : ${order.paymentStatus}`);

    doc.moveDown();

    doc.text("Thank you for shopping!");

    doc.end();
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// REPEAT ORDER
router.post("/:id/repeat", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Customer ownership check
    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
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

    for (const orderItem of order.items) {
      const product = await Product.findById(orderItem.product);

      // Skip deleted/out of stock products
      if (!product || !product.status || product.stock <= 0) {
        continue;
      }

      const existingItem = cart.items.find(
        (item) => item.product.toString() === product._id.toString(),
      );

      if (existingItem) {
        existingItem.quantity = Math.min(
          existingItem.quantity + orderItem.quantity,
          product.stock,
        );
      } else {
        cart.items.push({
          product: product._id,
          quantity: Math.min(orderItem.quantity, product.stock),
        });
      }
    }

    await cart.save();

    res.json({
      message: "Products added to cart",
    });
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
