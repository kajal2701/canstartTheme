import React from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

const ConfirmModal = ({ activeModal, onClose, onConfirm, itemName, isLoading = false }) => {
  return (
    <Modal
      activeModal={activeModal}
      onClose={onClose}
      className="max-w-sm"
      title="Delete Confirmation"
      centered
    >
      <div className="flex flex-col space-y-6">
        {/* Message */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete{" "}
          {itemName ? (
            <span className="font-medium text-gray-700 dark:text-gray-200">
              "{itemName}"
            </span>
          ) : (
            "this item"
          )}
          ?
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            text="Cancel"
            className="btn-outline-dark btn-sm"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            text={isLoading ? "Deleting..." : "Delete"}
            className="btn-danger btn-sm"
            onClick={onConfirm}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;