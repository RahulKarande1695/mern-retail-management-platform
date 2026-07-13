import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/socket.js";

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import morgan from "morgan";
import logger from "./config/logger.js";

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import brandRoutes from "./routes/brands.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import checkoutRoutes from "./routes/checkout.js";
import deliveryBoyRoutes from "./routes/deliveryBoy.js";
import analyticsRoutes from "./routes/analytics.js";
import notificationRoutes from "./routes/notification.js";

dotenv.config();

// FIRST APP
const app = express();

// THEN HTTP SERVER
const server = http.createServer(app);

// THEN SOCKET
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  // user joins own room
  socket.on("JOIN_USER", (userId) => {
    socket.join(userId);
    console.log("ROOMS:", [...socket.rooms], "JOIN_USER", userId);
  });

  socket.on("JOIN_SHOP", () => {
    socket.join("SHOP_ROOM");
    console.log("Shop joined");
  });
  
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });

});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Logger
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// Static
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/brands", brandRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/address", addressRoutes);
app.use("/deliveryBoy", deliveryBoyRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/notifications", notificationRoutes);

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// START
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running ${PORT}`);
});
