import { Box, Typography, CircularProgress } from "@mui/material";

import { useEffect, useState } from "react";
import api from "../../../api/axios";

import ApprovedReturnCard from "./ApprovedReturnCard";

const ApprovedReturns = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedReturns();
  }, []);

  const getApprovedReturns = async () => {
    try {
      const res = await api.get("/orders/returns/approved");

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
        Approved Returns
      </Typography>

      {orders.length === 0 && <Typography>No Approved Returns</Typography>}

      {orders.map((order) =>
        order.items
          .filter((item) => item.returnStatus === "Approved")
          .map((item) => (
            <ApprovedReturnCard
              key={item._id}
              order={order}
              item={item}
              refresh={getApprovedReturns}
            />
          )),
      )}
    </Box>
  );
};

export default ApprovedReturns;
