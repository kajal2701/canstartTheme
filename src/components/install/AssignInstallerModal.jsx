import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { DUMMY_INSTALLERS } from "@/mocks/installMocks";
import { toast } from "react-toastify";

const AssignInstallerModal = ({ activeModal, onClose, jobData, onAssigned }) => {
  const [selectedInstaller, setSelectedInstaller] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = () => {
    if (!selectedInstaller) return;
    setIsAssigning(true);
    setTimeout(() => {
      setIsAssigning(false);
      onAssigned(selectedInstaller);
      toast.success(
        `${selectedInstaller.name} assigned to ${jobData?.quote_no}. Email notification sent! (dummy)`
      );
      onClose();
      setSelectedInstaller(null);
    }, 800);
  };

  const handleClose = () => {
    if (!isAssigning) {
      setSelectedInstaller(null);
      onClose();
    }
  };

  return (
    <Modal
      activeModal={activeModal}
      onClose={handleClose}
      title="Assign Installer"
      className="max-w-lg"
      footerContent={
        <>
          <Button
            text="Cancel"
            icon="ph:x"
            className="btn-outline-secondary"
            onClick={handleClose}
            disabled={isAssigning}
          />
          <Button
            text={isAssigning ? "Assigning..." : "Assign & Notify"}
            icon="ph:user-check"
            className="btn-primary"
            onClick={handleAssign}
            disabled={!selectedInstaller || isAssigning}
            isLoading={isAssigning}
          />
        </>
      }
    >
      {/* Job Info */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Quote #:</span>{" "}
          <span className="text-indigo-600">{jobData?.quote_no}</span>
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          <span className="font-semibold">Customer:</span>{" "}
          {jobData?.fname} {jobData?.lname}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          <span className="font-semibold">Date:</span>{" "}
          {jobData?.installation_date}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          <span className="font-semibold">Linear Feet:</span>{" "}
          {jobData?.total_numerical_box} ft
        </p>
      </div>

      {/* Installer Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          <Icon icon="ph:user-list" />
          Select Installer
        </label>

        <div className="space-y-2">
          {DUMMY_INSTALLERS.map((installer) => (
            <button
              key={installer.id}
              type="button"
              onClick={() => setSelectedInstaller(installer)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                selectedInstaller?.id === installer.id
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-200 dark:ring-indigo-800"
                  : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                selectedInstaller?.id === installer.id
                  ? "bg-indigo-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}>
                {installer.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {installer.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {installer.email} • {installer.phone}
                </p>
              </div>
              {selectedInstaller?.id === installer.id && (
                <Icon icon="ph:check-circle-fill" className="text-indigo-500 text-xl" />
              )}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          The installer will receive an email notification about this assignment. (dummy)
        </p>
      </div>
    </Modal>
  );
};

export default AssignInstallerModal;
