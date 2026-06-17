import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StepHeader from "./StepHeader";
import { toast } from "react-toastify";
import { completeInstallProcess } from "@/services/installService";

const CompletionStep = ({ data, onChange, processState, job }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeInstallProcess(job?.quote_id);
      onChange(true);
      toast.success(
        "🎉 Installation marked as complete! Admin and quote person notified."
      );
    } catch (err) {
      console.error("Failed to complete installation:", err);
      toast.error("Failed to mark as complete. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  // Gather summary
  const prep = processState?.prep || {};
  const onWay = processState?.onTheWay || {};
  const timeEntry = processState?.timeEntry || {};
  const dropOff = processState?.dropOff || {};
  const postImages = processState?.postInstall?.images || [];

  const calcDuration = () => {
    const totalTime = timeEntry.totalTime || { hours: 0, minutes: 0 };
    if (!totalTime.hours && !totalTime.minutes) return "—";
    return `${totalTime.hours}h ${totalTime.minutes}m`;
  };

  const totalExpenses = (timeEntry.expenses || []).reduce(
    (s, e) => s + (parseFloat(e.amount) || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      {data === true ? (
        <div className="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center">
            <Icon icon="ph:check-circle-fill" className="text-5xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            Installation Complete! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Admin and quote person have been notified. You can review the details below.
          </p>
        </div>
      ) : (
        <StepHeader
          icon="ph:flag-checkered"
          iconColorClass="text-green-500"
          title="Completion"
          description="Review the installation summary and mark it as complete."
          colorClass="from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800"
        />
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: "ph:user", colorClass: "text-indigo-500", title: "Customer", value: `${job?.fname || ""} ${job?.lname || ""}` },
          { icon: "ph:ruler", colorClass: "text-amber-500", title: "Linear Feet", value: `${prep.linearFeet || 0} ft` },
          { icon: "ph:clock", colorClass: "text-blue-500", title: "Duration", value: calcDuration() },
          { icon: "ph:images", colorClass: "text-rose-500", title: "Photos", value: postImages.length }
        ].map((card, idx) => (
          <Card key={idx} className="!shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center justify-center">
              <Icon icon={card.icon} className={`text-2xl mb-1 ${card.colorClass}`} />
              <p className="text-xs text-gray-500">{card.title}</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                {card.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Details ── */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Icon icon="ph:list-checks" className="text-green-500" />
            <span>Installation Summary</span>
          </div>
        }
        className="!shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="space-y-3 text-sm">
          {[
            { label: "Quote #", value: <span className="text-indigo-600">{job?.quote_no}</span> },
            { label: "Address", value: `${job?.address || ""}, ${job?.city || ""}` },
            { label: "Installer", value: job?.installer_name || "Not assigned" },
            { label: "ETA Sent", value: onWay.sent ? <span className="text-green-600">Yes — {onWay.etaMinutes} min</span> : <span className="text-gray-400">No</span> },
            { label: "Total Time Spent", value: calcDuration() },
            { label: "Travel Time", value: `${dropOff.travelTime?.hours || 0}h ${dropOff.travelTime?.minutes || 0}m` },
            { label: "Total Expenses", value: <span className="text-green-600 font-bold">${totalExpenses.toFixed(2)}</span>, isLast: true }
          ].map((item, idx) => (
            <div key={idx} className={`flex justify-between py-2 ${item.isLast ? "" : "border-b border-gray-50 dark:border-gray-700"}`}>
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Complete Button ── */}
      {data !== true && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleComplete}
            disabled={isCompleting}
            className="group relative px-10 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompleting ? (
              <span className="flex items-center gap-2">
                <Icon icon="ph:circle-notch" className="animate-spin" />
                Completing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Icon icon="ph:flag-checkered" className="text-xl" />
                Mark as Complete & Notify
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CompletionStep;
