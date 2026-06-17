import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StepHeader from "./StepHeader";
import { toast } from "react-toastify";
import { sendOnTheWayNotification } from "@/services/installService";
import { HOUR_OPTIONS, MINUTE_OPTIONS } from "@/utils/constants";
import { formatEta, formatTime } from "@/utils/formatters";

const OnTheWay = ({ data, onChange, job }) => {
  const [showEtaPicker, setShowEtaPicker] = useState(false);
  const [etaHours, setEtaHours] = useState(0);
  const [etaMinutes, setEtaMinutes] = useState(15);
  const [isSending, setIsSending] = useState(false);

  const totalEta = etaHours * 60 + etaMinutes;

  const handleConfirm = async () => {
    if (totalEta === 0) {
      toast.error("Please select an ETA greater than 0.");
      return;
    }

    setIsSending(true);
    const etaFormatted = formatEta(etaHours, etaMinutes);
    try {
      await sendOnTheWayNotification(job?.quote_id, etaFormatted);

      const now = new Date();
      onChange({
        ...data,
        sent: true,
        etaMinutes: etaFormatted,
        sentAt: now.toISOString(),
      });
      setShowEtaPicker(false);
      toast.success(
        `Notification sent! ETA: ${etaFormatted}. Email sent to customer & quote person.`
      );
    } catch (error) {
      console.error("Failed to send on-the-way notification:", error);
      toast.error("Failed to send notification. Please try again.");
    } finally {
      setIsSending(false);
    }
  };



  const selectClassName = "w-24 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-center text-lg font-semibold focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none cursor-pointer";

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <StepHeader
        icon="ph:car-profile"
        iconColorClass="text-sky-500"
        title="On The Way"
        description="Notify the customer that you are en route to the installation site."
        colorClass="from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 border-sky-100 dark:border-sky-800"
      />

      {/* ── Job Info ── */}
      <Card className="!shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Customer", value: `${job?.fname} ${job?.lname}` },
            { label: "Address", value: `${job?.address}, ${job?.city}` },
            { label: "Phone", value: job?.phone },
            { label: "Quote #", value: job?.quote_no, valueClass: "text-indigo-600" },
          ].map((item, index) => (
            <div key={index}>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className={`text-sm font-medium ${item.valueClass || "text-gray-800 dark:text-white"}`}>
                {item.value}
              </p>
            </div>
          ))}
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
            ETA: <span className="font-bold">{data.etaMinutes}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Sent at {formatTime(data.sentAt)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Email sent to the customer and the quote person
          </p>
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
              <div className="text-center mb-5">
                <Icon icon="ph:clock" className="text-3xl text-sky-500 mb-2" />
                <h4 className="text-base font-semibold text-gray-800 dark:text-white">
                  How long until you arrive?
                </h4>
              </div>

              {/* Hours + Minutes Dropdowns */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex flex-col items-center">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Hours</label>
                  <select
                    value={etaHours}
                    onChange={(e) => setEtaHours(parseInt(e.target.value))}
                    className={selectClassName}
                  >
                    {HOUR_OPTIONS.map((h) => (
                      <option key={h} value={h}>{h} hr</option>
                    ))}
                  </select>
                </div>

                <span className="text-2xl font-bold text-gray-400 dark:text-gray-500 mt-5">:</span>

                <div className="flex flex-col items-center">
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">Minutes</label>
                  <select
                    value={etaMinutes}
                    onChange={(e) => setEtaMinutes(parseInt(e.target.value))}
                    className={selectClassName}
                  >
                    {MINUTE_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m} min</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview */}
              {totalEta > 0 && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-5">
                  Customer will be notified: <span className="font-semibold text-sky-600 dark:text-sky-400">{formatEta(etaHours, etaMinutes)}</span>
                </p>
              )}

              <div className="flex justify-center gap-3">
                <Button
                  text="Cancel"
                  className="btn-outline-secondary"
                  disabled={isSending}
                  onClick={() => setShowEtaPicker(false)}
                />
                <Button
                  text={isSending ? "Sending..." : `Confirm — ${formatEta(etaHours, etaMinutes)} ETA`}
                  icon={isSending ? "ph:circle-notch" : "ph:paper-plane-tilt"}
                  className="btn-primary"
                  disabled={isSending || totalEta === 0}
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
