import { Box, Button, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const roleLog = location.state?.role;

  const handleVerifyOtp = async () => {
    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
        role: roleLog,
      });

      const { accessToken, role, user } = res.data;

      switch (role) {
        case "shop":
          localStorage.setItem("shopToken", accessToken);
          localStorage.setItem("shop", JSON.stringify(user));
          sessionStorage.setItem("currentRole", "shop");
          navigate("/dgflake");
          break;

        case "customer":
          localStorage.setItem("customerToken", accessToken);
          localStorage.setItem("customer", JSON.stringify(user));
          sessionStorage.setItem("currentRole", "customer");
          navigate("/customer");
          break;

        case "deliveryPartner":
          localStorage.setItem("deliveryPartnerToken", accessToken);
          localStorage.setItem("deliveryPartner", JSON.stringify(user));
          sessionStorage.setItem("currentRole", "deliveryPartner");
          navigate("/delivery/dashboard");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="main">
      <Typography variant="h5" mb={2} textAlign="center">
        Verify OTP
      </Typography>

      <Typography variant="body2" mb={2} textAlign="center">
        OTP sent to {email}
      </Typography>

      <TextField
        fullWidth
        label="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        margin="normal"
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleVerifyOtp}
        sx={{ mt: 2 }}
      >
        Verify OTP
      </Button>
    </div>
  );
};

export default VerifyOtp;
