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
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const CustomerOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
                {/* Return Status */}
                {item.returnStatus !== "None" && (
                  <Box mt={2}>
                    <Typography fontWeight={600}>Return Status</Typography>
                    <Chip
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
            {item.itemStatus === "Delivered" &&
              item.returnStatus === "None" && <Button>Request Return</Button>}
          </CardContent>
        </Card>
      ))}
      {order.paymentStatus === "Refunded" && (
        <Box
          mt={3}
          p={2}
          sx={{
            border: "1px solid #ddd",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            💰 Refund Details
          </Typography>

          <Typography>Amount : ₹{order.refundAmount}</Typography>

          <Typography>Status :{order.paymentStatus}</Typography>

          <Typography>
            Date :{new Date(order.refundDate).toLocaleString()}
          </Typography>
        </Box>
      )}
      {order.orderStatus === "Delivered" && (
        <Button variant="contained" onClick={repeatOrder}>
          Repeat Order
        </Button>
      )}
      {order.orderStatus === "Delivered" && (
        <Button variant="contained" onClick={downloadInvoice}>
          Download Invoice
        </Button>
      )}
    </Box>
  );
};

export default CustomerOrderDetails;
