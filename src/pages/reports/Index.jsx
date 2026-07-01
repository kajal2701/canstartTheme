import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import SalesByMonthTab from "./SalesByMonthTab";
import SalesByPersonTab from "./SalesByPersonTab";
import ColorAnalysisTab from "./ColorAnalysisTab";
import { YEAR_OPTIONS, MONTH_OPTIONS } from "@/utils/constants";

// ─── Tab button ───────────────────────────────────────────────────────
const TabBtn = ({ active, onClick, icon, label }) => (
  <button
    id={`report-tab-${label.toLowerCase().replace(/\s/g, "-")}`}
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
      : "text-slate-600 hover:text-slate-800 hover:bg-slate-100" // Light theme adjustment
      }`}
  >
    <Icon icon={icon} className="text-base" />
    {label}
  </button>
);

const Reports = () => {
  const [activeTab, setActiveTab] = useState("month");
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(""); // empty means all months

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight"> {/* Light theme text */}
            Sales Reports
          </h1>
          <p className="text-sm text-slate-500 mt-0.5"> {/* Light theme text */}
            Analytics across all quotes and salespeople
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Filter */}
          <div className="flex items-center gap-2">
            <Icon icon="ph:calendar-blank" className="text-slate-400 text-lg" />
            <select
              id="report-month-filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
            >
              <option value="">All Months</option>
              {MONTH_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <Icon icon="ph:calendar-dots" className="text-slate-400 text-lg" />
            <select
              id="report-year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm"
            >
              <option value="">All Years</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Tabs Container ─────────────────────────────────────── */}
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-wrap gap-2">
            <TabBtn
              active={activeTab === "month"}
              onClick={() => setActiveTab("month")}
              icon="ph:chart-line-up"
              label="Sales by Month"
            />
            <TabBtn
              active={activeTab === "person"}
              onClick={() => setActiveTab("person")}
              icon="ph:users-three"
              label="Sales by Quote Person"
            />
            <TabBtn
              active={activeTab === "color"}
              onClick={() => setActiveTab("color")}
              icon="ph:paint-bucket"
              label="Maximum Use of Colour"
            />
          </div>
        </div>

        {/* ── Tab Content ─────────────────────────────────── */}
        <div className="p-5">
          {activeTab === "month" && <SalesByMonthTab selectedYear={selectedYear} selectedMonth={selectedMonth} />}
          {activeTab === "person" && <SalesByPersonTab selectedYear={selectedYear} selectedMonth={selectedMonth} />}
          {activeTab === "color" && <ColorAnalysisTab selectedYear={selectedYear} selectedMonth={selectedMonth} />}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
