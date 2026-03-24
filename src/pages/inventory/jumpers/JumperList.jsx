import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import LoadingIcon from "@/components/LoadingIcon";
import DataTable from "@/components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const JumperList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJumpers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your real API call:
        // const response = await fetch("/api/inventory/jumpers");
        // const result = await response.json();
        // setData(result.data);

        // --- Remove this dummy block when API is ready ---
        await new Promise((r) => setTimeout(r, 600)); // simulate delay
        setData([
          {
            id: 1,
            type: "LED Jumpers",
            quantity: "1000",
            notes: "Standard LED connectors",
            cost: "0.50",
            price: "1.00",
          },
          {
            id: 2,
            type: "RGB Jumpers",
            quantity: "800",
            notes: "RGB LED connectors",
            cost: "0.75",
            price: "1.50",
          },
          {
            id: 3,
            type: "Extension Jumpers",
            quantity: "500",
            notes: "Extension cables",
            cost: "1.00",
            price: "2.00",
          },
        ]);
        // --- End dummy block ---
      } catch (err) {
        setError("Failed to load jumpers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJumpers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this jumper?")) return;
    try {
      // await deleteJumper(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Jumper deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete jumper.");
    }
  };

  const columns = [
    { Header: "Type", accessor: "type" },
    { Header: "Quantity", accessor: "quantity" },
    { Header: "Cost", accessor: "cost" },
    { Header: "Price", accessor: "price" },
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
              navigate(`/inventory/jumpers/edit/${row.original.id}`)
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
            <Icon
              icon="ph:arrows-horizontal"
              className="text-xl text-indigo-600"
            />
            <h1 className="text-xl font-bold">Jumpers</h1>
          </div>
        </div>
        <Button
          text="Add Jumper"
          icon="ph:plus"
          className="btn-primary w-full sm:w-auto"
          onClick={() => navigate("/inventory/jumpers/add")}
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
              title="Jumpers List"
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

export default JumperList;
