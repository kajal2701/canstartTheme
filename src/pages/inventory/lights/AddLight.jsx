import React from "react";
import CommonLightForm from "./CommonLightForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddLight = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await addLight(formData);
      
      toast.success("Light added successfully!");
      navigate("/inventory?tab=lights");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonLightForm
      isEdit={false}
      title="Add Light"
      onSubmit={handleSubmit}
    />
  );
};

export default AddLight;
