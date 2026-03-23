import React, { useState, useEffect } from "react";
import CommonLightForm from "./CommonLightForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditLight = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Dummy data for editing
  const dummyLightData = {
    1: { type: "led_strip", cost: "8.00", price: "15.00", quantity: "200", purchaseInfo: "Supplier A - Bulk Order", notes: "Warm white LED" },
    2: { type: "spot_light", cost: "12.00", price: "22.00", quantity: "100", purchaseInfo: "Supplier B - Premium", notes: "Adjustable spotlight" },
  };

  useEffect(() => {
    // Simulate fetching light data
    const fetchLightData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const lightData = dummyLightData[id];
        if (lightData) {
          // Data will be handled by CommonLightForm
        } else {
          toast.error("Light not found");
          navigate("/inventory");
        }
      } catch (error) {
        toast.error("Failed to load light data");
        navigate("/inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchLightData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await updateLight(id, formData);
      
      toast.success("Light updated successfully!");
      navigate("/inventory?tab=lights");
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

  const initialData = dummyLightData[id] || {};

  return (
    <CommonLightForm
      isEdit={true}
      title="Edit Light"
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditLight;
