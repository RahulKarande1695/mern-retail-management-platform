import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

const AssignedOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAssignedOrders();
  }, []);

  const getAssignedOrders = async () => {
    try {
      // API Later
      // const res = await api.get("/deliveryBoy/orders");
      // setOrders(res.data);

      setOrders([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box p={3}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        Assigned Orders
      </Typography>

      <Grid container spacing={3}>
        {orders.length > 0 ? (
          orders.map((order) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={order._id}
            >
              <Card>
                <CardContent>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography
                      fontWeight={700}
                    >
                      {order.orderNumber}
                    </Typography>

                    <Chip
                      label={
                        order.orderStatus
                      }
                      color="primary"
                    />
                  </Stack>

                  <Typography>
                    <strong>
                      Customer :
                    </strong>{" "}
                    {
                      order.customer
                        ?.name
                    }
                  </Typography>

                  <Typography>
                    <strong>
                      Mobile :
                    </strong>{" "}
                    {
                      order.customer
                        ?.mobile
                    }
                  </Typography>

                  <Typography mt={1}>
                    <strong>
                      Total :
                    </strong>{" "}
                    ₹
                    {
                      order.totalAmount
                    }
                  </Typography>

                  <Typography mt={1}>
                    <strong>
                      Items :
                    </strong>{" "}
                    {
                      order.items
                        ?.length
                    }
                  </Typography>

                  <Typography mt={1}>
                    <strong>
                      Address :
                    </strong>
                  </Typography>

                  <Typography
                    variant="body2"
                  >
                    {
                      order
                        .deliveryAddress
                        ?.houseNo
                    }
                    ,{" "}
                    {
                      order
                        .deliveryAddress
                        ?.area
                    }
                    ,{" "}
                    {
                      order
                        .deliveryAddress
                        ?.city
                    }
                  </Typography>

                  <Button
                    fullWidth
                    sx={{ mt: 3 }}
                    variant="contained"
                    onClick={() =>
                      navigate(
                        `/delivery/orders/${order._id}`
                      )
                    }
                  >
                    View Order
                  </Button>

                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  align="center"
                >
                  No Assigned Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AssignedOrders;