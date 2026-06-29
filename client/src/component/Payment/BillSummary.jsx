import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";

const BillSummary = ({ cart }) => {
  if (!cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.items.reduce(
    (total, item) =>
      total +
      item.product.sellingPrice * item.quantity,
    0
  );

  const mrpTotal = cart.items.reduce(
    (total, item) =>
      total +
      item.product.mrp * item.quantity,
    0
  );

  const totalSavings = mrpTotal - subtotal;

  // Future: Calculate based on amount/pincode
  const deliveryCharge = 0;

  // Future: Platform fee
  const platformFee = 0;

  const grandTotal =
    subtotal +
    deliveryCharge +
    platformFee;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>

        <Typography
          variant="h6"
          fontWeight={600}
          mb={2}
        >
          Bill Summary
        </Typography>

        {/* Cart Products */}

        {cart.items.map((item) => (
          <Box
            key={item._id}
            display="flex"
            justifyContent="space-between"
            mb={1}
          >
            <Typography>
              {item.product.name}
              {" "}
              ×
              {" "}
              {item.quantity}
            </Typography>

            <Typography>
              ₹
              {item.product.sellingPrice *
                item.quantity}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box
          display="flex"
          justifyContent="space-between"
          mb={1}
        >
          <Typography>
            MRP Total
          </Typography>

          <Typography>
            ₹{mrpTotal}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          mb={1}
        >
          <Typography>
            Discount
          </Typography>

          <Typography color="green">
            - ₹{totalSavings}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          mb={1}
        >
          <Typography>
            Delivery Charge
          </Typography>

          <Typography>
            {deliveryCharge === 0
              ? "FREE"
              : `₹${deliveryCharge}`}
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          mb={2}
        >
          <Typography>
            Platform Fee
          </Typography>

          <Typography>
            ₹{platformFee}
          </Typography>
        </Box>

        <Divider />

        <Box
          display="flex"
          justifyContent="space-between"
          mt={2}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Grand Total
          </Typography>

          <Typography
            variant="h6"
            fontWeight={700}
          >
            ₹{grandTotal}
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );
};

export default BillSummary;