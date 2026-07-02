import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Typography,
} from "@mui/material";

import TrackingStepper from "./TrackingStepper";

const CurrentOrder = ({ order }) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const latestStatus =
    order.trackingHistory[order.trackingHistory.length - 1]?.status;
  return (
    <Box mt={5}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        📦 Current Order
      </Typography>

      <Typography color="primary" fontWeight={600}>
        Latest Update : {latestStatus}
      </Typography>

      <Card
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Box>
              <Typography variant="h6">{order.orderNumber}</Typography>

              <Typography color="text.secondary">
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Box>

            <Chip
              label={order.paymentStatus}
              color={order.paymentStatus === "Paid" ? "success" : "warning"}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <TrackingStepper status={order.orderStatus} trackingHistory={order.trackingHistory}/>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" mb={2}>
            Products
          </Typography>

          {order.items.map((item) => (
            <Card
              key={item._id}
              sx={{
                mb: 2,
                boxShadow: 0,
                border: "1px solid #eee",
              }}
            >
              <CardContent>
                <Box display="flex" gap={2}>
                  <CardMedia
                    component="img"
                    image={`http://localhost:5000/uploads/${item.product.image}`}
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: 2,
                    }}
                  />

                  <Box flex={1}>
                    <Typography fontWeight={600}>{item.productName}</Typography>

                    <Typography color="text.secondary">
                      Qty : {item.quantity}
                    </Typography>

                    <Typography color="text.secondary">
                      ₹{item.price}
                    </Typography>

                    <Chip
                      size="small"
                      label={item.itemStatus}
                      color={
                        item.itemStatus === "Delivered"
                          ? "success"
                          : item.itemStatus === "Cancelled"
                            ? "error"
                            : "warning"
                      }
                      sx={{
                        mt: 1,
                      }}
                    />
                  </Box>

                  <Typography fontWeight={700}>
                    ₹{item.price * item.quantity}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Items</Typography>

            <Typography>{totalItems}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Payment</Typography>

            <Typography>{order.paymentMethod}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Total Amount</Typography>

            <Typography fontWeight={700}>₹{order.totalAmount}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CurrentOrder;
