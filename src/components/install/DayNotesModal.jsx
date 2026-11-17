import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { formatDateLong } from "@/utils/formatters";
import { NOTE_COLOR_OPTIONS, NOTE_COLOR_STYLES, STATUS_STYLES } from "@/utils/constants";
import {
  createCalendarNote,
  updateCalendarNote,
  deleteCalendarNote,
} from "@/services/installService";
import { toast } from "react-toastify";

const DayNotesModal = ({
  activeModal,
  onClose,
  selectedDate, // YYYY-MM-DD
  notes = [],
  currentUser,
  onNotesChanged,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("blue");
  const [noteDate, setNoteDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (activeModal && selectedDate) {
      setNoteDate(selectedDate);
      resetForm();
    }
  }, [activeModal, selectedDate]);

  const resetForm = () => {
    setIsAdding(false);
    setEditingNoteId(null);
    setTitle("");
    setDescription("");
    setColor("blue");
    setNoteDate(selectedDate || "");
    setNoteToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const startEdit = (note) => {
    setIsAdding(true);
    setEditingNoteId(note.note_id);
    setTitle(note.title || "");
    setDescription(note.description || "");
    setColor(note.color || "blue");
    setNoteDate(note.date ? note.date.split("T")[0] : selectedDate || "");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a note title.");
      return;
    }
    if (!noteDate) {
      toast.error("Please select a date.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingNoteId) {
        await updateCalendarNote(editingNoteId, {
          title: title.trim(),
          description: description.trim(),
          color,
          date: noteDate,
        });
        toast.success("Note updated successfully.");
      } else {
        await createCalendarNote({
          date: noteDate,
          title: title.trim(),
          description: description.trim(),
          color,
          created_by: currentUser?.user_id || 1,
        });
        toast.success("Note added successfully.");
      }
      resetForm();
      onNotesChanged?.();
    } catch (err) {
      console.error("Save note failed:", err);
      toast.error(err.message || "Failed to save note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const promptDelete = (note) => {
    setNoteToDelete(note);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      setIsDeleting(true);
      await deleteCalendarNote(noteToDelete.note_id);
      toast.success("Note deleted successfully.");
      if (editingNoteId === noteToDelete.note_id) resetForm();
      setDeleteConfirmOpen(false);
      setNoteToDelete(null);
      onNotesChanged?.();
    } catch (err) {
      console.error("Delete note failed:", err);
      toast.error(err.message || "Failed to delete note.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      activeModal={activeModal}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={`Date Details — ${formatDateLong(selectedDate)}`}
      className="w-full max-w-[95vw] sm:max-w-lg md:max-w-xl mx-auto"
      scrollContent={true}
    >
      <div className="space-y-5 sm:space-y-6 max-h-[75vh] sm:max-h-[70vh] overflow-y-auto pr-1 -mr-1">
        {/* ── NOTES SECTION ── */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="ph:note-pencil" className="text-indigo-500 text-base" />
              Notes ({notes.length})
            </h3>
            {!isAdding && (
              <Button
                text="Add Note"
                icon="ph:plus"
                className="btn-primary btn-sm !py-1.5 !px-3 text-xs min-h-[32px] sm:min-h-[28px]"
                onClick={() => {
                  resetForm();
                  setIsAdding(true);
                }}
              />
            )}
          </div>

          {/* Add / Edit Form */}
          {isAdding && (
            <form
              onSubmit={handleSubmit}
              className="p-3 sm:p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-900/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  {editingNoteId ? "Edit Note" : "New Note"}
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  aria-label="Close form"
                >
                  <Icon icon="ph:x" className="h-4 w-4" />
                </button>
              </div>

              {/* Date Input */}
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={noteDate}
                  onChange={(e) => setNoteDate(e.target.value)}
                  className="w-full text-sm sm:text-xs px-3 py-2 sm:py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parts pickup at warehouse"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm sm:text-xs px-3 py-2 sm:py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Description (optional)
                </label>
                <textarea
                  placeholder="Add any extra details..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm sm:text-xs px-3 py-2 sm:py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              {/* Color selector - responsive touch targets */}
              <div>
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                  Color Tag
                </label>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-2">
                  {NOTE_COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setColor(opt.value)}
                      className={`h-7 w-7 sm:h-6 sm:w-6 rounded-full ${opt.colorClass} flex items-center justify-center transition-all ${color === opt.value
                        ? "ring-2 ring-offset-2 ring-indigo-500 scale-110 shadow-sm"
                        : "opacity-75 hover:opacity-100"
                        }`}
                      title={opt.label}
                    >
                      {color === opt.value && (
                        <Icon icon="ph:check-bold" className="text-white text-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  text="Cancel"
                  type="button"
                  className="btn-outline-secondary btn-sm !py-1.5 !px-3 text-xs"
                  onClick={resetForm}
                  disabled={isSubmitting}
                />
                <Button
                  text={editingNoteId ? "Update" : "Save Note"}
                  type="submit"
                  className="btn-primary btn-sm !py-1.5 !px-4 text-xs font-medium"
                  isLoading={isSubmitting}
                />
              </div>
            </form>
          )}

          {/* Notes list */}
          <div className="space-y-2 max-h-[220px] sm:max-h-[260px] overflow-y-auto pr-1">
            {notes.length === 0 && !isAdding ? (
              <div className="p-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                <p className="text-xs text-gray-400">No notes for this date.</p>
              </div>
            ) : (
              notes.map((note) => {
                const style = NOTE_COLOR_STYLES[note.color] || NOTE_COLOR_STYLES.blue;
                return (
                  <div
                    key={note.note_id}
                    className={`p-2.5 sm:p-3 rounded-lg border-l-4 ${style.border} ${style.bg} flex items-start justify-between gap-2 transition-all`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${style.dot} shrink-0`} />
                        <h4 className={`text-xs sm:text-sm font-semibold ${style.text} break-words`}>
                          {note.title}
                        </h4>
                      </div>
                      {note.description && (
                        <p className="text-xs sm:text-[11px] text-gray-600 dark:text-gray-300 mt-1 pl-3.5 whitespace-pre-wrap break-words">
                          {note.description}
                        </p>
                      )}
                      {note.creator_name && (
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 pl-3.5">
                          By {note.creator_name}
                        </p>
                      )}
                    </div>

                    {/* Touch-friendly action buttons */}
                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="p-1.5 sm:p-1 rounded-md hover:bg-white/80 dark:hover:bg-gray-800/80 text-gray-500 hover:text-indigo-600 transition-colors"
                        title="Edit note"
                      >
                        <Icon icon="ph:pencil-simple" className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => promptDelete(note)}
                        disabled={isDeleting && noteToDelete?.note_id === note.note_id}
                        className="p-1.5 sm:p-1 rounded-md hover:bg-white/80 dark:hover:bg-gray-800/80 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete note"
                      >
                        <Icon
                          icon="ph:trash"
                          className="h-4 w-4 sm:h-3.5 sm:w-3.5"
                        />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <ConfirmModal
        activeModal={deleteConfirmOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteConfirmOpen(false);
            setNoteToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        actionText="delete the note"
        itemName={noteToDelete?.title}
        isLoading={isDeleting}
        confirmBtnText="Delete"
        confirmBtnLoadingText="Deleting..."
        confirmBtnClass="btn-danger"
      />
    </Modal>
  );
};

export default DayNotesModal;
