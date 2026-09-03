import React from "react";
import CommonPlugForm from "./CommonPlugForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addPlug } from "@/services/inventoryService";

const AddPlug = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = { 
      type: formData.type, 
      supplier: formData.supplier || null,
      quantity: parseInt(formData.quantity, 10), 
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice)
    };
    const result = await addPlug(payload);
    if (result?.success) { toast.success("Plug added!"); navigate("/inventory/plugs"); }
    else toast.error(result?.message || "Failed to add plug.");
  };
  return <CommonPlugForm isEdit={false} title="Add Plug" onSubmit={handleSubmit} />;
};

export default AddPlug;
