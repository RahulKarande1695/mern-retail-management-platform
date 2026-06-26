import { Box, Button } from "@mui/material";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../../api/axios";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    const res = await api.get(`/orders/${id}`);

    setOrder(res.data);
  };

  const handleAccept = async (item) => {
    await api.post(`/orders/${order._id}/items/${item._id}/accept`, {
      acceptedQty: 1,
    });

    getOrder();
  };

  const handleCancel = async (item) => {
    try {
      await api.post(`/orders/${order._id}/items/${item._id}/cancel`, {
        cancelledQty: 1,
      });

      getOrder();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePack = async (item) => {
    try {
      await api.post(`/orders/${order._id}/items/${item._id}/pack`);

      getOrder();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelivered = async (item) => {
    try {
      await api.post(`/orders/${order._id}/items/${item._id}/delivered`);

      getOrder();
    } catch (err) {
      console.log(err);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <Box p={3}>
      <h2>{order.orderNumber}</h2>
      <p>Customer :{order.customer?.name}</p>
      <p>Payment :{order.paymentStatus}</p>
      <p>Status :{order.orderStatus}</p>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Accepted</TableCell>
              <TableCell>Cancelled</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {order.items?.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.productName}</TableCell>

                <TableCell>{item.quantity}</TableCell>

                <TableCell>{item.acceptedQty}</TableCell>

                <TableCell>{item.cancelledQty}</TableCell>

                <TableCell>₹{item.price}</TableCell>

                <TableCell>
                  <Chip label={item.itemStatus} size="small" />
                </TableCell>

                <TableCell>
                  {item.itemStatus === "Placed" && (
                    <>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleAccept(item)}
                      >
                        Accept
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleCancel(item)}
                      >
                        CANCEL
                      </Button>
                    </>
                  )}

                  {(item.itemStatus === "Accepted" ||
                    item.itemStatus === "PartiallyAccepted") && (
                    <Button
                      color="warning"
                      size="small"
                      onClick={() => handlePack(item)}
                    >
                      PACK
                    </Button>
                  )}

                  {item.itemStatus === "Packed" && (
                    <Button size="small" onClick={() => handleDelivered(item)}>
                      DELIVER
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={4}>
        <h3>Tracking History</h3>

        {order.items?.map((item) => (
          <Box key={item._id} mt={3}>
            <h4>{item.productName}</h4>

            {item.trackingHistory?.map((track, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  mb: 1,
                  bgcolor: "#f5f5f5",
                }}
              >
                <strong>{track.status}</strong>
                <br />
                {new Date(track.updatedAt).toLocaleString()}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OrderDetails;
