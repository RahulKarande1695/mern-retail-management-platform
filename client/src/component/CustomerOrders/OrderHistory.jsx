import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
  Button,
} from "@mui/material";

const OrderHistory = ({ orders = [] }) => {
  if (orders.length === 0) {
    return (
      <Box mt={5}>
        <Typography variant="h5" fontWeight={700}>
          Order History
        </Typography>

        <Typography
          color="text.secondary"
          mt={2}
        >
          No previous orders found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={5}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        Order History
      </Typography>

      {orders.map((order) => (
        <Card
          key={order._id}
          sx={{
            mb: 2,
            borderRadius: 3,
          }}
        >
          <CardContent>

            {/* Order Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              <Box>

                <Typography fontWeight={700}>
                  {order.orderNumber}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </Typography>

              </Box>

              <Chip
                label={order.orderStatus}
                color={
                  order.orderStatus ===
                  "Delivered"
                    ? "success"
                    : "error"
                }
              />

            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Order Summary */}

            <Box
              display="flex"
              justifyContent="space-between"
              mb={1}
            >
              <Typography>
                Payment
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
                Items
              </Typography>

              <Typography>
                {order.items.length}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
            >
              <Typography>
                Total
              </Typography>

              <Typography
                fontWeight={700}
              >
                ₹{order.totalAmount}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Future */}
            {/* TODO: Navigate to Order Details Page */}

            <Box textAlign="right">

              <Button
                variant="outlined"
              >
                View Details
              </Button>

            </Box>

          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default OrderHistory;