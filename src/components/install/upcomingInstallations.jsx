import React, { useMemo, useState } from "react"; // ✅ added useState
import Icon from "@/components/ui/Icon";
import DataTable from "@/components/ui/DataTable";
import { AddressCell, addressAccessor } from "@/utils/mappers";
import { formatDateLong } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";
import { encodeId, getQuoteStage } from "../../utils/mappers"; // ✅ added encodeId, getQuoteStage
import ScheduleInstallationModal from "@/components/quote/quotelisting/ScheduleInstallationModal"; // ✅ added
import { toast } from "react-toastify"; // ✅ added

const UpcomingInstallations = ({ jobs = [], loading, onRefresh }) => {
  // ✅ added onRefresh
  const navigate = useNavigate();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false); // ✅ added
  const [selectedJob, setSelectedJob] = useState(null); // ✅ added

  // ✅ Map jobs to add statusLabel + statusColor (same pattern as other components)
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

  // ✅ Handle reschedule button click — pass existing installation_date as prefillDate
  const handleRescheduleClick = (jobRow) => {
    setSelectedJob({
      id: jobRow.quote_id,
      srNumber: jobRow.quote_no,
      customerName: `${jobRow.fname || ""} ${jobRow.lname || ""}`.trim(),
      email: jobRow.email,
      installation_date: jobRow.installation_date, // ✅ existing date for prefill
    });
    setShowRescheduleModal(true);
  };

  // ✅ Handle after rescheduled
  const handleRescheduled = async () => {
    toast.success("Installation rescheduled & email sent successfully!");
    setShowRescheduleModal(false);
    if (onRefresh) await onRefresh();
  };

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
      Cell: ({ cell: { value }, row }) => (
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
            className="icon-btn hover:bg-green-50 dark:hover:bg-green-900"
            type="button"
            title="Print"
            onClick={() => navigate(`/users/quote_invoice/${encodeId(value)}`)}
          >
            <Icon icon="ph:printer" />
          </button>

          <button
            className="icon-btn hover:bg-indigo-50 dark:hover:bg-indigo-900 text-indigo-600"
            type="button"
            title="Reschedule Installation"
            onClick={() => handleRescheduleClick(row.original)}
          >
            <Icon icon="ph:calendar-check" />
          </button>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);

  return (
    <>
      <div className="my-5">
        <div className="border-2 border-blue-300 bg-blue-50/30 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 pt-6 pb-4">
            <Icon icon="ph:calendar-dots" className="text-2xl text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Upcoming Installations
            </h2>
            <span className="bg-indigo-500 text-white text-sm px-3 py-1 rounded-full font-medium">
              {jobs.length} Jobs
            </span>
          </div>

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
            <DataTable
              title=""
              columns={columns}
              data={mappedJobs} // ✅ use mappedJobs
              loading={loading}
              initialPageSize={5}
              rowClassName="hover:bg-blue-50 dark:hover:bg-gray-700 hover:bg-opacity-50"
              tableWrapperClassName="card bg-blue-50/30"
            />
          )}
        </div>
      </div>

      {/* ✅ Reschedule Modal — prefillDate passed so date is pre-filled */}
      <ScheduleInstallationModal
        activeModal={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        quoteData={selectedJob}
        onScheduled={handleRescheduled}
        prefillDate={selectedJob?.installation_date ?? null} // ✅ prefill existing date
      />
    </>
  );
};

export default UpcomingInstallations;
