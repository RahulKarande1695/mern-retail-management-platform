import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

    currentLocation: {
      lat: {
        type: Number,
        default: null,
      },

      lng: {
        type: Number,
        default: null,
      },

      updatedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  },
);

deliveryBoySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

deliveryBoySchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("DeliveryBoy", deliveryBoySchema);
