import React from "react";
import Icon from "@/components/ui/Icon";

export const RichDescription = ({ text }) => {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong
            key={i}
            className="font-semibold text-slate-900 dark:text-white"
          >
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    approved:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    pending:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    draft: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${map[status] || map.draft}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

export const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
      <Icon
        icon={icon}
        className="text-blue-600 dark:text-blue-400 text-base"
      />
    </div>
    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
      {title}
    </h3>
  </div>
);
