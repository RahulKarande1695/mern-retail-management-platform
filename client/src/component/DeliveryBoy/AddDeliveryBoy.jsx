import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DeliveryBoyForm from "./DeliveryBoyForm";

import api from "../../api/axios";

import PageContainer from "../common/PageContainer";

const initialState = {
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
};

const AddDeliveryBoy = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          data.append(key, value);
        }
      });

      await api.post("/deliveryBoy", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Delivery Boy Added");

      navigate("/dgflake/deliveryBoy");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <PageContainer>
      <h2>Add Delivery Boy</h2>

      <DeliveryBoyForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitLabel="Add Delivery Boy"
      />
    </PageContainer>
  );
};

export default AddDeliveryBoy;
