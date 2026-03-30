import React, { useState, useEffect, useMemo } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getPowercords, deletePowercord } from "@/services/inventoryService";

const PowerCordList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try { setData(await getPowercords()); }
    catch { setError("Failed to load power cords. Please try again."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openDeleteModal = (item) => { setDeleteId(item.powercord_id); setDeleteName(item.type); setDeleteModalOpen(true); };
  const closeDeleteModal = () => { setDeleteModalOpen(false); setDeleteId(null); setDeleteName(""); };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const result = await deletePowercord(deleteId);
      if (result?.success) { toast.success("Power cord deleted!"); await fetchData(); }
      else toast.error(result?.message || "Failed to delete.");
    } catch { toast.error("Failed to delete power cord."); }
    finally { setIsDeleting(false); closeDeleteModal(); }
  };

  const columns = useMemo(() => [
    { Header: "Type", accessor: "type" },
    { Header: "Quantity", accessor: "quantity" },
    { Header: "Notes", accessor: "notes", Cell: ({ value }) => value || "—" },
    {
      Header: "Actions", accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Button icon="ph:pencil-simple" className="btn-warning h-9 w-9 p-0"
            onClick={() => navigate(`/inventory/powercord/edit/${row.original.powercord_id}`)} />
          <Button icon="ph:trash" className="btn-danger h-9 w-9 p-0"
            onClick={() => openDeleteModal(row.original)} />
        </div>
      ),
    },
  ], [navigate]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/inventory")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <Icon icon="ph:arrow-left" /><span>All Categories</span>
          </button>
          <span className="text-gray-300">/</span>
          <div className="flex items-center gap-2">
            <Icon icon="ph:power" className="text-xl text-indigo-600" />
            <h1 className="text-xl font-bold">Power Cords</h1>
          </div>
        </div>
        <Button text="Add Power Cord" icon="ph:plus" className="btn-primary w-full sm:w-auto"
          onClick={() => navigate("/inventory/powercord/add")} />
      </div>

      <Card className="overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-500">
            <Icon icon="ph:warning-circle" className="text-3xl" /><p className="text-sm">{error}</p>
            <Button text="Retry" className="btn-sm btn-outline" onClick={fetchData} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable title="Power Cords List" columns={columns} data={data} loading={loading} className="min-w-[600px]" />
          </div>
        )}
      </Card>

      <ConfirmModal activeModal={deleteModalOpen} onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete} itemName={deleteName} isLoading={isDeleting} />
    </>
  );
};

export default PowerCordList;
