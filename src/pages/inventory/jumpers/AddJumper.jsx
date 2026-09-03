import React from "react";
import CommonJumperForm from "./CommonJumperForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addJumper } from "@/services/inventoryService";

const AddJumper = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = {
      type: formData.type,
      supplier: formData.supplier || null,
      quantity: parseInt(formData.quantity, 10),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice),
    };
    const result = await addJumper(payload);
    if (result?.success) { toast.success("Jumper added!"); navigate("/inventory/jumpers"); }
    else toast.error(result?.message || "Failed to add jumper.");
  };
  return <CommonJumperForm isEdit={false} title="Add Jumper" onSubmit={handleSubmit} />;
};

export default AddJumper;
