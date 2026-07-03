import { Card, CardContent, Typography, Divider } from "@mui/material";

const RecentOrders = ({ orders }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Recent Orders
        </Typography>

        {orders.map((order) => (
          <div key={order._id}>
            <Typography>{order.orderNumber}</Typography>

            <Typography color="text.secondary">
              {order.customer?.name}
            </Typography>

            <Typography>₹{order.totalAmount}</Typography>

            <Divider sx={{ my: 1 }} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
