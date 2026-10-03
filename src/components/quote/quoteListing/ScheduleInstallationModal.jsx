// src/components/quote/quotelisting/ScheduleInstallationModal.jsx

import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { scheduleInstallation } from "../../../services/quoteService";
import { getUsers } from "@/services/usersService";
import { isPastDate } from "../../../utils/formatters";
import Select from "react-select";
import { CheckboxOption } from "../../../utils/helperFunctions";

const ScheduleInstallationModal = ({
  activeModal,
  onClose,
  quoteData,
  onScheduled,
  prefillDate = null,
  prefillInstallerId = null,
}) => {
  const [installationDate, setInstallationDate] = useState("");
  const [installerIds, setInstallerIds] = useState([]);
  const [installers, setInstallers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInstallers, setIsFetchingInstallers] = useState(false);
  const originalInstallerIdsRef = useRef([]);


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
        try {
          // prefillInstallerId could be a JSON string from backend or an array
          const parsed = typeof prefillInstallerId === 'string' ? JSON.parse(prefillInstallerId) : prefillInstallerId;
          const ids = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
          setInstallerIds(ids);
          originalInstallerIdsRef.current = ids;
        } catch {
          setInstallerIds([String(prefillInstallerId)]);
          originalInstallerIdsRef.current = [String(prefillInstallerId)];
        }
      } else {
        setInstallerIds([]);
        originalInstallerIdsRef.current = [];
      }
    }
  }, [activeModal, prefillDate, prefillInstallerId]);

  const handleSchedule = async () => {
    if (!installationDate) return;

    try {
      setIsLoading(true);
      await scheduleInstallation({
        quote_id: quoteData?.id,
        installation_date: installationDate,
        installer_ids: installerIds,
      });
      onScheduled();
      onClose();
      setInstallationDate("");
      setInstallerIds([]);
    } catch (error) {
      console.error("Schedule failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setInstallationDate("");
      setInstallerIds([]);
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
              installerIds.length === 0 ||
              isLoading ||
              // ✅ For reschedule: disable only if both date AND installer are unchanged
              (prefillDate && installationDate === prefillDate.split("T")[0] &&
                JSON.stringify([...installerIds].sort()) === JSON.stringify([...originalInstallerIdsRef.current].sort()))
              || isPastDate(prefillDate)
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
          <Icon icon="ph:users" />
          Assign Installers <span className="text-red-500">*</span>
        </label>
        <Select
          isMulti
          options={installers.map((inst) => ({ value: inst.id, label: inst.name }))}
          value={installers
            .filter((inst) => installerIds.includes(String(inst.id)))
            .map((inst) => ({ value: inst.id, label: inst.name }))}
          onChange={(selected) => {
            setInstallerIds(selected ? selected.map((s) => String(s.value)) : []);
          }}
          components={{ Option: CheckboxOption }}
          hideSelectedOptions={false}
          closeMenuOnSelect={false}
          isDisabled={isFetchingInstallers}
          placeholder={isFetchingInstallers ? "Loading installers..." : "Select installers"}
          className="react-select"
          classNamePrefix="select"
        />
        {/* ✅ Different helper text for reschedule */}
        <p className="text-xs text-gray-500 mt-2">
          {prefillDate
            ? installerIds.length > 0
              ? "The customer and installer(s) will receive an email with the updated details."
              : "The customer will receive an email with the updated details."
            : installerIds.length > 0
              ? "The customer and installer(s) will receive an email notification with the scheduled date."
              : "The customer will receive an email notification with the scheduled date."}
        </p>
      </div>
    </Modal>
  );
};

export default ScheduleInstallationModal;
