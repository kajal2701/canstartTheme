import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";

const ETA_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

const OnTheWay = ({ data, onChange, job }) => {
  const [showEtaPicker, setShowEtaPicker] = useState(false);
  const [selectedEta, setSelectedEta] = useState(data?.etaMinutes || 15);

  const handleConfirm = () => {
    const now = new Date();
    onChange({
      ...data,
      sent: true,
      etaMinutes: selectedEta,
      sentAt: now.toISOString(),
    });
    setShowEtaPicker(false);
    toast.success(
      `Notification sent! ETA: ${selectedEta} minutes. (Email to customer & quote person — dummy)`
    );
  };

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-sky-100 dark:border-sky-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
          <Icon icon="ph:car" className="text-sky-500 text-xl" />
          On the Way
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Let the customer and sales person know you're heading to the job site.
        </p>
      </div>

      {/* ── Job Info ── */}
      <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              {job?.fname} {job?.lname}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              {job?.address}, {job?.city}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white">{job?.phone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Quote #</p>
            <p className="text-sm font-medium text-indigo-600">{job?.quote_no}</p>
          </div>
        </div>
      </Card>

      {/* ── Status ── */}
      {data?.sent ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
            <Icon icon="ph:check-circle-fill" className="text-3xl text-green-500" />
          </div>
          <h4 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-1">
            Notification Sent!
          </h4>
          <p className="text-sm text-green-600 dark:text-green-500">
            ETA: <span className="font-bold">{data.etaMinutes} minutes</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Sent at {formatTime(data.sentAt)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Email sent to the customer and the quote person (dummy)
          </p>

          <button
            type="button"
            onClick={() => onChange({ ...data, sent: false, sentAt: null })}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Resend notification
          </button>
        </div>
      ) : (
        <>
          {!showEtaPicker ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowEtaPicker(true)}
                className="group relative w-48 h-48 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center text-white"
              >
                <Icon icon="ph:car" className="text-4xl mb-2 group-hover:animate-bounce" />
                <span className="text-lg font-bold">I'm On My Way</span>
                <span className="text-xs opacity-80 mt-1">Click to set ETA</span>
              </button>
            </div>
          ) : (
            <Card className="!shadow-sm border border-sky-100 dark:border-sky-800">
              <div className="text-center mb-4">
                <Icon icon="ph:clock" className="text-3xl text-sky-500 mb-2" />
                <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                  How long until you arrive?
                </h4>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
                {ETA_OPTIONS.map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedEta(mins)}
                    className={`py-3 rounded-lg text-sm font-medium transition-all ${
                      selectedEta === mins
                        ? "bg-sky-500 text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sky-100 dark:hover:bg-sky-900/30"
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  text="Cancel"
                  className="btn-outline-secondary"
                  onClick={() => setShowEtaPicker(false)}
                />
                <Button
                  text={`Confirm — ${selectedEta} min ETA`}
                  icon="ph:paper-plane-tilt"
                  className="btn-primary"
                  onClick={handleConfirm}
                />
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default OnTheWay;
