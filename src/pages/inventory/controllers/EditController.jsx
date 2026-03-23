import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CommonControllerForm from "./CommonControllerForm";

const EditController = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData, id) => {
    try {
      // In real implementation, call the API:
      // await updateController(id, formData);
      
      toast.success("Controller updated successfully!");
      navigate("/inventory?tab=controllers");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonControllerForm
      type="controllers"
      isEdit={true}
      title="Edit Controller"
      onSubmit={handleSubmit}
    />
  );
};

export default EditController;
