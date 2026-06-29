import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import api from "../../api/axios";

const History = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      // API Later
      // const res = await api.get("/deliveryBoy/history");
      // setOrders(res.data);

      setOrders([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        Delivery History
      </Typography>

      <Grid container spacing={3}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={order._id}
            >
              <Card>
                <CardContent>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography fontWeight={700}>
                      {order.orderNumber}
                    </Typography>

                    <Chip
                      label={order.orderStatus}
                      color={
                        order.orderStatus === "Delivered"
                          ? "success"
                          : "error"
                      }
                    />
                  </Stack>

                  <Typography>
                    <strong>Customer :</strong>{" "}
                    {order.customer?.name}
                  </Typography>

                  <Typography>
                    <strong>Mobile :</strong>{" "}
                    {order.customer?.mobile}
                  </Typography>

                  <Typography mt={1}>
                    <strong>Amount :</strong> ₹
                    {order.totalAmount}
                  </Typography>

                  <Typography mt={1}>
                    <strong>Items :</strong>{" "}
                    {order.items?.length}
                  </Typography>

                  <Typography mt={1}>
                    <strong>Delivered :</strong>{" "}
                    {order.deliveredAt
                      ? new Date(
                          order.deliveredAt
                        ).toLocaleString()
                      : "-"}
                  </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography align="center">
                  No Delivery History Found
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default History;