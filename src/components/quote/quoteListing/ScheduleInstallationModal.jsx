// src/components/quote/quotelisting/ScheduleInstallationModal.jsx

import React, { useState, useEffect } from "react"; // ✅ added useEffect
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { scheduleInstallation } from "../../../services/quoteService";

const ScheduleInstallationModal = ({
  activeModal,
  onClose,
  quoteData,
  onScheduled,
  prefillDate = null, // ✅ NEW optional prop — for reschedule, pass existing date
}) => {
  const [installationDate, setInstallationDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ When modal opens, prefill date if provided (reschedule)
  // If no prefillDate, reset to empty (new schedule)
  useEffect(() => {
    if (activeModal) {
      if (prefillDate) {
        setInstallationDate(prefillDate.split("T")[0]);
      } else {
        setInstallationDate("");
      }
    }
  }, [activeModal, prefillDate]);

  const handleSchedule = async () => {
    if (!installationDate) return;

    try {
      setIsLoading(true);
      await scheduleInstallation({
        quote_id: quoteData?.id,
        installation_date: installationDate,
      });
      onScheduled();
      onClose();
      setInstallationDate("");
    } catch (error) {
      console.error("Schedule failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setInstallationDate("");
      onClose();
    }
  };

  return (
    <Modal
      activeModal={activeModal}
      onClose={handleClose}
      // ✅ Title changes based on reschedule or new schedule
      title={prefillDate ? "Reschedule Installation" : "Schedule Installation"}
      className="max-w-lg"
      footerContent={
        <>
          <Button
            text="Cancel"
            icon="ph:x"
            className="btn-outline-secondary"
            onClick={handleClose}
            disabled={isLoading}
          />
          <Button
            // ✅ Button text changes based on reschedule or new schedule
            text={
              prefillDate ? "Reschedule & Send Email" : "Schedule & Send Email"
            }
            icon="ph:paper-plane-tilt"
            className="btn-primary"
            onClick={handleSchedule}
            disabled={!installationDate || isLoading}
            isLoading={isLoading}
          />
        </>
      }
    >
      {/* Quote Info */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Quote #:</span>{" "}
          <span className="text-indigo-600">{quoteData?.srNumber}</span>
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          <span className="font-semibold">Customer:</span>{" "}
          {quoteData?.customerName}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          <span className="font-semibold">Email:</span> {quoteData?.email}
        </p>
      </div>

      {/* Date Field */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Icon icon="ph:calendar" />
          {prefillDate
            ? "New Installation Date"
            : "Select Installation Date"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={installationDate}
          onChange={(e) => setInstallationDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        {/* ✅ Different helper text for reschedule */}
        <p className="text-xs text-gray-500 mt-1">
          {prefillDate
            ? "The customer will receive an email with the updated installation date."
            : "The customer will receive an email notification with the scheduled date."}
        </p>
      </div>
    </Modal>
  );
};

export default ScheduleInstallationModal;
