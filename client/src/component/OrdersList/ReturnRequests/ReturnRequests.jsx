import { Box, Typography, CircularProgress } from "@mui/material";

import { useEffect, useState } from "react";
import api from "../../../api/axios";

import ReturnCard from "./ReturnCard";

const ReturnRequests = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReturns();
  }, []);

  const getReturns = async () => {
    try {
      const res = await api.get("/orders/returns");

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Return Requests
      </Typography>

      {orders.length === 0 && <Typography>No Return Requests</Typography>}

      {orders.map((order) =>
        order.items
          .filter((item) => item.returnStatus === "Requested")
          .map((item) => (
            <ReturnCard
              key={item._id}
              order={order}
              item={item}
              refresh={getReturns}
            />
          )),
      )}
    </Box>
  );
};

export default ReturnRequests;
