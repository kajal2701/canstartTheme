import React, { useMemo, useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import LoadingIcon from "@/components/LoadingIcon";
import DataTable from "@/components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { getQuotes } from "@/services/quoteService";
import { useSelector } from "react-redux";
import { AddressCell } from "@/utils/mappers";
import { formatDate } from "@/utils/formatters";
import QuoteActionButtons from "@/components/quote/quotelisting/QuoteActionButtons";
import FilterSection from "../../components/quote/quotelisting/FilterSection";
import { addressAccessor, getQuoteStage } from "../../utils/mappers";
import { quoteStatusList } from "../../utils/constants";
import { exportQuotesToExcel } from "../../utils/exportUtils";
import { toast } from "react-toastify";

const mapQuoteData = (quote) => {
  const stage = getQuoteStage(quote);
  return {
    id: quote.quote_id,
    srNumber: quote.quote_no,
    email: quote.email,
    salesman: quote.salesman,
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
    statusColor: stage.color,
    date: quote.created_at ? quote.created_at.split("T")[0] : "",
    installationDate: quote.installation_date || "",
    installationSchedule: quote.installation_date
      ? quote.installation_date
      : "Not Scheduled",
  };
};
const Quote = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [salesmanFilter, setSalesmanFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [quotesData, setQuotesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const uid = user?.user_id ?? "";
      const role = user?.role ?? "";
      const list = await getQuotes(uid, role);
      const mappedList = list.map(mapQuoteData);
      setQuotesData(mappedList);
    } catch (err) {
      console.error("Error loading quotes:", err);
      setQuotesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      loadQuotes();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  const fetchQuotes = async () => {
    await loadQuotes();
  };

  const uniqueSalesmen = useMemo(() => {
    return [...new Set(quotesData.map((item) => item.salesman))].sort();
  }, [quotesData]);

  const onClearAll = () => {
    setSearchQuery("");
    setStatusFilter("");
    setSalesmanFilter("all");
    setDateFilter("");
  };

  const filteredData = useMemo(() => {
    return quotesData.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.srNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone?.includes(searchQuery) ||
        item.address?.toLowerCase().includes(searchQuery.toLowerCase());

      // ✅ Change this line (was: item.status === statusFilter)
      const matchesStatus = statusFilter === "" || item.status === statusFilter;

      const matchesSalesman =
        salesmanFilter === "all" || item.salesman === salesmanFilter;
      const matchesDate = dateFilter === "" || item.date === dateFilter;

      return matchesSearch && matchesStatus && matchesSalesman && matchesDate;
    });
  }, [searchQuery, statusFilter, salesmanFilter, dateFilter, quotesData]);
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
      Header: "Date",
      accessor: "date",
      Cell: ({ cell: { value } }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
    {
      Header: "Action",
      accessor: "id",
      Cell: (
        { cell: { value }, row }, // ✅ add row here
      ) => (
        <QuoteActionButtons
          id={value}
          navigate={navigate}
          fetchQuotes={fetchQuotes}
          rowData={row.original} // ✅ pass full row data
        />
      ),
    },
  ];

  const handleExport = () => {
    if (data.length === 0) {
      toast.error("No data to export!");
      return;
    }
    try {
      exportQuotesToExcel(data);
      toast.success(`${data.length} quotes exported successfully!`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");
    }
  };
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => filteredData, [filteredData]);

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
              uniqueSalesmen={uniqueSalesmen}
              STATUS_OPTIONS={quoteStatusList}
              onClearAll={onClearAll}
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
            title="Quotes"
            columns={columns}
            data={data}
            loading={loading}
          />
        </div>
      )}
    </>
  );
};

export default Quote;
