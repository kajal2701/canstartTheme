import React from "react";
import Card from "@/components/ui/Card";
import { DAY_NAMES, STATUS_STYLES } from "@/utils/constants";
import { isToday } from "@/utils/formatters";

const CalendarComponent = ({ calendarDays, jobsByDate, onJobClick }) => {
  return (
    <Card className="!shadow-sm border border-gray-100 dark:border-gray-700 !p-0 overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 dark:from-gray-700/60 dark:via-gray-700/40 dark:to-gray-700/60 border-b border-gray-200 dark:border-gray-600">
            {DAY_NAMES.map((day, i) => (
              <div
                key={day}
                className={`text-center py-3 text-[11px] font-bold uppercase tracking-widest ${i === 0 || i === 6
                  ? "text-rose-400 dark:text-rose-400/70"
                  : "text-indigo-500 dark:text-indigo-400"
                  }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map((cell, idx) => {
              const dayJobs = cell.dateKey ? (jobsByDate[cell.dateKey] || []) : [];
              const todayCell = isToday(cell.dateKey);
              const hasJobs = dayJobs.length > 0;

              return (
                <div
                  key={idx}
                  className={`relative min-h-[120px] border-b border-r border-gray-100 dark:border-gray-700/50 p-2 transition-all duration-200 group ${cell.isCurrentMonth
                    ? "bg-white dark:bg-gray-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10"
                    : "bg-gray-50/60 dark:bg-gray-850/40"
                    } ${todayCell ? "bg-indigo-50/40 dark:bg-indigo-900/15" : ""}`}
                >
                  {/* Today left accent bar */}
                  {todayCell && (
                    <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-indigo-500" />
                  )}

                  {/* Day number row */}
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[13px] font-semibold leading-none ${todayCell
                          ? "bg-indigo-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm shadow-indigo-200 dark:shadow-indigo-900/50"
                          : cell.isCurrentMonth
                            ? "text-gray-700 dark:text-gray-300 w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            : "text-gray-300 dark:text-gray-600 w-7 h-7 flex items-center justify-center"
                          }`}
                      >
                        {cell.day}
                      </span>
                      {/* Today pulsing dot */}
                      {todayCell && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                      )}
                    </div>

                    {/* Job count badge */}
                    {hasJobs && (
                      <span className={`text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 ${todayCell
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}>
                        {dayJobs.length}
                      </span>
                    )}
                  </div>

                  {/* Job chips */}
                  <div className="space-y-1">
                    {dayJobs.slice(0, 2).map((j) => {
                      const style = STATUS_STYLES[j.status] || STATUS_STYLES.upcoming;
                      return (
                        <div
                          key={j.quote_id}
                          onClick={() => onJobClick(j.quote_id)}
                          className={`${style.bg} rounded-md px-2 py-1 cursor-pointer hover:scale-[1.02] hover:shadow-sm transition-all duration-150 border-l-[3px] ${j.status === "upcoming"
                            ? "border-l-indigo-500"
                            : j.status === "in_progress"
                              ? "border-l-amber-500"
                              : "border-l-green-500"
                            }`}
                        >
                          <div className="flex items-center gap-1">
                            <span className={`text-[10px] font-semibold ${style.text} truncate leading-tight`}>
                              {j.fname} {j.lname}
                            </span>
                          </div>
                          <p className={`text-[8px] ${style.text} opacity-60 truncate leading-tight mt-0.5`}>
                            {j.installer_name || "⚠ Unassigned"}
                          </p>
                        </div>
                      );
                    })}
                    {dayJobs.length > 2 && (
                      <div className="flex items-center gap-1 pl-1 pt-0.5">
                        <div className="flex -space-x-0.5">
                          {dayJobs.slice(2, 5).map((j) => {
                            const s = STATUS_STYLES[j.status] || STATUS_STYLES.upcoming;
                            return <div key={j.quote_id} className={`w-1.5 h-1.5 rounded-full ${s.dot} ring-1 ring-white dark:ring-gray-800`} />;
                          })}
                        </div>
                        <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-semibold cursor-pointer hover:underline">
                          +{dayJobs.length - 2} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CalendarComponent;
