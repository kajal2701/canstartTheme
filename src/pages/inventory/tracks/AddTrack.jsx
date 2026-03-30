import React from "react";
import CommonTrackForm from "./CommonTrackForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addTrack } from "@/services/inventoryService";

const AddTrack = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        color: formData.color,
        supplier: formData.supplier,
        totalLength: formData.totalLength,
        size: formData.size,
        cost: parseFloat(formData.cost),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      };

      const result = await addTrack(payload);
      if (result?.success) {
        toast.success("Track added successfully!");
        navigate("/inventory/tracks");
      } else {
        toast.error(result?.message || "Failed to add track.");
      }
    } catch (error) {
      toast.error("Failed to add track.");
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
