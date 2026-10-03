import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingIcon from "@/components/LoadingIcon";
import CalendarComponent from "@/components/install/CalendarComponent";
import CalendarHeader from "@/components/install/CalendarHeader";
import Modal from "@/components/ui/Modal";
import { getCalendarInstalls } from "@/services/installService";
import { getDaysInMonth, getFirstDayOfMonth, formatDateKey, formatDateLong } from "@/utils/formatters";
import { STATUS_STYLES } from "@/utils/constants";

// ── Helpers ──

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

  const [allJobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── "+n more" popup state ──
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [moreModalDateKey, setMoreModalDateKey] = useState("");

  // ── Fetch Installations ──
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const data = await getCalendarInstalls(userId || "", userRole || "");
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
            status: job.install_status || "upcoming" // Use install_status from backend
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

  // ── Backend already filters by user role, so jobs is just allJobs ──
  const jobs = allJobs;


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
    return calendarDays
      .filter((day) => day.isCurrentMonth && jobsByDate[day.dateKey])
      .flatMap((day) => jobsByDate[day.dateKey])
      .sort((a, b) => a.installation_date.localeCompare(b.installation_date));
  }, [calendarDays, jobsByDate]);

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

  // ── "+n more" popup helpers ──
  const handleMoreClick = (dateKey) => {
    setMoreModalDateKey(dateKey);
    setMoreModalOpen(true);
  };

  const closeMoreModal = () => {
    setMoreModalOpen(false);
    setMoreModalDateKey("");
  };

  const moreModalJobs = moreModalDateKey ? (jobsByDate[moreModalDateKey] || []) : [];


  return (
    <div className="space-y-5">
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        jobCount={monthJobs.length}

        goToday={goToday}
        goPrev={goPrev}
        goNext={goNext}
        onBack={() => navigate("/install")}
      />

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <LoadingIcon className="h-10 w-10 text-indigo-500" />
        </div>
      ) : (
        <CalendarComponent
          calendarDays={calendarDays}
          jobsByDate={jobsByDate}
          onJobClick={(quoteId) => navigate(`/install/process/${quoteId}`)}
          onMoreClick={handleMoreClick}
        />
      )}

      <Modal
        activeModal={moreModalOpen}
        onClose={closeMoreModal}
        title={`Installations — ${formatDateLong(moreModalDateKey)}`}
        className="max-w-md"
        disableBackdrop={false}
      >
        <div className="space-y-2 max-h-[360px] overflow-y-auto -mx-2 px-2">
          {moreModalJobs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No installations found.</p>
          ) : (
            moreModalJobs.map((j) => {
              const status = j.status || "upcoming";
              const style = STATUS_STYLES[status] || STATUS_STYLES.upcoming;
              const borderClass = {
                upcoming: "border-l-indigo-500",
                in_progress: "border-l-amber-500",
                completed: "border-l-green-500"
              }[status] || "border-l-indigo-500";

              return (
                <div
                  key={j.quote_id}
                  onClick={() => {
                    closeMoreModal();
                    navigate(`/install/process/${j.quote_id}`);
                  }}
                  className={`${style.bg} ${borderClass} rounded-lg px-4 py-3 cursor-pointer hover:scale-[1.01] hover:shadow-md transition-all duration-150 border-l-[4px]`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-semibold ${style.text}`}>
                        {j.fname} {j.lname}
                      </p>
                      <p className={`text-xs ${style.text} opacity-60 mt-0.5`}>
                        {j.installer_name || "⚠ Unassigned"}
                      </p>
                    </div>
                    <span className={`text-[10px] font-medium capitalize px-2 py-0.5 rounded-full ${style.bg} ${style.text} ring-1 ring-current/10`}>
                      {status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Modal>

    </div>
  );
};

export default CalendarView;

