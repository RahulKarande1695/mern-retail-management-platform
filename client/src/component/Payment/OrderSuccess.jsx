import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  const { state } = useLocation();

  const order = state?.order;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 2, sm: 3 },
        minHeight: "80vh",
        justifyContent: "center",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Card
        sx={{
          maxWidth: 550,
          width: "100%",
          textAlign: "center",
          borderRadius: "20px",
          border: "1px solid #eaeaea",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <CheckCircleOutlineIcon
            color="success"
            sx={{ fontSize: { xs: 70, sm: 90 }, mb: 1 }}
          />

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ fontSize: { xs: "1.4rem", sm: "1.9rem" } }}
          >
            Order Placed Successfully
          </Typography>

          <Typography color="text.secondary" mt={1.5}>
            Thank you for shopping with us.
          </Typography>

          <Stack
            spacing={1.5}
            mt={4}
            sx={{
              bgcolor: "#fafafa",
              border: "1px solid #eee",
              borderRadius: "14px",
              p: 2.5,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Order Number
              </Typography>
              <Typography fontWeight={700}>{order?.orderNumber}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Payment Status
              </Typography>
              <Typography fontWeight={700} color="success.main">
                {order?.paymentStatus}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography fontWeight={700}>₹{order?.totalAmount}</Typography>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            mt={4}
            sx={{ "& .MuiButton-root": { borderRadius: "10px", textTransform: "none" } }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate(`/customer/orders/${order?._id}`)}
            >
              Track Order
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/customer")}
            >
              Continue Shopping
            </Button>
          </Stack>

          <Button
            variant="text"
            fullWidth
            onClick={() => navigate("/customer/cart")}
            sx={{ mt: 1.5, borderRadius: "10px", textTransform: "none" }}
          >
            My Orders
          </Button>
        </CardContent>
      </Card>

      <Card
        sx={{
          maxWidth: 550,
          width: "100%",
          borderRadius: "20px",
          border: "1px solid #eaeaea",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1.5}
            sx={{ "& .MuiButton-root": { borderRadius: "10px", textTransform: "none" } }}
          >
            {/* Cancel Order */}
            {order?.orderStatus === "Placed" && (
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
            {order?.orderStatus === "Delivered" && (
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
            {order?.orderStatus === "Delivered" && (
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
            {order?.orderStatus === "Delivered" && (
              <Button
                variant="contained"
                onClick={() => {
                  // TODO
                }}
              >
                Repeat Order
              </Button>
            )}
          </Stack>

          {order?.deliveryBoy && (
            <Box
              mt={2.5}
              p={2}
              sx={{
                border: "1px solid #eee",
                borderRadius: "14px",
                bgcolor: "#fafafa",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                <LocalShippingIcon color="primary" />
                <Typography variant="h6" fontWeight={700} sx={{ fontSize: "1.05rem" }}>
                  Delivery Partner
                </Typography>
              </Stack>

              <Stack spacing={0.4} mb={2}>
                <Typography>
                  <b>Name :</b> {order.deliveryBoy.name}
                </Typography>

                <Typography>
                  <b>Mobile :</b> {order.deliveryBoy.mobile}
                </Typography>

                <Typography>
                  <b>Vehicle :</b> {order.deliveryBoy.vehicleType}
                </Typography>
              </Stack>

              <Button
                variant="contained"
                href={`tel:${order.deliveryBoy.mobile}`}
                sx={{ borderRadius: "10px", textTransform: "none" }}
              >
                Contact Delivery Partner
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderSuccess;