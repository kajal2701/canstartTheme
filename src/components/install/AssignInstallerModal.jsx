import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { toast } from "react-toastify";
import { getUsers } from "@/services/usersService";

const AssignInstallerModal = ({ activeModal, onClose, jobData, onAssigned }) => {
  const [selectedInstaller, setSelectedInstaller] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [installers, setInstallers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeModal) {
      fetchInstallers();
    } else {
      setSelectedInstaller(null);
    }
  }, [activeModal]);

  const fetchInstallers = async () => {
    setIsLoading(true);
    try {
      const usersResponse = await getUsers();
      // Filter users who have role 2 (Installer)
      const installersList = usersResponse.filter(user => Number(user.role) === 2).map((u) => ({
        id: u.id || u.user_id,
        name: `${u.fname || ""} ${u.lname || ""}`.trim() || u.name || "Unknown",
        email: u.email || "",
        phone: u.phone || "No phone",
        raw: u // Keep raw data just in case
      }));
      setInstallers(installersList);
    } catch (error) {
      console.error("Failed to fetch installers:", error);
      toast.error("Failed to load installers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = () => {
    if (!selectedInstaller) return;
    setIsAssigning(true);
    setTimeout(() => {
      setIsAssigning(false);
      onAssigned(selectedInstaller);
      toast.success(
        `${selectedInstaller.name} assigned to ${jobData?.quote_no}. Email notification sent!`
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

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Icon icon="ph:spinner" className="animate-spin text-2xl text-indigo-500" />
            </div>
          ) : installers.length === 0 ? (
            <div className="text-center py-6 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
              No installers found.
            </div>
          ) : (
            installers.map((installer) => (
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                  selectedInstaller?.id === installer.id
                    ? "bg-indigo-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}>
                  {installer.name.split(" ").map(n => n?.[0] || "").join("").substring(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {installer.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {installer.email} • {installer.phone}
                  </p>
                </div>
                {selectedInstaller?.id === installer.id && (
                  <Icon icon="ph:check-circle-fill" className="text-indigo-500 text-xl flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          The installer will receive an email notification about this assignment. (dummy)
        </p>
      </div>
    </Modal>
  );
};

export default AssignInstallerModal;
