import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
      default: "",
    },

    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
    },

    aadhaarImage: {
      type: String,
      default: "",
    },

    panNumber: {
      type: String,
      required: true,
      unique: true,
    },

    panImage: {
      type: String,
      default: "",
    },

    drivingLicenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    drivingLicenseImage: {
      type: String,
      default: "",
    },

    vehicleType: {
      type: String,
      enum: ["Bike", "Scooter", "Cycle"],
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },

    bankName: {
      type: String,
      default: "",
    },

    accountHolderName: {
      type: String,
      default: "",
    },

    accountNumber: {
      type: String,
      default: "",
    },

    ifscCode: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    currentOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    status: {
      type: Boolean,
      default: true,
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("DeliveryBoy", deliveryBoySchema);
