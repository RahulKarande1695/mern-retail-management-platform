import { Box } from "@mui/material";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import DeliveryBoyForm from "./DeliveryBoyForm";

const EditDeliveryBoy = () => {
  const { id } = useParams();

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

  useEffect(() => {
    getDeliveryBoy();
  }, []);

  const getDeliveryBoy = async () => {
    try {
      const res = await api.get(`/deliveryBoy/${id}`);

      setFormData({
        ...res.data,
        password: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      await api.put(
        `/deliveryBoy/${id}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Delivery Boy Updated Successfully"
      );

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
      <h2>Edit Delivery Boy</h2>

      <DeliveryBoyForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitLabel="Update Delivery Boy"
      />
    </Box>
  );
};

export default EditDeliveryBoy;