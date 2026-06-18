import { Box, Button, MenuItem, TextField } from "@mui/material";
import leftArrow from "../../leftArrow.svg";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const AddNewProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);

  const [file, setFile] = useState(null);

  const [product, setProduct] = useState({
    category: "",
    name: "",
    packSize: "",
    mrp: "",
    status: "",
  });

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("packSize", product.packSize);
      formData.append("mrp", product.mrp);
      formData.append("category", product.category);
      formData.append("status", product.status === "active");

      if (file) {
        formData.append("image", file);
      }

      if (id) {
        await api.put(`/products/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/dgflake/products");
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  const getProductById = async () => {
  try {
    const res = await api.get(`/products/${id}`);

    setProduct({
      category: res.data.category?._id || "",
      name: res.data.name || "",
      packSize: res.data.packSize || "",
      mrp: res.data.mrp || "",
      status: res.data.status ? "active" : "inActive",
    });
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
  getCategories();

  if (id) {
    getProductById();
  }
}, [id]);

  return (
    <Box
      sx={{
        background: "#FFFFFF",
        boxShadow: "0px 1px 4px 0px #000000",
        padding: "20px",
        margin: "10px",
        height: "85vh",
      }}
    >
      <Box display="flex" gap="20px">
        <img src={leftArrow} alt="Arrow" onClick={() => navigate(-1)} />
        <span>
  {id ? "Edit Product" : "Add Product"}
</span>
      </Box>

      {/* Row 1 */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "30px",
        }}
      >
        <TextField
          select
          label="Category"
          value={product.category}
          onChange={(e) =>
            setProduct({
              ...product,
              category: e.target.value,
            })
          }
          sx={{ width: "350px" }}
        >
          {categories.map((item) => (
            <MenuItem key={item._id} value={item._id}>
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
              name: e.target.value,
            })
          }
          sx={{ width: "350px" }}
        />

        <TextField
          label="Pack Size"
          value={product.packSize}
          onChange={(e) =>
            setProduct({
              ...product,
              packSize: e.target.value,
            })
          }
          sx={{ width: "350px" }}
        />
      </Box>

      {/* Row 2 */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "30px",
        }}
      >
        <TextField
          label="MRP"
          value={product.mrp}
          onChange={(e) =>
            setProduct({
              ...product,
              mrp: e.target.value,
            })
          }
          sx={{ width: "350px" }}
        />

        <Button
          variant="outlined"
          component="label"
          sx={{
            width: "350px",
            height: "56px",
          }}
        >
          {file ? file.name : "Upload Product Image"}

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>

        <TextField
          select
          label="Status"
          value={product.status}
          onChange={(e) =>
            setProduct({
              ...product,
              status: e.target.value,
            })
          }
          sx={{ width: "350px" }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Buttons */}

      <Box
        position="absolute"
        right="20px"
        bottom="20px"
        display="flex"
        gap="30px"
      >
        <Button variant="contained" onClick={() => navigate(-1)}>
          Cancel
        </Button>

        <Button variant="outlined" onClick={handleAdd}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default AddNewProduct;
