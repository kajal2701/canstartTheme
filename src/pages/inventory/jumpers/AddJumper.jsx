import React from "react";
import CommonJumperForm from "./CommonJumperForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddJumper = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await addJumper(formData);
      
      toast.success("Jumper added successfully!");
      navigate("/inventory?tab=jumpers");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonJumperForm
      isEdit={false}
      title="Add Jumper"
      onSubmit={handleSubmit}
    />
  );
};

export default AddJumper;
