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
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={{ xs: 2, sm: 3 }}
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
      >
        My Profile
      </Typography>

      <Card
        sx={{
          borderRadius: "16px",
          border: "1px solid #eaeaea",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3.5 } }}>
          <Stack spacing={1.5} alignItems="center" mb={4}>
            <Avatar
              src={`http://localhost:5000/uploads/${deliveryBoy.photo}`}
              sx={{
                width: { xs: 96, sm: 120 },
                height: { xs: 96, sm: 120 },
                border: "3px solid #fff",
                boxShadow: "0 0 0 2px #e0e0e0",
              }}
            />

            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mt: 1, fontSize: { xs: "1rem", sm: "1.1rem" } }}
            >
              {deliveryBoy.name || "—"}
            </Typography>

            <Chip
              label={deliveryBoy.isAvailable ? "Available" : "Busy"}
              color={deliveryBoy.isAvailable ? "success" : "warning"}
              sx={{ fontWeight: 600, px: 1 }}
            />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={{ xs: 2, sm: 2.5 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Name"
                name="name"
                value={deliveryBoy.name}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                value={deliveryBoy.email}
                disabled
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Mobile"
                value={deliveryBoy.mobile}
                disabled
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Vehicle Type"
                name="vehicleType"
                value={deliveryBoy.vehicleType}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Vehicle Number"
                name="vehicleNumber"
                value={deliveryBoy.vehicleNumber}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Divider sx={{ my: { xs: 0.5, sm: 1 } }}>
                <Typography variant="caption" color="text.secondary">
                  BANK DETAILS
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Bank Name"
                name="bankName"
                value={deliveryBoy.bankName}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Account Holder"
                name="accountHolderName"
                value={deliveryBoy.accountHolderName}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="Account Number"
                name="accountNumber"
                value={deliveryBoy.accountNumber}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                label="IFSC Code"
                name="ifscCode"
                value={deliveryBoy.ifscCode}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            mb={3}
            sx={{
              bgcolor: "#fafafa",
              border: "1px solid #eee",
              borderRadius: "12px",
              px: 2,
              py: 1.5,
            }}
          >
            <Typography fontWeight={500}>Availability</Typography>

            <Switch checked={deliveryBoy.isAvailable} onChange={handleAvailability} />
          </Stack>

          <Button
            variant="contained"
            onClick={updateProfile}
            fullWidth
            sx={{
              borderRadius: "10px",
              py: 1.2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;