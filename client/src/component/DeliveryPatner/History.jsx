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
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={{ xs: 2, sm: 3 }}
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
      >
        Delivery History
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Grid item xs={12} sm={6} lg={4} key={order._id}>
              <Card
                sx={{
                  borderRadius: "16px",
                  border: "1px solid #eaeaea",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  height: "100%",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                    mb={2}
                  >
                    <Typography
                      fontWeight={700}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                      }}
                    >
                      {order.orderNumber}
                    </Typography>

                    <Chip
                      label={order.orderStatus}
                      color={order.orderStatus === "Delivered" ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: 600, flexShrink: 0 }}
                    />
                  </Stack>

                  <Stack spacing={0.6}>
                    <Typography sx={{ wordBreak: "break-word" }}>
                      <strong>Customer :</strong> {order.customer?.name}
                    </Typography>

                    <Typography>
                      <strong>Mobile :</strong> {order.customer?.mobile}
                    </Typography>

                    <Typography>
                      <strong>Amount :</strong> ₹{order.totalAmount}
                    </Typography>

                    <Typography>
                      <strong>Items :</strong> {order.items?.length}
                    </Typography>

                    <Typography>
                      <strong>Delivered :</strong>{" "}
                      {order.deliveredAt
                        ? new Date(order.deliveredAt).toLocaleString()
                        : "-"}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: "16px",
                border: "1px solid #eaeaea",
                boxShadow: "none",
                bgcolor: "#fafafa",
              }}
            >
              <CardContent sx={{ py: 5 }}>
                <Typography align="center" color="text.secondary">
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