import React, { useState, useEffect } from "react";
import CommonBoostForm from "./CommonBoostForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditBoostBox = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Dummy data for editing
  const dummyBoostData = {
    1: { cost: "15.00", price: "28.00", quantity: "150" },
    2: { cost: "18.00", price: "32.00", quantity: "120" },
  };

  useEffect(() => {
    // Simulate fetching boost box data
    const fetchBoostData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const boostData = dummyBoostData[id];
        if (boostData) {
          // Data will be handled by CommonBoostForm
        } else {
          toast.error("Boost Box not found");
          navigate("/inventory");
        }
      } catch (error) {
        toast.error("Failed to load boost box data");
        navigate("/inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchBoostData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await updateBoostBox(id, formData);
      
      toast.success("Boost Box updated successfully!");
      navigate("/inventory?tab=boost");
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

  const initialData = dummyBoostData[id] || {};

  return (
    <CommonBoostForm
      isEdit={true}
      title="Edit Boost Box"
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditBoostBox;
