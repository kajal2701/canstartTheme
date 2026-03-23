import React, { useState, useEffect } from "react";
import CommonConnectorForm from "./CommonConnectorForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditConnector = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Dummy data for editing
  const dummyConnectorData = {
    1: { name: "T-Connector", cost: "2.50", price: "5.00", notes: "Standard T connector" },
    2: { name: "Y-Connector", cost: "3.00", price: "6.00", notes: "Y-split connector" },
    3: { name: "Male Connector", cost: "1.50", price: "3.00", notes: "Male end connector" },
  };

  useEffect(() => {
    // Simulate fetching connector data
    const fetchConnectorData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const connectorData = dummyConnectorData[id];
        if (connectorData) {
          // Data will be handled by CommonConnectorForm
        } else {
          toast.error("Connector not found");
          navigate("/inventory");
        }
      } catch (error) {
        toast.error("Failed to load connector data");
        navigate("/inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchConnectorData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await updateConnector(id, formData);
      
      toast.success("Connector updated successfully!");
      navigate("/inventory?tab=connectors");
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const initialData = dummyConnectorData[id] || {};

  return (
    <CommonConnectorForm
      isEdit={true}
      title="Edit Connector"
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditConnector;
