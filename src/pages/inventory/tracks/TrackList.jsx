import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import DataTable from "@/components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TrackList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your real API call:
        // const response = await fetch("/api/inventory/tracks");
        // const result = await response.json();
        // setData(result.data);

        // --- Remove this dummy block when API is ready ---
        await new Promise((r) => setTimeout(r, 600)); // simulate delay
        setData([
          { id: 1, color: "White",  supplier: "Track Supplier A", totalLength: "1000", size: "1 meter", cost: "5.50",  price: "8.50",  quantity: 500 },
          { id: 2, color: "Black",  supplier: "Track Supplier B", totalLength: "800",  size: "4 feet",  cost: "12.00", price: "18.00", quantity: 300 },
          { id: 3, color: "Silver", supplier: "Track Supplier A", totalLength: "600",  size: "6 feet",  cost: "18.00", price: "25.00", quantity: 200 },
        ]);
        // --- End dummy block ---

      } catch (err) {
        setError("Failed to load tracks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this track?")) return;
    try {
      // await deleteTrack(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Track deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete track.");
    }
  };

  const columns = [
    { Header: "Color",        accessor: "color" },
    { Header: "Supplier",     accessor: "supplier" },
    { Header: "Total Length", accessor: "totalLength" },
    { Header: "Size",         accessor: "size" },
    { Header: "Cost",         accessor: "cost" },
    { Header: "Price",        accessor: "price" },
    { Header: "Quantity",     accessor: "quantity" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            text="Edit"
            className="btn-xs btn-primary"
            onClick={() => navigate(`/inventory/tracks/edit/${row.original.id}`)}
          />
          <Button
            text="Delete"
            className="btn-xs btn-danger"
            onClick={() => handleDelete(row.original.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
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
              onClick={() => window.location.reload()}
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
    </>
  );
};

export default TrackList;