import React from "react";
import CommonPowersupplyForm from "./CommonPowersupplyForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addPowersupply } from "@/services/inventoryService";

const AddPowersupply = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = {
      type: formData.type,
      supplier: formData.supplier,
      quantity: parseInt(formData.quantity, 10),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice),
    };
    const result = await addPowersupply(payload);
    if (result?.success) { toast.success("Power supply added successfully!"); navigate("/inventory/powersupplies"); }
    else toast.error(result?.message || "Failed to add power supply.");
  };

  return <CommonPowersupplyForm isEdit={false} title="Add Power Supply" onSubmit={handleSubmit} />;
};

export default AddPowersupply;
