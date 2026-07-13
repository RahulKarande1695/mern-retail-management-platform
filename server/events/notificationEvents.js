import Notification from "../models/Notification.js";
import { getIo } from "../socket/socket.js";

export const createNotification = async ({
  userId,
  orderId = null,
  title,
  message,
  type = "Order",
}) => {
  const notification = await Notification.create({
    user: userId,
    order: orderId,
    title,
    message,
    type,
  });

  const io = getIo();

  io.to(userId.toString()).emit("NEW_NOTIFICATION", notification);

  return notification;
};
