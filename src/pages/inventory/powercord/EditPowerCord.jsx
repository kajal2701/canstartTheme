import React, { useState, useEffect } from "react";
import CommonPowerCordForm from "./CommonPowerCordForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditPowerCord = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Dummy data for editing
  const dummyPowerCordData = {
    1: { type: "6_foot", quantity: "300", notes: "Standard 6-foot power cords", cost: "3.00", price: "6.00" },
    2: { type: "10_foot", quantity: "200", notes: "Extended 10-foot cords", cost: "4.50", price: "8.00" },
    3: { type: "12_foot", quantity: "150", notes: "Long 12-foot cords", cost: "5.00", price: "9.00" },
  };

  useEffect(() => {
    // Simulate fetching power cord data
    const fetchPowerCordData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const powerCordData = dummyPowerCordData[id];
        if (powerCordData) {
          // Data will be handled by CommonPowerCordForm
        } else {
          toast.error("Power Cord not found");
          navigate("/inventory");
        }
      } catch (error) {
        toast.error("Failed to load power cord data");
        navigate("/inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchPowerCordData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await updatePowerCord(id, formData);
      
      toast.success("Power Cord updated successfully!");
      navigate("/inventory?tab=powercord");
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

  const initialData = dummyPowerCordData[id] || {};

  return (
    <CommonPowerCordForm
      isEdit={true}
      title="Edit Power Cord"
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditPowerCord;
