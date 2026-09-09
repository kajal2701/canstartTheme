import Icon from "@/components/ui/Icon";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { deleteQuote, resendFinalQuote } from "../../../services/quoteService";
import { useState } from "react";
import { encodeId } from "../../../utils/mappers";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ScheduleInstallationModal from "./ScheduleInstallationModal";
import confirmAction from "../../../utils/confirmAction";

const QuoteActionButtons = ({ id, navigate, fetchQuotes, rowData }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 1;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isResendingInvoice, setIsResendingInvoice] = useState(false);

  const canSchedule = rowData?.status === "Confirmed - Deposit Paid";
  const canResendInvoice = ["Invoice Sent", "Invoice Sent - Awaiting Confirmation", "Fully Paid"].includes(rowData?.status);
  const handleView = () => navigate(`/quote/view_quote_admin/${id}`);
  const handleEdit = () => navigate(`/quote/edit_quote/${id}`);

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteQuote(id);
      if (response.success) {
        setShowDeleteModal(false);
        if (fetchQuotes) fetchQuotes();
      } else {
        alert(response.message || "Failed to delete quote");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error deleting quote");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleScheduled = async () => {
    toast.success("Installation scheduled & email sent successfully!");
    if (fetchQuotes) await fetchQuotes(); // ✅ refetch quotes
  };

  const handleResendInvoice = async () => {
    const confirmResult = await confirmAction({
      text: "Do you want to resend the invoice?",
      confirmButtonText: "Yes, resend it!",
    });
    if (!confirmResult || (confirmResult.isConfirmed === false && confirmResult !== true)) return;

    try {
      setIsResendingInvoice(true);
      const result = await resendFinalQuote({ quote_id: id, send_email: true });
      if (result.success) {
        toast.success(result.message || "Invoice resent successfully.");
      } else {
        toast.error(result.message || "Failed to resend invoice.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsResendingInvoice(false);
    }
  };

  return (
    <>
      <div className="flex space-x-2 rtl:space-x-reverse justify-center">
        <button
          className="icon-btn hover:bg-gray-100 dark:hover:bg-gray-700"
          type="button"
          title="Edit"
          onClick={handleEdit}
        >
          <Icon icon="ph:pencil-line" />
        </button>

        <button
          className="icon-btn hover:bg-blue-50 dark:hover:bg-blue-900"
          type="button"
          title="View"
          onClick={handleView}
        >
          <Icon icon="ph:eye" />
        </button>

        <button
          className="icon-btn hover:bg-green-50 dark:hover:bg-green-900"
          type="button"
          title="Print"
          onClick={() => navigate(`/users/quote_invoice/${encodeId(id)}`)}
        >
          <Icon icon="ph:printer" />
        </button>

        <button
          className="icon-btn hover:bg-red-50 dark:hover:bg-red-900"
          type="button"
          title="Delete"
          onClick={() => setShowDeleteModal(true)}
        >
          <Icon icon="ph:trash" />
        </button>

        {/* ✅ Schedule button (Admin only) */}
        {isAdmin && (
          <button
            className="icon-btn hover:bg-indigo-50 dark:hover:bg-indigo-900"
            type="button"
            title={
              canSchedule
                ? "Schedule Installation"
                : `Cannot schedule — current status: ${rowData?.status}`
            }
            onClick={() => canSchedule && setShowScheduleModal(true)}
            disabled={!canSchedule}
          >
            <Icon icon="ph:calendar-check" />
          </button>
        )}

        {/* ✅ Resend Invoice button */}
        {canResendInvoice && (
          <button
            className="icon-btn hover:bg-teal-50 dark:hover:bg-teal-900"
            type="button"
            title="Resend Invoice"
            onClick={handleResendInvoice}
            disabled={isResendingInvoice}
          >
            <Icon icon="ph:paper-plane-right" />
          </button>
        )}
      </div>

      <ConfirmModal
        activeModal={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        itemName={`Quote #${id}`}
        isLoading={isDeleting}
      />

      <ScheduleInstallationModal
        activeModal={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        quoteData={rowData}
        onScheduled={handleScheduled}
        prefillDate={rowData?.rawInstallationDate || null}
        prefillInstallerId={rowData?.installerId || null}
      />
    </>
  );
};

export default QuoteActionButtons;
