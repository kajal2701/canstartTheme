import React from "react";
import CommonPlugForm from "./CommonPlugForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addPlug } from "@/services/inventoryService";

const AddPlug = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = { type: formData.type, quantity: parseInt(formData.quantity, 10), notes: formData.notes || null };
    const result = await addPlug(payload);
    if (result?.success) { toast.success("Plug added!"); navigate("/inventory/plugs"); }
    else toast.error(result?.message || "Failed to add plug.");
  };
  return <CommonPlugForm isEdit={false} title="Add Plug" onSubmit={handleSubmit} />;
};

export default AddPlug;
