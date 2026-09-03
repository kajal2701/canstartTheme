import React, { useState, useEffect } from "react";
import CommonJumperForm from "./CommonJumperForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getJumpers, editJumper } from "@/services/inventoryService";

const EditJumper = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getJumpers();
        const item = items.find(i => i.jumper_id === parseInt(id, 10));
        if (item) setInitialData({
          type: item.type || "",
          supplier: item.supplier || "",
          quantity: String(item.quantity || ""),
          pricePerUnit: String(item.pricePerUnit || ""),
          totalPrice: String(item.totalPrice || "")
        });
        else { toast.error("Jumper not found"); navigate("/inventory/jumpers", { replace: true }); }
      } catch { toast.error("Failed to load data"); navigate("/inventory/jumpers", { replace: true }); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    const payload = {
      jumper_id: parseInt(id, 10),
      type: formData.type,
      supplier: formData.supplier || null,
      quantity: parseInt(formData.quantity, 10),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice),
    };
    const result = await editJumper(payload);
    if (result?.success) { toast.success("Jumper updated!"); navigate("/inventory/jumpers"); }
    else toast.error(result?.message || "Failed to update.");
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  if (!initialData) return null;
  return <CommonJumperForm isEdit={true} title="Edit Jumper" initialData={initialData} onSubmit={handleSubmit} />;
};

export default EditJumper;
