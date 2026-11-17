import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { DAY_NAMES, STATUS_STYLES, NOTE_COLOR_STYLES } from "@/utils/constants";
import { isToday, toTitleCase } from "@/utils/formatters";

const CalendarComponent = ({
  calendarDays,
  jobsByDate,
  notesByDate = {},
  onJobClick,
  onMoreClick,
  onDayClick,
}) => {
  return (
    <Card className="!shadow-sm border border-gray-100 dark:border-gray-700 !p-0 overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 dark:from-gray-700/60 dark:via-gray-700/40 dark:to-gray-700/60 border-b border-gray-200 dark:border-gray-600">
            {DAY_NAMES.map((day, i) => (
              <div
                key={day}
                className={`text-center py-3 text-[11px] font-bold uppercase tracking-widest ${
                  i === 0 || i === 6
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
              const dayJobs = cell.dateKey ? jobsByDate[cell.dateKey] || [] : [];
              const dayNotes = cell.dateKey ? notesByDate[cell.dateKey] || [] : [];
              const todayCell = isToday(cell.dateKey);
              const hasJobs = dayJobs.length > 0;
              const hasNotes = dayNotes.length > 0;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (cell.isCurrentMonth && cell.dateKey && onDayClick) {
                      onDayClick(cell.dateKey);
                    }
                  }}
                  className={`relative min-h-[135px] border-b border-r border-gray-100 dark:border-gray-700/50 p-2 transition-all duration-200 group flex flex-col justify-between ${
                    cell.isCurrentMonth
                      ? "bg-white dark:bg-gray-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 cursor-pointer"
                      : "bg-gray-50/60 dark:bg-gray-850/40"
                  } ${todayCell ? "bg-indigo-50/40 dark:bg-indigo-900/15" : ""}`}
                >
                  {/* Today left accent bar */}
                  {todayCell && (
                    <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-indigo-500" />
                  )}

                  {/* Top content */}
                  <div>
                    {/* Day number row */}
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[13px] font-semibold leading-none ${
                            todayCell
                              ? "bg-indigo-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm shadow-indigo-200 dark:shadow-indigo-900/50"
                              : cell.isCurrentMonth
                              ? "text-gray-700 dark:text-gray-300 w-7 h-7 rounded-full flex items-center justify-center group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors"
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

                      <div className="flex items-center gap-1">
                        {/* Note count badge */}
                        {hasNotes && (
                          <span
                            title={`${dayNotes.length} note(s)`}
                            className="text-[10px] font-semibold rounded-full h-5 px-1.5 flex items-center gap-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          >
                            <Icon icon="ph:note-pencil" className="text-[10px]" />
                            {dayNotes.length}
                          </span>
                        )}

                        {/* Job count badge */}
                        {hasJobs && (
                          <span
                            title={`${dayJobs.length} installation(s)`}
                            className={`text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 ${
                              todayCell
                                ? "bg-indigo-500 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {dayJobs.length}
                          </span>
                        )}

                        {/* Add / Edit button on hover */}
                        {cell.isCurrentMonth && (
                          <button
                            type="button"
                            title="Add / View Notes"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDayClick && onDayClick(cell.dateKey);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-500 hover:text-white text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs"
                          >
                            <Icon icon="ph:plus" className="text-xs" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Job chips */}
                    <div className="space-y-1">
                      {dayJobs.slice(0, 2).map((j) => {
                        const style = STATUS_STYLES[j.status] || STATUS_STYLES.upcoming;
                        const customerName = `${j.fname || ""} ${j.lname || ""}`.trim();
                        const feet = j.total_numerical_box || "";
                        const color = j.colors || "";

                        return (
                          <div
                            key={j.quote_id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onJobClick(j.quote_id);
                            }}
                            title={`${customerName}${
                              feet || color
                                ? ` (${[feet ? `${feet} ft` : "", color].filter(Boolean).join(" • ")})`
                                : ""
                            } - ${j.installer_name || "Unassigned"}`}
                            className={`${style.bg} rounded-lg p-1.5 cursor-pointer hover:scale-[1.01] hover:shadow-md transition-all duration-150 border-l-[3px] ${
                              j.status === "upcoming"
                                ? "border-l-indigo-500"
                                : j.status === "in_progress"
                                ? "border-l-amber-500"
                                : "border-l-green-500"
                            }`}
                          >
                            {/* Line 1: Customer Name */}
                            <div
                              className={`text-[11px] font-semibold ${style.text} truncate leading-tight`}
                            >
                              {customerName || "—"}
                            </div>

                            {/* Line 2: Clean Pill Badges */}
                            {(feet || color) && (
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                {[feet && `${feet} ft`, color && toTitleCase(color)]
                                  .filter(Boolean)
                                  .map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-medium rounded bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-gray-600/50 shadow-xs truncate max-w-[90px]"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                              </div>
                            )}

                            {/* Line 3: Installer Name */}
                            <p
                              className={`text-[9px] ${style.text} opacity-70 truncate leading-tight mt-1 flex items-center gap-1`}
                            >
                              <span className="truncate">
                                {j.installer_name || "⚠ Unassigned"}
                              </span>
                            </p>
                          </div>
                        );
                      })}

                      {dayJobs.length > 2 && (
                        <div
                          className="flex items-center gap-1 pl-1 pt-0.5 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoreClick && onMoreClick(cell.dateKey);
                          }}
                        >
                          <div className="flex -space-x-0.5">
                            {dayJobs.slice(2, 5).map((j) => {
                              const s = STATUS_STYLES[j.status] || STATUS_STYLES.upcoming;
                              return (
                                <div
                                  key={j.quote_id}
                                  className={`w-1.5 h-1.5 rounded-full ${s.dot} ring-1 ring-white dark:ring-gray-800`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-[9px] text-indigo-500 dark:text-indigo-400 font-semibold hover:underline">
                            +{dayJobs.length - 2} more
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Custom Notes indicator chips */}
                  {hasNotes && (
                    <div className="mt-1.5 pt-1 border-t border-gray-100 dark:border-gray-700/60 space-y-1">
                      {dayNotes.slice(0, 2).map((note) => {
                        const style =
                          NOTE_COLOR_STYLES[note.color] || NOTE_COLOR_STYLES.blue;
                        return (
                          <div
                            key={note.note_id}
                            title={`${note.title}${note.description ? `\n${note.description}` : ""}`}
                            className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border-l-2 ${style.border} ${style.bg} ${style.text} truncate font-medium`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                            <span className="truncate">{note.title}</span>
                          </div>
                        );
                      })}
                      {dayNotes.length > 2 && (
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 pl-1">
                          +{dayNotes.length - 2} more note(s)
                        </span>
                      )}
                    </div>
                  )}
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
