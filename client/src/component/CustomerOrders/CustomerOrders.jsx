import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import api from "../../api/axios";

import CartSection from "./CartSection";
import CurrentOrder from "./CurrentOrder";
import OrderHistory from "./OrderHistory";

const CustomerOrders = () => {
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState(null);

  const [currentOrder, setCurrentOrder] = useState(null);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [cartRes, orderRes] = await Promise.all([
        api.get("/cart"),
        api.get("/orders/customer/orders"),
      ]);

      setCart(cartRes.data);

      const orders = orderRes.data;

      const activeOrder = orders.find(
        (item) =>
          item.orderStatus !== "Delivered" && item.orderStatus !== "Cancelled"
      );

      setCurrentOrder(activeOrder || null);

      setHistory(
        orders.filter(
          (item) =>
            item.orderStatus === "Delivered" || item.orderStatus === "Cancelled"
        )
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        margin: "auto",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        mb={{ xs: 2, sm: 3 }}
        sx={{ fontSize: { xs: "1.4rem", sm: "2rem" } }}
      >
        My Orders
      </Typography>

      <Stack spacing={{ xs: 2, sm: 3 }}>
        {cart?.items?.length > 0 && <CartSection cart={cart} refresh={loadData} />}

        {currentOrder && <CurrentOrder order={currentOrder} refresh={loadData} />}

        <OrderHistory orders={history} />
      </Stack>
    </Box>
  );
};

export default CustomerOrders;