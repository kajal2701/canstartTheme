import React, { useState, useEffect } from "react";
import CommonTrackForm from "./CommonTrackForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getTracks, editTrack } from "@/services/inventoryService";

const EditTrack = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const tracks = await getTracks();
        const track = tracks.find((t) => t.track_id === parseInt(id, 10));
        if (track) {
          setInitialData({
            color: track.color || "",
            supplier: track.supplier || "",
            totalLength: track.totalLength || "",
            size: track.size || "",
            cost: track.cost || "",
            price: track.price || "",
            quantity: String(track.quantity || ""),
          });
        } else {
          toast.error("Track not found");
          navigate("/inventory/tracks", { replace: true });
        }
      } catch (error) {
        toast.error("Failed to load track data");
        navigate("/inventory/tracks", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchTrackData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        track_id: parseInt(id, 10),
        color: formData.color,
        supplier: formData.supplier,
        totalLength: formData.totalLength,
        size: formData.size,
        cost: parseFloat(formData.cost),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
      };

      const result = await editTrack(payload);
      if (result?.success) {
        toast.success("Track updated successfully!");
        navigate("/inventory/tracks");
      } else {
        toast.error(result?.message || "Failed to update track.");
      }
    } catch (error) {
      toast.error("Failed to update track.");
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

  if (!initialData) return null;

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
