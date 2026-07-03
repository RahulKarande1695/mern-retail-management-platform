import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import api from "../../../api/axios";

const ApprovedReturnCard = ({ order, item, refresh }) => {
  const processRefund = async () => {
    try {
      await api.post(`/orders/${order._id}/items/${item._id}/refund`);

      alert("Refund Completed");

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

        <Typography>Order :{order.orderNumber}</Typography>

        <Typography>Customer :{order.customer?.name}</Typography>

        <Typography>Qty :{item.quantity}</Typography>

        <Typography>Refund Amount : ₹{item.price * item.quantity}</Typography>

        <Typography color="green" fontWeight={600}>
          Status : Approved
        </Typography>

        <Box mt={2}>
          <Button variant="contained" onClick={processRefund}>
            Process Refund
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApprovedReturnCard;
