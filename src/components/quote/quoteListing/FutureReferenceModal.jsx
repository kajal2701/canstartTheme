import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { saveFutureReference } from "../../../services/quoteService";
import { REASON_OPTIONS } from "../../../utils/constants";

const FutureReferenceModal = ({
  activeModal,
  onClose,

  quote,
  onSuccess,
}) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherText, setOtherText] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Reset form when modal opens
  useEffect(() => {
    if (activeModal) {
      setSelectedReason("");
      setOtherText("");
      setErrors({});
    }
  }, [activeModal]);

  const isOther = selectedReason === "4";

  const validate = () => {
    const newErrors = {};
    if (!selectedReason) newErrors.reason = "Please select a reason";
    if (isOther && !otherText.trim())
      newErrors.otherText = "Please enter a reason";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        quote_id: quote.id,
        sanction_reason: selectedReason,
        sanction_notes: isOther ? otherText.trim() : "",
      };
      await saveFutureReference(payload);

      toast.success("Future reference saved!");
      onClose();
      onSuccess();
    } catch (error) {
      toast.error(error?.message || "Failed to save future reference.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      activeModal={activeModal}
      onClose={onClose}
      title="Future Reference"
      className="max-w-lg"
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

        {/* Reason Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Not Proceeding
          </label>
          <select
            value={selectedReason}
            onChange={(e) => {
              setSelectedReason(e.target.value);
              setErrors((prev) => ({ ...prev, reason: "" }));
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {REASON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.reason && (
            <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
          )}
        </div>

        {/* Other Textbox — only shown when reason = 4 */}
        {isOther && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Details
            </label>
            <textarea
              rows={3}
              value={otherText}
              onChange={(e) => {
                setOtherText(e.target.value);
                setErrors((prev) => ({ ...prev, otherText: "" }));
              }}
              placeholder="Provide further details about the reason..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            {errors.otherText && (
              <p className="text-red-500 text-xs mt-1">{errors.otherText}</p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            text="Cancel"
            className="btn-outline-dark btn-sm"
            onClick={onClose}
            disabled={isSubmitting}
          />
          <Button
            text={isSubmitting ? "Submitting..." : "Submit"}
            className="btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FutureReferenceModal;
