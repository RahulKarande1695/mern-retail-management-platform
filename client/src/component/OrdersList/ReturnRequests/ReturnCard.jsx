import { Card, CardContent, Typography, Box, Button } from "@mui/material";

import api from "../../../api/axios";

const ReturnCard = ({ order, item, refresh }) => {
  const approveReturn = async () => {
    try {
      await api.post(`/orders/${order._id}/items/${item._id}/return/approve`);

      alert("Return Approved");

      refresh();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectReturn = async () => {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    try {
      await api.post(`/orders/${order._id}/items/${item._id}/return/reject`, {
        reason,
      });

      alert("Return Rejected");

      refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          {item.productName}
        </Typography>

        <Typography>Order : {order.orderNumber}</Typography>

        <Typography>Customer :{order.customer?.name}</Typography>

        <Typography>Qty : {item.quantity}</Typography>

        <Typography>Amount : ₹{item.price * item.quantity}</Typography>

        <Typography color="error" mt={1}>
          Reason :{order.returnReason}
        </Typography>

        <Box display="flex" gap={2} mt={2}>
          <Button variant="contained" color="success" onClick={approveReturn}>
            Approve
          </Button>

          <Button variant="outlined" color="error" onClick={rejectReturn}>
            Reject
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReturnCard;
