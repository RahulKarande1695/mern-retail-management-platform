import { Box } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import api from "../../api/axios";
import DeliveryBoyForm from "./DeliveryBoyForm";

const AddDeliveryBoy = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",

    photo: null,

    aadhaarNumber: "",
    aadhaarImage: null,

    panNumber: "",
    panImage: null,

    drivingLicenseNumber: "",
    drivingLicenseImage: null,

    vehicleType: "",
    vehicleNumber: "",

    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      await api.post("/deliveryBoy", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Delivery Boy Added Successfully");

      navigate("/dgflake/deliveryBoy");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <Box
      sx={{
        background: "#fff",
        p: 3,
        m: 2,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <h2>Add Delivery Boy</h2>

      <DeliveryBoyForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitLabel="Add Delivery Boy"
      />
    </Box>
  );
};

export default AddDeliveryBoy;