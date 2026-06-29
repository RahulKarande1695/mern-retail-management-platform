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

import {
  CheckCircle,
  LocalShipping,
  Phone,
  Room,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../api/axios";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder();
  }, []);

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
      // API Later

      alert("Accept Delivery API");
    } catch (err) {
      console.log(err);
    }
  };

  const handlePicked = async () => {
    try {
      // API Later

      alert("Picked API");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelivered = async () => {
    try {
      // API Later

      alert("Delivered API");
    } catch (err) {
      console.log(err);
    }
  };

  if (!order) return <h2>Loading...</h2>;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Order Details
      </Typography>

      <Grid container spacing={3}>
        {/* Customer */}

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>

              <Typography variant="h6">
                Customer Details
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography>
                <strong>Name :</strong>{" "}
                {order.customer?.name}
              </Typography>

              <Typography>
                <strong>Mobile :</strong>{" "}
                {order.customer?.mobile}
              </Typography>

              <Button
                startIcon={<Phone />}
                sx={{ mt: 2 }}
                variant="contained"
              >
                Call Customer
              </Button>

            </CardContent>
          </Card>
        </Grid>

        {/* Address */}

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>

              <Typography variant="h6">
                Delivery Address
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography>
                {order.deliveryAddress?.houseNo}
              </Typography>

              <Typography>
                {order.deliveryAddress?.area}
              </Typography>

              <Typography>
                {order.deliveryAddress?.city}
              </Typography>

              <Typography>
                {order.deliveryAddress?.district}
              </Typography>

              <Typography>
                {order.deliveryAddress?.state}
              </Typography>

              <Typography>
                {order.deliveryAddress?.pincode}
              </Typography>

              <Button
                sx={{ mt: 2 }}
                startIcon={<Room />}
                variant="outlined"
              >
                Open Google Maps
              </Button>

            </CardContent>
          </Card>
        </Grid>

        {/* Products */}

        <Grid item xs={12}>
          <Card>
            <CardContent>

              <Typography variant="h6">
                Ordered Items
              </Typography>

              <Divider sx={{ my: 2 }} />

              {order.items.map((item) => (
                <Stack
                  key={item._id}
                  direction="row"
                  justifyContent="space-between"
                  sx={{
                    py: 1,
                  }}
                >
                  <Box>

                    <Typography fontWeight={600}>
                      {item.productName}
                    </Typography>

                    <Typography
                      variant="body2"
                    >
                      Qty : {item.quantity}
                    </Typography>

                  </Box>

                  <Typography fontWeight={700}>
                    ₹{item.price}
                  </Typography>

                </Stack>
              ))}

            </CardContent>
          </Card>
        </Grid>

        {/* Tracking */}

        <Grid item xs={12}>
          <Card>
            <CardContent>

              <Typography variant="h6">
                Tracking History
              </Typography>

              <Divider sx={{ my: 2 }} />

              {order.trackingHistory.map(
                (track, index) => (
                  <Chip
                    key={index}
                    sx={{
                      mr: 1,
                      mb: 1,
                    }}
                    icon={
                      <CheckCircle />
                    }
                    label={track.status}
                    color="success"
                  />
                )
              )}

            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}

        <Grid item xs={12}>
          <Card>
            <CardContent>

              <Typography variant="h6">
                Delivery Actions
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack
                direction="row"
                spacing={2}
              >
                <Button
                  variant="contained"
                  onClick={
                    handleAccept
                  }
                >
                  Accept Delivery
                </Button>

                <Button
                  variant="contained"
                  color="warning"
                  startIcon={
                    <LocalShipping />
                  }
                  onClick={
                    handlePicked
                  }
                >
                  Picked
                </Button>

                <Button
                  variant="contained"
                  color="success"
                  onClick={
                    handleDelivered
                  }
                >
                  Delivered
                </Button>

              </Stack>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetails;