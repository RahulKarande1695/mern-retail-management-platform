import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";

const DeliveryBoyDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [deliveryBoy, setDeliveryBoy] = useState(null);

  useEffect(() => {
    getDeliveryBoy();
  }, []);

  const getDeliveryBoy = async () => {
    try {
      const res = await api.get(`/deliveryBoy/${id}`);

      setDeliveryBoy(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!deliveryBoy) {
    return <h3>Loading...</h3>;
  }

  const handleApprove = async () => {
    try {
      await api.post(`/deliveryBoy/${id}/approve`);

      getDeliveryBoy();

      alert("Verified");
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async () => {
    const rejectionReason = prompt("Enter rejection reason");

    if (!rejectionReason) return;

    try {
      await api.post(`/deliveryBoy/${id}/reject`, {
        rejectionReason,
      });

      getDeliveryBoy();

      alert("Rejected");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        m: 2,
        background: "#fff",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Delivery Boy Details</Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate(`/dgflake/deliveryBoy/edit/${deliveryBoy._id}`)
          }
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Avatar
              src={
                deliveryBoy.photo
                  ? `${process.env.REACT_APP_API_URL}/uploads/${deliveryBoy.photo}`
                  : ""
              }
              sx={{
                width: 130,
                height: 130,
              }}
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography>
              <strong>Name :</strong> {deliveryBoy.name}
            </Typography>

            <Typography>
              <strong>Email :</strong> {deliveryBoy.email}
            </Typography>

            <Typography>
              <strong>Mobile :</strong> {deliveryBoy.mobile}
            </Typography>

            {deliveryBoy.verificationStatus === "Rejected" && (
              <Typography color="error" mt={2}>
                Reason :{deliveryBoy.rejectionReason}
              </Typography>
            )}

            <Box mt={2}>
              <Chip
                label={deliveryBoy.isAvailable ? "Available" : "Busy"}
                color={deliveryBoy.isAvailable ? "success" : "warning"}
                sx={{ mr: 1 }}
              />

              <Chip
                label={deliveryBoy.isVerified ? "Verified" : "Pending"}
                color={deliveryBoy.isVerified ? "success" : "default"}
                sx={{ mr: 1 }}
              />

              <Chip
                label={deliveryBoy.verificationStatus}
                color={
                  deliveryBoy.verificationStatus === "Approved"
                    ? "success"
                    : deliveryBoy.verificationStatus === "Rejected"
                      ? "error"
                      : "warning"
                }
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Vehicle Details
        </Typography>

        <Typography>
          <strong>Vehicle :</strong> {deliveryBoy.vehicleType}
        </Typography>

        <Typography>
          <strong>Vehicle Number :</strong> {deliveryBoy.vehicleNumber}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Bank Details
        </Typography>

        <Typography>
          <strong>Bank :</strong> {deliveryBoy.bankName}
        </Typography>

        <Typography>
          <strong>Account Holder :</strong> {deliveryBoy.accountHolderName}
        </Typography>

        <Typography>
          <strong>Account Number :</strong> {deliveryBoy.accountNumber}
        </Typography>

        <Typography>
          <strong>IFSC :</strong> {deliveryBoy.ifscCode}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Documents
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography>Aadhaar Number</Typography>

            <Typography>{deliveryBoy.aadhaarNumber}</Typography>

            {deliveryBoy.aadhaarImage && (
              <Button
                href={`${process.env.REACT_APP_API_URL}/uploads/${deliveryBoy.aadhaarImage}`}
                target="_blank"
              >
                View Aadhaar
              </Button>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>PAN Number</Typography>

            <Typography>{deliveryBoy.panNumber}</Typography>

            {deliveryBoy.panImage && (
              <Button
                href={`${process.env.REACT_APP_API_URL}/uploads/${deliveryBoy.panImage}`}
                target="_blank"
              >
                View PAN
              </Button>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>License Number</Typography>

            <Typography>{deliveryBoy.drivingLicenseNumber}</Typography>

            {deliveryBoy.drivingLicenseImage && (
              <Button
                href={`${process.env.REACT_APP_API_URL}/uploads/${deliveryBoy.drivingLicenseImage}`}
                target="_blank"
              >
                View License
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
      <Box display="flex" justifyContent="end" alignItems="center" mt={3}>
        {deliveryBoy.verificationStatus === "Pending" && (
          <>
            <Button color="success" variant="contained" onClick={handleApprove}>
              Approve
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={handleReject}
              sx={{ ml: 2 }}
            >
              Reject
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DeliveryBoyDetails;
