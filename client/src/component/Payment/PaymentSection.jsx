import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
  handlePayment,
  selectedAddress,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Payment Method
        </Typography>

        <RadioGroup
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="COD"
            control={<Radio />}
            label="Cash On Delivery"
          />

          <FormControlLabel value="UPI" control={<Radio />} label="UPI" />

          <FormControlLabel
            value="CARD"
            control={<Radio />}
            label="Credit / Debit Card"
          />
        </RadioGroup>

        <Divider sx={{ my: 3 }} />

        {/* Future Payment Information */}

        {paymentMethod === "COD" && (
          <Typography variant="body2" color="text.secondary">
            Pay cash when your order is delivered.
          </Typography>
        )}

        {paymentMethod === "UPI" && (
          <Typography variant="body2" color="text.secondary">
            UPI payment will be integrated in the next phase.
          </Typography>
        )}

        {paymentMethod === "CARD" && (
          <Typography variant="body2" color="text.secondary">
            Card payment will be integrated in the next phase.
          </Typography>
        )}

        <Box mt={4}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={!selectedAddress}
            onClick={handlePayment}
          >
            {paymentMethod === "COD" ? "Place Order" : "Pay Now"}
          </Button>
        </Box>

        {!selectedAddress && (
          <Typography mt={2} color="error" fontSize={14}>
            Please select a delivery address before proceeding.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSection;
