import React, { useState, useEffect } from "react";
import CommonCableForm from "./CommonCableForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditCable = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Dummy data for editing
  const dummyCableData = {
    1: { type: "coaxial", quantity: "500", notes: "Various lengths and colors", cost: "2.50", price: "4.00" },
    2: { type: "ethernet", quantity: "300", notes: "Cat6 standard cables", cost: "3.00", price: "5.50" },
    3: { type: "power", quantity: "200", notes: "16AWG power cables", cost: "4.00", price: "7.00" },
  };

  useEffect(() => {
    // Simulate fetching cable data
    const fetchCableData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const cableData = dummyCableData[id];
        if (cableData) {
          // Data will be handled by CommonCableForm
        } else {
          toast.error("Cable not found");
          navigate("/inventory");
        }
      } catch (error) {
        toast.error("Failed to load cable data");
        navigate("/inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchCableData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await updateCable(id, formData);
      
      toast.success("Cable updated successfully!");
      navigate("/inventory?tab=cables");
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

  const initialData = dummyCableData[id] || {};

  return (
    <CommonCableForm
      isEdit={true}
      title="Edit Cable"
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditCable;
