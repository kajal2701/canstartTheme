import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AssignInstallerModal from "@/components/install/AssignInstallerModal";
import { getInstalls } from "@/services/installService";

// ── Helpers ──
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const formatDateKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const isToday = (dateStr) => dateStr === new Date().toISOString().split("T")[0];

const STATUS_STYLES = {
  upcoming:    { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-300", dot: "bg-indigo-500" },
  in_progress: { bg: "bg-amber-100 dark:bg-amber-900/30",  text: "text-amber-700 dark:text-amber-300",   dot: "bg-amber-500" },
  completed:   { bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-700 dark:text-green-300",   dot: "bg-green-500" },
};

const CalendarView = () => {
  const navigate = useNavigate();
  const today = new Date();

  // ── Get user role from redux ──
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;       // 1=Admin, 2=Installer
  const userId = user?.user_id;      // current user's ID
  const isAdmin = userRole === 1;

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [viewMode, setViewMode] = useState("month"); // month | list
  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── Fetch Installations ──
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const data = await getInstalls(userId || "", userRole || "");
        // Use upcoming installations for the calendar
        const upcoming = data?.upcoming_installations || [];
        
        // Ensure installation_date is just YYYY-MM-DD to match the calendar grid grouping
        const formattedJobs = upcoming.map(job => {
          let dateStr = job.installation_date || "";
          // Strip time part if present (e.g. "2026-04-10 14:30:00" -> "2026-04-10")
          if (dateStr.includes(" ")) dateStr = dateStr.split(" ")[0];
          if (dateStr.includes("T")) dateStr = dateStr.split("T")[0];
          
          return {
            ...job,
            installation_date: dateStr,
            status: job.status || "upcoming" // Default to upcoming
          };
        });
        
        setAllJobs(formattedJobs);
      } catch (error) {
        console.error("Failed to load jobs", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [userId, userRole]);

  // ── Role-based filtering: Admin sees all, Installer sees only their assigned jobs ──
  const jobs = useMemo(() => {
    if (isAdmin) return allJobs;
    return allJobs.filter((j) => j.installer_id === userId);
  }, [allJobs, isAdmin, userId]);

  // Assign modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignJob, setSelectedAssignJob] = useState(null);

  // ── Build calendar grid ──
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Previous month padding
    const prevMonthDays = getDaysInMonth(
      currentMonth === 0 ? currentYear - 1 : currentYear,
      currentMonth === 0 ? 11 : currentMonth - 1
    );
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false, dateKey: "" });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        day: d,
        isCurrentMonth: true,
        dateKey: formatDateKey(currentYear, currentMonth, d),
      });
    }

    // Next month padding (fill to 42 = 6 rows)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, isCurrentMonth: false, dateKey: "" });
    }

    return days;
  }, [currentYear, currentMonth]);

  // ── Jobs grouped by date ──
  const jobsByDate = useMemo(() => {
    const map = {};
    jobs.forEach((job) => {
      const key = job.installation_date;
      if (!map[key]) map[key] = [];
      map[key].push(job);
    });
    return map;
  }, [jobs]);

  // ── Jobs for current month (list view) ──
  const monthJobs = useMemo(() => {
    return jobs
      .filter((j) => {
        const d = new Date(j.installation_date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      })
      .sort((a, b) => a.installation_date.localeCompare(b.installation_date));
  }, [jobs, currentYear, currentMonth]);

  // ── Navigation ──
  const goToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };
  const goPrev = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };
  const goNext = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // ── Assign handler ──
  const handleAssignClick = (job) => {
    setSelectedAssignJob(job);
    setShowAssignModal(true);
  };

  const handleAssigned = (installer) => {
    setAllJobs((prev) =>
      prev.map((j) =>
        j.quote_id === selectedAssignJob?.quote_id
          ? { ...j, installer_id: installer.id, installer_name: installer.name }
          : j
      )
    );
    setShowAssignModal(false);
  };

  // ── Render a job chip ──
  const renderJobChip = (job, compact = false) => {
    const style = STATUS_STYLES[job.status] || STATUS_STYLES.upcoming;
    return (
      <div
        key={job.quote_id}
        onClick={() => navigate(`/install/process/${job.quote_id}`)}
        className={`${style.bg} rounded-md px-2 py-1 cursor-pointer hover:opacity-80 transition-opacity ${
          compact ? "mb-0.5" : "mb-1"
        }`}
      >
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${style.dot} flex-shrink-0`} />
          <span className={`text-[10px] font-medium ${style.text} truncate`}>
            {compact ? job.quote_no : `${job.fname} ${job.lname}`}
          </span>
        </div>
        {!compact && (
          <p className={`text-[9px] ${style.text} opacity-70 truncate pl-2.5`}>
            {job.installer_name || "Unassigned"}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/install")}
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
              {MONTH_NAMES[currentMonth]} {currentYear} • {monthJobs.length} installations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button text="Today" className="btn-outline-secondary btn-sm" onClick={goToday} />
          <div className="flex border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "month"
                  ? "bg-indigo-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50"
              }`}
            >
              List
            </button>
          </div>
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
      <div className="flex items-center gap-4 text-xs">
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

      {/* ── MONTH VIEW ── */}
      {viewMode === "month" && (
        <Card className="!shadow-sm border border-gray-100 dark:border-gray-700 !p-0 overflow-hidden rounded-2xl">
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
              const dayJobs = cell.dateKey ? (jobsByDate[cell.dateKey] || []) : [];
              const todayCell = isToday(cell.dateKey);
              const hasJobs = dayJobs.length > 0;

              return (
                <div
                  key={idx}
                  className={`relative min-h-[120px] border-b border-r border-gray-100 dark:border-gray-700/50 p-2 transition-all duration-200 group ${
                    cell.isCurrentMonth
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
                        className={`text-[13px] font-semibold leading-none ${
                          todayCell
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
                      <span className={`text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 ${
                        todayCell
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
                          onClick={() => navigate(`/install/process/${j.quote_id}`)}
                          className={`${style.bg} rounded-md px-2 py-1 cursor-pointer hover:scale-[1.02] hover:shadow-sm transition-all duration-150 border-l-[3px] ${
                            j.status === "upcoming"
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
        </Card>
      )}

      {/* ── LIST VIEW ── */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {monthJobs.length === 0 ? (
            <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-center py-10 text-gray-400">
                <Icon icon="ph:calendar-blank" className="text-4xl mb-3" />
                <p className="text-sm">No installations scheduled for {MONTH_NAMES[currentMonth]}.</p>
              </div>
            </Card>
          ) : (
            monthJobs.map((job) => {
              const style = STATUS_STYLES[job.status] || STATUS_STYLES.upcoming;
              const dateObj = new Date(job.installation_date + "T00:00:00");
              const dayName = DAY_NAMES[dateObj.getDay()];
              const dayNum = dateObj.getDate();

              return (
                <div
                  key={job.quote_id}
                  onClick={() => navigate(`/install/process/${job.quote_id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                >
                  <div className="flex">
                    {/* Date block */}
                    <div className={`w-20 flex-shrink-0 ${style.bg} flex flex-col items-center justify-center py-4`}>
                      <span className={`text-xs font-medium ${style.text}`}>{dayName}</span>
                      <span className={`text-2xl font-bold ${style.text}`}>{dayNum}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">
                              {job.fname} {job.lname}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text}`}>
                              {String(job.status || "upcoming").replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {job.quote_no || `#${job.quote_id}`} • {job.address}, {job.city} • {job.linear_feet || job.total_numerical_box || 0} ft
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Installer: {job.installer_name || (
                              <span className="text-amber-500 font-medium">Unassigned</span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isAdmin && !job.installer_id && (
                            <Button
                              text="Assign"
                              icon="ph:user-plus"
                              className="btn-outline-primary btn-sm"
                              onClick={(e) => { e.stopPropagation(); handleAssignClick(job); }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Assign Modal ── */}
      <AssignInstallerModal
        activeModal={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        jobData={selectedAssignJob}
        onAssigned={handleAssigned}
      />
    </div>
  );
};

export default CalendarView;
