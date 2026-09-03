import React, { useState, useEffect } from "react";
import CommonAppcontrollerForm from "./CommonAppcontrollerForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getAppcontrollers, editAppcontroller } from "@/services/inventoryService";

const EditAppcontroller = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getAppcontrollers();
        const item = items.find(i => i.appcontroller_id === parseInt(id, 10));
        if (item) {
          setInitialData({
            type: item.type || "",
            supplier: item.supplier || "",
            quantity: String(item.quantity || ""),
            pricePerUnit: item.pricePerUnit || "",
            totalPrice: item.totalPrice || "",
          });
        } else { toast.error("App controller not found"); navigate("/inventory/appcontrollers", { replace: true }); }
      } catch { toast.error("Failed to load data"); navigate("/inventory/appcontrollers", { replace: true }); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    const payload = {
      appcontroller_id: parseInt(id, 10),
      type: formData.type,
      supplier: formData.supplier,
      quantity: parseInt(formData.quantity, 10),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      totalPrice: parseFloat(formData.totalPrice),
    };
    const result = await editAppcontroller(payload);
    if (result?.success) { toast.success("App controller updated successfully!"); navigate("/inventory/appcontrollers"); }
    else toast.error(result?.message || "Failed to update app controller.");
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  if (!initialData) return null;
  return <CommonAppcontrollerForm isEdit={true} title="Edit App Controller" initialData={initialData} onSubmit={handleSubmit} />;
};

export default EditAppcontroller;
