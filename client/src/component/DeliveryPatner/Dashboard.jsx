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
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Delivery Partner Dashboard
      </Typography>

      {/* Welcome Card */}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            Welcome,
            <strong> {deliveryBoy?.name}</strong>
          </Typography>

          <Typography mt={1}>
            Vehicle :
            <strong>
              {" "}
              {deliveryBoy?.vehicleType}
            </strong>
          </Typography>

          <Typography mt={1}>
            Vehicle Number :
            <strong>
              {" "}
              {deliveryBoy?.vehicleNumber}
            </strong>
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            mt={2}
          >
            <Chip
              label={
                deliveryBoy?.isAvailable
                  ? "Available"
                  : "Busy"
              }
              color={
                deliveryBoy?.isAvailable
                  ? "success"
                  : "warning"
              }
            />

            <Chip
              label={
                deliveryBoy?.isVerified
                  ? "Verified"
                  : "Pending"
              }
              color={
                deliveryBoy?.isVerified
                  ? "success"
                  : "default"
              }
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Dashboard Cards */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <AssignmentIcon
                color="primary"
                fontSize="large"
              />

              <Typography
                variant="h4"
                mt={1}
              >
                {dashboard.assigned}
              </Typography>

              <Typography>
                Assigned Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <LocalShippingIcon
                color="warning"
                fontSize="large"
              />

              <Typography
                variant="h4"
                mt={1}
              >
                {dashboard.picked}
              </Typography>

              <Typography>
                Picked Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <CheckCircleIcon
                color="success"
                fontSize="large"
              />

              <Typography
                variant="h4"
                mt={1}
              >
                {dashboard.delivered}
              </Typography>

              <Typography>
                Delivered Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <HistoryIcon
                color="error"
                fontSize="large"
              />

              <Typography
                variant="h4"
                mt={1}
              >
                {dashboard.cancelled}
              </Typography>

              <Typography>
                Cancelled Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;