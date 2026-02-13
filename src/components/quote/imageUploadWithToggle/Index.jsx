// components/quote/ImageUploadSection.jsx
import React from "react";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";

/**
 * ImageUploadWithToggle  Component
 *
 * Displays a toggleable section for image uploads or notes
 *
 * Props:
 * @param {string} title - Section title (e.g., "Easy plug access")
 * @param {boolean} isEnabled - Whether upload mode is enabled
 * @param {function} onToggle - Callback when toggle switch is clicked
 * @param {array} files - Array of file objects with id property
 * @param {function} onFilesChange - Callback to update files array
 * @param {string} notes - Notes text when upload is disabled
 * @param {function} onNotesChange - Callback to update notes
 */
const ImageUploadWithToggle = ({
  title,
  isEnabled,
  onToggle,
  files,
  onFilesChange,
  notes,
  onNotesChange,
}) => {
  // Add a new file input row
  const handleAddFile = () => {
    const newFiles = [...files, { id: Date.now() }];
    onFilesChange(newFiles);
  };

  // Remove a file input row by id
  const handleRemoveFile = (id) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      {/* Header with title and toggle */}
      <div className="flex items-center justify-between">
        <p className="font-medium text-gray-700">{title}</p>
        <Switch
          outline
          activeClass="border-gray-500"
          value={isEnabled}
          onChange={onToggle}
          badge
        />
      </div>

      {/* Notes textarea - shown when disabled */}
      {!isEnabled && (
        <textarea
          rows={4}
          placeholder="Enter notes..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      )}

      {/* File upload inputs - shown when enabled */}
      {isEnabled && (
        <div className="space-y-3">
          {files.map((file, index) => (
            <div key={file.id} className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />

              {/* Only show remove button if more than one file */}
              {files.length > 1 && (
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  type="button"
                  className="bg-red-400 hover:bg-red-500 text-white px-3 py-2 rounded-lg transition-colors"
                  aria-label="Remove file"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <Button
            text="Add Image +"
            className="btn-primary btn-sm"
            onClick={handleAddFile}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadWithToggle;
