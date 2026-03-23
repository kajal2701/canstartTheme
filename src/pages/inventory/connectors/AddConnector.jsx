import React from "react";
import CommonConnectorForm from "./CommonConnectorForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddConnector = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await addConnector(formData);
      
      toast.success("Connector added successfully!");
      navigate("/inventory?tab=connectors");
    } catch (error) {
      throw error;
    }
  };

  return (
    <CommonConnectorForm
      isEdit={false}
      title="Add Connector"
      onSubmit={handleSubmit}
    />
  );
};

export default AddConnector;
