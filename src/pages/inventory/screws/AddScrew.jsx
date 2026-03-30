import React from "react";
import CommonScrewForm from "./CommonScrewForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addScrew } from "@/services/inventoryService";

const AddScrew = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = {
      color: formData.color,
      quantity: parseInt(formData.quantity, 10),
      cost: parseFloat(formData.cost),
      price: parseFloat(formData.price),
    };
    const result = await addScrew(payload);
    if (result?.success) { toast.success("Screw added successfully!"); navigate("/inventory/screws"); }
    else toast.error(result?.message || "Failed to add screw.");
  };

  return <CommonScrewForm isEdit={false} title="Add Screw" onSubmit={handleSubmit} />;
};

export default AddScrew;
