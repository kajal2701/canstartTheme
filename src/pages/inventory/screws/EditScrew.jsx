import React, { useState, useEffect } from "react";
import CommonScrewForm from "./CommonScrewForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getScrews, editScrew } from "@/services/inventoryService";

const EditScrew = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const items = await getScrews();
        const item = items.find((i) => i.screw_id === parseInt(id, 10));
        if (item) {
          setInitialData({
            color: item.color || "", quantity: String(item.quantity || ""),
            cost: item.cost || "", price: item.price || "",
          });
        } else { toast.error("Screw not found"); navigate("/inventory/screws", { replace: true }); }
      } catch { toast.error("Failed to load screw data"); navigate("/inventory/screws", { replace: true }); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    const payload = {
      screw_id: parseInt(id, 10),
      color: formData.color,
      quantity: parseInt(formData.quantity, 10),
      cost: parseFloat(formData.cost),
      price: parseFloat(formData.price),
    };
    const result = await editScrew(payload);
    if (result?.success) { toast.success("Screw updated successfully!"); navigate("/inventory/screws"); }
    else toast.error(result?.message || "Failed to update screw.");
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  if (!initialData) return null;

  return <CommonScrewForm isEdit={true} title="Edit Screw" initialData={initialData} onSubmit={handleSubmit} />;
};

export default EditScrew;
