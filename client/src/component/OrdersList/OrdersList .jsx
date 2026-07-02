import React, { useEffect, useState } from "react";

import { Box, MenuItem, TextField, Chip, Button } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((item) => item.orderStatus === statusFilter);

  return (
    <Box
      sx={{
        background: "#FFFFFF",
        boxShadow: "0px 1px 4px 0px #000000",
        padding: "10px",
        margin: "10px",
        minHeight: "85vh",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <h2>Orders</h2>

        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter || "All"}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{
            width: "220px",
          }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Placed">New Orders</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ background: "#FFF8B7" }}>
            <TableRow>
              <TableCell>Sr No</TableCell>
              <TableCell>Order No</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Orders Found
                </TableCell>
              </TableRow>
            )}

            {filteredOrders.map((order, index) => {
              const deliveryStatus =
                order.trackingHistory.length > 0
                  ? order.trackingHistory[order.trackingHistory.length - 1]
                      .status
                  : "-";
              return (
                <TableRow key={order._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.customer?.name}</TableCell>
                  <TableCell>{order.items?.length}</TableCell>
                  <TableCell>₹{order.totalAmount}</TableCell>
                  <TableCell>
                    <Chip size="small" label={order.paymentStatus} />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={order.orderStatus} />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={deliveryStatus} color="info" />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/dgflake/orders/${order._id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdersList;
