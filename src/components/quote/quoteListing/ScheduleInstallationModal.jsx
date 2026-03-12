// src/components/quote/quotelisting/ScheduleInstallationModal.jsx

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { scheduleInstallation } from "../../../services/quoteService";

const ScheduleInstallationModal = ({
  activeModal,
  onClose,
  quoteData,
  onScheduled,
}) => {
  const [installationDate, setInstallationDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSchedule = async () => {
    if (!installationDate) return;

    try {
      setIsLoading(true);

      await scheduleInstallation({
        quote_id: quoteData?.id,
        installation_date: installationDate,
      });
      onScheduled(); // refetch + toast handled in parent
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
      title="Schedule Installation"
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
            text="Schedule & Send Email"
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
          Select Installation Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={installationDate}
          onChange={(e) => setInstallationDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          The customer will receive an email notification with the scheduled
          date.
        </p>
      </div>
    </Modal>
  );
};

export default ScheduleInstallationModal;
