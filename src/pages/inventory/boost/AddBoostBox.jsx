import React from "react";
import CommonBoostForm from "./CommonBoostForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddBoostBox = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await addBoostBox(formData);
      
      toast.success("Boost Box added successfully!");
      navigate("/inventory?tab=boost");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonBoostForm
      isEdit={false}
      title="Add Boost Box"
      onSubmit={handleSubmit}
    />
  );
};

export default AddBoostBox;
