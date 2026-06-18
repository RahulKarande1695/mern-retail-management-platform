import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../App.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async () => {
    try {
      const res = await api.post(
        "/auth/register",
        formData
      );
      navigate("/");
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="main">

      <Typography
        variant="h4"
        textAlign="center"
        mb={3}
      >
        Register
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleRegister}
      >
        Register
      </Button>

      <Button
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => navigate("/")}
      >
        Back to Login
      </Button>
    </div>
  );
};

export default Register;
