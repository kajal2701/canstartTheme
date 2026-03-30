import React from "react";
import CommonConnectorForm from "./CommonConnectorForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addConnector } from "@/services/inventoryService";

const AddConnector = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData) => {
    const payload = { name: formData.name, type: formData.type, cost: parseFloat(formData.cost), notes: formData.notes || null };
    const result = await addConnector(payload);
    if (result?.success) { toast.success("Connector added!"); navigate("/inventory/connectors"); }
    else toast.error(result?.message || "Failed to add connector.");
  };
  return <CommonConnectorForm isEdit={false} title="Add Connector" onSubmit={handleSubmit} />;
};

export default AddConnector;
