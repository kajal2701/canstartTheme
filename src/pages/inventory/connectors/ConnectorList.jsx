import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import LoadingIcon from "@/components/LoadingIcon";
import DataTable from "@/components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ConnectorList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConnectors = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace with your real API call:
        // const response = await fetch("/api/inventory/connectors");
        // const result = await response.json();
        // setData(result.data);

        // --- Remove this dummy block when API is ready ---
        await new Promise((r) => setTimeout(r, 600)); // simulate delay
        setData([
          {
            id: 1,
            name: "T-Connector",
            cost: "2.50",
            price: "5.00",
            notes: "Standard T connector",
          },
          {
            id: 2,
            name: "Y-Connector",
            cost: "3.00",
            price: "6.00",
            notes: "Y-split connector",
          },
          {
            id: 3,
            name: "Male Connector",
            cost: "1.50",
            price: "3.00",
            notes: "Male end connector",
          },
          {
            id: 4,
            name: "2x2 Connector",
            cost: "4.00",
            price: "8.00",
            notes: "2x2 grid connector",
          },
        ]);
        // --- End dummy block ---
      } catch (err) {
        setError("Failed to load connectors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchConnectors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this connector?"))
      return;
    try {
      // await deleteConnector(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Connector deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete connector.");
    }
  };

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Cost", accessor: "cost" },
    { Header: "Price", accessor: "price" },
    { Header: "Notes", accessor: "notes" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <div className="flex gap-1 items-center">
          <Button
            icon="ph:pencil-simple"
            className="btn-warning h-9 w-9 p-0"
            onClick={() =>
              navigate(`/inventory/connectors/edit/${row.original.id}`)
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
            <Icon icon="ph:plug" className="text-xl text-indigo-600" />
            <h1 className="text-xl font-bold">Connectors</h1>
          </div>
        </div>
        <Button
          text="Add Connector"
          icon="ph:plus"
          className="btn-primary w-full sm:w-auto"
          onClick={() => navigate("/inventory/connectors/add")}
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
              title="Connectors List"
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

export default ConnectorList;
