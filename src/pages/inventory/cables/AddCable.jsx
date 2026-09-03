import React from "react";
import CommonCableForm from "./CommonCableForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addCable } from "@/services/inventoryService";

const AddCable = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = { 
      type: formData.type, 
      supplier: formData.supplier || null,
      quantity: parseInt(formData.quantity, 10), 
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice)
    };
    const result = await addCable(payload);
    if (result?.success) { toast.success("Cable added!"); navigate("/inventory/cables"); }
    else toast.error(result?.message || "Failed to add cable.");
  };
  return <CommonCableForm isEdit={false} title="Add Cable" onSubmit={handleSubmit} />;
};

export default AddCable;
