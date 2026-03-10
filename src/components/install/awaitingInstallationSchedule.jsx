import React, { useMemo } from "react";
import Icon from "@/components/ui/Icon";
import DataTable from "@/components/ui/DataTable";
import { AddressCell, addressAccessor } from "@/utils/mappers";
import { formatDateLong } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

const AwaitingInstallationSchedule = ({ jobs = [], loading }) => {
  const navigate = useNavigate();

  const COLUMNS = [
    {
      Header: "Quote #",
      accessor: "quote_no",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-indigo-600 font-medium">{value}</span>
      ),
    },
    {
      Header: "Initial",
      accessor: "salesman",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {value}
        </span>
      ),
    },
    {
      Header: "Customer Name",
      accessor: (row) => `${row.fname || ""} ${row.lname || ""}`.trim(),
      id: "customerName",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          {value}
        </span>
      ),
    },
    {
      Header: "Phone",
      accessor: "phone",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value}
        </span>
      ),
    },
    {
      Header: "Address",
      accessor: addressAccessor,
      Cell: ({ row }) => (
        <div className="min-w-[200px]">
          <AddressCell row={row} />
        </div>
      ),
    },
    {
      Header: "Linear Feet",
      accessor: "total_numerical_box",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {value} ft
        </span>
      ),
    },
    {
      Header: "Total Amount",
      accessor: "main_total",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm font-semibold text-green-600">
          ${parseFloat(value || 0).toFixed(2)}
        </span>
      ),
    },
    {
      Header: "Payment Status",
      accessor: "status",
      Cell: ({ cell: { value } }) => {
        const statusMap = {
          0: { label: "Draft", color: "bg-gray-400" },
          1: { label: "Sent", color: "bg-yellow-500" },
          2: { label: "Approved", color: "bg-blue-500" },
          3: { label: "Invoice Sent", color: "bg-indigo-500" },
          4: { label: "Completed", color: "bg-green-500" },
        };
        const s = statusMap[value] || {
          label: "Unknown",
          color: "bg-gray-400",
        };
        return (
          <span
            className={`inline-block ${s.color} text-white text-xs px-4 py-1.5 rounded font-medium`}
          >
            {s.label}
          </span>
        );
      },
    },
    {
      Header: "Date",
      accessor: "created_at",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {formatDateLong(value)}
        </span>
      ),
    },
    {
      Header: "Action",
      accessor: "quote_id",
      Cell: ({ cell: { value } }) => (
        <div className="flex gap-2 justify-center">
          <button
            className="icon-btn hover:bg-indigo-50 dark:hover:bg-indigo-900"
            type="button"
            title="Schedule"
          >
            <Icon icon="ph:calendar-check" />
          </button>
          <button
            className="icon-btn hover:bg-blue-50 dark:hover:bg-blue-900"
            type="button"
            title="View"
            onClick={() => navigate(`/quote/view_quote_admin/${value}`)}
          >
            <Icon icon="ph:eye" />
          </button>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => jobs, [jobs]);

  return (
    <div className="border-2 border-yellow-300 bg-yellow-50/30 rounded-xl">
      <DataTable
        title={
          <div className="flex items-center gap-3">
            <Icon icon="ph:clock" className="text-2xl text-gray-700" />
            <span>Awaiting Installation Schedule</span>
            <span className="bg-pink-500 text-white text-sm px-3 py-1 rounded-full font-medium">
              {jobs.length} Jobs
            </span>
          </div>
        }
        columns={columns}
        data={data}
        loading={loading}
        initialPageSize={5}
      />
    </div>
  );
};

export default AwaitingInstallationSchedule;
