import React, { useState, useEffect } from "react";
import CommonLightForm from "./CommonLightForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getLights, editLight } from "@/services/inventoryService";

const EditLight = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getLights();
        const item = items.find(i => i.light_id === parseInt(id, 10));
        if (item) setInitialData({ type: item.type || "", quantity: String(item.quantity || ""), cost: item.cost || "", purchaseInfo: item.purchaseInfo || "", notes: item.notes || "" });
        else { toast.error("Light not found"); navigate("/inventory/lights", { replace: true }); }
      } catch { toast.error("Failed to load data"); navigate("/inventory/lights", { replace: true }); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    const payload = { light_id: parseInt(id, 10), type: formData.type, quantity: parseInt(formData.quantity, 10), cost: parseFloat(formData.cost), purchaseInfo: formData.purchaseInfo || null, notes: formData.notes || null };
    const result = await editLight(payload);
    if (result?.success) { toast.success("Light updated!"); navigate("/inventory/lights"); }
    else toast.error(result?.message || "Failed to update.");
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  if (!initialData) return null;
  return <CommonLightForm isEdit={true} title="Edit Light" initialData={initialData} onSubmit={handleSubmit} />;
};

export default EditLight;
