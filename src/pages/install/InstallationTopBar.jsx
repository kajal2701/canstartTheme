import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/Icon";

const InstallationTopBar = ({ job, currentStep, isCurrentStepSaved }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/install/calendar")}
          className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Icon icon="ph:arrow-left" className="text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Installation Process
          </h1>
          <p className="text-sm text-gray-500">
            {job.quote_no} — {job.fname} {job.lname} • {job.address}, {job.city}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Save status badge */}
        {currentStep < 7 && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${isCurrentStepSaved
            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
            : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
            }`}>
            <Icon icon={isCurrentStepSaved ? "ph:check-circle" : "ph:warning-circle"} className="text-sm" />
            {isCurrentStepSaved ? "Saved" : "Unsaved"}
          </div>
        )}

        {job.installer_name && (
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
              {job.installer_name.split(" ").map((n) => n[0]).join("")}
            </div>
            <span className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              {job.installer_name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallationTopBar;
