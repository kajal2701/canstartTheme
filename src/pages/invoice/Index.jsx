import { useState, useMemo, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import DataTable from "@/components/ui/DataTable";
import { getPayments } from "@/services/paymentService";
import { useSelector } from "react-redux";
import { formatDate } from "@/utils/formatters";

const Invoice = () => {
  const { user } = useSelector((state) => state.auth);

  const TEXT_CLASSES = {
    primary: "text-sm text-gray-700 dark:text-gray-300",
    secondary: "text-sm text-gray-600 dark:text-gray-400",
    medium: "text-sm text-gray-700 dark:text-gray-300 font-medium",
  };
  const PAYMENT_COLUMNS = [
    {
      Header: "Invoice No.",
      accessor: "invoiceNo",
      Cell: ({ cell: { value } }) => (
        <span className={TEXT_CLASSES.primary}>{value}</span>
      ),
    },
    {
      Header: "Customer Name",
      accessor: "customerName",
      Cell: ({ cell: { value } }) => (
        <span className={TEXT_CLASSES.medium}>{value}</span>
      ),
    },
    {
      Header: "Payment Type",
      accessor: "paymentType",
      Cell: ({ cell: { value } }) => (
        <span className={TEXT_CLASSES.secondary}>{value}</span>
      ),
    },
    {
      Header: "Payment Amount",
      accessor: "paymentAmount",
      Cell: ({ cell: { value } }) => (
        <span className={TEXT_CLASSES.primary}>{value}</span>
      ),
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ cell: { value } }) => (
        <span className={TEXT_CLASSES.secondary}>{value}</span>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: () => (
        <div className="flex justify-center">
          <button className="icon-btn" type="button" title="Print">
            <Icon icon="ph:printer" />
          </button>
        </div>
      ),
    },
  ];

  const columns = useMemo(() => PAYMENT_COLUMNS, []);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const data = useMemo(() => rows, [rows]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(user, "user");
        const uid = user?.user_id ?? "";
        const role = user?.role ?? "";
        const list = await getPayments(uid, role);
        console.log(list, "list");
        if (!mounted) return;
        const mapped = Array.isArray(list)
          ? list.map((p, idx) => ({
              invoiceNo: p.payment_id || idx + 1,
              customerName: p.customer_name || p.name || "-",
              paymentType: p.payment_method || "-",
              paymentAmount: p.amount || "-",
              date: formatDate(p.created_at),
            }))
          : [];
        setRows(mapped);
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load payments");
          setRows([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <DataTable
      title="Invoice"
      columns={columns}
      data={data}
      loading={loading}
      initialPageSize={10}
    />
  );
};

export default Invoice;
