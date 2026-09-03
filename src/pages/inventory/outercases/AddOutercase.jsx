import React from "react";
import CommonOutercaseForm from "./CommonOutercaseForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addOutercase } from "@/services/inventoryService";

const AddOutercase = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = {
      type: formData.type,
      supplier: formData.supplier,
      quantity: parseInt(formData.quantity, 10),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice),
    };
    const result = await addOutercase(payload);
    if (result?.success) { toast.success("Outer case added successfully!"); navigate("/inventory/outercases"); }
    else toast.error(result?.message || "Failed to add outer case.");
  };

  return <CommonOutercaseForm isEdit={false} title="Add Outer Case" onSubmit={handleSubmit} />;
};

export default AddOutercase;
