import React, { useMemo } from "react";
import Icon from "@/components/ui/Icon";
import DataTable from "@/components/ui/DataTable";
import { AddressCell, addressAccessor } from "@/utils/mappers";
import { formatDateLong } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

const getDaysAhead = (installationDate) => {
  if (!installationDate) return null;
  const install = new Date(installationDate.split("T")[0]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = install - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : null;
};

const UpcomingInstallations = ({ jobs = [], loading }) => {
  const navigate = useNavigate();

  const COLUMNS = [
    {
      Header: "Installation Date",
      accessor: "installation_date",
      Cell: ({ cell: { value } }) => (
        <div className="flex items-center gap-2">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            <Icon icon="ph:calendar-check" className="inline mr-1" />
            {formatDateLong(value)}
          </span>
        </div>
      ),
    },
    {
      Header: "Days Ahead",
      accessor: "installation_date",
      id: "daysAhead",
      Cell: ({ cell: { value } }) => {
        const days = getDaysAhead(value);
        if (days === null)
          return <span className="text-gray-400 text-xs">-</span>;
        return (
          <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded text-xs font-medium">
            {days} days
          </span>
        );
      },
    },
    {
      Header: "Quote #",
      accessor: "quote_no",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {value}
        </span>
      ),
    },
    {
      Header: "Initial",
      accessor: "salesman",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
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
        <span className="text-sm font-medium">{value} ft</span>
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
      accessor: "payment_details",
      id: "paymentStatus",
      Cell: ({ cell: { value } }) => {
        const status = value?.[0]?.payment_status;
        const isFull = value?.[0]?.payment_type === 1; // 1 = full, 2 = deposit
        const label = isFull
          ? "Confirmed - Full Payment"
          : "Confirmed - Deposit Paid";
        const cls = isFull
          ? "bg-green-100 text-green-600"
          : "bg-cyan-100 text-cyan-600";
        return (
          <span
            className={`inline-block ${cls} text-xs px-3 py-1 rounded-full font-medium`}
          >
            {status === 1 ? label : "Pending"}
          </span>
        );
      },
    },
    {
      Header: "Action",
      accessor: "quote_id",
      Cell: ({ cell: { value } }) => (
        <div className="flex gap-2 justify-center">
          <button
            className="icon-btn hover:bg-blue-50 dark:hover:bg-blue-900"
            type="button"
            title="View"
            onClick={() => navigate(`/quote/view_quote_admin/${value}`)}
          >
            <Icon icon="ph:eye" />
          </button>
          <button
            className="icon-btn hover:bg-indigo-50 dark:hover:bg-indigo-900"
            type="button"
            title="Edit"
            onClick={() => navigate(`/quote/edit_quote/${value}`)}
          >
            <Icon icon="ph:pencil-line" />
          </button>
          <button
            className="icon-btn hover:bg-red-50 dark:hover:bg-red-900"
            type="button"
            title="Cancel"
          >
            <Icon icon="ph:x-circle" />
          </button>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => jobs, [jobs]);

  return (
    <div className="my-5">
      <div className="border-2 border-blue-300 bg-blue-50/30 rounded-xl overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4">
          <Icon icon="ph:calendar-dots" className="text-2xl text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Upcoming Installations
          </h2>
          <span className="bg-indigo-500 text-white text-sm px-3 py-1 rounded-full font-medium">
            {jobs.length} Jobs
          </span>
        </div>

        {/* ── Empty state ── */}
        {!loading && jobs.length === 0 ? (
          <div className="px-6 pb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Icon
                  icon="ph:info"
                  className="text-blue-500 text-xl flex-shrink-0"
                />
                <p className="text-blue-700 text-sm">
                  No upcoming installations scheduled at this time.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ── DataTable ── */
          <DataTable
            title=""
            columns={columns}
            data={data}
            loading={loading}
            initialPageSize={5}
            rowClassName="hover:bg-blue-50 dark:hover:bg-gray-700 hover:bg-opacity-50"
            tableWrapperClassName="card bg-blue-50/30"
          />
        )}
      </div>
    </div>
  );
};

export default UpcomingInstallations;
