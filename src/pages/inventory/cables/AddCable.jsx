import React from "react";
import CommonCableForm from "./CommonCableForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCable = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await addCable(formData);
      
      toast.success("Cable added successfully!");
      navigate("/inventory?tab=cables");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonCableForm
      isEdit={false}
      title="Add Cable"
      onSubmit={handleSubmit}
    />
  );
};

export default AddCable;
