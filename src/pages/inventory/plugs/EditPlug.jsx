import React, { useState, useEffect } from "react";
import CommonPlugForm from "./CommonPlugForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditPlug = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Dummy data for editing
  const dummyPlugData = {
    1: { type: "3_pin", quantity: "800", notes: "Standard 3-pin connectors", cost: "1.50", price: "3.00" },
    2: { type: "4_pin", quantity: "600", notes: "4-pin RGB connectors", cost: "2.00", price: "4.00" },
    3: { type: "usb", quantity: "400", notes: "USB power connectors", cost: "2.50", price: "5.00" },
  };

  useEffect(() => {
    // Simulate fetching plug data
    const fetchPlugData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const plugData = dummyPlugData[id];
        if (plugData) {
          // Data will be handled by CommonPlugForm
        } else {
          toast.error("Plug not found");
          navigate("/inventory");
        }
      } catch (error) {
        toast.error("Failed to load plug data");
        navigate("/inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchPlugData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await updatePlug(id, formData);
      
      toast.success("Plug updated successfully!");
      navigate("/inventory?tab=plugs");
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

  const initialData = dummyPlugData[id] || {};

  return (
    <CommonPlugForm
      isEdit={true}
      title="Edit Plug"
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditPlug;
