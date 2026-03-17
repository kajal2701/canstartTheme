// src/components/quote/quotelisting/FollowUpModal.jsx

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { toast } from "react-toastify";
import { saveFollowUpDate } from "../../../services/quoteService";

const FollowUpModal = ({ activeModal, onClose, onSuccess, quote }) => {
  const [followUpDate, setFollowUpDate] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (activeModal) {
      setFollowUpDate("");
      setErrors({});
    }
  }, [activeModal]);

  const validate = () => {
    const newErrors = {};
    if (!followUpDate)
      newErrors.followUpDate = "Please select a follow-up date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        quote_id: quote.id,
        followup_date: followUpDate,
      };
      await saveFollowUpDate(payload);

      toast.success("Follow-up date saved!");
      onClose();
      onSuccess();
    } catch (error) {
      toast.error(error?.message || "Failed to save follow up date.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <Modal
      activeModal={activeModal}
      onClose={handleClose}
      title="Schedule Follow-up"
      className="max-w-lg"
      footerContent={
        <>
          <Button
            text="Cancel"
            icon="ph:x"
            className="btn-outline-dark btn-sm"
            onClick={handleClose}
            disabled={isSubmitting}
          />
          <Button
            text={isSubmitting ? "Submitting..." : "Submit"}
            icon="ph:paper-plane-tilt"
            className="btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          />
        </>
      }
    >
      <div className="space-y-4">
        {/* Quote Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Quote #:</span>{" "}
            <span className="text-indigo-600">{quote?.srNumber}</span>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            <span className="font-semibold">Customer:</span>{" "}
            {quote?.customerName}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            <span className="font-semibold">Email:</span> {quote?.email}
          </p>
        </div>

        {/* Follow-up Date Field */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Icon icon="ph:calendar" />
            Follow-up Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => {
              setFollowUpDate(e.target.value);
              setErrors((prev) => ({ ...prev, followUpDate: "" }));
            }}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          {errors.followUpDate && (
            <p className="text-red-500 text-xs mt-1">{errors.followUpDate}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            A reminder will be set for this date to follow up on the quote.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default FollowUpModal;
