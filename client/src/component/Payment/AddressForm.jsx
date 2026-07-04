import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import MapPicker from "../map/MapPicker";

const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: "10px" } };

const AddressForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);
  const [location, setLocation] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",

    pincode: "",
    state: "",
    district: "",
    city: "",

    taluka: "",
    village: "",
    postOffice: "",

    houseNo: "",
    area: "",
    landmark: "",

    buildingName: "",

    addressType: "Home",

    deliveryInstruction: "",

    isDefault: false,
  });

  useEffect(() => {
    if (isEdit) {
      getAddress();
    }
  }, []);

  const getAddress = async () => {
    try {
      const res = await api.get(`/address/${id}`);
      setForm(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await api.put(`/address/${id}`, form);
      } else {
        await api.post("/address", form);
      }

      alert(
        isEdit ? "Address Updated Successfully" : "Address Added Successfully",
      );
      await api.post("/address", {
        ...form,
        location,
      });

      navigate("/customer/checkout");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 3.5 },
          borderRadius: "16px",
          border: "1px solid #eaeaea",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          mb={{ xs: 2, sm: 3 }}
          sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
        >
          {isEdit ? "Edit Address" : "Add Address"}
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 2.5 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label="Mobile Number"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="District"
              name="district"
              value={form.district}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Taluka"
              name="taluka"
              value={form.taluka}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Village"
              name="village"
              value={form.village}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Post Office"
              name="postOffice"
              value={form.postOffice}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="House No / Flat No"
              name="houseNo"
              value={form.houseNo}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Area / Street"
              name="area"
              value={form.area}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Landmark"
              name="landmark"
              value={form.landmark}
              onChange={handleChange}
              sx={fieldSx}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleChange}
                />
              }
              label="Set as Default Address"
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end",
            gap: 2,
            mt: 3,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/customer/checkout")}
            sx={{ borderRadius: "10px", textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ borderRadius: "10px", textTransform: "none" }}
          >
            {isEdit ? "Update" : "Save"}
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mt: { xs: 2, sm: 3 } }}>
        <MapPicker location={location} setLocation={setLocation} setForm={setForm} />
      </Box>
    </Box>
  );
};

export default AddressForm;