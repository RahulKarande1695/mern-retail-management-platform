import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    packSize: {
      type: String,
    },

    mrp: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },

    status: {
      type: Boolean,
      default: true,
    },
    productCode: {
      type: String,
      unique: true,
      require: true
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
