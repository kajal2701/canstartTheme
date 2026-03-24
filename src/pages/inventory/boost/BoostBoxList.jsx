import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import LoadingIcon from "@/components/LoadingIcon";
import DataTable from "@/components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BoostBoxList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoostBoxes = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your real API call:
        // const response = await fetch("/api/inventory/boost");
        // const result = await response.json();
        // setData(result.data);

        // --- Remove this dummy block when API is ready ---
        await new Promise((r) => setTimeout(r, 600)); // simulate delay
        setData([
          { id: 1, cost: "15.00", price: "28.00", quantity: 150 },
          { id: 2, cost: "18.00", price: "32.00", quantity: 120 },
        ]);
        // --- End dummy block ---
      } catch (err) {
        setError("Failed to load boost boxes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoostBoxes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this boost box?"))
      return;
    try {
      // await deleteBoostBox(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Boost box deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete boost box.");
    }
  };

  const columns = [
    { Header: "Cost", accessor: "cost" },
    { Header: "Price", accessor: "price" },
    { Header: "Quantity", accessor: "quantity" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex gap-1 items-center">
          <Button
            icon="ph:pencil-simple"
            className="btn-warning h-9 w-9 p-0"
            onClick={() => navigate(`/inventory/boost/edit/${row.original.id}`)}
          />
          <Button
            icon="ph:trash"
            className="btn-danger h-9 w-9 p-0"
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
            <Icon icon="ph:cube" className="text-xl text-indigo-600" />
            <h1 className="text-xl font-bold">Boost Box</h1>
          </div>
        </div>
        <Button
          text="Add Boost Box"
          icon="ph:plus"
          className="btn-primary w-full sm:w-auto"
          onClick={() => navigate("/inventory/boost/add")}
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
              title="Boost Box List"
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

export default BoostBoxList;
