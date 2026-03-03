// components/quote/ImageUploadSection.jsx
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";

const ImageUploadWithToggle = ({
  title,
  isEnabled,
  onToggle,
  files,
  onFilesChange,
  notes,
  onNotesChange,
}) => {
  // ✅ Fix 1 — define missing handler
  const handleFileChange = (id, e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const updatedFiles = files.map((file) =>
      file.id === id
        ? { ...file, file: selectedFile, name: selectedFile.name }
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
            <div key={file.id} className="flex items-center gap-2 w-full">
              {/* Custom styled file input wrapper */}
              <label className="flex-1 min-w-0 cursor-pointer">
                <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 bg-white hover:border-indigo-400 transition-colors w-full">
                  <span className="shrink-0 bg-indigo-50 text-indigo-700 font-semibold text-sm px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors">
                    Choose File
                  </span>
                  <span className="text-gray-400 text-sm truncate">
                    {file.name || "No file chosen"}
                  </span>
                </div>
                {/* ✅ Fix 1 — handleFileChange now defined */}
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
                  className="shrink-0 bg-red-400 hover:bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
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
            type="button"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadWithToggle;
