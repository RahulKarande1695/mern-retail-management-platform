import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

const AssignedOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAssignedOrders();
  }, []);

  const getAssignedOrders = async () => {
    try {
      // API Later
      const res = await api.get("/deliveryBoy/orders");
      setOrders(res.data);
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
        Assigned Orders
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
                  display: "flex",
                  flexDirection: "column",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
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
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 600, flexShrink: 0 }}
                    />
                  </Stack>

                  <Stack spacing={0.6} sx={{ flex: 1 }}>
                    <Typography sx={{ wordBreak: "break-word" }}>
                      <strong>Customer :</strong> {order.customer?.name}
                    </Typography>

                    <Typography>
                      <strong>Mobile :</strong> {order.customer?.mobile}
                    </Typography>

                    <Typography>
                      <strong>Total :</strong> ₹{order.totalAmount}
                    </Typography>

                    <Typography>
                      <strong>Items :</strong> {order.items?.length}
                    </Typography>

                    <Box sx={{ pt: 0.5 }}>
                      <Typography>
                        <strong>Address :</strong>
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {order.deliveryAddress?.houseNo}, {order.deliveryAddress?.area},{" "}
                        {order.deliveryAddress?.city}
                      </Typography>
                    </Box>
                  </Stack>

                  <Button
                    fullWidth
                    sx={{ mt: 2.5, borderRadius: "10px", textTransform: "none" }}
                    variant="contained"
                    onClick={() => navigate(`/delivery/orders/${order._id}`)}
                  >
                    View Order
                  </Button>
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
                  No Assigned Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AssignedOrders;