import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

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

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Order Placed Successfully
          </Typography>

          <Typography
            color="text.secondary"
            mt={2}
          >
            Thank you for shopping with us.
          </Typography>

          <Box mt={4}>

            <Typography>
              Order Number
            </Typography>

            <Typography
              fontWeight={700}
            >
              {order?.orderNumber}
            </Typography>

          </Box>

          <Box mt={2}>

            <Typography>
              Payment Status
            </Typography>

            <Typography
              fontWeight={700}
              color="green"
            >
              {order?.paymentStatus}
            </Typography>

          </Box>

          <Box mt={2}>

            <Typography>
              Total Amount
            </Typography>

            <Typography
              fontWeight={700}
            >
              ₹{order?.totalAmount}
            </Typography>

          </Box>

          <Box
            mt={5}
            display="flex"
            gap={2}
            justifyContent="center"
          >

            <Button
              variant="contained"
              onClick={() =>
                navigate(
                  `/customer/orders/${order?._id}`
                )
              }
            >
              Track Order
            </Button>

            <Button
              variant="outlined"
              onClick={() =>
                navigate("/customer/products")
              }
            >
              Continue Shopping
            </Button>

          </Box>

        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderSuccess;