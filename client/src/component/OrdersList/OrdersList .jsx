import {
  Box,
  TextField,
  MenuItem,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

import PageContainer from "../common/PageContainer";
import TableWrapper from "../common/TableWrapper";
import Loader from "../common/Loader";
import usePagination from "../../hooks/usePagination";

const OrdersList = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);

  const { page, rowsPerPage, setPage, handleRows, paginate } = usePagination();

  useEffect(() => {
    getOrders();

    socket.on("ORDER_UPDATED", () => {
      console.log("Shop Orders realtime");
      getOrders();
    });

    return () => {
      socket.off("ORDER_UPDATED");
    };
  }, [status]);

  const getOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/orders?status=${status}`);

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <PageContainer>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <h2>Orders</h2>

        <TextField
          select
          size="small"
          label="Status"
          value={status}
          sx={{
            width: 200,
          }}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>

          <MenuItem value="Placed">New Orders</MenuItem>

          <MenuItem value="Processing">Processing</MenuItem>

          <MenuItem value="Delivered">Delivered</MenuItem>

          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </TextField>
      </Box>

      <TableWrapper>
        <Table>
          <TableHead
            sx={{
              background: "#FFF8B7",
            }}
          >
            <TableRow>
              <TableCell>Sr</TableCell>

              <TableCell>Order No</TableCell>

              <TableCell>Customer</TableCell>

              <TableCell>Items</TableCell>

              <TableCell>Total</TableCell>

              <TableCell>Payment</TableCell>

              <TableCell>Status</TableCell>

              <TableCell>Delivery</TableCell>

              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginate(orders).map((order, index) => {
              const deliveryStatus = order.trackingHistory?.length
                ? order.trackingHistory[order.trackingHistory.length - 1].status
                : "-";

              return (
                <TableRow key={order._id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>

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
                    <Chip size="small" color="info" label={deliveryStatus} />
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
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
      </TableWrapper>

      <TablePagination
        component="div"
        count={orders.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, p) => setPage(p)}
        onRowsPerPageChange={handleRows}
      />
    </PageContainer>
  );
};

export default OrdersList;
