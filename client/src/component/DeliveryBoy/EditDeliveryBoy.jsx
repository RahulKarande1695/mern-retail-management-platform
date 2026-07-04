import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";

import DeliveryBoyForm from "./DeliveryBoyForm";

import PageContainer from "../common/PageContainer";

import Loader from "../common/Loader";

const EditDeliveryBoy = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await api.get(`/deliveryBoy/${id}`);

      setFormData({
        ...res.data,
        password: "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    await api.put(`/deliveryBoy/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Delivery Boy Updated");

    navigate("/dgflake/deliveryBoy");
  };

  if (loading) return <Loader />;

  return (
    <PageContainer>
      <h2>Edit Delivery Boy</h2>

      <DeliveryBoyForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        submitLabel="Update Delivery Boy"
      />
    </PageContainer>
  );
};

export default EditDeliveryBoy;
