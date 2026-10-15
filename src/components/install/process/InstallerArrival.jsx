import React, { useState } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { toast } from "react-toastify";
import { sendInstallerArrivalNotif } from "@/services/installService";
import { formatDateLong, formatTime } from "@/utils/formatters";

const InstallerArrival = ({ data, onChange, job }) => {
  const [isSending, setIsSending] = useState(false);

  const handleDateChange = (e) => {
    onChange({ ...data, arrivalDate: e.target.value });
  };

  const handleTimeChange = (e) => {
    onChange({ ...data, arrivalTime: e.target.value });
  };

  const handleSend = async () => {
    if (!data.arrivalDate || !data.arrivalTime) {
      toast.error("Please select both date and time before sending.");
      return;
    }

    setIsSending(true);
    try {
      await sendInstallerArrivalNotif(job?.quote_id, data.arrivalDate, data.arrivalTime);

      const now = new Date();
      onChange({
        ...data,
        arrivalNotifSent: true,
        arrivalNotifSentAt: now.toISOString(),
      });
      toast.success("Arrival notification sent! Email sent to customer & quote person.");
    } catch (error) {
      console.error("Failed to send installer arrival notification:", error);
      toast.error("Failed to send arrival notification. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="!shadow-sm border border-amber-100 dark:border-amber-800/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
          <Icon icon="ph:calendar-check" className="text-lg text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
            Select Date and Time
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Set your planned arrival date &amp; time and notify the customer
          </p>
        </div>
      </div>

      {data?.arrivalNotifSent ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
            <Icon icon="ph:check-circle-fill" className="text-2xl text-green-500" />
          </div>
          <h5 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
            Customer Notified!
          </h5>
          <p className="text-sm text-green-600 dark:text-green-500">
            <span className="font-bold">{formatDateLong(data.arrivalDate)}</span> at{" "}
            <span className="font-bold">{data.arrivalTime}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Email was sent to the customer and the quote person
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Date Input */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                <Icon icon="ph:calendar" className="text-sm" />
                Date
              </label>
              <input
                type="date"
                value={data?.arrivalDate || ""}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Time Input */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                <Icon icon="ph:clock" className="text-sm" />
                Time
              </label>
              <input
                type="time"
                value={data?.arrivalTime || ""}
                onChange={handleTimeChange}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Preview */}
          {data?.arrivalDate && data?.arrivalTime && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your arrival:{" "}
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {formatDateLong(data.arrivalDate)} at {data.arrivalTime}
              </span>
            </p>
          )}

          <div className="flex justify-center">
            <Button
              text={isSending ? "Sending..." : "Notify Customer"}
              icon={isSending ? "ph:circle-notch" : "ph:paper-plane-tilt"}
              className="btn-warning w-full sm:w-auto"
              disabled={isSending || !data?.arrivalDate || !data?.arrivalTime}
              onClick={handleSend}
            />
          </div>


        </>
      )}
    </Card>
  );
};

export default InstallerArrival;
