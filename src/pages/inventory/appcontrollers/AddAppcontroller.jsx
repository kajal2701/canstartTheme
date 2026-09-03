import React from "react";
import CommonAppcontrollerForm from "./CommonAppcontrollerForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addAppcontroller } from "@/services/inventoryService";

const AddAppcontroller = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = {
      type: formData.type,
      supplier: formData.supplier,
      quantity: parseInt(formData.quantity, 10),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice),
    };
    const result = await addAppcontroller(payload);
    if (result?.success) { toast.success("App controller added successfully!"); navigate("/inventory/appcontrollers"); }
    else toast.error(result?.message || "Failed to add app controller.");
  };

  return <CommonAppcontrollerForm isEdit={false} title="Add App Controller" onSubmit={handleSubmit} />;
};

export default AddAppcontroller;
