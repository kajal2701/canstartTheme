import React from "react";
import CommonPowerCordForm from "./CommonPowerCordForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addPowercord } from "@/services/inventoryService";

const AddPowerCord = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = { 
      type: formData.type, 
      supplier: formData.supplier || null,
      quantity: parseInt(formData.quantity, 10), 
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice)
    };
    const result = await addPowercord(payload);
    if (result?.success) { toast.success("Power cord added!"); navigate("/inventory/powercord"); }
    else toast.error(result?.message || "Failed to add power cord.");
  };
  return <CommonPowerCordForm isEdit={false} title="Add Power Cord" onSubmit={handleSubmit} />;
};

export default AddPowerCord;
