import React, { useState, useEffect } from "react";
import CommonPlugForm from "./CommonPlugForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPlugs, editPlug } from "@/services/inventoryService";

const EditPlug = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getPlugs();
        const item = items.find(i => i.plug_id === parseInt(id, 10));
        if (item) setInitialData({ type: item.type || "", quantity: String(item.quantity || ""), notes: item.notes || "" });
        else { toast.error("Plug not found"); navigate("/inventory/plugs", { replace: true }); }
      } catch { toast.error("Failed to load data"); navigate("/inventory/plugs", { replace: true }); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    const payload = { plug_id: parseInt(id, 10), type: formData.type, quantity: parseInt(formData.quantity, 10), notes: formData.notes || null };
    const result = await editPlug(payload);
    if (result?.success) { toast.success("Plug updated!"); navigate("/inventory/plugs"); }
    else toast.error(result?.message || "Failed to update.");
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  if (!initialData) return null;
  return <CommonPlugForm isEdit={true} title="Edit Plug" initialData={initialData} onSubmit={handleSubmit} />;
};

export default EditPlug;
