import React, { useState, useEffect } from "react";
import CommonTrackForm from "./CommonTrackForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditTrack = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Dummy data for editing
  const dummyTrackData = {
    1: { color: "white", supplier: "supplier_a", totalLength: "1000", size: "1_meter", cost: "5.50", price: "8.50", quantity: "500" },
    2: { color: "black", supplier: "supplier_b", totalLength: "800", size: "4_feet", cost: "12.00", price: "18.00", quantity: "300" },
    3: { color: "silver", supplier: "supplier_a", totalLength: "600", size: "6_feet", cost: "18.00", price: "25.00", quantity: "200" },
  };

  useEffect(() => {
    // Simulate fetching track data
    const fetchTrackData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const trackData = dummyTrackData[id];
        if (trackData) {
          // Data will be handled by CommonTrackForm
        } else {
          toast.error("Track not found");
          navigate("/inventory");
        }
      } catch (error) {
        toast.error("Failed to load track data");
        navigate("/inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchTrackData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      // In real implementation, call the API:
      // await updateTrack(id, formData);
      
      toast.success("Track updated successfully!");
      navigate("/inventory?tab=tracks");
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

  const initialData = dummyTrackData[id] || {};

  return (
    <CommonTrackForm
      isEdit={true}
      title="Edit Track"
      initialData={initialData}
      onSubmit={handleSubmit}
    />
  );
};

export default EditTrack;
