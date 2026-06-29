import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { useState } from "react";

import api from "../../api/axios";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      await api.post(
        "/deliveryBoy/change-password",
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }
      );

      alert("Password changed successfully");

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        Change Password
      </Typography>

      <Card
        sx={{
          maxWidth: 600,
        }}
      >
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Old Password"
                type={
                  showOldPassword
                    ? "text"
                    : "password"
                }
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowOldPassword(
                            !showOldPassword
                          )
                        }
                      >
                        {showOldPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="New Password"
                type={
                  showNewPassword
                    ? "text"
                    : "password"
                }
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowNewPassword(
                            !showNewPassword
                          )
                        }
                      >
                        {showNewPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "Update Password"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword;