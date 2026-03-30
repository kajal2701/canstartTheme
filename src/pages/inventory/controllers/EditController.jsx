import React, { useState, useEffect } from "react";
import CommonControllerForm from "./CommonControllerForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getControllers, editController } from "@/services/inventoryService";

const EditController = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getControllers();
        const item = items.find(i => i.controller_id === parseInt(id, 10));
        if (item) setInitialData({ type: item.type || "", boostBox: String(item.boostBox || ""), cost: item.cost || "", price: item.price || "" });
        else { toast.error("Controller not found"); navigate("/inventory/controllers", { replace: true }); }
      } catch { toast.error("Failed to load data"); navigate("/inventory/controllers", { replace: true }); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    const payload = { controller_id: parseInt(id, 10), type: formData.type, boostBox: formData.boostBox, cost: parseFloat(formData.cost), price: parseFloat(formData.price) };
    const result = await editController(payload);
    if (result?.success) { toast.success("Controller updated!"); navigate("/inventory/controllers"); }
    else toast.error(result?.message || "Failed to update.");
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  if (!initialData) return null;
  return <CommonControllerForm isEdit={true} title="Edit Controller" initialData={initialData} onSubmit={handleSubmit} />;
};

export default EditController;
