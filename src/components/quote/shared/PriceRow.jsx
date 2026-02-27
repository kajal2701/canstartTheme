import React from "react";

const PriceRow = ({ label, value, red = false, className = "" }) => {
  return (
    <div
      className={`flex justify-between items-center py-2 border-b border-dashed border-slate-100 dark:border-slate-700/60 ${className}`}
    >
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${red ? "text-rose-500" : "text-slate-700 dark:text-slate-300"}`}
      >
        {value}
      </span>
    </div>
  );
};

export default PriceRow;
