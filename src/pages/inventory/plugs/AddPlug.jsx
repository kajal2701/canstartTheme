import React from "react";
import CommonPlugForm from "./CommonPlugForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddPlug = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await addPlug(formData);
      
      toast.success("Plug added successfully!");
      navigate("/inventory?tab=plugs");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonPlugForm
      isEdit={false}
      title="Add Plug"
      onSubmit={handleSubmit}
    />
  );
};

export default AddPlug;
