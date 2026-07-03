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
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={3}>
          {isEdit ? "Edit Address" : "Add Address"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="District"
              name="district"
              value={form.district}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Taluka"
              name="taluka"
              value={form.taluka}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Village"
              name="village"
              value={form.village}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Post Office"
              name="postOffice"
              value={form.postOffice}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="House No / Flat No"
              name="houseNo"
              value={form.houseNo}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Area / Street"
              name="area"
              value={form.area}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Landmark"
              name="landmark"
              value={form.landmark}
              onChange={handleChange}
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

        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button
            variant="outlined"
            onClick={() => navigate("/customer/checkout")}
          >
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </Box>
      </Paper>
      <MapPicker location={location} setLocation={setLocation} />
    </Box>
  );
};

export default AddressForm;
