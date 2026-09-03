import React, { useState, useEffect } from "react";
import CommonPowersupplyForm from "./CommonPowersupplyForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPowersupplies, editPowersupply } from "@/services/inventoryService";

const EditPowersupply = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getPowersupplies();
        const item = items.find(i => i.powersupply_id === parseInt(id, 10));
        if (item) {
          setInitialData({
            type: item.type || "",
            supplier: item.supplier || "",
            quantity: String(item.quantity || ""),
            pricePerUnit: item.pricePerUnit || "",
            totalPrice: item.totalPrice || "",
          });
        } else { toast.error("Power supply not found"); navigate("/inventory/powersupplies", { replace: true }); }
      } catch { toast.error("Failed to load data"); navigate("/inventory/powersupplies", { replace: true }); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    const payload = {
      powersupply_id: parseInt(id, 10),
      type: formData.type,
      supplier: formData.supplier,
      quantity: parseInt(formData.quantity, 10),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice),
    };
    const result = await editPowersupply(payload);
    if (result?.success) { toast.success("Power supply updated successfully!"); navigate("/inventory/powersupplies"); }
    else toast.error(result?.message || "Failed to update power supply.");
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  if (!initialData) return null;
  return <CommonPowersupplyForm isEdit={true} title="Edit Power Supply" initialData={initialData} onSubmit={handleSubmit} />;
};

export default EditPowersupply;
