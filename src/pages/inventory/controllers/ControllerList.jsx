import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import LoadingIcon from "@/components/LoadingIcon";
import DataTable from "@/components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ControllerList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchControllers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your real API call:
        // const response = await fetch("/api/inventory/controllers");
        // const result = await response.json();
        // setData(result.data);

        // --- Remove this dummy block when API is ready ---
        await new Promise((r) => setTimeout(r, 600)); // simulate delay
        setData([
          { id: 1, type: "350W", cost: "25.00", price: "45.00", boostBox: 100 },
          { id: 2, type: "600W", cost: "35.00", price: "65.00", boostBox: 80 },
        ]);
        // --- End dummy block ---
      } catch (err) {
        setError("Failed to load controllers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchControllers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this controller?"))
      return;
    try {
      // await deleteController(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Controller deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete controller.");
    }
  };

  const columns = [
    { Header: "Type", accessor: "type" },
    { Header: "Cost", accessor: "cost" },
    { Header: "Price", accessor: "price" },
    { Header: "Boost Box", accessor: "boostBox" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            icon="ph:pencil-simple"
            className="btn-warning h-9 w-9 p-0"
            onClick={() =>
              navigate(`/inventory/controllers/edit/${row.original.id}`)
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
            <Icon icon="ph:cpu" className="text-xl text-indigo-600" />
            <h1 className="text-xl font-bold">Controllers</h1>
          </div>
        </div>
        <Button
          text="Add Controller"
          icon="ph:plus"
          className="btn-primary w-full sm:w-auto"
          onClick={() => navigate("/inventory/controllers/add")}
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
              title="Controllers List"
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

export default ControllerList;
