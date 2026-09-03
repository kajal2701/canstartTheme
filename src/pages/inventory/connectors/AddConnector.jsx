import React from "react";
import CommonConnectorForm from "./CommonConnectorForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addConnector } from "@/services/inventoryService";

const AddConnector = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = { 
      type: formData.type, 
      supplier: formData.supplier || null, 
      quantity: parseInt(formData.quantity, 10), 
      pricePerUnit: parseFloat(formData.pricePerUnit), 
      totalPrice: parseFloat(formData.totalPrice) 
    };
    const result = await addConnector(payload);
    if (result?.success) { toast.success("Connector added!"); navigate("/inventory/connectors"); }
    else toast.error(result?.message || "Failed to add connector.");
  };
  return <CommonConnectorForm isEdit={false} title="Add Connector" onSubmit={handleSubmit} />;
};

export default AddConnector;
