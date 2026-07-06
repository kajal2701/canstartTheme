import React, { useMemo, useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import LoadingIcon from "@/components/LoadingIcon";
import DataTable from "@/components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { getQuotes, exportAllQuotes } from "@/services/quoteService";
import { useSelector } from "react-redux";
import { AddressCell } from "@/utils/mappers";
import { formatDate } from "@/utils/formatters";
import QuoteActionButtons from "@/components/quote/quotelisting/QuoteActionButtons";
import FilterSection from "../../components/quote/quotelisting/FilterSection";
import { addressAccessor, getQuoteStage } from "../../utils/mappers";
import { quoteStatusList, SANCTION_REASON_LABELS } from "../../utils/constants";
import { exportQuotesToExcel } from "../../utils/exportUtils";
import { toast } from "react-toastify";
import FutureReferenceModal from "../../components/quote/quoteListing/FutureReferenceModal";
import FollowUpModal from "../../components/quote/quoteListing/FollowUpModal";
import { useCallback } from "react";

const mapQuoteData = (quote) => {
  const stage = getQuoteStage(quote);
  return {
    id: quote.quote_id,
    srNumber: quote.quote_no,
    email: quote.email,
    salesman: quote.salesman,
    installerName: quote.installer_name || "",
    installerId: quote.installer_id || null,
    customerName: `${quote.fname} ${quote.lname}`,
    phone: quote.phone,
    address: quote.address,
    city: quote.city,
    state: quote.state,
    country: quote.country,
    post_code: quote.post_code,
    linearFeet: quote.total_numerical_box,
    colors: quote.colors,
    total: `$${parseFloat(quote.main_total).toFixed(2)}`,
    status: stage.label,
    rawStatus: quote.status,
    statusColor: stage.color,
    sanctionReason: quote.sanction_reason
      ? parseInt(quote.sanction_reason) === 4
        ? quote.sanction_notes
        : SANCTION_REASON_LABELS[parseInt(quote.sanction_reason)]
      : null,
    date: formatDate(quote.created_at),
    rawDate: quote.created_at ? quote.created_at.split("T")[0] : "",
    rawInstallationDate: quote.installation_date
      ? quote.installation_date.split("T")[0]
      : "",
    installationDate: formatDate(quote.installation_date) || "",
    followupDate: quote.followup_date ? formatDate(quote.followup_date) : "",

    installationSchedule: quote.installation_date
      ? formatDate(quote.installation_date)
      : "Not Scheduled",
  };
};
const Quote = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [salesmanFilter, setSalesmanFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [installationFilter, setInstallationFilter] = useState("");

  const [quotesData, setQuotesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uniqueSalesmen, setUniqueSalesmen] = useState([]);

  const [futureRefModal, setFutureRefModal] = useState({
    open: false,
    quote: null,
  });
  const [followUpModal, setFollowUpModal] = useState({
    open: false,
    quote: null,
  });

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 800);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when any filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, salesmanFilter, dateFilter, installationFilter, limit]);

  // Load unique salesmen once on mount
  useEffect(() => {
    let mounted = true;
    const fetchSalesmen = async () => {
      const uid = user?.user_id ?? "";
      const role = user?.role ?? "";
      try {
        const all = await exportAllQuotes({ userId: uid, role });
        if (mounted && all.length > 0) {
          const salesmen = [...new Set(all.map(q => q.salesman))].filter(Boolean).sort();
          setUniqueSalesmen(salesmen);
        }
      } catch (e) {
        console.error("Failed to load salesmen", e);
      }
    };
    if (user) fetchSalesmen();
    return () => { mounted = false; };
  }, [user]);

  const loadQuotes = useCallback(async () => {
    try {
      setLoading(true);
      const uid = user?.user_id ?? "";
      const role = user?.role ?? "";

      const res = await getQuotes({
        userId: uid,
        role: role,
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter,
        salesman: salesmanFilter === "all" ? "" : salesmanFilter,
        date: dateFilter,
        installation_date: installationFilter
      });

      if (res && res.data) {
        setQuotesData(res.data.map(mapQuoteData));
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalRecords(res.pagination?.total || 0);
      } else {
        setQuotesData([]);
      }
    } catch (err) {
      console.error("Error loading quotes:", err);
      setQuotesData([]);
    } finally {
      setLoading(false);
    }
  }, [user, page, limit, debouncedSearch, statusFilter, salesmanFilter, dateFilter, installationFilter]);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      loadQuotes();
    }
    return () => {
      mounted = false;
    };
  }, [loadQuotes]);

  const fetchQuotes = useCallback(async () => {
    await loadQuotes();
  }, [loadQuotes]);

  const onClearAll = () => {
    setSearchQuery("");
    setStatusFilter("");
    setSalesmanFilter("all");
    setDateFilter("");
    setInstallationFilter("");
  };

  const COLUMNS = [
    {
      Header: "Sr.",
      accessor: "srNumber",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-indigo-600 font-medium">{value}</span>
      ),
    },
    {
      Header: "Salesman",
      accessor: "salesman",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {value}
        </span>
      ),
    },
    {
      Header: "Customer Name",
      accessor: "customerName",
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
      accessor: "linearFeet",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {value}
        </span>
      ),
    },
    {
      Header: "Colors",
      accessor: "colors",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value}
        </span>
      ),
    },
    {
      Header: "Total",
      accessor: "total",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm font-semibold text-green-600">{value}</span>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => (
        <span
          className={`inline-block text-xs px-3 py-1 rounded font-medium ${row.original.statusColor}`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      Header: "Installation",
      accessor: "installationSchedule",
      Cell: ({ cell: { value } }) => (
        <span
          className={`inline-block text-xs px-3 py-1 rounded font-medium ${value === "Scheduled" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
        >
          {value}
        </span>
      ),
    },
    {
      Header: "Installer",
      accessor: "installerName",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {value || <span className="text-gray-400 italic">—</span>}
        </span>
      ),
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value}
        </span>
      ),
    },
    {
      Header: () => (
        <div className="text-center">
          Future <br /> Reference
        </div>
      ),
      accessor: "sanctionReason",
      Cell: ({ row }) => {
        const isSanctioned =
          row.original.status === "Confirmed - Awaiting Payment";

        if (!isSanctioned) {
          return (
            <div className="w-full flex justify-center items-center">
              <span className="text-gray-400 text-sm">—</span>
            </div>
          );
        }

        if (row.original.sanctionReason) {
          return (
            <div className="w-[90px] text-center ">
              <span
                className="inline-block text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium truncate max-w-[80px]"
                title={row.original.sanctionReason}
              >
                {row.original.sanctionReason}
              </span>
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <button
              className="icon-btn hover:bg-blue-50 "
              type="button"
              title="Future Reference"
              onClick={() =>
                setFutureRefModal({
                  open: true,
                  quote: row.original,
                })
              }
            >
              <Icon icon="ph:note-pencil" />
            </button>
          </div>
        );
      },
    },
    {
      Header: () => (
        <div className="text-center">
          Follow-Up <br /> Date
        </div>
      ),
      accessor: "followupDate",
      Cell: ({ row }) => {
        if (row.original.followupDate) {
          return (
            <div className="w-[90px] text-center">
              <span className="inline-block text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-medium truncate ">
                {row.original.followupDate}{" "}
              </span>
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <button
              className="icon-btn hover:bg-red-50"
              type="button"
              title="Set Follow-Up Date"
              onClick={() =>
                setFollowUpModal({ open: true, quote: row.original })
              }
            >
              <Icon icon="ph:bell-ringing" />
            </button>
          </div>
        );
      },
    },
    {
      Header: "Action",
      accessor: "id",
      Cell: ({ cell: { value }, row }) => (
        <QuoteActionButtons
          id={value}
          navigate={navigate}
          fetchQuotes={fetchQuotes}
          rowData={row.original}
        />
      ),
    },
  ];

  const handleExport = async () => {
    try {
      const uid = user?.user_id ?? "";
      const role = user?.role ?? "";
      const allMatchingData = await exportAllQuotes({
        userId: uid,
        role: role,
        search: debouncedSearch,
        status: statusFilter,
        salesman: salesmanFilter === "all" ? "" : salesmanFilter,
        date: dateFilter,
        installation_date: installationFilter
      });

      if (!allMatchingData || allMatchingData.length === 0) {
        toast.error("No data to export!");
        return;
      }

      const mappedData = allMatchingData.map(mapQuoteData);
      exportQuotesToExcel(mappedData);
      toast.success(`${mappedData.length} quotes exported successfully!`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");
    }
  };
  const columns = useMemo(() => COLUMNS, [fetchQuotes]);
  const data = quotesData;

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <LoadingIcon className="h-12 w-12 text-indigo-500" />
        </div>
      ) : (
        <div className="space-y-4">
          <Card noborder>
            <FilterSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              salesmanFilter={salesmanFilter}
              setSalesmanFilter={setSalesmanFilter}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
              installationFilter={installationFilter}
              setInstallationFilter={setInstallationFilter}
              uniqueSalesmen={uniqueSalesmen}
              STATUS_OPTIONS={quoteStatusList}
              onClearAll={onClearAll}
              limit={limit}
              setLimit={setLimit}
            />
            <div className="flex gap-2">
              <Button
                text="Export"
                icon="ph:download-simple"
                className="btn-warning"
                onClick={handleExport}
              />
              <Button
                text="Add Quote"
                icon="ph:plus"
                className="btn-primary"
                onClick={() => navigate("/quote/add")}
              />
            </div>
          </Card>

          <DataTable
            title={`Quote List (${totalRecords})`}
            columns={columns}
            data={data}
            loading={loading}
            serverSidePagination={true}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <FutureReferenceModal
        activeModal={futureRefModal.open}
        quote={futureRefModal.quote}
        onClose={() => setFutureRefModal({ open: false, quote: null })}
        onSuccess={fetchQuotes}
      />

      <FollowUpModal
        activeModal={followUpModal.open}
        quote={followUpModal.quote}
        onClose={() => setFollowUpModal({ open: false, quote: null })}
        onSuccess={fetchQuotes}
      />
    </>
  );
};

export default Quote;
