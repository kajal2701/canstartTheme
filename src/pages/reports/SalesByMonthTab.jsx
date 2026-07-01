import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { formatCurrency } from "@/utils/formatters";
import { getSalesByMonth } from "@/services/reportService";
import { CHART_LIGHT_THEME } from "@/utils/constants";

const SalesByMonthTab = ({ selectedYear, selectedMonth }) => {
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getSalesByMonth(selectedYear);
        setAllData(data || []);
      } catch (error) {
        console.error("Failed to fetch sales by month data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  // Apply month filter on frontend
  const monthData = React.useMemo(() => {
    if (!selectedMonth) return allData;
    return allData.filter((d) => d.month.endsWith(`-${selectedMonth}`));
  }, [allData, selectedMonth]);

  const monthChartOptions = {
    chart: { type: "area", toolbar: { show: false }, ...CHART_LIGHT_THEME, zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    markers: {
      size: monthData.length === 1 ? 6 : 0,
      hover: {
        size: 8,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    colors: ["#6366f1", "#f59e0b"],
    xaxis: {
      categories: monthData.map((d) => d.month_label),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#64748b", fontSize: "11px" } },
    },
    yaxis: [
      {
        title: { text: "Revenue ($)", style: { color: "#6366f1", fontWeight: 600 } },
        labels: {
          formatter: (v) => `$${(v / 1000).toFixed(0)}k`,
          style: { colors: "#64748b" },
        },
      },
      {
        opposite: true,
        title: { text: "Quotes", style: { color: "#f59e0b", fontWeight: 600 } },
        labels: {
          formatter: (v) => Math.round(v),
          style: { colors: "#64748b" },
        },
      },
    ],
    tooltip: {
      theme: "light",
      y: [
        { formatter: (v) => formatCurrency(v) },
        { formatter: (v) => `${v} quotes` },
      ],
    },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 }, // slate-200
    legend: { labels: { colors: "#475569" } }, // slate-600
  };

  const monthChartSeries = [
    { name: "Revenue", data: monthData.map((d) => d.total_revenue) },
    { name: "Quotes", data: monthData.map((d) => d.total_quotes), yAxisIndex: 1 },
  ];

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-500">
          Loading data...
        </div>
      ) : monthData.length === 0 ? (
        <div className="flex justify-center items-center py-20 text-slate-500">
          No data found for the selected filters.
        </div>
      ) : (
        <>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales by Month Overview</h3>
            <ReactApexChart
              options={monthChartOptions}
              series={monthChartSeries}
              type="area"
              height={320}
            />
          </div>

          <div className="bg-white overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  {["Month", "Quotes", "Revenue", "Avg Deal Size"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthData.map((row, i) => (
                  <tr
                    key={row.month}
                    className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{row.month_label}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        {row.total_quotes}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      {formatCurrency(row.total_revenue)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatCurrency(row.avg_deal_size)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-800">Total</td>
                  <td className="px-4 py-3 font-bold text-amber-700">
                    {monthData.reduce((s, d) => s + d.total_quotes, 0)}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-600">
                    {formatCurrency(monthData.reduce((s, d) => s + d.total_revenue, 0))}
                  </td>
                  <td className="px-4 py-3 text-slate-500">—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesByMonthTab;
