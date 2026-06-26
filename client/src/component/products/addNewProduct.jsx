import {
  Box,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import leftArrow from "../../leftArrow.svg";
import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../../api/axios";

const statusOptions = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inActive",
    label: "In-Active",
  },
];

const fieldStyle = {
  width: "100%",
};

const AddNewProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] =
    useState([]);
  const [brands, setBrands] = useState([]);
  const [file, setFile] = useState(null);
  const [product, setProduct] =
    useState({
      category: "",
      brand: "",
      name: "",
      packSize: "",
      mrp: "",
      sellingPrice: "",
      stock: "",
      status: "active",
    });

  useEffect(() => {
    getCategories();

    if (id) {
      getProductById();
    }
  }, [id]);

  const getCategories = async () => {
    try {
      const res = await api.get(
        "/categories"
      );
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getBrandsByCategory =
    async (categoryId) => {
      try {
        const res = await api.get(
          `/brands/category/${categoryId}`
        );

        setBrands(res.data);
      } catch (err) {
        console.log(err);
      }
    };

  const getProductById = async () => {
    try {
      const res = await api.get(
        `/products/${id}`
      );

      setProduct({
        category:
          res.data.category?._id || "",
        brand:
          res.data.brand?._id || "",
        name: res.data.name || "",
        packSize:
          res.data.packSize || "",
        mrp: res.data.mrp || "",
        sellingPrice:
          res.data.sellingPrice || "",
        stock: res.data.stock || "",
        status: res.data.status
          ? "active"
          : "inActive",
      });

      if (res.data.category?._id) {
        getBrandsByCategory(
          res.data.category._id
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    try {
      const formData =
        new FormData();

      formData.append(
        "category",
        product?.category
      );
      formData.append(
        "brand",
        product?.brand
      );
      formData.append(
        "name",
        product?.name
      );
      formData.append(
        "packSize",
        product?.packSize
      );
      formData.append(
        "mrp",
        product?.mrp
      );
      formData.append(
        "sellingPrice",
        product?.sellingPrice
      );
      formData.append(
        "stock",
        product?.stock
      );
      formData.append(
        "status",
        product?.status === "active"
      );

      if (file) {
        formData.append(
          "image",
          file
        );
      }

      if (id) {
        await api.put(
          `/products/${id}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      } else {
        await api.post(
          "/products",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );
      }

      navigate(
        "/dgflake/products"
      );
    } catch (err) {
      console.log(err);
      alert(
        err?.response?.data
          ?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <Box
      sx={{
        background: "#fff",
        boxShadow:
          "0px 1px 4px rgba(0,0,0,0.2)",
        padding: "20px",
        margin: "10px",
        minHeight: "85vh",
        position: "relative",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap="15px"
        mb={4}
      >
        <img
          src={leftArrow}
          alt="Arrow"
          style={{
            cursor: "pointer",
          }}
          onClick={() =>
            navigate(-1)
          }
        />

        <span
          style={{
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          {id
            ? "Edit Product"
            : "Add Product"}
        </span>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <TextField
          select
          label="Category"
          value={product.category}
          onChange={(e) => {
            setProduct({
              ...product,
              category:
                e.target.value,
              brand: "",
            });

            getBrandsByCategory(
              e.target.value
            );
          }}
          sx={fieldStyle}
        >
          {categories.map(
            (item) => (
              <MenuItem
                key={item._id}
                value={item._id}
              >
                {item.name}
              </MenuItem>
            )
          )}
        </TextField>

        <TextField
          select
          label="Brand"
          value={product.brand}
          onChange={(e) =>
            setProduct({
              ...product,
              brand:
                e.target.value,
            })
          }
          sx={fieldStyle}
        >
          {brands.map((item) => (
            <MenuItem
              key={item._id}
              value={item._id}
            >
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Product Name"
          value={product.name}
          onChange={(e) =>
            setProduct({
              ...product,
              name:
                e.target.value,
            })
          }
          sx={fieldStyle}
        />

        <TextField
          label="Pack Size"
          value={product.packSize}
          onChange={(e) =>
            setProduct({
              ...product,
              packSize:
                e.target.value,
            })
          }
          sx={fieldStyle}
        />

        <TextField
          label="MRP"
          type="number"
          value={product.mrp}
          onChange={(e) =>
            setProduct({
              ...product,
              mrp:
                e.target.value,
            })
          }
          sx={fieldStyle}
        />

        <TextField
          label="Selling Price"
          type="number"
          value={
            product.sellingPrice
          }
          onChange={(e) =>
            setProduct({
              ...product,
              sellingPrice:
                e.target.value,
            })
          }
          sx={fieldStyle}
        />

        <TextField
          label="Stock"
          type="number"
          value={product.stock}
          onChange={(e) =>
            setProduct({
              ...product,
              stock:
                e.target.value,
            })
          }
          sx={fieldStyle}
        />

        <Button
          variant="outlined"
          component="label"
          sx={{
            height: "56px",
          }}
        >
          {file
            ? file.name
            : "Upload Product Image"}

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />
        </Button>

        <TextField
          select
          label="Status"
          value={product.status}
          onChange={(e) =>
            setProduct({
              ...product,
              status:
                e.target.value,
            })
          }
          sx={fieldStyle}
        >
          {statusOptions.map(
            (option) => (
              <MenuItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            )
          )}
        </TextField>
      </Box>

      <Box
        display="flex"
        justifyContent="flex-end"
        gap="20px"
        mt={5}
      >
        <Button
          variant="contained"
          onClick={() =>
            navigate(-1)
          }
        >
          Cancel
        </Button>

        <Button
          variant="outlined"
          onClick={handleAdd}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AddNewProduct;