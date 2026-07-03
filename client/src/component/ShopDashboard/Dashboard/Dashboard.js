import { Box, Grid, Typography } from "@mui/material";

import { useEffect, useState } from "react";

import api from "../../../api/axios";

import AnalyticsCard from "./AnalyticsCard";
import TopProductsChart from "./TopProductsChart";
import RecentOrders from "./RecentOrders";

const ShopDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAnalytics();
  }, []);

  const getAnalytics = async () => {
    try {
      const res = await api.get("/analytics/dashboard");

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data) {
    return <>Loading...</>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <AnalyticsCard title="Total Orders" value={data.totalOrders} />
        </Grid>

        <Grid item xs={12} md={3}>
          <AnalyticsCard title="Sales" value={`₹${data.totalSales}`} />
        </Grid>

        <Grid item xs={12} md={3}>
          <AnalyticsCard title="Delivered" value={data.deliveredOrders} />
        </Grid>

        <Grid item xs={12} md={3}>
          <AnalyticsCard title="Cancelled" value={data.cancelledOrders} />
        </Grid>

        <Grid item xs={12} md={3}>
          <AnalyticsCard title="Returns" value={data.returnRequests} />
        </Grid>

        <Grid item xs={12} md={3}>
          <AnalyticsCard title="Refund" value={`₹${data.refundAmount}`} />
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <TopProductsChart data={data.topProducts} />
        </Grid>

        <Grid item xs={12} md={6}>
          <RecentOrders orders={data.recentOrders} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShopDashboard;
