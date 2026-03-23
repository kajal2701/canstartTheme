import React, { useState, useEffect } from "react";
import CommonJumperForm from "./CommonJumperForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditJumper = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Dummy data for editing
  const dummyJumperData = {
    1: { type: "led", quantity: "1000", notes: "Standard LED connectors", cost: "0.50", price: "1.00" },
    2: { type: "rgb", quantity: "800", notes: "RGB LED connectors", cost: "0.75", price: "1.50" },
    3: { type: "extension", quantity: "500", notes: "Extension cables", cost: "1.00", price: "2.00" },
  };

  useEffect(() => {
    // Simulate fetching jumper data
    const fetchJumperData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const jumperData = dummyJumperData[id];
        if (jumperData) {
          // Data will be handled by CommonJumperForm
        } else {
          toast.error("Jumper not found");
          navigate("/inventory");
        }
      } catch (error) {
        toast.error("Failed to load jumper data");
        navigate("/inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchJumperData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await updateJumper(id, formData);
      
      toast.success("Jumper updated successfully!");
      navigate("/inventory?tab=jumpers");
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

  const initialData = dummyJumperData[id] || {};

  return (
    <CommonJumperForm
      isEdit={true}
      title="Edit Jumper"
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditJumper;
