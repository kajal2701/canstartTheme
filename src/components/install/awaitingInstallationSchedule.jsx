import React, { useMemo, useState } from "react"; // ✅ added useState
import Icon from "@/components/ui/Icon";
import DataTable from "@/components/ui/DataTable";
import { AddressCell, addressAccessor } from "@/utils/mappers";
import { formatDateLong } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";
import { getQuoteStage } from "../../utils/mappers";
import ScheduleInstallationModal from "@/components/quote/quotelisting/ScheduleInstallationModal"; // ✅ added
import { toast } from "react-toastify"; // ✅ added

const AwaitingInstallationSchedule = ({ jobs = [], loading, onRefresh }) => {
  const navigate = useNavigate();
  const [showScheduleModal, setShowScheduleModal] = useState(false); // ✅ added
  const [selectedJob, setSelectedJob] = useState(null); // ✅ added

  const mappedJobs = useMemo(() => {
    return jobs.map((job) => {
      const stage = getQuoteStage(job);
      return {
        ...job,
        statusLabel: stage.label,
        statusColor: stage.color,
      };
    });
  }, [jobs]);

  // ✅ Handle schedule button click
  const handleScheduleClick = (jobRow) => {
    const quote = {
      id: jobRow.quote_id,
      srNumber: jobRow.quote_no,
      customerName: `${jobRow.fname || ""} ${jobRow.lname || ""}`,
      email: jobRow.email,
    };
    setSelectedJob(quote);
    setShowScheduleModal(true);
  };

  // ✅ Handle after scheduled
  const handleScheduled = async () => {
    toast.success("Installation scheduled & email sent successfully!");
    setShowScheduleModal(false);
    if (onRefresh) await onRefresh();
  };

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
      accessor: "statusLabel",
      Cell: ({ row }) => (
        <span
          className={`inline-block ${row.original.statusColor} text-xs px-4 py-1.5 rounded font-medium whitespace-nowrap`}
        >
          {row.original.statusLabel}
        </span>
      ),
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
      Cell: ({ cell: { value }, row }) => {
        const canSchedule =
          row.original.statusLabel === "Confirmed - Deposit Paid";
        return (
          <div className="flex gap-2 justify-center">
            {/* ✅ Schedule button with modal */}
            <button
              className={`icon-btn transition-colors ${
                canSchedule
                  ? "hover:bg-indigo-50 dark:hover:bg-indigo-900 text-indigo-600 cursor-pointer"
                  : "opacity-40 cursor-not-allowed text-gray-400"
              }`}
              type="button"
              title={
                canSchedule
                  ? "Schedule Installation"
                  : `Cannot schedule — status: ${row.original.statusLabel}`
              }
              disabled={!canSchedule}
              onClick={() => canSchedule && handleScheduleClick(row.original)} // ✅ open modal
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
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);

  return (
    <>
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
          data={mappedJobs}
          loading={loading}
          initialPageSize={5}
        />
      </div>

      {/* ✅ Schedule Modal */}
      <ScheduleInstallationModal
        activeModal={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        quoteData={selectedJob}
        onScheduled={handleScheduled}
      />
    </>
  );
};

export default AwaitingInstallationSchedule;
