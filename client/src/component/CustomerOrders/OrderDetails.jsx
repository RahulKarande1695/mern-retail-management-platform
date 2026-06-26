import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Typography,
  Button,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../../api/axios";
import TrackingStepper from "./components/TrackingStepper";

const CustomerOrderDetails = () => {
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

  if (!order)
    return (
      <Typography p={5}>
        Loading...
      </Typography>
    );

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        p: 3,
      }}
    >
      {/* Page Title */}

      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Order Details
      </Typography>

      {/* Order Summary */}

      <Card sx={{ mb: 3 }}>
        <CardContent>

          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
          >

            <Box>

              <Typography variant="h6">
                {order.orderNumber}
              </Typography>

              <Typography color="text.secondary">
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </Typography>

            </Box>

            <Chip
              label={order.orderStatus}
              color={
                order.orderStatus === "Delivered"
                  ? "success"
                  : order.orderStatus === "Cancelled"
                  ? "error"
                  : "warning"
              }
            />

          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Tracking */}

          <TrackingStepper
            trackingHistory={
              order.trackingHistory
            }
          />

        </CardContent>
      </Card>

      {/* Ordered Products */}

      <Typography
        variant="h5"
        fontWeight={700}
        mb={2}
      >
        Ordered Products
      </Typography>

      {order.items.map((item) => (
        <Card
          key={item._id}
          sx={{
            mb: 2,
          }}
        >
          <CardContent>

            <Box
              display="flex"
              gap={3}
            >

              <CardMedia
                component="img"
                image={`http://localhost:5000/uploads/${item.product.image}`}
                sx={{
                  width: 110,
                  height: 110,
                  borderRadius: 2,
                }}
              />

              <Box flex={1}>

                <Typography
                  variant="h6"
                >
                  {item.productName}
                </Typography>

                <Typography>
                  Qty :
                  {" "}
                  {item.quantity}
                </Typography>

                <Typography>
                  Accepted :
                  {" "}
                  {item.acceptedQty}
                </Typography>

                <Typography>
                  Cancelled :
                  {" "}
                  {item.cancelledQty}
                </Typography>

                <Typography>
                  ₹{item.price}
                </Typography>

                <Chip
                  sx={{
                    mt: 1,
                  }}
                  label={
                    item.itemStatus
                  }
                  color={
                    item.itemStatus ===
                    "Delivered"
                      ? "success"
                      : item.itemStatus ===
                        "Cancelled"
                      ? "error"
                      : "warning"
                  }
                />

              </Box>

              <Typography
                fontWeight={700}
              >
                ₹
                {item.price *
                  item.quantity}
              </Typography>

            </Box>

          </CardContent>
        </Card>
      ))}

      {/* Payment */}

      <Card
        sx={{
          mt: 4,
        }}
      >
        <CardContent>

          <Typography
            variant="h5"
            mb={2}
          >
            Payment Summary
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            mb={1}
          >
            <Typography>
              Payment Method
            </Typography>

            <Typography>
              {order.paymentMethod}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            mb={1}
          >
            <Typography>
              Payment Status
            </Typography>

            <Typography>
              {order.paymentStatus}
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            mb={1}
          >
            <Typography>
              Refund
            </Typography>

            <Typography>
              ₹{order.refundAmount}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            display="flex"
            justifyContent="space-between"
          >
            <Typography
              fontWeight={700}
            >
              Total
            </Typography>

            <Typography
              fontWeight={700}
            >
              ₹{order.totalAmount}
            </Typography>
          </Box>

        </CardContent>
      </Card>

      {/* Action Buttons */}

      <Box
        mt={4}
        display="flex"
        gap={2}
      >

        {/* TODO:
            Show only after Delivered
        */}
        <Button
          variant="contained"
        >
          Buy Again
        </Button>

        {/* TODO:
            Enable only within return window
        */}
        <Button
          variant="outlined"
        >
          Return Product
        </Button>

        {/* TODO:
            Download invoice PDF
        */}
        <Button
          variant="outlined"
        >
          Download Invoice
        </Button>

      </Box>

    </Box>
  );
};

export default CustomerOrderDetails;