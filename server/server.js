// server.js
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import brandRoutes from "./routes/brands.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js"
import checkoutRoutes from "./routes/checkout.js"
import deliveryBoyRoutes from "./routes/deliveryBoy.js";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // your React dev URL
    credentials: true, // required for cookies
  }),
);
app.use("/uploads", express.static("uploads"));
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use(
  "/uploads",
  express.static("uploads")
);
app.use(
  "/brands",
  brandRoutes
);
app.use(
  "/orders",
  orderRoutes
);
app.use(
  "/cart",
  cartRoutes
);
app.use(
  "/address",
  addressRoutes
);
app.use(
  "/deliveryBoy",
  deliveryBoyRoutes
);

app.use("/checkout", checkoutRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
