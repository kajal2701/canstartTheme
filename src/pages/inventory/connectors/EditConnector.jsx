import React, { useState, useEffect } from "react";
import CommonConnectorForm from "./CommonConnectorForm";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getConnectors, editConnector } from "@/services/inventoryService";

const EditConnector = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getConnectors();
        const item = items.find(i => i.connector_id === parseInt(id, 10));
        if (item) setInitialData({ name: item.name || "", type: item.type || "", cost: item.cost || "", notes: item.notes || "" });
        else { toast.error("Connector not found"); navigate("/inventory/connectors", { replace: true }); }
      } catch { toast.error("Failed to load data"); navigate("/inventory/connectors", { replace: true }); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    const payload = { connector_id: parseInt(id, 10), name: formData.name, type: formData.type, cost: parseFloat(formData.cost), notes: formData.notes || null };
    const result = await editConnector(payload);
    if (result?.success) { toast.success("Connector updated!"); navigate("/inventory/connectors"); }
    else toast.error(result?.message || "Failed to update.");
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  if (!initialData) return null;
  return <CommonConnectorForm isEdit={true} title="Edit Connector" initialData={initialData} onSubmit={handleSubmit} />;
};

export default EditConnector;
