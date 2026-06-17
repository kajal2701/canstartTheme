import React from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { MONTH_NAMES } from "@/utils/constants";

const CalendarHeader = ({ 
  currentMonth, 
  currentYear, 
  jobCount, 
  goToday, 
  goPrev, 
  goNext, 
  onBack 
}) => {
  return (
    <>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon icon="ph:arrow-left" className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Icon icon="ph:calendar-dots" className="text-indigo-500" />
              Installation Calendar
            </h1>
            <p className="text-sm text-gray-500">
              {MONTH_NAMES[currentMonth]} {currentYear} • {jobCount} installations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button text="Today" className="btn-outline-secondary btn-sm" onClick={goToday} />

        </div>
      </div>

      {/* ── Month Nav ── */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3 shadow-sm">
        <button
          onClick={goPrev}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
        >
          <Icon icon="ph:caret-left" className="text-gray-600 dark:text-gray-300" />
        </button>

        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h2>

        <button
          onClick={goNext}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
        >
          <Icon icon="ph:caret-right" className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        {[
          { label: "Upcoming", color: "bg-indigo-500" },
          { label: "In Progress", color: "bg-amber-500" },
          { label: "Completed", color: "bg-green-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default CalendarHeader;
