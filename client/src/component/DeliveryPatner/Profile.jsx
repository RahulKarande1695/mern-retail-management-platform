import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import api from "../../api/axios";

const Profile = () => {
  const [deliveryBoy, setDeliveryBoy] = useState({
    name: "",
    email: "",
    mobile: "",

    vehicleType: "",
    vehicleNumber: "",

    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",

    isAvailable: false,
    photo: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const res = await api.get("/deliveryBoy/profile");

      setDeliveryBoy(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setDeliveryBoy({
      ...deliveryBoy,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvailability = async () => {
    try {
      await api.post("/deliveryBoy/toggle-availability");

      getProfile();
    } catch (err) {
      console.log(err);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(deliveryBoy).forEach((key) => {
        formData.append(key, deliveryBoy[key]);
      });

      await api.put(
        "/deliveryBoy/profile",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Profile Updated");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        My Profile
      </Typography>

      <Card>
        <CardContent>

          <Stack
            spacing={2}
            alignItems="center"
            mb={4}
          >
            <Avatar
              src={`http://localhost:5000/uploads/${deliveryBoy.photo}`}
              sx={{
                width: 120,
                height: 120,
              }}
            />

            <Chip
              label={
                deliveryBoy.isAvailable
                  ? "Available"
                  : "Busy"
              }
              color={
                deliveryBoy.isAvailable
                  ? "success"
                  : "warning"
              }
            />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={deliveryBoy.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={deliveryBoy.email}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mobile"
                value={deliveryBoy.mobile}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Type"
                name="vehicleType"
                value={deliveryBoy.vehicleType}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Number"
                name="vehicleNumber"
                value={deliveryBoy.vehicleNumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankName"
                value={deliveryBoy.bankName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Holder"
                name="accountHolderName"
                value={deliveryBoy.accountHolderName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Number"
                name="accountNumber"
                value={deliveryBoy.accountNumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="IFSC Code"
                name="ifscCode"
                value={deliveryBoy.ifscCode}
                onChange={handleChange}
              />
            </Grid>

          </Grid>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            mb={3}
          >
            <Typography>
              Availability
            </Typography>

            <Switch
              checked={
                deliveryBoy.isAvailable
              }
              onChange={
                handleAvailability
              }
            />
          </Stack>

          <Button
            variant="contained"
            onClick={updateProfile}
          >
            Update Profile
          </Button>

        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;