import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  MenuItem,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import dflogo from "../dflogo.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../App.css";

const LoginUi = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    if (!role) {
      return alert("Please select login role.");
    }
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
        role,
      });

      navigate("/verify-otp", {
        state: {
          email,
          role,
        },
      });
    } catch (err) {
      console.error(err);

      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="main">
      <Box display="flex" justifyContent="center">
        <img src={dflogo} className="App-logo" alt="logo" />
      </Box>

      <Box textAlign="center" mb={3}>
        <h1>Welcome to Digitalflake</h1>
      </Box>

      <Box mb={2}>
        <TextField
          fullWidth
          label="Email Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>

      <Box mb={2}>
        <FormControl sx={{ width: "100%" }} variant="outlined">
          <InputLabel>Password</InputLabel>

          <OutlinedInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <Box textAlign="end" color="#A08CB1" pt={1}>
          <p onClick={() => navigate("forgot")}>Forgot Password?</p>
        </Box>
      </Box>
      <Box mb={2}>
        <TextField
          select
          fullWidth
          label="Login As"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="shop">Shop</MenuItem>
          <MenuItem value="deliveryPartner">Delivery Partner</MenuItem>
        </TextField>
      </Box>
      <Box display="flex" justifyContent="center" gap="1vw">
        <Button variant="contained" onClick={handleLogin} fullWidth>
          Login
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/register")}
          fullWidth
        >
          Sign Up
        </Button>
      </Box>
    </div>
  );
};

export default LoginUi;
