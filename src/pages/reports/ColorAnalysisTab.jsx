import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { formatCurrency } from "@/utils/formatters";
import { getColorUsage } from "@/services/reportService";
import { CHART_LIGHT_THEME, CHART_COLORS } from "@/utils/constants";

const ColorAnalysisTab = ({ selectedYear, selectedMonth }) => {
  const [loading, setLoading] = useState(true);
  const [colorData, setColorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getColorUsage(selectedYear, selectedMonth);
        setColorData(data || []);
      } catch (error) {
        console.error("Failed to fetch color usage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear, selectedMonth]);

  const topColors = colorData.slice(0, 10);
  const maxBoxes = colorData.length > 0 ? colorData[0].total_boxes : 1; // Prevent division by zero

  const colorDonutOptions = {
    chart: { type: "donut", ...CHART_LIGHT_THEME },
    labels: topColors.map((d) => d.color),
    colors: CHART_COLORS.slice(0, topColors.length),
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      labels: { colors: "#475569" }, // slate-600
      fontSize: "12px",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Boxes",
              color: "#475569", // slate-600
              formatter: (w) =>
                w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString(),
            },
            value: {
              color: "#1e293b", // slate-800 for the actual number
            }
          },
        },
      },
    },
    tooltip: { theme: "light", y: { formatter: (v) => `${v.toLocaleString()} boxes` } },
  };

  const colorDonutSeries = topColors.map((d) => d.total_boxes);

  const colorBarOptions = {
    chart: { type: "bar", toolbar: { show: false }, ...CHART_LIGHT_THEME },
    plotOptions: {
      bar: { horizontal: true, borderRadius: 6, distributed: true, barHeight: "55%" },
    },
    colors: CHART_COLORS,
    dataLabels: { enabled: false },
    xaxis: {
      labels: { style: { colors: "#64748b" } },
      axisBorder: { show: false },
    },
    yaxis: { labels: { style: { colors: "#475569", fontSize: "11px", fontWeight: 500 } } },
    tooltip: { theme: "light", y: { formatter: (v) => `${v.toLocaleString()} boxes` } },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4 }, // slate-200
    legend: { show: false },
  };

  const colorBarSeries = [
    {
      name: "Total Boxes",
      data: colorData.slice(0, 15).map((d) => ({ x: d.color, y: d.total_boxes })),
    },
  ];

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-500">
          Loading data...
        </div>
      ) : colorData.length === 0 ? (
        <div className="flex justify-center items-center py-20 text-slate-500">
          No data found for the selected filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donut */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Top 10 — Share of Total Boxes
              </p>
              <ReactApexChart
                options={colorDonutOptions}
                series={colorDonutSeries}
                type="donut"
                height={320}
              />
            </div>
            {/* Horizontal bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Top 15 — Total Boxes Used
              </p>
              <ReactApexChart
                options={colorBarOptions}
                series={colorBarSeries}
                type="bar"
                height={320}
              />
            </div>
          </div>

          {/* Colour swatches + table */}
          <div className="bg-white overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                <tr>
                  {["#", "Colour", "Times Used", "Total Boxes", "Revenue Generated"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {colorData.map((row, i) => (
                  <tr
                    key={row.color}
                    className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                  >
                    <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full border border-slate-300 flex-shrink-0"
                          style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                        />
                        <span className="font-medium text-slate-800">{row.color}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{row.usage_count}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full bg-indigo-500"
                          style={{
                            width: `${Math.min(100, (row.total_boxes / maxBoxes) * 100)}%`,
                            minWidth: "4px",
                            maxWidth: "80px",
                          }}
                        />
                        <span className="text-indigo-600 font-semibold">{row.total_boxes.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">
                      {formatCurrency(row.total_revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan="2" className="px-4 py-3 font-bold text-slate-800">Total</td>
                  <td className="px-4 py-3 font-bold text-indigo-700">
                    {colorData.reduce((s, d) => s + d.usage_count, 0)}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-500">
                    {colorData.reduce((s, d) => s + d.total_boxes, 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-600">
                    {formatCurrency(colorData.reduce((s, d) => s + d.total_revenue, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorAnalysisTab;
