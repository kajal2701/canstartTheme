import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { formatCurrency } from "@/utils/formatters";
import { getSalesByPerson } from "@/services/reportService";
import { CHART_LIGHT_THEME, CHART_COLORS } from "@/utils/constants";

const SalesByPersonTab = ({ selectedYear, selectedMonth }) => {
  const [loading, setLoading] = useState(true);
  const [personData, setPersonData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getSalesByPerson(selectedYear, selectedMonth);
        setPersonData(data || []);
      } catch (error) {
        console.error("Failed to fetch sales by person data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear, selectedMonth]);

  const personChartOptions = {
    chart: { type: "bar", toolbar: { show: false }, ...CHART_LIGHT_THEME },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        distributed: true,
        barHeight: "60%",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (v) => `$${(v / 1000).toFixed(1)}k`,
      style: { fontSize: "11px", colors: ["#333"] },
    },
    colors: CHART_COLORS,
    xaxis: {
      labels: {
        formatter: (v) => `$${(v / 1000).toFixed(0)}k`,
        style: { colors: "#64748b" },
      },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#475569", fontSize: "12px", fontWeight: 500 } }, // slate-600
    },
    tooltip: { theme: "light", y: { formatter: (v) => formatCurrency(v) } },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } }, // slate-200
    legend: { show: false },
  };

  const personChartSeries = [
    {
      name: "Revenue",
      data: personData.map((d) => ({
        x: d.salesperson,
        y: d.total_revenue,
      })),
    },
  ];

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-500">
          Loading data...
        </div>
      ) : personData.length === 0 ? (
        <div className="flex justify-center items-center py-20 text-slate-500">
          No data found for the selected filters.
        </div>
      ) : (
        <>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales by Person Overview</h3>
            <ReactApexChart
              options={personChartOptions}
              series={personChartSeries}
              type="bar"
              height={Math.max(280, personData.length * 52)}
            />
          </div>

          <div className="bg-white overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  {["Rank", "Salesperson", "Quotes", "Total Revenue", "Avg Deal", "Best Deal"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {personData.map((row, i) => (
                  <tr
                    key={row.user_id}
                    className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${i === 0 ? "bg-amber-50/50" : i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${i === 0
                          ? "bg-amber-400 text-amber-900"
                          : i === 1
                            ? "bg-slate-300 text-slate-800"
                            : i === 2
                              ? "bg-orange-300 text-orange-900"
                              : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{row.salesperson}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {row.total_quotes}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      {formatCurrency(row.total_revenue)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatCurrency(row.avg_deal_size)}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatCurrency(row.max_deal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan="2" className="px-4 py-3 font-bold text-slate-800">Total</td>
                  <td className="px-4 py-3 font-bold text-indigo-700">
                    {personData.reduce((s, d) => s + d.total_quotes, 0)}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-600">
                    {formatCurrency(personData.reduce((s, d) => s + d.total_revenue, 0))}
                  </td>
                  <td colSpan="2" className="px-4 py-3 text-slate-500">—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesByPersonTab;
