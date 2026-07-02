import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

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

  if (!order) {
    return <h3>Loading...</h3>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Track Order
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
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

          <Typography mt={2}>
            <b>Order Status</b>
          </Typography>

          <Chip color="primary" label={order.orderStatus} />
        </CardContent>
      </Card>

      <Typography variant="h5" mb={2}>
        Products
      </Typography>

      {order.deliveryBoy && (
        <Box
          mt={3}
          p={2}
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
            bgcolor: "#fafafa",
          }}
        >
          <h3>🚚 Delivery Partner</h3>

          <p>
            <strong>Name :</strong> {order.deliveryBoy.name}
          </p>

          <p>
            <strong>Mobile :</strong> {order.deliveryBoy.mobile}
          </p>

          <p>
            <strong>Vehicle :</strong> {order.deliveryBoy.vehicleType}
          </p>

          <Button
            variant="contained"
            color="success"
            href={`tel:${order.deliveryBoy.mobile}`}
          >
            Call Delivery Partner
          </Button>
        </Box>
      )}
      {order.items.map((item) => (
        <Card key={item._id} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" gap={3}>
              <CardMedia
                component="img"
                image={`http://localhost:5000/uploads/${item.product.image}`}
                sx={{
                  width: 120,
                  height: 120,
                }}
              />

              <Box flex={1}>
                <Typography variant="h6">{item.productName}</Typography>

                <Typography>Qty : {item.quantity}</Typography>

                <Typography>Accepted : {item.acceptedQty}</Typography>

                <Typography>Cancelled : {item.cancelledQty}</Typography>

                <Typography color="primary" fontWeight={700}>
                  ₹{item.price}
                </Typography>

                <Chip sx={{ mt: 2 }} label={item.itemStatus} />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={700} mb={2}>
              Tracking History
            </Typography>

            {item.trackingHistory.length === 0 ? (
              <Typography>No Tracking Available</Typography>
            ) : (
              item.trackingHistory.map((track, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    pl: 2,
                    borderLeft: "4px solid green",
                  }}
                >
                  <Typography fontWeight={700}>{track.status}</Typography>

                  <Typography variant="body2">
                    {new Date(track.updatedAt).toLocaleString()}
                  </Typography>
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CustomerOrderDetails;
