import React from "react";
import CommonScrewForm from "./CommonScrewForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddScrew = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await addScrew(formData);
      
      toast.success("Screw added successfully!");
      navigate("/inventory?tab=screws");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonScrewForm
      isEdit={false}
      title="Add Screw"
      onSubmit={handleSubmit}
    />
  );
};

export default AddScrew;
