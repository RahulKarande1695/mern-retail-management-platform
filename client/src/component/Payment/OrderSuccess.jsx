import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  const { state } = useLocation();

  const order = state?.order;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Card
        sx={{
          maxWidth: 550,
          width: "100%",
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        <CardContent>
          <CheckCircleOutlineIcon
            color="success"
            sx={{
              fontSize: 90,
              mb: 2,
            }}
          />

          <Typography variant="h4" fontWeight={700}>
            Order Placed Successfully
          </Typography>

          <Typography color="text.secondary" mt={2}>
            Thank you for shopping with us.
          </Typography>

          <Box mt={4}>
            <Typography>Order Number</Typography>

            <Typography fontWeight={700}>{order?.orderNumber}</Typography>
          </Box>

          <Box mt={2}>
            <Typography>Payment Status</Typography>

            <Typography fontWeight={700} color="green">
              {order?.paymentStatus}
            </Typography>
          </Box>

          <Box mt={2}>
            <Typography>Total Amount</Typography>

            <Typography fontWeight={700}>₹{order?.totalAmount}</Typography>
          </Box>

          <Box mt={5} display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => navigate(`/customer/orders/${order?._id}`)}
            >
              Track Order
            </Button>
            <Button variant="outlined" onClick={() => navigate("/customer")}>
              Continue Shopping
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("/customer/cart")}
          >
            My Orders
          </Button>
        </CardContent>
      </Card>
      <Box mt={4}>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {/* Cancel Order */}
          {order.orderStatus === "Placed" && (
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                // TODO
              }}
            >
              Cancel Order
            </Button>
          )}

          {/* Return Product */}
          {order.orderStatus === "Delivered" && (
            <Button
              color="warning"
              variant="contained"
              onClick={() => {
                // TODO
              }}
            >
              Return Product
            </Button>
          )}

          {/* Download Invoice */}
          {order.orderStatus === "Delivered" && (
            <Button
              variant="outlined"
              onClick={() => {
                // TODO
              }}
            >
              Download Invoice
            </Button>
          )}

          {/* Repeat Order */}
          {order.orderStatus === "Delivered" && (
            <Button
              variant="contained"
              onClick={() => {
                // TODO
              }}
            >
              Repeat Order
            </Button>
          )}
          {order.deliveryBoy && (
            <Box mt={4} p={2} border="1px solid #ddd" borderRadius={2}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Delivery Partner
              </Typography>

              <Typography>
                <b>Name :</b> {order.deliveryBoy.name}
              </Typography>

              <Typography>
                <b>Mobile :</b> {order.deliveryBoy.mobile}
              </Typography>

              <Typography>
                <b>Vehicle :</b> {order.deliveryBoy.vehicleType}
              </Typography>

              <Button
                sx={{ mt: 2 }}
                variant="contained"
                href={`tel:${order.deliveryBoy.mobile}`}
              >
                Contact Delivery Partner
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OrderSuccess;
