import Icon from "@/components/ui/Icon";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { deleteQuote } from "../../../services/quoteService";
import { useState } from "react";
import { encodeId } from "../../../utils/mappers";
import { toast } from "react-toastify";
import ScheduleInstallationModal from "./ScheduleInstallationModal";

const QuoteActionButtons = ({ id, navigate, fetchQuotes, rowData }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const canSchedule = rowData?.status === "Confirmed - Deposit Paid";
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

        {/* ✅ Schedule button */}
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
      />
    </>
  );
};

export default QuoteActionButtons;
