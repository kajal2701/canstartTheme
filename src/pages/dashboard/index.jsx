import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { getDashboard } from "@/services/dashboardService";
import DataTable from "@/components/ui/DataTable";
import { AddressCell } from "@/utils/mappers";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { STATUS_MAP } from "@/utils/constants";

const COLUMNS = [
  {
    Header: "Sr.",
    accessor: "quote_no",
    Cell: ({ cell: { value } }) => (
      <span className="text-sm text-indigo-600 font-medium">{value}</span>
    ),
  },
  {
    Header: "Salesman",
    accessor: "salesman",
    Cell: ({ cell: { value } }) => (
      <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
    ),
  },
  {
    Header: "Customer Name",
    accessor: "fname",
    Cell: ({ row }) => (
      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{`${row.original.fname} ${row.original.lname}`}</span>
    ),
  },
  {
    Header: "Phone",
    accessor: "phone",
    Cell: ({ cell: { value } }) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
    ),
  },
  {
    Header: "Address",
    accessor: "address",
    Cell: ({ row }) => (
      <div className="min-w-[200px]">
        <AddressCell row={row} />
      </div>
    ),
  },
  {
    Header: "Total",
    accessor: "main_total",
    Cell: ({ cell: { value } }) => (
      <span className="text-sm font-semibold text-green-600">
        {formatCurrency(value)}
      </span>
    ),
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: ({ row }) => {
      const s = STATUS_MAP[row.original.status] || "Unknown";
      return (
        <span
          className={`inline-block text-xs px-3 py-1 rounded font-medium ${s === "Sent" ? "bg-yellow-400 text-gray-800" : "bg-gray-400 text-white"}`}
        >
          {s}
        </span>
      );
    },
  },
  {
    Header: "Date",
    accessor: "created_at",
    Cell: ({ cell: { value } }) => (
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {formatDate(value)}
      </span>
    ),
  },
];
const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    total_quotes: 0,
    total_approved_quotes: 0,
    total_users: 0,
    total_products: 0,
    quotes: [],
  });
  const [loadingData, setLoadingData] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        const data = await getDashboard(user.user_id, user.role);
        if (mounted && data) {
          setStats({
            total_quotes: data.total_quotes || 0,
            total_approved_quotes: data.total_approved_quotes || 0,
            total_users: data.total_users || 0,
            total_products: data.total_products || 0,
            quotes: data.quotes || [],
          });
        }
      } catch (e) {
        console.error("failed to load dashboard stats", e);
      } finally {
        if (mounted) setLoadingData(false);
      }
    };
    loadStats();
    return () => {
      mounted = false;
    };
  }, [user]);
  const columns = useMemo(() => COLUMNS, []);
  return (
    <div className=" space-y-5">
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {[
          {
            id: "total_quotes",
            icon: "ph:clipboard-text",
            gradient: "from-[#ff8a80] to-[#ff5252]",
            subtitle: "Total Quotes",
          },
          {
            id: "total_approved_quotes",
            icon: "ph:receipt",
            gradient: "from-[#ffb74d] to-[#ff9800]",
            subtitle: "Total Invoices",
          },
          {
            id: "total_users",
            icon: "ph:users",
            gradient: "from-[#F472B6] to-[#DB2777]",
            subtitle: "Total Users",
          },
          {
            id: "total_products",
            icon: "ph:package",
            gradient: "from-[#ff7043] to-[#f4511e]",
            subtitle: "Total Products",
          },
        ].map((card) => (
          <Card
            key={card.id}
            className={`flex items-center py-2 px-4 bg-gradient-to-br ${card.gradient} shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-xl text-white`}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center text-lg">
                <Icon icon={card.icon} />
              </div>

              <div>
                <div className="text-lg font-semibold">
                  {loadingData ? "..." : stats[card.id]}
                </div>
                <div className="text-xs text-orange-100">{card.subtitle}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div>
        <DataTable
          title="Quotes"
          columns={columns}
          data={stats.quotes}
          loading={loadingData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
