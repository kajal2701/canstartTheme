import React, { useMemo, useState } from "react"; // ✅ added useState
import Icon from "@/components/ui/Icon";
import DataTable from "@/components/ui/DataTable";
import { AddressCell, addressAccessor } from "@/utils/mappers";
import { formatDateLong } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";
import { encodeId, getQuoteStage } from "../../utils/mappers";
import ScheduleInstallationModal from "@/components/quote/quotelisting/ScheduleInstallationModal"; // ✅ added
import { toast } from "react-toastify";
import { sendFinalQuote } from "../../services/quoteService";

const PastInstallations = ({ jobs = [], loading, onRefresh }) => {
  const navigate = useNavigate();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);

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

  const getDaysOverdue = (installationDate) => {
    if (!installationDate) return null;
    const install = new Date(installationDate.split("T")[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffMs = today - install;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };
  const handleSendFinalInvoice = async () => {
    try {
      setIsSendingInvoice(true);
      const result = await sendFinalQuote({ quote_id: jobs?.quote_id });
      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
      onRefresh?.();
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSendingInvoice(false);
    }
  };

  const COLUMNS = [
    {
      Header: "Installation Date",
      accessor: "installation_date",
      Cell: ({ cell: { value } }) => (
        <div className="flex items-center gap-2">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {formatDateLong(value)}
          </span>
        </div>
      ),
    },
    {
      Header: "Days Overdue",
      accessor: "installation_date",
      id: "daysOverdue",
      Cell: ({ cell: { value } }) => {
        const days = getDaysOverdue(value);
        if (!days) return <span className="text-gray-400 text-xs">-</span>;
        const isDanger = days >= 90;
        return (
          <span
            className={`inline-block px-3 py-1 rounded text-xs font-medium ${isDanger ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}
          >
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
      Header: "Action",
      accessor: "quote_id",
      Cell: ({ cell: { value }, row }) => {
        const canSchedule =
          row.original.statusLabel === "Confirmed - Deposit Paid";
        return (
          <div className="flex gap-2 justify-center">
            <button
              className="icon-btn hover:bg-orange-50 dark:hover:bg-orange-900"
              type="button"
              title="Send Invoice"
              onClick={handleSendFinalInvoice}
            >
              <Icon icon="ph:paper-plane-tilt" />
            </button>

            <button
              className="icon-btn hover:bg-blue-50 dark:hover:bg-blue-900"
              type="button"
              title="View"
              onClick={() =>
                navigate(`/users/quote_invoice/${encodeId(value)}`)
              }
            >
              <Icon icon="ph:printer" />
            </button>

            <button
              className={`icon-btn transition-colors ${
                canSchedule
                  ? "hover:bg-red-50 dark:hover:bg-red-900 cursor-pointer"
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
          </div>
        );
      },
    },
  ];

  const columns = useMemo(() => COLUMNS, []);

  return (
    <>
      <div className="border-2 border-red-300 bg-red-50/30 rounded-xl overflow-hidden mb-5 [&_.card]:bg-transparent [&_.card]:shadow-none">
        <div className="px-6 pt-6">
          <div className="flex items-center gap-3 mb-3">
            <Icon icon="ph:warning-circle" className="text-red-500 text-xl" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Past Installations - Invoice Pending
            </h2>
            <span className="bg-pink-500 text-white text-sm px-3 py-1 rounded-full font-medium">
              {jobs.length} items
            </span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 text-xs flex items-center gap-1">
              <Icon icon="ph:info" className="text-sm" />
              <span className="font-medium">Action Required:</span>&nbsp;These
              installations are complete but invoices haven't been sent to
              customers yet.
            </p>
          </div>
        </div>

        <DataTable
          title=""
          columns={columns}
          data={mappedJobs}
          loading={loading}
          initialPageSize={5}
          rowClassName="hover:bg-red-50 dark:hover:bg-gray-700 hover:bg-opacity-50"
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

export default PastInstallations;
