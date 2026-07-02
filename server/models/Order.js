import mongoose from "mongoose";

const itemTrackingSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  productName: {
    type: String,
    required: true,
  },

  productImage: {
    type: String,
    default: "",
  },

  quantity: {
    type: Number,
    required: true,
    default: 1,
  },

  acceptedQty: {
    type: Number,
    default: 0,
    min: 0,
  },

  cancelledQty: {
    type: Number,
    default: 0,
    min: 0,
  },

  price: {
    type: Number,
    required: true,
  },

  itemStatus: {
    type: String,
    enum: [
      "Placed",
      "Accepted",
      "PartiallyAccepted",
      "Cancelled",
      "Packed",
      "Assigned",
      "Picked",
      "Delivered",
    ],
    default: "Placed",
  },

  trackingHistory: [itemTrackingSchema],

  returnStatus: {
    type: String,
    enum: ["None", "Requested", "Approved", "Rejected", "Returned"],
    default: "None",
  },
});

const trackingSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "RefundInitiated", "Refunded"],
      default: "Pending",
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    refundDate: {
      type: Date,
    },

    shopRemark: {
      type: String,
      default: "",
    },

    returnReason: {
      type: String,
      default: "",
    },

    orderStatus: {
      type: String,
      enum: [
        "Placed",
        "Processing",
        "PartiallyFulfilled",
        "Delivered",
        "Cancelled",
        "Returned",
        "Processing",
      ],
      default: "Placed",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    cancelReason: {
      type: String,
      default: "",
    },

    trackingHistory: [trackingSchema],

    status: {
      type: Boolean,
      default: true,
    },

    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      default: null,
    },

    // future sathi aahe lifecycle synchronize krnyasathi delivery boy status sathi
    // deliveryStatus: {
    //   type: String,
    //   enum: ["Assigned", "Accepted", "Picked", "Delivered"],
    //   default: "Assigned",
    // },

    assignedAt: Date,
    pickedAt: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
  },
);

orderSchema.pre("save", function (next) {
  console.log("===== ORDER SAVE =====");
  console.log("Order:", this.orderNumber);
  console.log(
    "Items:",
    this.items.map((i) => i._id?.toString()),
  );
  console.trace(); // <-- khup important
  next();
});

orderSchema.pre("init", function (data) {
  console.log("INIT");
  console.log(data.items?.map((i) => i._id));
});

export default mongoose.model("Order", orderSchema);
