import React, { useState } from "react";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const ImageUploadWithToggle = ({
  title,
  isEnabled,
  onToggle,
  files,
  onFilesChange,
  notes,
  onNotesChange,
}) => {
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (id, e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const updatedFiles = files.map((file) =>
      file.id === id
        ? {
          ...file,
          file: selectedFile,
          name: selectedFile.name,
          preview: URL.createObjectURL(selectedFile)
        }
        : file,
    );
    onFilesChange(updatedFiles);
  };

  const handleAddFile = () => {
    onFilesChange([...files, { id: Date.now() }]);
  };

  const handleRemoveFile = (id) => {
    onFilesChange(files.filter((file) => file.id !== id));
  };

  return (
    <div className="space-y-4 w-full">
      {/* Header with title and toggle */}
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-gray-700 text-sm sm:text-base truncate">{title}</p>
        <Switch
          outline
          activeClass="border-gray-500"
          value={isEnabled}
          onChange={onToggle}
          badge
        />
      </div>

      {/* Notes textarea — shown when disabled */}
      {!isEnabled && (
        <textarea
          rows={4}
          placeholder="Enter notes..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      )}

      {/* File upload inputs — shown when enabled */}
      {isEnabled && (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center sm:items-center gap-2 w-full"
            >
              {/* Custom styled file input wrapper */}
              <label className="flex-1 min-w-0 cursor-pointer">
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 bg-white hover:border-indigo-400 transition-colors w-full">
                  <span className="shrink-0 bg-indigo-50 text-indigo-700 font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors whitespace-nowrap">
                    Choose File
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm truncate">
                    {file.name || "No file chosen"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(file.id, e)}
                />
              </label>

              {/* Remove button — only show if more than one file */}
              {files.length > 1 && (
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  type="button"
                  className="self-end xs:self-auto sm:self-auto shrink-0 bg-red-400 hover:bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                  aria-label="Remove file"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <Button
            text="Add Image +"
            className="btn-primary btn-sm w-full sm:w-auto"
            onClick={handleAddFile}
            type="button"
          />

          {/* ── Image Preview Grid ──────────────────────── */}
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
            {files
              .filter((item) => item.preview)
              .map((item, index) => (
                <div
                  key={index}
                  className="relative group w-full aspect-square rounded-lg overflow-hidden border cursor-pointer"
                  onClick={() => {
                    setSelectedImage(item.preview);
                    setPreviewModal(true);
                  }}
                >
                  <img
                    src={item.preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── MODAL Image Preview ───────────────────────────────────────────── */}
      <Modal
        title="Image Preview"
        activeModal={previewModal}
        onClose={() => setPreviewModal(false)}
        className="max-w-3xl"
      >
        {selectedImage && (
          <img src={selectedImage} alt="Large Preview" className="w-full h-auto rounded-lg" />
        )}
      </Modal>
    </div>
  );
};

export default ImageUploadWithToggle;