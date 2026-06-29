import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import api from "../../api/axios";

import AddressSection from "./AddressSection";
import BillSummary from "./BillSummary";
import PaymentSection from "./PaymentSection";

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState(null);

  const [selectedAddress, setSelectedAddress] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    getAddresses();
    getCart();
  }, []);

  const getAddresses = async () => {
    try {
      const res = await api.get("/address");

      setAddresses(res.data);

      const defaultAddress = res.data.find((item) => item.isDefault);

      if (defaultAddress) {
        setSelectedAddress(defaultAddress._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCart = async () => {
    try {
      const res = await api.get("/cart");

      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await api.post("/checkout", {
        addressId: selectedAddress,
        paymentMethod,
      });

      navigate("/customer/order-success", {
        state: {
          order: res.data,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Checkout
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <AddressSection
            addresses={addresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            getAddresses={getAddresses}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <BillSummary cart={cart} />

          <PaymentSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            handlePayment={handlePayment}
            selectedAddress={selectedAddress}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
