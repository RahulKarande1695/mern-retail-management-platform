import { Box, Button, Grid, MenuItem, TextField } from "@mui/material";

const DeliveryBoyForm = ({
  formData,
  setFormData,
  handleSubmit,
  submitLabel = "Save",
}) => {
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* ---------- Personal Details ---------- */}

        <Grid item xs={12}>
          <h3>Personal Details</h3>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!formData._id}
            helperText={
              formData._id ? "Leave blank to keep existing password." : ""
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Button component="label" variant="outlined">
            Upload Photo
            <input
              hidden
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          </Button>
        </Grid>

        {/* ---------- Aadhaar ---------- */}

        <Grid item xs={12}>
          <h3>Aadhaar Details</h3>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Aadhaar Number"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <Button component="label" variant="outlined">
            Upload Aadhaar
            <input
              hidden
              type="file"
              name="aadhaarImage"
              accept="image/*"
              onChange={handleChange}
            />
          </Button>
        </Grid>

        {/* ---------- PAN ---------- */}

        <Grid item xs={12}>
          <h3>PAN Details</h3>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="PAN Number"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <Button component="label" variant="outlined">
            Upload PAN
            <input
              hidden
              type="file"
              name="panImage"
              accept="image/*"
              onChange={handleChange}
            />
          </Button>
        </Grid>

        {/* ---------- Driving License ---------- */}

        <Grid item xs={12}>
          <h3>Driving License</h3>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="License Number"
            name="drivingLicenseNumber"
            value={formData.drivingLicenseNumber}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <Button component="label" variant="outlined">
            Upload License
            <input
              hidden
              type="file"
              name="drivingLicenseImage"
              accept="image/*"
              onChange={handleChange}
            />
          </Button>
        </Grid>

        {/* ---------- Vehicle ---------- */}

        <Grid item xs={12}>
          <h3>Vehicle Details</h3>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            label="Vehicle Type"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
          >
            <MenuItem value="Bike">Bike</MenuItem>
            <MenuItem value="Scooter">Scooter</MenuItem>
            <MenuItem value="Cycle">Cycle</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Vehicle Number"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* ---------- Bank ---------- */}

        <Grid item xs={12}>
          <h3>Bank Details</h3>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Bank Name"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Account Holder"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Account Number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="IFSC Code"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            {submitLabel}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryBoyForm;
