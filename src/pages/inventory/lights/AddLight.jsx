import React from "react";
import CommonLightForm from "./CommonLightForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addLight } from "@/services/inventoryService";

const AddLight = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = { type: formData.type, quantity: parseInt(formData.quantity, 10), cost: parseFloat(formData.cost), purchaseInfo: formData.purchaseInfo || null, notes: formData.notes || null };
    const result = await addLight(payload);
    if (result?.success) { toast.success("Light added!"); navigate("/inventory/lights"); }
    else toast.error(result?.message || "Failed to add light.");
  };
  return <CommonLightForm isEdit={false} title="Add Light" onSubmit={handleSubmit} />;
};

export default AddLight;
