import { Box, Button, MenuItem, TextField } from "@mui/material";
import leftArrow from "../../leftArrow.svg";
import { useEffect, useState } from "react";
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

const fieldStyle = {
  width: "100%",
};

const AddNewBrand = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);

  const [brand, setBrand] = useState({
    name: "",
    category: "",
    status: "active",
  });
console.log(brand, categories,"brand")
  useEffect(() => {
    getCategories();

    if (id) {
      getBrandById();
    }
  }, [id]);

  const getCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getBrandById = async () => {
    try {
      const res = await api.get(`/brands/${id}`);
      setBrand({
        name: res.data.name || "",
        category: res.data.category?._id || "",
        status: res.data.status ? "active" : "inActive",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...brand,
        status: brand.status === "active",
      };

      if (id) {
        await api.put(`/brands/${id}`, payload);
      } else {
        await api.post("/brands", payload);
      }

      navigate("/dgflake/brands");
    } catch (err) {
      console.log(err);

      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        background: "#fff",
        boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
        padding: "20px",
        margin: "10px",
        minHeight: "85vh",
        position: "relative",
      }}
    >
      {" "}
      <Box display="flex" alignItems="center" gap="15px" mb={4}>
        <img
          src={leftArrow}
          alt="Arrow"
          style={{
            cursor: "pointer",
          }}
          onClick={() => navigate(-1)}
        />

        <span
          style={{
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          {id ? "Edit Brand" : "Add Brand"}
        </span>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <TextField
          label="Brand Name"
          value={brand.name}
          onChange={(e) =>
            setBrand({
              ...brand,
              name: e.target.value,
            })
          }
          sx={fieldStyle}
        />

        <TextField
          select
          label="Category"
          value={brand.category}
          onChange={(e) =>
            setBrand({
              ...brand,
              category: e.target.value,
            })
          }
          sx={fieldStyle}
        >
          {categories.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Status"
          value={brand.status}
          onChange={(e) =>
            setBrand({
              ...brand,
              status: e.target.value,
            })
          }
          sx={fieldStyle}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box display="flex" justifyContent="flex-end" gap="20px" mt={5}>
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

export default AddNewBrand;
