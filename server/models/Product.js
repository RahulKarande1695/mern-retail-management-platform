import mongoose from "mongoose";

const productSchema =
  new mongoose.Schema(
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

      image: {
        type: String,
      },

      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },

      status: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Product",
  productSchema
);