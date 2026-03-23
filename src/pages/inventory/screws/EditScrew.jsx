import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CommonScrewForm from "./CommonScrewForm";

const EditScrew = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData, id) => {
    try {
      // In real implementation, call the API:
      // await updateScrew(id, formData);
      
      toast.success("Screw updated successfully!");
      navigate("/inventory?tab=screws");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonScrewForm
      type="screws"
      isEdit={true}
      title="Edit Screw"
      onSubmit={handleSubmit}
    />
  );
};

export default EditScrew;
