import React from "react";
import CommonPowerCordForm from "./CommonPowerCordForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddPowerCord = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await addPowerCord(formData);
      
      toast.success("Power Cord added successfully!");
      navigate("/inventory?tab=powercord");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonPowerCordForm
      isEdit={false}
      title="Add Power Cord"
      onSubmit={handleSubmit}
    />
  );
};

export default AddPowerCord;
