import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

const CompletionStep = ({ data, onChange, processState, job }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onChange(true);
      setIsCompleting(false);
      toast.success(
        "🎉 Installation marked as complete! Admin and quote person notified. (dummy)"
      );
    }, 1200);
  };

  // Gather summary
  const prep = processState?.prep || {};
  const onWay = processState?.onTheWay || {};
  const timeEntry = processState?.timeEntry || {};
  const dropOff = processState?.dropOff || {};
  const postImages = processState?.postInstall?.images || [];

  const calcDuration = () => {
    if (!timeEntry.startTime || !timeEntry.endTime) return "—";
    const [sh, sm] = timeEntry.startTime.split(":").map(Number);
    const [eh, em] = timeEntry.endTime.split(":").map(Number);
    let diffMin = (eh * 60 + em) - (sh * 60 + sm);
    if (diffMin < 0) diffMin += 24 * 60;
    return `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
  };

  const totalExpenses = (timeEntry.expenses || []).reduce(
    (s, e) => s + (parseFloat(e.amount) || 0), 0
  );

  if (data === true) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-bounce">
          <Icon icon="ph:check-circle-fill" className="text-5xl text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
          Installation Complete! 🎉
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-1">
          Quote #{job?.quote_no} — {job?.fname} {job?.lname}
        </p>
        <p className="text-sm text-gray-400">
          Admin and quote person have been notified. (dummy email)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-100 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <Icon icon="ph:flag-checkered" className="text-green-500 text-xl" />
          Completion
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Review the installation summary and mark it as complete.
        </p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center">
            <Icon icon="ph:user" className="text-2xl text-indigo-500 mb-1" />
            <p className="text-xs text-gray-500">Customer</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {job?.fname} {job?.lname}
            </p>
          </div>
        </Card>

        <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center">
            <Icon icon="ph:ruler" className="text-2xl text-amber-500 mb-1" />
            <p className="text-xs text-gray-500">Linear Feet</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {prep.linearFeet || 0} ft
            </p>
          </div>
        </Card>

        <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center">
            <Icon icon="ph:clock" className="text-2xl text-blue-500 mb-1" />
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {calcDuration()}
            </p>
          </div>
        </Card>

        <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center">
            <Icon icon="ph:images" className="text-2xl text-rose-500 mb-1" />
            <p className="text-xs text-gray-500">Photos</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {postImages.length}
            </p>
          </div>
        </Card>
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
          <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
            <span className="text-gray-500">Quote #</span>
            <span className="font-medium text-indigo-600">{job?.quote_no}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
            <span className="text-gray-500">Address</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{job?.address}, {job?.city}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
            <span className="text-gray-500">Installer</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{job?.installer_name || "Not assigned"}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
            <span className="text-gray-500">ETA Sent</span>
            <span className={`font-medium ${onWay.sent ? "text-green-600" : "text-gray-400"}`}>
              {onWay.sent ? `Yes — ${onWay.etaMinutes} min` : "No"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700">
            <span className="text-gray-500">Travel Time</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {dropOff.travelTime?.hours || 0}h {dropOff.travelTime?.minutes || 0}m
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Total Expenses</span>
            <span className="font-bold text-green-600">${totalExpenses.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* ── Complete Button ── */}
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
    </div>
  );
};

export default CompletionStep;
