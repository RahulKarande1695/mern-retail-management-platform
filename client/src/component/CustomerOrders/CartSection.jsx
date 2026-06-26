import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/axios";


const CartSection = ({ cart, refresh }) => {
  const increaseQty = async (item) => {
    await api.post("/cart/update", {
      productId: item.product._id,
      quantity: item.quantity + 1,
    });

    refresh();
  };

  const decreaseQty = async (item) => {
    if (item.quantity === 1) return;

    await api.post("/cart/update", {
      productId: item.product._id,
      quantity: item.quantity - 1,
    });

    refresh();
  };

  const removeItem = async (item) => {
    await api.post("/cart/remove", {
      productId: item.product._id,
    });

    refresh();
  };

  const handlePayment = async () => {
    alert("Checkout API Next 😄");
  };

  const total = cart.items.reduce(
    (sum, item) =>
      sum +
      item.product.sellingPrice * item.quantity,
    0
  );

  return (
    <Box mb={5}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
      >
        🛒 My Cart
      </Typography>

      {cart.items.map((item) => (
        <Card
          key={item._id}
          sx={{
            mb: 2,
            borderRadius: 3,
          }}
        >
          <CardContent>

            <Box
              display="flex"
              gap={3}
            >

              <CardMedia
                component="img"
                image={`http://localhost:5000/uploads/${item.product.image}`}
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                }}
              />

              <Box flex={1}>

                <Typography
                  variant="h6"
                >
                  {item.product.name}
                </Typography>

                <Typography
                  color="text.secondary"
                >
                  {item.product.brand?.name}
                </Typography>

                <Typography>
                  {item.product.packSize}
                </Typography>

                <Box
                  display="flex"
                  gap={2}
                  mt={1}
                >
                  <Typography
                    sx={{
                      textDecoration:
                        "line-through",
                    }}
                  >
                    ₹{item.product.mrp}
                  </Typography>

                  <Typography
                    color="green"
                    fontWeight={700}
                  >
                    ₹{item.product.sellingPrice}
                  </Typography>
                </Box>

                <Box
                  mt={2}
                  display="flex"
                  alignItems="center"
                >
                  <IconButton
                    onClick={() =>
                      decreaseQty(item)
                    }
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Typography
                    mx={2}
                    fontWeight={700}
                  >
                    {item.quantity}
                  </Typography>

                  <IconButton
                    onClick={() =>
                      increaseQty(item)
                    }
                  >
                    <AddIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    sx={{
                      ml: 2,
                    }}
                    onClick={() =>
                      removeItem(item)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

              </Box>

              <Typography
                variant="h6"
                color="primary"
              >
                ₹
                {item.product.sellingPrice *
                  item.quantity}
              </Typography>

            </Box>

          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 3 }} />

      <Box
        display="flex"
        justifyContent="space-between"
        mb={1}
      >
        <Typography>
          Total
        </Typography>

        <Typography
          fontWeight={700}
        >
          ₹{total}
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
      >
        <Typography>
          Delivery
        </Typography>

        <Typography color="green">
          FREE
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h5"
          fontWeight={700}
        >
          ₹{total}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handlePayment}
        >
          PAY NOW
        </Button>
      </Box>
    </Box>
  );
};

export default CartSection;