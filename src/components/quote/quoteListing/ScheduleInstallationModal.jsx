// src/components/quote/quotelisting/ScheduleInstallationModal.jsx

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { scheduleInstallation } from "../../../services/quoteService";
import { getUsers } from "@/services/usersService";

const ScheduleInstallationModal = ({
  activeModal,
  onClose,
  quoteData,
  onScheduled,
  prefillDate = null,
  prefillInstallerId = null,
}) => {
  const [installationDate, setInstallationDate] = useState("");
  const [installerId, setInstallerId] = useState("");
  const [installers, setInstallers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInstallers, setIsFetchingInstallers] = useState(false);

  useEffect(() => {
    if (activeModal && installers.length === 0) {
      const fetchInstallers = async () => {
        setIsFetchingInstallers(true);
        try {
          const usersResponse = await getUsers();
          const installersList = usersResponse.filter(user => Number(user.role) === 2).map((u) => ({
            id: u.id || u.user_id,
            name: `${u.fname || ""} ${u.lname || ""}`.trim() || u.name || "Unknown",
            email: u.email || "",
            phone: u.phone || "No phone",
          }));
          setInstallers(installersList);
        } catch (error) {
          console.error("Failed to fetch installers:", error);
        } finally {
          setIsFetchingInstallers(false);
        }
      };
      fetchInstallers();
    }
  }, [activeModal]);

  useEffect(() => {
    if (activeModal) {
      if (prefillDate) {
        setInstallationDate(prefillDate.split("T")[0]);
      } else {
        setInstallationDate("");
      }
      if (prefillInstallerId) {
        setInstallerId(prefillInstallerId);
      } else {
        setInstallerId("");
      }
    }
  }, [activeModal, prefillDate, prefillInstallerId]);

  const handleSchedule = async () => {
    if (!installationDate || !installerId) return;

    try {
      setIsLoading(true);
      await scheduleInstallation({
        quote_id: quoteData?.id,
        installation_date: installationDate,
        installer_id: installerId,
      });
      onScheduled();
      onClose();
      setInstallationDate("");
      setInstallerId("");
    } catch (error) {
      console.error("Schedule failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setInstallationDate("");
      setInstallerId("");
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
              prefillDate ? "Reschedule" : "Schedule"
            }
            icon="ph:paper-plane-tilt"
            className="btn-primary"
            onClick={handleSchedule}
            disabled={
              !installationDate ||
              !installerId ||
              isLoading ||
              // ✅ For reschedule: disable if user picked the same date as already scheduled
              (prefillDate && installationDate === prefillDate.split("T")[0])
            }
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
      <div className="mb-4">
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
      </div>

      {/* Installer Field */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Icon icon="ph:user-list" />
          Assign Installer <span className="text-red-500">*</span>
        </label>
        <select
          value={installerId}
          onChange={(e) => setInstallerId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
          disabled={isFetchingInstallers}
        >
          <option value="" disabled>
            {isFetchingInstallers ? "Loading installers..." : "Select an installer"}
          </option>
          {installers.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>
        {/* ✅ Different helper text for reschedule */}
        <p className="text-xs text-gray-500 mt-2">
          {prefillDate
            ? "The customer and installer will receive an email with the updated details."
            : "The customer and installer will receive an email notification with the scheduled date."}
        </p>
      </div>
    </Modal>
  );
};

export default ScheduleInstallationModal;
