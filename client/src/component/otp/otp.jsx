import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const handleVerifyOtp = async () => {
    try {
      const res = await api.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      localStorage.setItem(
        "accessToken",
        res.data.accessToken
      );

      navigate("/dgflake");
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Invalid OTP"
      );
    }
  };

  return (
    <div
     className="main"
    >
      <Typography
        variant="h5"
        mb={2}
        textAlign="center"
      >
        Verify OTP
      </Typography>

      <Typography
        variant="body2"
        mb={2}
        textAlign="center"
      >
        OTP sent to {email}
      </Typography>

      <TextField
        fullWidth
        label="Enter OTP"
        value={otp}
        onChange={(e) =>
          setOtp(e.target.value)
        }
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