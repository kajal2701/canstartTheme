import React from "react";
import CommonTrackForm from "./CommonTrackForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddTrack = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await addTrack(formData);
      
      toast.success("Track added successfully!");
      navigate("/inventory?tab=tracks");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonTrackForm
      isEdit={false}
      title="Add Track"
      onSubmit={handleSubmit}
    />
  );
};

export default AddTrack;
