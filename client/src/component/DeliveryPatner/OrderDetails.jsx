import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { CheckCircle, LocalShipping, Phone, Room } from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../api/axios";
import DeliveryMap from "../map/DeliveryMap";
import socket from "../../socket/socket";

const cardSx = {
  borderRadius: "16px",
  border: "1px solid #eaeaea",
  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  height: "100%",
};

const DeliveryOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const lastTrackingStatus =
    order?.trackingHistory?.length > 0
      ? order.trackingHistory[order.trackingHistory.length - 1].status
      : "";

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {
  socket.on("ORDER_UPDATED", (updatedOrder) => {
    if (updatedOrder._id === id) {
      console.log("Delivery realtime", updatedOrder);
      setOrder(updatedOrder);
    }
  });

  return () => {
    socket.off("ORDER_UPDATED");
  };
}, [id]);

  const getOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);

      setOrder(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccept = async () => {
    try {
      await api.post(`/orders/${order._id}/accept-delivery`);
      startLocationTracking();
      alert("Delivery Accepted");
      getOrder();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePicked = async () => {
    try {
      await api.post(`/orders/${order._id}/picked`);
      alert("Order Picked");
      getOrder();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelivered = async () => {
    try {
      await api.post(`/orders/${order._id}/delivered`);
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      alert("Order Delivered");
      getOrder();
    } catch (err) {
      console.log(err);
    }
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert("Location not supported");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;

        const lng = position.coords.longitude;

        await api.post("/deliveryBoy/location", {
          lat,
          lng,
        });

        console.log("Location Updated", lat, lng);
      },

      (error) => {
        console.log(error);
      },

      {
        enableHighAccuracy: true,
      },
    );

    setWatchId(id);
  };

  const openGoogleMap = () => {
    const location = order?.deliveryAddress?.location;

    if (!location) {
      alert("Customer location not available");
      return;
    }

    const { lat, lng } = location;

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
    );
  };
  console.log("order.deliveryAddress?.location", order?.deliveryAddress?.location);

  if (!order)
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

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h5"
        mb={{ xs: 2, sm: 3 }}
        fontWeight={700}
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
      >
        Order Details
      </Typography>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Customer */}

        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" fontWeight={600}>
                Customer Details
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                <Typography sx={{ wordBreak: "break-word" }}>
                  <strong>Name :</strong> {order.customer?.name}
                </Typography>

                <Typography>
                  <strong>Mobile :</strong> {order.customer?.mobile}
                </Typography>
              </Stack>

              <Button
                startIcon={<Phone />}
                sx={{ mt: 2.5, borderRadius: "10px", textTransform: "none" }}
                variant="contained"
                fullWidth
              >
                Call Customer
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Address */}

        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" fontWeight={600}>
                Delivery Address
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={0.4} sx={{ mb: order.deliveryAddress?.location ? 2 : 0 }}>
                <Typography sx={{ wordBreak: "break-word" }}>
                  {order.deliveryAddress?.houseNo}
                </Typography>

                <Typography sx={{ wordBreak: "break-word" }}>
                  {order.deliveryAddress?.area}
                </Typography>

                <Typography>{order.deliveryAddress?.city}</Typography>

                <Typography>{order.deliveryAddress?.district}</Typography>

                <Typography>{order.deliveryAddress?.state}</Typography>

                <Typography fontWeight={600}>
                  {order.deliveryAddress?.pincode}
                </Typography>
              </Stack>

              {order.deliveryAddress?.location && (
                <Box
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                    aspectRatio: "16 / 9",
                    width: "100%",
                  }}
                >
                  <DeliveryMap customerLocation={order.deliveryAddress.location} />
                </Box>
              )}

              {order.deliveryAddress?.location && (
                <Button
                  sx={{ mt: 2, borderRadius: "10px", textTransform: "none" }}
                  startIcon={<Room />}
                  variant="outlined"
                  fullWidth
                  onClick={openGoogleMap}
                >
                  Open Google Maps
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Products */}

        <Grid item xs={12}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" fontWeight={600}>
                Ordered Items
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack divider={<Divider />} spacing={0}>
                {order.items.map((item) => (
                  <Stack
                    key={item._id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                    sx={{ py: 1.2 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={600} sx={{ wordBreak: "break-word" }}>
                        {item.productName}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Qty : {item.quantity}
                      </Typography>
                    </Box>

                    <Typography fontWeight={700} sx={{ flexShrink: 0 }}>
                      ₹{item.price}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Tracking */}

        <Grid item xs={12}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" fontWeight={600}>
                Tracking History
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" flexWrap="wrap" gap={1}>
                {order.trackingHistory.map((track, index) => (
                  <Chip
                    key={index}
                    icon={<CheckCircle />}
                    label={track.status}
                    color="success"
                    sx={{ fontWeight: 500 }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}

        <Grid item xs={12}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" fontWeight={600}>
                Delivery Actions
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ "& .MuiButton-root": { borderRadius: "10px", textTransform: "none" } }}
              >
                {lastTrackingStatus === "Assigned" && (
                  <Button variant="contained" onClick={handleAccept}>
                    Accept Delivery
                  </Button>
                )}

                {lastTrackingStatus === "Accepted By Delivery Partner" && (
                  <Button variant="contained" onClick={handlePicked}>
                    Picked Up
                  </Button>
                )}

                {lastTrackingStatus === "Picked Up" && (
                  <Button variant="contained" onClick={handleDelivered}>
                    Delivered
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryOrderDetails;