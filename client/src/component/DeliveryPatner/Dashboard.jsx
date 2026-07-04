import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HistoryIcon from "@mui/icons-material/History";

import { useEffect, useState } from "react";
import api from "../../api/axios";

const statCards = [
  {
    key: "assigned",
    label: "Assigned Orders",
    icon: AssignmentIcon,
    color: "primary.main",
  },
  {
    key: "picked",
    label: "Picked Orders",
    icon: LocalShippingIcon,
    color: "warning.main",
  },
  {
    key: "delivered",
    label: "Delivered Orders",
    icon: CheckCircleIcon,
    color: "success.main",
  },
  {
    key: "cancelled",
    label: "Cancelled Orders",
    icon: HistoryIcon,
    color: "error.main",
  },
];

const Dashboard = () => {
  const [deliveryBoy, setDeliveryBoy] = useState(null);

  const [dashboard, setDashboard] = useState({
    assigned: 0,
    picked: 0,
    delivered: 0,
    cancelled: 0,
  });

  useEffect(() => {
    getProfile();
    // getDashboard();
  }, []);

  const getProfile = async () => {
    try {
      const res = await api.get("/deliveryBoy/profile");

      setDeliveryBoy(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={{ xs: 2, sm: 3 }}
        sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
      >
        Delivery Partner Dashboard
      </Typography>

      {/* Welcome Card */}

      <Card
        sx={{
          mb: { xs: 2, sm: 3 },
          borderRadius: "16px",
          border: "1px solid #eaeaea",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ fontSize: { xs: "1.05rem", sm: "1.25rem" } }}>
            Welcome, <strong>{deliveryBoy?.name}</strong>
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 0.5, sm: 4 }}
            mt={1.5}
          >
            <Typography>
              Vehicle : <strong>{deliveryBoy?.vehicleType}</strong>
            </Typography>

            <Typography>
              Vehicle Number : <strong>{deliveryBoy?.vehicleNumber}</strong>
            </Typography>
          </Stack>

          <Stack direction="row" flexWrap="wrap" spacing={2} mt={2}>
            <Chip
              label={deliveryBoy?.isAvailable ? "Available" : "Busy"}
              color={deliveryBoy?.isAvailable ? "success" : "warning"}
              sx={{ fontWeight: 600 }}
            />

            <Chip
              label={deliveryBoy?.isVerified ? "Verified" : "Pending"}
              color={deliveryBoy?.isVerified ? "success" : "default"}
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Dashboard Cards */}

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <Grid item xs={6} md={3} key={key}>
            <Card
              sx={{
                borderRadius: "16px",
                border: "1px solid #eaeaea",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                height: "100%",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: { xs: 1.75, sm: 2.5 } }}>
                <Icon sx={{ color, fontSize: { xs: 30, sm: 38 } }} />

                <Typography
                  variant="h4"
                  mt={1}
                  fontWeight={700}
                  sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                >
                  {dashboard[key]}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
                >
                  {label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;