import React, { useState, useEffect } from "react";
import CommonPowerCordForm from "./CommonPowerCordForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPowercords, editPowercord } from "@/services/inventoryService";

const EditPowerCord = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getPowercords();
        const item = items.find(i => i.powercord_id === parseInt(id, 10));
        if (item) setInitialData({ 
          type: item.type || "", 
          supplier: item.supplier || "",
          quantity: String(item.quantity || ""), 
          pricePerUnit: String(item.pricePerUnit || ""),
          totalPrice: String(item.totalPrice || "")
        });
        else { toast.error("Power cord not found"); navigate("/inventory/powercord", { replace: true }); }
      } catch { toast.error("Failed to load data"); navigate("/inventory/powercord", { replace: true }); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    const payload = { 
      powercord_id: parseInt(id, 10), 
      type: formData.type, 
      supplier: formData.supplier || null,
      quantity: parseInt(formData.quantity, 10), 
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice)
    };
    const result = await editPowercord(payload);
    if (result?.success) { toast.success("Power cord updated!"); navigate("/inventory/powercord"); }
    else toast.error(result?.message || "Failed to update.");
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  if (!initialData) return null;
  return <CommonPowerCordForm isEdit={true} title="Edit Power Cord" initialData={initialData} onSubmit={handleSubmit} />;
};

export default EditPowerCord;
