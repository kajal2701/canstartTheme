import React from "react";
import CommonControllerForm from "./CommonControllerForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addController } from "@/services/inventoryService";

const AddController = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = { type: formData.type, boostBox: formData.boostBox, cost: parseFloat(formData.cost), price: parseFloat(formData.price) };
    const result = await addController(payload);
    if (result?.success) { toast.success("Controller added!"); navigate("/inventory/controllers"); }
    else toast.error(result?.message || "Failed to add controller.");
  };
  return <CommonControllerForm isEdit={false} title="Add Controller" onSubmit={handleSubmit} />;
};

export default AddController;
