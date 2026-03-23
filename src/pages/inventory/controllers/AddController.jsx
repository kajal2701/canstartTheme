import React from "react";
import CommonControllerForm from "./CommonControllerForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddController = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await addController(formData);
      
      toast.success("Controller added successfully!");
      navigate("/inventory?tab=controllers");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonControllerForm
      isEdit={false}
      title="Add Controller"
      onSubmit={handleSubmit}
    />
  );
};

export default AddController;
