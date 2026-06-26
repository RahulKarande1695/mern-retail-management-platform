import React, { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import api from "../../api/axios";

const CustomerProducts = () => {
  const [products, setProducts] = useState([]);

  const [qty, setQty] = useState({});

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const res = await api.get("/products/customer");

      setProducts(res.data);

      const quantity = {};

      res.data.forEach((item) => {
        quantity[item._id] = 1;
      });

      setQty(quantity);
    } catch (err) {
      console.log(err);
    }
  };

  const increaseQty = (product) => {
    setQty((prev) => ({
      ...prev,
      [product._id]: Math.min(
        prev[product._id] + 1,
        product.stock
      ),
    }));
  };

  const decreaseQty = (product) => {
    setQty((prev) => ({
      ...prev,
      [product._id]: Math.max(
        prev[product._id] - 1,
        1
      ),
    }));
  };

  const addToCart = (product) => {
    console.log({
      productId: product._id,
      quantity: qty[product._id],
    });

    alert("Cart API later 😄");
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill,minmax(280px,1fr))",
        gap: 3,
        p: 3,
      }}
    >
      {products.map((product) => (
        <Card key={product._id}>
          <CardMedia
            component="img"
            height="220"
            image={`http://localhost:5000/uploads/${product.image}`}
          />

          <CardContent>

            <Typography
              variant="h6"
              fontWeight={600}
            >
              {product.name}
            </Typography>

            <Typography
              color="text.secondary"
            >
              {product.brand?.name}
            </Typography>

            <Typography
              color="text.secondary"
            >
              {product.category?.name}
            </Typography>

            <Typography>
              {product.packSize}
            </Typography>

            <Box
              display="flex"
              gap={1}
              mt={2}
              alignItems="center"
            >
              <Typography
                sx={{
                  textDecoration:
                    "line-through",
                }}
              >
                ₹{product.mrp}
              </Typography>

              <Typography
                fontWeight={700}
                color="green"
              >
                ₹{product.sellingPrice}
              </Typography>
            </Box>

            <Typography
              color="success.main"
              mt={1}
            >
              Save ₹
              {product.mrp -
                product.sellingPrice}
            </Typography>

            <Typography
              mt={1}
            >
              Stock :
              {product.stock}
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={3}
              mb={2}
            >
              <IconButton
                onClick={() =>
                  decreaseQty(product)
                }
              >
                <RemoveIcon />
              </IconButton>

              <Typography
                sx={{
                  mx: 2,
                  fontWeight: 700,
                }}
              >
                {qty[product._id]}
              </Typography>

              <IconButton
                onClick={() =>
                  increaseQty(product)
                }
              >
                <AddIcon />
              </IconButton>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={() =>
                addToCart(product)
              }
            >
              Add To Cart
            </Button>

          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CustomerProducts;