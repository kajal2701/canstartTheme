import React, { useState, useEffect, useMemo } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getTracks, deleteTrack } from "@/services/inventoryService";

const TrackList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTrackId, setDeleteTrackId] = useState(null);
  const [deleteTrackName, setDeleteTrackName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const tracks = await getTracks();
      setData(tracks);
    } catch (err) {
      setError("Failed to load tracks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open confirmation modal
  const openDeleteModal = (track) => {
    setDeleteTrackId(track.track_id);
    setDeleteTrackName(`${track.color} - ${track.size}`);
    setDeleteModalOpen(true);
  };

  // Close confirmation modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteTrackId(null);
    setDeleteTrackName("");
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteTrackId) return;
    setIsDeleting(true);
    try {
      const result = await deleteTrack(deleteTrackId);
      if (result?.success) {
        toast.success("Track deleted successfully!");
        await fetchData();
      } else {
        toast.error(result?.message || "Failed to delete track.");
      }
    } catch (err) {
      toast.error("Failed to delete track.");
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const columns = useMemo(
    () => [
      { Header: "Color", accessor: "color" },
      { Header: "Supplier", accessor: "supplier" },
      { Header: "Total Length", accessor: "totalLength" },
      { Header: "Size", accessor: "size" },
      {
        Header: "Cost",
        accessor: "cost",
        Cell: ({ value }) => `$${parseFloat(value).toFixed(2)}`,
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => `$${parseFloat(value).toFixed(2)}`,
      },
      { Header: "Quantity", accessor: "quantity" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              icon="ph:pencil-simple"
              className="btn-warning h-9 w-9 p-0"
              onClick={() =>
                navigate(`/inventory/tracks/edit/${row.original.track_id}`)
              }
            />
            <Button
              icon="ph:trash"
              className="btn-danger h-9 w-9 p-0"
              onClick={() => openDeleteModal(row.original)}
            />
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => navigate("/inventory")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <Icon icon="ph:arrow-left" />
            <span>All Categories</span>
          </button>
          <span className="text-gray-300">/</span>
          <div className="flex items-center gap-2">
            <Icon icon="ph:line-segments" className="text-xl text-indigo-600" />
            <h1 className="text-xl font-bold">Tracks</h1>
          </div>
        </div>
        <Button
          text="Add Track"
          icon="ph:plus"
          className="btn-primary w-full sm:w-auto"
          onClick={() => navigate("/inventory/tracks/add")}
        />
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-red-500">
            <Icon icon="ph:warning-circle" className="text-3xl" />
            <p className="text-sm">{error}</p>
            <Button
              text="Retry"
              className="btn-sm btn-outline"
              onClick={fetchData}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              title="Tracks List"
              columns={columns}
              data={data}
              loading={loading}
              className="min-w-[600px]"
            />
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        activeModal={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        itemName={deleteTrackName}
        isLoading={isDeleting}
      />
    </>
  );
};

export default TrackList;
