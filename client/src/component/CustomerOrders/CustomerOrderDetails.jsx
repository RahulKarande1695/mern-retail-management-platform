import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaidIcon from "@mui/icons-material/Paid";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import socket from "../../socket/socket";

const cardSx = {
  borderRadius: "16px",
  border: "1px solid #eaeaea",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
};

const CustomerOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder();

    socket.on("ORDER_UPDATED", (updatedOrder) => {
      console.log("Realtime order", updatedOrder);
      setOrder(updatedOrder);
    });

    return () => {
      socket.off("ORDER_UPDATED");
    };
  }, []);

  const getOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);

      setOrder(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const downloadInvoice = async () => {
    try {
      const res = await api.get(`/orders/${order._id}/invoice`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.log(err);
    }
  };

  const repeatOrder = async () => {
    try {
      await api.post(`/orders/${order._id}/repeat`);
      alert("Products added to cart");
      navigate("/customer/cart");
    } catch (err) {
      console.log(err);
    }
  };

  if (!order) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1000, mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={{ xs: 2, sm: 3 }}
        sx={{ fontSize: { xs: "1.4rem", sm: "2rem" } }}
      >
        Track Order
      </Typography>

      <Card sx={{ ...cardSx, mb: { xs: 2, sm: 3 } }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1.5,
            }}
          >
            <Typography>
              <b>Order Number :</b> {order.orderNumber}
            </Typography>

            <Typography>
              <b>Payment :</b> {order.paymentMethod}
            </Typography>

            <Typography>
              <b>Payment Status :</b> {order.paymentStatus}
            </Typography>

            <Typography>
              <b>Total :</b> ₹{order.totalAmount}
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center" spacing={1.5} mt={2.5}>
            <Typography fontWeight={600}>Order Status :</Typography>
            <Chip
              color="primary"
              label={order.orderStatus}
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {order.deliveryBoy && (
        <Card sx={{ ...cardSx, mb: { xs: 2, sm: 3 }, bgcolor: "#fafafa" }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <LocalShippingIcon color="primary" />
              <Typography variant="h6" fontWeight={700}>
                Delivery Partner
              </Typography>
            </Stack>

            <Stack spacing={0.6} mb={2}>
              <Typography>
                <strong>Name :</strong> {order.deliveryBoy.name}
              </Typography>

              <Typography>
                <strong>Mobile :</strong> {order.deliveryBoy.mobile}
              </Typography>

              <Typography>
                <strong>Vehicle :</strong> {order.deliveryBoy.vehicleType}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              color="success"
              href={`tel:${order.deliveryBoy.mobile}`}
              sx={{ borderRadius: "10px", textTransform: "none" }}
            >
              Call Delivery Partner
            </Button>
          </CardContent>
        </Card>
      )}

      <Typography
        variant="h5"
        fontWeight={700}
        mb={2}
        sx={{ fontSize: { xs: "1.1rem", sm: "1.5rem" } }}
      >
        Products
      </Typography>

      <Stack spacing={2} mb={3}>
        {order.items.map((item) => (
          <Card key={item._id} sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 3 },
                }}
              >
                <CardMedia
                  component="img"
                  image={`http://localhost:5000/uploads/${item.product.image}`}
                  sx={{
                    width: { xs: "100%", sm: 120 },
                    height: { xs: 180, sm: 120 },
                    objectFit: "cover",
                    borderRadius: "12px",
                    flexShrink: 0,
                    border: "1px solid #eee",
                  }}
                />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ wordBreak: "break-word" }}
                  >
                    {item.productName}
                  </Typography>

                  <Stack
                    direction="row"
                    flexWrap="wrap"
                    columnGap={3}
                    rowGap={0.3}
                    mt={0.5}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Qty : {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Accepted : {item.acceptedQty}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cancelled : {item.cancelledQty}
                    </Typography>
                  </Stack>

                  <Typography color="primary" fontWeight={700} mt={1}>
                    ₹{item.price}
                  </Typography>

                  <Chip
                    sx={{ mt: 1.5, fontWeight: 500 }}
                    label={item.itemStatus}
                    size="small"
                  />

                  {item.returnStatus !== "None" && (
                    <Box mt={1.5}>
                      <Typography fontWeight={600} variant="body2">
                        Return Status
                      </Typography>
                      <Chip
                        size="small"
                        sx={{ mt: 0.5, fontWeight: 500 }}
                        label={item.returnStatus}
                        color={
                          item.returnStatus === "Returned"
                            ? "success"
                            : item.returnStatus === "Rejected"
                              ? "error"
                              : "warning"
                        }
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Typography fontWeight={700} mb={1.5}>
                Tracking History
              </Typography>

              {item.trackingHistory.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No Tracking Available
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {item.trackingHistory.map((track, index) => (
                    <Box
                      key={index}
                      sx={{
                        pl: 2,
                        borderLeft: "3px solid",
                        borderColor: "success.main",
                      }}
                    >
                      <Typography fontWeight={700}>{track.status}</Typography>

                      <Typography variant="body2" color="text.secondary">
                        {new Date(track.updatedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}

              {item.itemStatus === "Delivered" &&
                item.returnStatus === "None" && (
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, borderRadius: "10px", textTransform: "none" }}
                  >
                    Request Return
                  </Button>
                )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      {order.paymentStatus === "Refunded" && (
        <Card sx={{ ...cardSx, mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
              <PaidIcon color="success" />
              <Typography variant="h6" fontWeight={700}>
                Refund Details
              </Typography>
            </Stack>

            <Stack spacing={0.4}>
              <Typography>Amount : ₹{order.refundAmount}</Typography>
              <Typography>Status : {order.paymentStatus}</Typography>
              <Typography>
                Date : {new Date(order.refundDate).toLocaleString()}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {order.orderStatus === "Delivered" && (
          <Button
            variant="contained"
            onClick={repeatOrder}
            fullWidth
            sx={{ borderRadius: "10px", textTransform: "none", py: 1.2 }}
          >
            Repeat Order
          </Button>
        )}

        {order.orderStatus === "Delivered" && (
          <Button
            variant="outlined"
            onClick={downloadInvoice}
            fullWidth
            sx={{ borderRadius: "10px", textTransform: "none", py: 1.2 }}
          >
            Download Invoice
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default CustomerOrderDetails;
