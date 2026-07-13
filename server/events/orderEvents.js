import { getIo } from "../socket/socket.js";

export const emitOrderUpdate = (order) => {
  const io = getIo();
  if (order.deliveryBoy) {
    io.to(order.deliveryBoy.toString()).emit("ORDER_UPDATED", order);
    console.log("✅ Delivery event emitted",order, order.deliveryBoy.toString());
  } 

  io.to(order.customer.toString()).emit("ORDER_UPDATED", order);
  console.log(io.sockets.adapter.rooms, "sockets adapter");

  io.to("SHOP_ROOM").emit("ORDER_UPDATED", order);  
};

