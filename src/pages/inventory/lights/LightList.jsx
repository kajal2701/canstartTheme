import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import LoadingIcon from "@/components/LoadingIcon";
import DataTable from "@/components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LightList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLights = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your real API call:
        // const response = await fetch("/api/inventory/lights");
        // const result = await response.json();
        // setData(result.data);

        // --- Remove this dummy block when API is ready ---
        await new Promise((r) => setTimeout(r, 600)); // simulate delay
        setData([
          {
            id: 1,
            type: "LED Strip",
            cost: "8.00",
            price: "15.00",
            quantity: 200,
            purchaseInfo: "Supplier A - Bulk Order",
            notes: "Warm white LED",
          },
          {
            id: 2,
            type: "Spot Light",
            cost: "12.00",
            price: "22.00",
            quantity: 100,
            purchaseInfo: "Supplier B - Premium",
            notes: "Adjustable spotlight",
          },
        ]);
        // --- End dummy block ---
      } catch (err) {
        setError("Failed to load lights. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLights();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this light?")) return;
    try {
      // await deleteLight(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Light deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete light.");
    }
  };

  const columns = [
    { Header: "Type", accessor: "type" },
    { Header: "Cost", accessor: "cost" },
    { Header: "Price", accessor: "price" },
    { Header: "Quantity", accessor: "quantity" },
    { Header: "Purchase Info", accessor: "purchaseInfo" },
    { Header: "Notes", accessor: "notes" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            icon="ph:pencil-simple"
            className="btn-warning h-9 w-9 p-0"
            onClick={() =>
              navigate(`/inventory/lights/edit/${row.original.id}`)
            }
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
            <Icon icon="ph:lightbulb" className="text-xl text-indigo-600" />
            <h1 className="text-xl font-bold">Lights</h1>
          </div>
        </div>
        <Button
          text="Add Light"
          icon="ph:plus"
          className="btn-primary w-full sm:w-auto"
          onClick={() => navigate("/inventory/lights/add")}
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
              title="Lights List"
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

export default LightList;
