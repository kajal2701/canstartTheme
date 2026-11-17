import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingIcon from "@/components/LoadingIcon";
import CalendarComponent from "@/components/install/CalendarComponent";
import CalendarHeader from "@/components/install/CalendarHeader";
import DayNotesModal from "@/components/install/DayNotesModal";
import Modal from "@/components/ui/Modal";
import { getCalendarInstalls, getCalendarNotes } from "@/services/installService";
import { getDaysInMonth, getFirstDayOfMonth, formatDateKey, formatDateLong, toTitleCase } from "@/utils/formatters";
import { STATUS_STYLES } from "@/utils/constants";

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
  const [allNotes, setAllNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── "+n more" popup state ──
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [moreModalDateKey, setMoreModalDateKey] = useState("");

  // ── Day Notes / Edit Modal State ──
  const [dayNotesModalOpen, setDayNotesModalOpen] = useState(false);
  const [selectedDateForNotes, setSelectedDateForNotes] = useState("");

  // ── Fetch Installations ──
  const fetchJobs = useCallback(async () => {
    try {
      const data = await getCalendarInstalls(userId || "", userRole || "");
      const upcoming = data?.upcoming_installations || [];

      // Ensure installation_date is just YYYY-MM-DD
      const formattedJobs = upcoming.map((job) => {
        let dateStr = job.installation_date || "";
        if (dateStr.includes(" ")) dateStr = dateStr.split(" ")[0];
        if (dateStr.includes("T")) dateStr = dateStr.split("T")[0];

        return {
          ...job,
          installation_date: dateStr,
          status: job.install_status || "upcoming",
        };
      });

      setAllJobs(formattedJobs);
    } catch (error) {
      console.error("Failed to load jobs", error);
    }
  }, [userId, userRole]);

  // ── Fetch Custom Notes for Current Month & Year ──
  const fetchNotes = useCallback(async () => {
    try {
      // Month is 1-indexed for backend query: currentMonth + 1
      const notesData = await getCalendarNotes(
        currentMonth + 1,
        currentYear,
        userId || "",
        userRole || ""
      );

      // Normalize date to YYYY-MM-DD
      const formattedNotes = (notesData || []).map((n) => {
        let d = n.date || "";
        if (d.includes(" ")) d = d.split(" ")[0];
        if (d.includes("T")) d = d.split("T")[0];
        return {
          ...n,
          date: d,
        };
      });

      setAllNotes(formattedNotes);
    } catch (error) {
      console.error("Failed to load calendar notes", error);
    }
  }, [currentMonth, currentYear, userId, userRole]);

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchJobs(), fetchNotes()]);
      setIsLoading(false);
    };

    loadAll();
  }, [fetchJobs, fetchNotes]);

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

  // ── Notes grouped by date ──
  const notesByDate = useMemo(() => {
    const map = {};
    allNotes.forEach((note) => {
      const key = note.date;
      if (!map[key]) map[key] = [];
      map[key].push(note);
    });
    return map;
  }, [allNotes]);

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

  // ── Day Cell Click (Notes / Edit Modal) ──
  const handleDayClick = (dateKey) => {
    setSelectedDateForNotes(dateKey);
    setDayNotesModalOpen(true);
  };

  const closeDayNotesModal = () => {
    setDayNotesModalOpen(false);
    setSelectedDateForNotes("");
  };

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
          notesByDate={notesByDate}
          onJobClick={(quoteId) => navigate(`/install/process/${quoteId}`)}
          onMoreClick={handleMoreClick}
          onDayClick={handleDayClick}
        />
      )}

      {/* ── Day Notes / Edit Modal ── */}
      <DayNotesModal
        activeModal={dayNotesModalOpen}
        onClose={closeDayNotesModal}
        selectedDate={selectedDateForNotes}
        notes={selectedDateForNotes ? notesByDate[selectedDateForNotes] || [] : []}
        jobs={selectedDateForNotes ? jobsByDate[selectedDateForNotes] || [] : []}
        currentUser={user}
        onNotesChanged={fetchNotes}
      />

      {/* ── "+n more" Installations Modal ── */}
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
                completed: "border-l-green-500",
              }[status] || "border-l-indigo-500";

              const customerName = `${j.fname || ""} ${j.lname || ""}`.trim();
              const feet = j.total_numerical_box || "";
              const color = j.colors || "";

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
                      {/* Line 1: Customer Name */}
                      <p className={`text-sm font-semibold ${style.text}`}>
                        {customerName || "—"}
                      </p>
                      {/* Line 2: Clean Pill Badges */}
                      {(feet || color) && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {[
                            feet && `${feet} ft`,
                            color && toTitleCase(color),
                          ]
                            .filter(Boolean)
                            .map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 border border-gray-200/70 dark:border-gray-600/60 shadow-xs"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}
                      {/* Line 3: Installer Name */}
                      <p className={`text-xs ${style.text} opacity-70 mt-1.5`}>
                        {j.installer_name || "⚠ Unassigned"}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-medium capitalize px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${
                        status === "in_progress"
                          ? "border-amber-300 dark:border-amber-700"
                          : status === "completed"
                          ? "border-green-300 dark:border-green-700"
                          : "border-indigo-300 dark:border-indigo-700"
                      }`}
                    >
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
